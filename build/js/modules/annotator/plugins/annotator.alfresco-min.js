var __bind = function(fn, me) {
	return function() {
		return fn.apply(me, arguments);
	};
}, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
	for ( var key in parent) {
		if (__hasProp.call(parent, key))
			child[key] = parent[key];
	}
	function ctor() {
		this.constructor = child;
	}
	ctor.prototype = parent.prototype;
	child.prototype = new ctor();
	child.__super__ = parent.prototype;
	return child;
}, __indexOf = [].indexOf || function(item) {
	for ( var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item)
			return i;
	}
	return -1;
};

var thisAnnotator = null;

var compteurAppel = 0;

var ranges = {};
var quotes = {};

/**
 * Annotator ShareStore Plugin for Alfresco Share
 */
Annotator.Plugin.ShareStore = (function(_super) {

	__extends(ShareStore, _super);

	ShareStore.prototype.userName = "undefined";

	ShareStore.prototype.events = {
		'annotationCreated' : 'annotationCreated',
		'annotationUpdated' : 'annotationUpdated',
		'annotationDeleted' : 'annotationDeleted'
	};

	ShareStore.prototype.options = {
		prefix : Alfresco.constants.PROXY_URI
				+ 'fr/starxpert/alfresco/annotations',
		webscript : 'fr/starxpert/alfresco/annotations',
		autoFetch : true,
		annotationData : {},
		loadFromSearch : false,
		urls : {
			create : '/post',
			read : '/get.json',
			update : '/put',
			destroy : '/delete',
			search : '/get.json'
		}
	};

	ShareStore.prototype.pluginInit = function() {
		if (!Annotator.supported()) {
			return;
		}

		if (compteurAppel > 0) {
			var _ref = this.annotations;
			for ( var _i = 0, _len = _ref.length; _i < _len; _i++) {
				ann = _ref[_i];
				ann.ranges = ranges[ann.id];
				ann.quote = quotes[ann.id];
			}
			
			return this.annotator.loadAnnotations(this.annotations.slice());
		}

		compteurAppel++;

		var res = null;
		
		if (this.annotator.plugins.Auth) {
			res = this.annotator.plugins.Auth.withToken(this._getAnnotations);
		} else {
			res = this._getAnnotations();
		}

		return res;
	};

	function ShareStore(element, options) {
		this._onError = __bind(this._onError, this);
		this._onLoadAnnotationsFromSearch = __bind(
				this._onLoadAnnotationsFromSearch, this);
		this._onLoadAnnotations = __bind(this._onLoadAnnotations, this);
		this._getAnnotations = __bind(this._getAnnotations, this);
		ShareStore.__super__.constructor.apply(this, arguments);
		this.annotations = [];
	}

	ShareStore.prototype.annotationUpdated = function(annotation) {
		if (__indexOf.call(this.annotations, annotation) >= 0) {
			return this._apiRequest('update', annotation, function(data) {
			});
		}
	};

	ShareStore.prototype._getAnnotations = function() {
		return this._apiRequest('read', null, this._onLoadAnnotations);
	};

	ShareStore.prototype._onLoadAnnotations = function(data) {
		ShareStore.prototype.userName = data.json.userName;
		
		var writePermission = data.json.hasWritePermission;
		
		if (!writePermission) {
			this.annotator.setReadOnly();
		}
		
		data = data.json.annotations;
		if (data == null) {
			data = [];
		}

		this.annotations = data;
		var _ref = this.annotations;

		for ( var _i = 0, _len = _ref.length; _i < _len; _i++) {
			var ann = _ref[_i];
			ranges[ann.id] = ann.ranges;
			quotes[ann.id] = ann.quote;
		}
		
		return this.annotator.loadAnnotations(data.slice());
	};

	ShareStore.prototype.registerAnnotation = function(annotation) {
		return this.annotations.push(annotation);
	};

	ShareStore.prototype.unregisterAnnotation = function(annotation) {
		return this.annotations.splice(this.annotations.indexOf(annotation), 1);
	};

	ShareStore.prototype.annotationCreated = function(annotation) {

		if (!annotation.id) {
			annotation.id = this.uniqId();
		}
		if (!annotation.created) {
			annotation.created = $.now();
		}
		if (!annotation.user || annotation.user === "undefined") {
			annotation.user = this.userName;
		}

		annotation.pageNum = document
				.getElementById('template_x002e_web-preview_x002e_document-details_x0023_default-pageNumber').value;

		if (__indexOf.call(this.annotations, annotation) < 0) {
			this.registerAnnotation(annotation);
			this._apiRequest('create', annotation,function(data) {
			});
		}
	};

	ShareStore.prototype.annotationDeleted = function(annotation) {
		if (__indexOf.call(this.annotations, annotation) >= 0) {
			this.unregisterAnnotation(annotation);
			return this._apiRequest('destroy', annotation, function(data) {
			});
		}
	};

	ShareStore.prototype.getSuccesMessage = function(action) {
		var successMessage = "";

		switch (action) {
		
		case "create":
			successMessage = i18n_dict.annotation_created;
			break;
		case "update":
			successMessage = i18n_dict.annotation_updated;
			break;
		case "destroy":
			successMessage = i18n_dict.annotation_deleted;
			break;

		default:
			successMessage = i18n_dict.annotation_Init;
			break;
		}

		return successMessage;
	};

	ShareStore.prototype._apiRequest = function(action, obj, onSuccess) {
		var request, url, requestContentType;

		var successMessage = this.getSuccesMessage(action);
		
		url = this._urlFor(action);
		requestContentType = Alfresco.util.Ajax.JSON;
		var dataObj = {
			nodeRef : QueryString.nodeRef,
			annotation : this._dataFor(obj)
		};
		
		if (action === "destroy") {
			url += "?nodeRef=" + QueryString.nodeRef + "&annotationId="
					+ obj.id;
			requestContentType = Alfresco.util.Ajax.DELETE;
		}

		Alfresco.util.Ajax.request({
			url : url,
			requestContentType : requestContentType,
			method : this._methodFor(action),
			dataObj : dataObj,
			successCallback : {
				fn : onSuccess,
				scope : this
			},
			successMessage : successMessage,
			failureCallback : {
				fn : this._onError,
				scope : this
			}
		});
		

		return request;
	};

	ShareStore.prototype._urlFor = function(action) {
		var url;
		url = this.options.prefix || '/';
		url += this.options.urls[action];
		return url;
	};

	ShareStore.prototype._methodFor = function(action) {
		var table;
		table = {
			'create' : 'POST',
			'read' : 'GET',
			'update' : 'PUT',
			'destroy' : 'DELETE',
			'search' : 'GET'
		};
		return table[action];
	};

	ShareStore.prototype._dataFor = function(annotation) {
		if (annotation == null) {
			return null;
		}
		var data, highlights;
		highlights = annotation.highlights;
		delete annotation.highlights;
		$.extend(annotation, this.options.annotationData);
		data = JSON.stringify(annotation);
		if (highlights) {
			annotation.highlights = highlights;
		}
		return data;
	};

	ShareStore.prototype.dumpAnnotations = function() {
		var ann, _i, _len, _ref, _results;
		_ref = this.annotations;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			ann = _ref[_i];
			_results.push(JSON.parse(this._dataFor(ann)));
		}
		return _results;
	};

	ShareStore.prototype.uniqId = function() {
		return Math.round(new Date().getTime() + (Math.random() * 100));
	};

	ShareStore.prototype._onError = function(xhr) {
		var action, message;
		action = xhr._action;
		message = Annotator._t("Desolé, nous n'avons pas trouvé ") + action
				+ Annotator._t(" cette annotation");
		if (xhr._action === 'search') {
			message = Annotator
					._t("Desolé, impossible de chercher les annotations");
		} else if (xhr._action === 'read' && !xhr._id) {
			message = Annotator._t("Desolé, nous n'avons pas pu ") + action
					+ Annotator._t(" l'annotation depuis le serveur");
		}
		switch (xhr.status) {
		case 401:
			message = Annotator._t("Desolé, vous n'êtes pas autorisé à ") + action
					+ Annotator._t(" cette annotation");
			break;
		case 404:
			message = Annotator
					._t("Desolé, impossible de se connecter au serveur d'annotation");
			break;
		case 500:
			message = Annotator
					._t("Desolé, quelques choses ne vas pas bien avec les annotations");
		}
		
		console.info("Annotator: ", message);
		return console.error(Annotator._t("API request failed:")
				+ (" '" + xhr.status + "'"));
	};

	return ShareStore;

})(Annotator.Plugin);
