// component creators
function createItem(){
    var item = document.createElement("div");
    item.setAttribute("class","article");
	item.innerHTML = '\
		<p class="date"></p>\
		<p class="title"></p>\
		<p class="abstract"></p>\
		<div class="content"></div>\
		<p class="label"></p>\
		';
    return item;
}

//http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
function getElementLeft(element){
　　var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}
　　return actualLeft;
}
//http://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html
function getElementTop(element){
　　var actualTop = element.offsetTop;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualTop += current.offsetTop;
　　　　current = current.offsetParent;
　　}
　　return actualTop;
}

//extract the get parameters from url to a dict
function urlparser(){
    var ret = {};
    var option = unescape(window.location.href);
    var r = /[?&]([^?=#&]*)=([^?=#&]*)/g;
    var temp;
    while(temp=r.exec(option)) ret[temp[1]]=temp[2];
    return ret;
}

function getstate(){
    var url = urlparser();
    if(('t' in url) && (url['t'] in jblog.typelist)) // 't' for state
	    return url['t'];//以后设做主页hello
    else
	    return 'main';
}

function scrollToArticle(){
    var top = getElementTop($$('articletree'))-20-55; //20-"padding"; 55-"height of top bar";
    //console.log(top);
    window.scrollTo(0,top);
}


function isempty(obj){
    var empty = true;
    for(i in obj){empty=false;break;}
    return empty;
}


function getAttributes(){
    var ret = [];
    if($$('itemlist')){
	var uls = $$('itemlist').getElementsByTagName('ul')
	for(i=0;i<uls.length;i++){
	    var id = uls[i].id.split('-')[1];
	    if(id != 'all' && id != 'editor'){
		ret.push(id);
	    }
	}
    }
    return ret;
}


function fileupload(){
    if(window.FormData){
	var formData = new FormData();
	// 建立一个upload表单项，值为上传的文件
	formData.append('upload', $$('upload-file').files[0]);
	ajaxhandler("POST","post/upload",updateResume,{"type":"resume","file":formData});
    }else{
	console.log("[ WARN ] This browser does not support Formdata");
    }    
}

//外部接口，用作本文件加载后执行的主函数
function display(){
    var type = getstate();
    ajaxhandler("POST","post/itemlist",updateItemList,{"type":type});
    ajaxhandler("POST","post/item",updateItem,{"type":type,"year":2015});
    ajaxhandler("POST","post/title",updateTitle,{"type":type});
    if(type in {'contact':'','main':''})
	ajaxhandler("POST","post/"+type,updateItem,{"type":type});
//    ajaxhandler("POST","post/experience",updateExperience,{"type":type});
//    ajaxhandler("POST","post/honor",updateHonor,{"type":type});
//    ajaxhandler("POST","post/project",updateProject,{"type":type});
//    console.log("Support HTML5 localStorage?  ",check_HTML5_Storage_Support()?"[ YES ]":"[  NO ]")
}


function goto(type){ // main|projects|experiences|honors|resume|contact|blog
    if(type=="")
	type = "main";
    if(type in jblog.typelist){
	//修改href会导致页面刷新
	//window.location.href = window.location.origin + '?t=' + type;
	//HTML5,无刷新修改url
	window.history.pushState({},0,window.location.origin + '?t=' + type);
	display();
    }
}

//HTML5无刷新页面前进/后退
window.onpopstate = display;

