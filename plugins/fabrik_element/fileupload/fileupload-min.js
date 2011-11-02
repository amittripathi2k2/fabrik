var FbFileUpload=new Class({Extends:FbFileElement,initialize:function(b,a){this.plugin="fileupload";this.parent(b,a);this.toppath=this.options.dir;if(this.options.folderSelect===1&&this.options.editable===1){this.ajaxFolder()}Fabrik.addEvent("fabrik.form.submit.start",function(f,c){this.onSubmit(f)}.bind(this));if(this.options.ajax_upload&&this.options.editable!==false){this.watchAjax();this.options.files=$H(this.options.files);if(this.options.files.getLength()!==0){this.uploader.trigger("FilesAdded",this.options.files);this.startbutton.addClass("plupload_disabled");this.options.files.each(function(f){var c={filepath:f.path,uri:f.url};this.uploader.trigger("UploadProgress",f);this.uploader.trigger("FileUploaded",f,{response:JSON.encode(c)});$(f.id).getElement(".plupload_file_status").set("text","100%")}.bind(this));var e=$(this.options.element+"_container");var d=$(this.options.element+"_browseButton").getPosition().y-e.getPosition().y;e.getParent(".fabrikElement").getElement("input[type=file]").getParent().setStyle("top",d)}}},cloned:function(){if(typeOf(this.element.getParent(".fabrikElement"))==="null"){return}var a=this.element.getParent(".fabrikElement").getElement("img");if(a){a.src=Fabrik.liveSite+this.options.defaultImage}},decloned:function(a){var c=$("form_"+this.form.id);var b=c.getElement("input[name=fabrik_deletedimages["+a+"]");if(typeOf(b)==="null"){new Element("input",{type:"hidden",name:"fabrik_fileupload_deletedfile["+a+"][]",value:this.options.value}).inject(c)}},update:function(b){if(this.element){var a=this.element.getElement("img");if(typeOf(a)!=="null"){a.src=b}}},watchAjax:function(){if(this.options.editable===false){return}var a=this.element.getParent(".fabrikSubElementContainer");this.container=a;this.widget=new ImageWidget(a.getElement("canvas"),{cropdim:{w:this.options.cropwidth,h:this.options.cropheight,x:this.options.cropwidth/2,y:this.options.cropheight/2},crop:this.options.crop});this.pluploadContainer=a.getElement(".plupload_container");this.pluploadFallback=a.getElement(".plupload_fallback");this.droplist=a.getElement(".plupload_filelist");this.startbutton=a.getElement(".plupload_start");this.uploader=new plupload.Uploader({runtimes:this.options.ajax_runtime,browse_button:this.element.id+"_browseButton",container:this.element.id+"_container",drop_element:this.element.id+"_dropList",url:Fabrik.liveSite+"index.php?option=com_fabrik&format=raw&task=plugin.pluginAjax&plugin=fileupload&method=ajax_upload&element_id="+this.options.elid,max_file_size:this.options.max_file_size+"kb",unique_names:false,flash_swf_url:"plugins/element/fileupload/plupload/js/plupload.flash.swf",silverlight_xap_url:"plugins/element/fileupload/plupload/js/plupload.silverlight.xap",chunk_size:this.options.ajax_chunk_size+"kb",multipart:true});this.uploader.bind("Init",function(b,c){this.pluploadFallback.destroy();this.pluploadContainer.removeClass("fabrikHide")}.bind(this));this.uploader.bind("FilesRemoved",function(b,c){});this.uploader.bind("FilesAdded",function(c,e){var b=this.droplist.getElement(".plupload_droptext");if(typeOf(b)!=="null"){b.destroy()}var d=this.droplist.getElements("li").length;this.startbutton.removeClass("plupload_disabled");e.each(function(k,f){if(d>=this.options.ajax_max){alert(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_MAX_UPLOAD_REACHED"))}else{d++;var i=new Element("div",{"class":"plupload_file_action"}).adopt(new Element("a",{href:"#",style:"display:block",events:{click:this.pluploadRemoveFile.bindWithEvent(this)}}));var h=new Element("a",{href:"#",alt:Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_RESIZE"),events:{click:this.pluploadResize.bindWithEvent(this)}});if(this.options.crop){h.set("html",this.options.resizeButton)}else{h.set("html",this.options.previewButton)}var j=new Element("div",{"class":"plupload_file_name"}).adopt([new Element("span").set("text",k.name),new Element("div",{"class":"plupload_resize",style:"display:none"}).adopt(h)]);var g=[j,i,new Element("div",{"class":"plupload_file_status"}).set("text","0%"),new Element("div",{"class":"plupload_file_size"}).set("text",k.size),new Element("div",{"class":"plupload_clearer"})];this.droplist.adopt(new Element("li",{id:k.id,"class":"plupload_delete"}).adopt(g))}}.bind(this))}.bind(this));this.uploader.bind("UploadProgress",function(b,c){$(c.id).getElement(".plupload_file_status").set("text",c.percent+"%")});this.uploader.bind("Error",function(b,c){fconsole("Error:"+c)});this.uploader.bind("ChunkUploaded",function(b,d,c){c=JSON.decode(c.response);if(typeOf(c)!=="null"){if(c.error){fconsole(c.error.message)}}});this.uploader.bind("FileUploaded",function(b,e,c){c=JSON.decode(c.response);$(e.id).getElement(".plupload_resize").show();var d=$(e.id).getElement(".plupload_resize").getElement("a");d.href=c.uri;d.id="resizebutton_"+e.id;d.store("filepath",c.filepath);console.log("upload response, ",c);this.widget.setImage(c.uri,c.filepath,e.params);new Element("input",{type:"hidden",name:this.options.elementName+"[crop]["+c.filepath+"]",id:"coords_"+e.id,value:JSON.encode(e.params)}).inject(this.pluploadContainer,"after");var f=$pick(e.recordid,"0");new Element("input",{type:"hidden",name:this.options.elementName+"[id]["+c.filepath+"]",id:"id_"+e.id,value:f}).inject(this.pluploadContainer,"after");document.id(e.id).removeClass("plupload_file_action").addClass("plupload_done")}.bind(this));a.getElement(".plupload_start").addEvent("click",function(b){b.stop();this.uploader.start()}.bind(this));this.uploader.init()},pluploadRemoveFile:function(c){c.stop();var d=c.target.getParent().getParent().id.split("_").getLast();var b=c.target.getParent().getParent().getElement(".plupload_file_name span").get("text");new Request({url:"",data:{option:"com_fabrik",format:"raw",task:"plugin.pluginAjax",plugin:"fileupload",method:"ajax_deleteFile",element_id:this.options.id,file:b,recordid:d}}).send();var a=c.target.getParent(".plupload_delete");a.destroy();if($("id_alreadyuploaded_"+this.options.id+"_"+d)){$("id_alreadyuploaded_"+this.options.id+"_"+d).destroy()}if($("coords_alreadyuploaded_"+this.options.id+"_"+d)){$("coords_alreadyuploaded_"+this.options.id+"_"+d).destroy()}},pluploadResize:function(c){c.stop();var b=c.target.getParent();this.widget.setImage(b.href,b.retrieve("filepath"))},onSubmit:function(a){if(!this.allUploaded()){alert(Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_UPLOAD_ALL_FILES"));a.result=false;return false}if(typeOf(this.widget)!=="null"){this.widget.images.each(function(d,b){b=b.split("\\").getLast();var c=document.getElements("input[name*="+b+"]");c=c[1];c.value=JSON.encode(d)})}return true},allUploaded:function(){var a=true;if(this.uploader){this.uploader.files.each(function(b){if(b.loaded===0){a=false}}.bind(this))}return a}});var ImageWidget=new Class({initialize:function(a,d){this.canvas=a;this.imageDefault={rotation:0,scale:100,imagedim:{x:200,y:200,w:400,h:400},cropdim:{x:75,y:25,w:150,h:50}};$extend(this.imageDefault,d);this.windowopts={id:this.canvas.id+"-mocha",type:"modal",content:this.canvas.getParent(),loadMethod:"html",width:420,height:540,storeOnClose:true,createShowOverLay:false,crop:d.crop,onClose:function(){$("modalOverlay").hide()},onContentLoaded:function(){this.center()}};this.windowopts.title=d.crop?Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_CROP_AND_SCALE"):Joomla.JText._("PLG_ELEMENT_FILEUPLOAD_PREVIEW");this.showWin();this.images=$H({});var c=this;this.CANVAS=new FbCanvas({canvasElement:$(this.canvas.id),enableMouse:true,cacheCtxPos:false});this.CANVAS.layers.add(new Layer({id:"bg-layer"}));this.CANVAS.layers.add(new Layer({id:"image-layer"}));if(d.crop){this.CANVAS.layers.add(new Layer({id:"overlay-layer"}));this.CANVAS.layers.add(new Layer({id:"crop-layer"}))}var b=new CanvasItem({id:"bg",scale:1,events:{onDraw:function(e){if(typeOf(e)==="null"){e=this.CANVAS.ctx}e.fillStyle="#DFDFDF";e.fillRect(0,0,400/this.scale,400/this.scale)}.bind(this)}});this.CANVAS.layers.get("bg-layer").add(b);if(d.crop){this.overlay=new CanvasItem({id:"overlay",events:{onDraw:function(e){if(typeOf(e)==="null"){e=this.CANVAS.ctx}this.withinCrop=true;if(this.withinCrop){var h={x:0,y:0};var f={x:400,y:400};e.fillStyle="rgba(0, 0, 0, 0.3)";var g=this.cropperCanvas;e.fillRect(h.x,h.y,f.x,g.y-(g.h/2));e.fillRect(h.x-(g.w/2),h.y+g.y-(g.h/2),h.x+g.x,g.h);e.fillRect(h.x+g.x+g.w-(g.w/2),h.y+g.y-(g.h/2),f.x,g.h);e.fillRect(h.x,h.y+(g.y+g.h)-(g.h/2),f.x,f.y)}}.bind(this)}});this.CANVAS.layers.get("overlay-layer").add(this.overlay)}this.imgCanvas=this.makeImgCanvas();this.CANVAS.layers.get("image-layer").add(this.imgCanvas);this.cropperCanvas=this.makeCropperCanvas();if(d.crop){this.CANVAS.layers.get("crop-layer").add(this.cropperCanvas)}this.makeThread();this.watchZoom();this.watchRotate();this.watchClose();this.win.close()},setImage:function(b,c,d){this.activeFilePath=c;if(this.img&&this.img.src===b){this.showWin();return}this.img=Asset.image(b);var a=new Element("img",{src:b});if(c){a.store("filepath",c)}else{c=a.retrieve("filepath")}a.injectInside(document.body).hide();(function(){var f,l,e,k,j,g;if(!this.images.has(c)){f=false;d=d?d:new CloneObject(this.imageDefault,true,[]);this.images.set(c,d);var h=a.getDimensions(true);l=h.width;e=h.height;d.mainimagedim=d.imagedim;d.mainimagedim.w=l;d.mainimagedim.h=e;k=d.imagedim.x;j=d.imagedim.y}else{f=true;g=this.images.get(c);l=400;e=400;k=g.imagedim.x;j=g.imagedim.y}g=this.images.get(c);if(this.scaleSlide){this.scaleSlide.set(g.scale)}if(this.rotateSlide){this.rotateSlide.set(g.rotation)}if(this.cropperCanvas){this.cropperCanvas.x=g.cropdim.x;this.cropperCanvas.y=g.cropdim.y;this.cropperCanvas.w=g.cropdim.w;this.cropperCanvas.h=g.cropdim.h}this.imgCanvas.w=l;this.imgCanvas.h=e;this.imgCanvas.x=k;this.imgCanvas.y=j;this.imgCanvas.rotation=g.rotation;this.imgCanvas.scale=g.scale/100;if(f){this.showWin()}a.destroy()}.bind(this)).delay(500)},makeImgCanvas:function(){var a=this;return new CanvasItem({id:"imgtocrop",w:400,h:400,x:200,y:200,interactive:true,rotation:0,scale:1,offset:[0,0],events:{onMousemove:function(b,e){if(this.dragging){var c=this.w*this.scale;var d=this.h*this.scale;this.x=b-this.offset[0]+c*0.5;this.y=e-this.offset[1]+d*0.5}},onDraw:function(d){d=a.CANVAS.ctx;if(typeOf(a.img)==="null"){return}var c=this.w*this.scale;var e=this.h*this.scale;var b=this.x-c*0.5;var g=this.y-e*0.5;d.save();d.translate(this.x,this.y);d.rotate(this.rotation*Math.PI/180);this.hover?d.strokeStyle="#f00":d.strokeStyle="#000";d.strokeRect(c*-0.5,e*-0.5,c,e);if(typeOf(a.img)!=="null"){try{d.drawImage(a.img,c*-0.5,e*-0.5,c,e)}catch(f){fconsole(f,a.img,c*-0.5,e*-0.5,c,e)}}d.restore();if(typeOf(a.img)!=="null"&&a.images.get(a.activeFilePath)){a.images.get(a.activeFilePath).imagedim={x:this.x,y:this.y,w:c,h:e}}this.setDims(b,g,c,e)},onMousedown:function(b,c){a.CANVAS.setDrag(this);this.offset=[b-this.dims[0],c-this.dims[1]];this.dragging=true},onMouseup:function(){a.CANVAS.clearDrag();this.dragging=false},onMouseover:function(){a.overImg=true;document.body.style.cursor="move"},onMouseout:function(){a.overImg=false;if(!a.overCrop){document.body.style.cursor="default"}}}})},makeCropperCanvas:function(){var a=this;return new CanvasItem({id:"item",x:175,y:175,w:150,h:50,interactive:true,offset:[0,0],events:{onDraw:function(d){d=a.CANVAS.ctx;if(typeOf(d)==="null"){return}var c=this.w;var e=this.h;var b=this.x-c*0.5;var f=this.y-e*0.5;d.save();d.translate(this.x,this.y);this.hover?d.strokeStyle="#f00":d.strokeStyle="#000";d.strokeRect(c*-0.5,e*-0.5,c,e);d.restore();if(typeOf(a.img)!=="null"&&a.images.get(a.activeFilePath)){a.images.get(a.activeFilePath).cropdim={x:this.x,y:this.y,w:c,h:e}}this.setDims(b,f,c,e)},onMousedown:function(b,c){a.CANVAS.setDrag(this);this.offset=[b-this.dims[0],c-this.dims[1]];this.dragging=true;a.overlay.withinCrop=true},onMousemove:function(b,e){document.body.style.cursor="move";if(this.dragging){var c=this.w;var d=this.h;this.x=b-this.offset[0]+c*0.5;this.y=e-this.offset[1]+d*0.5}},onMouseup:function(){a.CANVAS.clearDrag();this.dragging=false;a.overlay.withinCrop=false},onMouseover:function(){this.hover=true;a.overCrop=true},onMouseout:function(){if(!a.overImg){document.body.style.cursor="default"}a.overCrop=false;this.hover=false}}})},makeThread:function(){this.CANVAS.addThread(new Thread({id:"myThread",onExec:function(){if(typeOf(this.CANVAS)!=="null"){if(typeOf(this.CANVAS.ctxEl)!=="null"){this.CANVAS.clear().draw()}}}.bind(this)}))},watchClose:function(){var a=$(this.windowopts.id);a.getElement("input[name=close-crop]").addEvent("click",function(b){this.win.close()}.bind(this))},watchZoom:function(){var a=$(this.windowopts.id);if(!this.windowopts.crop){return}this.scaleField=a.getElement("input[name=zoom-val]");this.scaleSlide=new Slider(a.getElement(".fabrikslider-line"),a.getElement(".knob"),{range:[20,300],onChange:function(c){this.imgCanvas.scale=c/100;if(typeOf(this.img)!=="null"){try{this.images.get(this.activeFilePath).scale=c}catch(b){fconsole("didnt get active file path:"+this.activeFilePath)}}this.scaleField.value=c}.bind(this)}).set(100);this.scaleField.addEvent("keyup",function(b){this.scaleSlide.set(b.target.get("value"))}.bind(this))},watchRotate:function(){var a=$(this.windowopts.id);if(!this.windowopts.crop){return}var b=a.getElement(".rotate");this.rotateField=b.getElement("input[name=rotate-val]");this.rotateSlide=new Slider(b.getElement(".fabrikslider-line"),b.getElement(".knob"),{onChange:function(d){this.imgCanvas.rotation=d;if(typeOf(this.img)!=="null"){try{this.images.get(this.activeFilePath).rotation=d}catch(c){fconsole("rorate err"+this.activeFilePath)}}this.rotateField.value=d}.bind(this),steps:360}).set(0);this.rotateField.addEvent("keyup",function(c){this.rotateSlide.set(c.target.get("value"))}.bind(this))},showWin:function(){this.win=Fabrik.getWindow(this.windowopts);if(typeOf(this.CANVAS)==="null"){return}if(typeOf(this.CANVAS.ctxEl)!=="null"){this.CANVAS.ctxPos=$(this.CANVAS.ctxEl).getPosition()}if(typeOf(this.CANVAS.threads)!=="null"){if(typeOf(this.CANVAS.threads.get("myThread"))!=="null"){this.CANVAS.threads.get("myThread").start()}}}});