/*
Annotator view panel Plugin v1.0 (https://https://github.com/albertjuhe/annotator_view/)
Copyright (C) 2014 Albert Juhé Brugué
License: https://github.com/albertjuhe/annotator_view/License.rst

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

(function() {
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
	};

	Annotator.Plugin.AnnotatorViewer = (function(_super) {
		__extends(AnnotatorViewer, _super);

		AnnotatorViewer.prototype.events = {
			'annotationsLoaded' : 'onAnnotationsLoaded',
			'annotationCreated' : 'onAnnotationCreated',
			'annotationDeleted' : 'onAnnotationDeleted',
			'annotationUpdated' : 'onAnnotationUpdated',
			".annotator-viewer-delete click" : "onDeleteClick",
			".annotator-viewer-delete mouseover" : "onDeleteMouseover",
			".annotator-viewer-delete mouseout" : "onDeleteMouseout",
		};

		AnnotatorViewer.prototype.field = null;

		AnnotatorViewer.prototype.input = null;

		AnnotatorViewer.prototype.options = {
			AnnotatorViewer : {}
		};

		
		function AnnotatorViewer(element, options) {
			this.onAnnotationCreated = __bind(this.onAnnotationCreated, this);
			this.onAnnotationUpdated = __bind(this.onAnnotationUpdated, this);
			this.onDeleteClick = __bind(this.onDeleteClick, this);
			this.onDeleteMouseover = __bind(this.onDeleteMouseover, this);
			this.onDeleteMouseout = __bind(this.onDeleteMouseout, this);
			AnnotatorViewer.__super__.constructor.apply(this, arguments);
	
			
			this.options['panelInMediaViewer'] = options['panelInMediaViewer'];
			
			if (options['panelInMediaViewer']) {
				var global = "#template_x002e_web-preview_x002e_document-details_x0023_default-sidebarTabView";
				
				$(global).find(".yui-nav").append('<li title><a href="#annotatorViewer"><em><img src="/share/res/extras/components/preview/images/outline-view-16.png" height="16"></em></a>');
				$(global).find(".yui-content").append(this.createAnnotationPanel());
				
				$(".annotations-list-uoc").css("position", "relative");
				$(".annotations-list-uoc").css("top", "0");
				$(".annotations-list-uoc").css("right", "0");
				$(".annotations-list-uoc").css("background-color", "none");
				$(".annotations-panel .rotate").css("background-color", "none !important");
				$(".bcAnnotation").css("width", "180px");
				
			} else {				
				$("body").append(this.createAnnotationPanel());
				$(".container-anotacions").toggle();
				
				$("#annotations-panel").click(function(event) {
					$(".container-anotacions").toggle("slide");
				});
			}

		}
		;

		AnnotatorViewer.prototype.pluginInit = function() {
			var cat, color, i, isChecked, _ref;
			if (!Annotator.supported()) {
				return;
			}
		};

		AnnotatorViewer.prototype.onDeleteClick = function(event) {
			return this.onButtonClick(event, 'delete');
		};

		AnnotatorViewer.prototype.onButtonClick = function(event, type) {
			var item;

			item = $(event.target).parents('.annotator-marginviewer-element');
			return this.annotator.deleteAnnotation(item.data('annotation'));
		};

		AnnotatorViewer.prototype.onDeleteMouseover = function(event) {
			$(event.target)
					.attr('src',
							'../modules/annotator/plugins/annotator-view/img/papelera_over.png');
		};

		AnnotatorViewer.prototype.onDeleteMouseout = function(event) {
			$(event.target)
					.attr('src',
							'../modules/annotator/plugins/annotator-view/img/icono_eliminar.png');
		};

		AnnotatorViewer.prototype.onAnnotationCreated = function(annotation) {

			this.createReferenceAnnotation(annotation);
			$('#count-anotations').text(
					$('.container-anotacions').children('li').length);
		};

		AnnotatorViewer.prototype.onAnnotationUpdated = function(annotation) {

			$("#annotation-" + annotation.id).html(
					this.mascaraAnnotation(annotation));
		};

		AnnotatorViewer.prototype.onAnnotationsLoaded = function(annotations) {
			var annotation;
			$('#count-anotations').text(annotations.length);
			if (annotations.length > 0) {
				for (i = 0, len = annotations.length; i < len; i++) {
					annotation = annotations[i];

					if ($("#annotation-" + annotation.id).length == 0) {
						this.createReferenceAnnotation(annotation);
					}
				}
			}
			if (this.options['panelInMediaViewer']) {
				$(".annotator-marginviewer-element").css("width", "170px");
				$(".slimScrollBar").css("width", "1px");
			}
		};

		AnnotatorViewer.prototype.onAnnotationDeleted = function(annotation) {
			$("li").remove("#annotation-" + annotation.id);
			$('#count-anotations').text(
					$('.container-anotacions').children('li').length);
		};

		AnnotatorViewer.prototype.mascaraAnnotation = function(annotation) {
			if (!annotation.created)
				annotation.created = $.now();

			var anotacio_compartida = "";
			var class_label = "label";
			var borrar = "<img src=\"/share/modules/annotator/plugins/annotator-view/img/icono_eliminar.png\" class=\"annotator-viewer-delete\" title=\""
					+ i18n_dict.Delete
					+ "\" style=\";margin-top:0px;\"/>";

//			 if (annotation.estat==1 || annotation.permissions.read.length===0
//			 ) {
//			 anotacio_compartida = "<img src=\"../src/img/Compartido.png\" " +
//			 		"title=\""+ i18n_dict.share +"\" style=\"margin-left:5px\"/>";
//			 }

			if (annotation.propietary == 0) {
				class_label = "label-compartit";
				borrar = "";
			}

			// If you have instal.led a plug-in for categorize anotations,
			// panel viewer can get this information with the category atribute
			if (annotation.category != null) {
				anotation_color = annotation.category;
			} else {
				anotation_color = "hightlight";
			}

			var anotacio_capa = '';

//			anotacio_capa += '<div class="annotator-marginviewer-text">';
//				anotacio_capa += '<div class="anotador_text anotador_text_wrap">' + annotation.text + '</div>';
//			anotacio_capa += '</div>';
//			
//			anotacio_capa += '<div class="annotator-marginviewer-text">';
//			anotacio_capa += '<span class="' + class_label + '">@' + annotation.user + '</span>';
//			anotacio_capa += '<span class="ann-date">'+$.format.date(annotation.created, "dd/MM/yyyy HH:mm")+'</span>';
//			
//			anotacio_capa += '<span class="ann-page-num">Page '+annotation.pageNum+'</span>';
//			anotacio_capa += '</div>';
			
			// -------------------------
			
			anotacio_capa += '<div class="annotator-marginviewer-text">';
				anotacio_capa += '<a><div class="anotador_text anotador_text_wrap">' + annotation.text + '</div></a>';
			anotacio_capa += '</div>';
			
			anotacio_capa += '<div class="annotator-marginviewer-text">';
			anotacio_capa += '<span class="' + class_label + '" title="Par '+annotation.user+'">' + annotation.user + '</span>';
			anotacio_capa += '<span class="ann-date" title="'+$.format.date(annotation.created, "dd/MM/yyyy HH:mm:ss")+'">'
			+$.format.date(annotation.created, "dd/MM/yyyy")+'</span>';
			
			anotacio_capa += '<span class="ann-page-num" title="Page '+annotation.pageNum+'">p'+annotation.pageNum+'</span>';
			anotacio_capa += '</div>';

			//----------------------
			
//			anotacio_capa += '<div class="annotator-marginviewer-quote">';
//			anotacio_capa += annotation.quote;
//			anotacio_capa += '</div>';
			
//			 anotacio_capa += '<div class="annotator-marginviewer-footer">';
//			 anotacio_capa += borrar;
//			 anotacio_capa += '</div>';
			//anotacio_capa += '</a>';

			return anotacio_capa;
		};

		AnnotatorViewer.prototype.createAnnotationPanel = function(annotation) {
			
			var anotacio_capa = '';
			
			if (this.options['panelInMediaViewer']) {
				anotacio_capa += '<div id="anotacions-uoc-panel" style="height:80%; width:60%;"><ul class="container-anotacions"></ul></div></div>';
				return anotacio_capa;
			}
			
			anotacio_capa = '<div  class="annotations-list-uoc" style="background-color:#ddd;">'
					+ '<div id="annotations-panel">'
					+ '<span class="rotate" title="'
					+ i18n_dict.view_annotations
					+ ' '
					+ i18n_dict.pdf_resum
					+ '" style="padding:5px;background-color:#ddd;position: absolute; top:10em;left: -50px; width: 155px; height: 110px;cursor:pointer">'
					+ i18n_dict.view_annotations
					+ '<span class="label-counter" style="padding:0.2em 0.3em;float:right" id="count-anotations">0</span>'
					+ '</span></div><div id="anotacions-uoc-panel" style="height:80%"><ul class="container-anotacions"></ul></div></div>';
			return anotacio_capa;
		};

		AnnotatorViewer.prototype.createReferenceAnnotation = function(
				annotation) {
			var anotation_reference = null;

			if (annotation.id != null) {
				anotation_reference = "annotation-" + annotation.id;
			} else {
				annotation.id = this.uniqId();
				// We need to add this id to the text anotation
				$element = $('span.annotator-hl:not([id])');
				if ($element) {
					$element.prop('id', annotation.id);
				}
				anotation_reference = "annotation-" + annotation.id;
			}

			var anotacio_capa = '<li class="annotator-marginviewer-element" id="'
					+ anotation_reference + '">'
					+ this.mascaraAnnotation(annotation) + '</li>';
			var malert = i18n_dict.anotacio_lost

			anotacioObject = $(anotacio_capa)
					.appendTo('.container-anotacions')
					.click(
							function(event) {
								var viewPanelHeight = jQuery(window).height();
								var annotation_reference = annotation.id;

								$element = $("#" + annotation.id);
								if (!$element.length) {
									$element = jQuery("#" + annotation.order);
									annotation_reference = annotation.order;
								}
								
								var anotador = $(this).find(".anotador_text");
								if (anotador.hasClass("anotador_text_wrap")) {
									anotador.removeClass("anotador_text_wrap");
								} else {
									anotador.addClass("anotador_text_wrap");
								}
								
								if ($element.length) {
									elOffset = $element.offset();
									$('html, body').animate({
									  scrollTop: $("#"+annotation_reference).offset().top - (viewPanelHeight/2)
									}, 2000);
								} 
								
								Alfresco.util.ComponentManager.findFirst("Alfresco.WebPreview").plugin._scrollToPage(annotation.pageNum);
								setTimeout(function() {
									annotator.addPlugin("ShareStore");
								},
								1000);
							});
			// Adding annotation to data element for delete and link
			$('#' + anotation_reference).data('annotation', annotation);
			$(anotacioObject).fadeIn('fast');
		};

		AnnotatorViewer.prototype.uniqId = function() {
			return Math.round(new Date().getTime() + (Math.random() * 100));
		};

		return AnnotatorViewer;

	})(Annotator.Plugin);

}).call(this);
