<import resource="classpath:alfresco/extension/annotation.lib.js">

/**
 * @author BAYRAMOV
 */

function main() {
	
	if (json.has("nodeRef") && json.has("annotation"))
	{
		var nodeRef = json.get("nodeRef");
		var annotation = json.get("annotation");
		var node = search.findNode(nodeRef);

		var data = getAnnotationsData(node);
		
		var jsData = jsonUtils.toObject(annotation);
		data.annotations.push(jsData);
		data.total++;
		
		setDocumentData(node, data);
		
		model.total = data.total;
	}
	else
	{
		status.code = 400;
		status.message = "NodeRef or annotation is not defined";
		status.redirect = true;
	}
}

main();
