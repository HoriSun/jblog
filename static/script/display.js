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

function listupdater(id){
    var atr = $$(id);
    var cat = atr.parentNode;
    var box = $$('itemlist');
    var query = {};
    if(id!='item-all-all'){
	if(box.chosen[cat.id.split('-')[1]]==atr.innerHTML){
	    box.chosen[cat.id.split('-')[1]] = "";
	    atr.setAttribute("class",atr.getAttribute("class").split(" chosen").join(""));
	}else{
	    if(box.chosen[cat.id.split('-')[1]]){
		var c = cat.id+"-"+box.chosen[cat.id.split('-')[1]];
		console.log(c);
		var tc = $$(c);
		console.log("cho",tc);
		try{
		    var tcc = tc.getAttribute("class");
		    console.log(tcc);
		    if(tc!=null){
			tc.setAttribute("class",tcc?tcc.split(" chosen").join(""):"");
		    }
		}catch(e){
		}
	    }
	    box.chosen[cat.id.split('-')[1]] = atr.innerHTML;
	    var atrc = atr.getAttribute("class");
	    atr.setAttribute("class",(atrc?atrc:"")+" chosen");
	}
	query = box.chosen;
    }else{
	box.chosen = {}
    }
    
    query['type']=getstate();
    if("label" in query){query["label"]=escape(query["label"]).replace(/\%/g,"%%")}
    console.log(query,$$('itemlist').chosen);
    ajaxhandler('POST','post/item',updateItem,query);
    //if(getstate()=="blog")scrollToArticle();
}

function isempty(obj){
    var empty = true;
    for(i in obj){empty=false;break;}
    return empty;
}

// data fillers , call component creators
function updateItemList(items){
    if(isempty(items)){
	$$('itemlist').style.display='none';
    }else{
	$$('itemlist').style.display='';
	var box = $$("itemlist");
	box.innerHTML = "";

	box.chosen={}
	var at = document.createElement("ul");
	at.id = "item-all";
	box.appendChild(at);
	var it = document.createElement("li");
	it.id = "item-all-all";
	it.innerHTML = "show all";
	it.onclick=eval("(function(){listupdater('"+it.id+"');})");
	at.appendChild(it);
	for(attr in items){
	    if(attr=="")continue;
	    if(attr=="attr"){
		box.attr = items[attr];
		continue;
	    }
            at = document.createElement("ul");
            at.id = "item-"+attr;
            box.appendChild(at);
            for(itm in items[attr]){
		var item = unescape(itm);
		it = document.createElement("li");
		it.id = at.id+"-"+item;
		it.innerHTML = item;
		it.onclick=eval("(function(){listupdater('"+it.id+"');})");
		at.appendChild(it);
            }
/*
            if(getUser() && (getstate() in {'project':'','experience':'','honor':''})) {
		it = document.createElement("li");
		it.setAttribute('class','label_editor');
		it.innerHTML = "<input type='text'><span class='label_editor_button'>+</span>";
		it.getElementsByTagName("span")[0].onclick = eval("(function() { \
                    ajaxhandler('POST','post/edit',NewResult,\
                                {'label':this.parentNode.children[0].value,\
                                 'itemAttr':'"+attr+"',\
                                 'type':'"+getstate()+"',\
                                 'operation':'new'});})");
		at.appendChild(it);
            }
*/
    
	}
    }


    if(jblog.getUser() && (getstate() in {'project':'','experience':'','honor':''})) {
/*
        at = document.createElement("ul");
        at.id = "item-editor";
        box.appendChild(at);
        it = document.createElement("li");
        it.setAttribute('class','label_editor');
        it.innerHTML = "<input type='text'><span class='label_editor_button'>+</span>";
        it.getElementsByTagName("span")[0].onclick = eval("(function() { \
                ajaxhandler('POST','/post/edit/list',NewResult,{'attr':this.parentNode.children[0].value,'type':'"+getstate()+"', 'operation':'new'}); \
                })");
        at.appendChild(it);
*/
    } else if(jblog.getUser() && getstate() == "blog") {
        at = document.createElement("ul");
        at.id = "item-editor";
        box.appendChild(at);
        it = document.createElement("li");
        it.innerHTML = "Add Blog";
        it.onclick = eval("(function() { showEditor(); })");
        at.appendChild(it);
    }
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

