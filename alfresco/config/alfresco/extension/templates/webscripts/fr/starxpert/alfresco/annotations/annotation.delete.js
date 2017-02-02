<import resource="classpath:alfresco/extension/annotation.lib.js">

/**
 * Remove an annotation 
 * @author BAYRAMOV
 */
function main() {
	
	if (args.nodeRef && args.annotationId) 
	{
		var nodeRef = args.nodeRef;
		var annotationId = args.annotationId;
		
		var node = search.findNode(nodeRef);
		var data = getAnnotationsWithoutIt(node, annotationId);
		
		setDocumentData(node, data);
		
		model.total = data.total;
	}
	else
	{
		status.code = 400;
		status.message = "NodeRef or annotationId is not defined";
		status.redirect = true;
	}
}

main();
