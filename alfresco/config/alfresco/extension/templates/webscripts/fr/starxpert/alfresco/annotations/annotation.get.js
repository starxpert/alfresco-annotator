<import resource="classpath:alfresco/extension/annotation.lib.js">

/**
 * @author BAYRAMOV
 * @returns
 */
function main() {
	
	if (args.nodeRef) 
	{	
		var nodeRef = args.nodeRef;
		var node = search.findNode(nodeRef);
		var data; 
		
		if (nodeRef.indexOf("version2Store") != -1) {
			
	      	var ver2VersionLabel = node.properties["ver2:versionLabel"];
	      	var parent = node.getParent();
	      	
	      	for each (child in parent.children)
	      	{
	      	  var versionLabel = child.properties["cm:versionLabel"];
	      	  
	      	  if (versionLabel != null && versionLabel == ver2VersionLabel)
	      	  {
	      		  data = getAnnotationsData(child);
	      		  break;
	      	  }
	      	}
	    } 
		else {
			node.addAspect("cm:versionable");
			node.addAspect("cm:preferences");
			
			data = getAnnotationsData(node);
			docVersion = getDocumentVersion(node);
			
			// Document has just been updated
			if (docVersion != data.version) {
				data.annotations = [];
				data.nodeRef = nodeRef;
				data.version = docVersion;
				setDocumentData(node, data);
			}
	    }
		
		data.hasWritePermission = node.hasPermission("Write");
		data.userName = person.properties.userName;
		
		model.annotations = jsonUtils.toJSONString(data);
	} 
	else {
		status.code = 400;
		status.message = "NodeRef is not defined";
		status.redirect = true;
	}
}

main();
