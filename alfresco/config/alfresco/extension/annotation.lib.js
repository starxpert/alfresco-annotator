/**
 * @author BAYRAMOV
 */

var hasAnnotationToUpdate = false;

/**
 * Get actuel version of a document
 * @param scriptNode
 * @returns
 */
function getDocumentVersion(scriptNode) {
	var docVersion = scriptNode.properties["cm:versionLabel"];
	return (docVersion == null) ? '1.0' : docVersion;
}


/**
 * Set cm:preferenceValues content of a node
 * @param scriptNode
 * @param data
 */
function setDocumentData(scriptNode, data) {
	
	behaviourFilter.disableBehaviour(scriptNode, "cm:versionable");
	
	var content = jsonUtils.toJSONString(data);
	scriptNode.properties["cm:preferenceValues"].content = content;
	scriptNode.save();
	
	behaviourFilter.enableBehaviour(scriptNode, "cm:versionable");
}


/**
 * Get all annotations stored in a node
 * @param scriptNode
 * @returns {___anonymous1274_1348}
 */
function getAnnotationsData(scriptNode) {
	
	var data = {
			nodeRef : "",
			total : 0,
			version : "1.0",
			annotations : []
	};
	
	// Get existant annotations
	var existant = scriptNode.properties["cm:preferenceValues"].content;
	existant = (existant == null) ? '' : existant.toString();
	
	if (existant.indexOf("annotations") == -1) {
		logger.log("There is no anotations in server");
		return data;
	}
	
	var existantJSON = eval('(' + existant + ')');
	
	// Get nodeRef 
	if (existantJSON.nodeRef) {
		data.nodeRef = existantJSON.nodeRef;
	}
	
	// Get annotations
	if (existantJSON.annotations) {
		for ( var i = 0, l = existantJSON.annotations.length; i < l; i++) {
			data.annotations.push(existantJSON.annotations[i]);
			data.total++;
		}
	}
	
	// Get version
	if (existantJSON.version) {
		data.version = existantJSON.version;
	}
	
	return data;
}

/**
 * Get all annotations except annotationId
 * @param scriptNode
 * @param annotationId
 * @returns {___anonymous1874_1948}
 */
function getAnnotationsWithoutIt(scriptNode, annotationId) {
	
	var data = getAnnotationsData(scriptNode);
	
	for ( var i = 0, len = data.annotations.length; i < len; i++) {
		if (annotationId == data.annotations[i].id) {
			data.annotations.splice(i, 1);
			break;
		}
	}
	
	return data;
}