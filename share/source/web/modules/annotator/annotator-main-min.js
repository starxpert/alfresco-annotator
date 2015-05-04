var annotatorDivId = "template_x002e_web-preview_x002e_document-details_x0023_default-viewer";
var annotatorPagesId = "template_x002e_web-preview_x002e_document-details_x0023_default-viewer-pageContainer-";
var annotatorVersionBlocId = "template_x002e_web-preview_x002e_document-version-details_x0023_default-viewer";

var annotator = null;
var writePermission = false;
var userName = "undefined";

function keyElementIsLoaded(keyElement) {
	if (!keyElement) { 
		console.log("keyElement is not found");
		return false; 
	}
	
	if (!keyElement[0]) {
		console.log("keyElement[0] is not found");
		return false; 
	}
	
	var pages = keyElement.find('.page');
	
	if (pages.length <= 0) {
		console.log("Ok pages.length is < 0 : ", pages);
		return false;
	}
	
	return true;
}

function startAnnotation() {

	if (document.getElementById(annotatorDivId) != null) {

		if (!keyElementIsLoaded($('#'+annotatorDivId))) {
			return false;
		}
		
		jQuery(function($) {
			$.i18n.load(i18n_dict);

			annotator = $("#" + annotatorDivId).annotator().annotator().data(
					'annotator');
			
			annotator.addPlugin('ShareStore', {});
			
			annotator.addPlugin('AnnotatorViewer', {
				panelInMediaViewer : false
			});

			// Annotation scroll
			$('#anotacions-uoc-panel').slimscroll({
				height : '100%'
			});
		});

		return true;
	}
	
	
	if (document.getElementById(annotatorVersionBlocId) != null) {
		
		if (!keyElementIsLoaded($('#'+annotatorVersionBlocId))) {
			return false;
		}
		
		annotatorDivId = annotatorVersionBlocId;
		
		jQuery(function($) {
			$.i18n.load(i18n_dict);

			var content = $("#" + annotatorDivId);
			
			content.annotator({
				readOnly: true
			});
			
			content.annotator('addPlugin', 'ShareStore', {});
			content.annotator('addPlugin', 'AnnotatorViewer', {});
			
			//annotator = content.annotator().annotator().data('annotator');
			annotator = $("#" + annotatorDivId).annotator().annotator().data('annotator');
			
			// Annotation scroll
			$('#anotacions-uoc-panel').slimscroll({
				height : '100%'
			});
		});

		return true;
	}

	return false;
}

(function() {
	var interval = "10000";
	interval = setInterval(function() {
		if (startAnnotation() == true) {
			clearInterval(interval);
			
			$("#"+annotatorDivId).scroll(function() {
				annotator.addPlugin("ShareStore");
			});
		}
	}, 1000);
})();

var QueryString = function() {
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for ( var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
}();




