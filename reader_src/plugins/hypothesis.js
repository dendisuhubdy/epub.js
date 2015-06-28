EPUBJS.reader.plugins.HypothesisController = function(Book) {
	var reader = this;
	var book = reader.book;
	var element = document.getElementById("hypothesis");
	var body = window.document.body;
	var annotator;
	var $main = $("#main");
	
	var updateAnnotations = function() {
		var annotatations = [],
				guestAnnotator = reader.book.renderer.render.window.annotator,
				_$, 
				$annotations, width;
		
		if(!guestAnnotator) {
			if(annotator) annotator.updateViewer([]);
			return;	
		};
		
		_$ = guestAnnotator.constructor.$;
		
		$annotations = _$(".annotator-hl");
		width = reader.book.renderer.render.iframe.clientWidth;
		
		//-- Find visible annotations
		$annotations.each(function(){
			var $this = _$(this),
					left = this.getBoundingClientRect().left;
					
			if(left >= 0 && left <= width) {
				annotatations.push($this.data('annotation'));
			}
		});
		
		//-- Update viewer
		window.annotator.updateAnnotations(annotatations);
	};
	
	var attach = function(){
		window.annotator.frame.appendTo(element);
		
		window.annotator.subscribe('annotationEditorShown', function () {
			showAnnotations(true);
		});
		
		window.annotator.subscribe('annotationViewerShown', function () {
			showAnnotations(true);
		});
		
		window.annotator.subscribe("annotationsLoaded", function(e){
			var _$ = reader.book.renderer.render.window.annotator.constructor.$; 
			
			
			// reader.annotator = annotator;
			updateAnnotations();
			
			_$(reader.book.renderer.contents).on("click", ".annotator-hl", function(event){
				var $this = _$(this);
				
				window.annotator.updateAnnotation([$this.data('annotation')]);
				
				// $scope.$apply(function(){
				// 	$scope.single = true;
				// 	$scope.noUpdate = true;
				// });
				
			});
		});
		
		$(".h-icon-comment").on("click", function () {
			if ($main.hasClass("single")) {
				showAnnotations(false);
			} else {
				showAnnotations(true);
			}
		});
		
		reader.book.on("renderer:locationChanged", function(){
			updateAnnotations();
		});

	}
	
	var showAnnotations = function(single) {
		var currentPosition = reader.currentLocationCfi;
		reader.settings.sidebarReflow = false;

		if(single) {
			$main.addClass("single");
			window.annotator.setVisibleHighlights(true);
		} else {
			$main.removeClass("single");
			window.annotator.setVisibleHighlights(false);
		}
		
		$main.one("transitionend", function(){
			book.gotoCfi(currentPosition);
		});
		
	};
	
	book.ready.all.then(function() {
		reader.HypothesisController.attach();
	});

	return {
        'attach': attach
	};
};