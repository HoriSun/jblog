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

var articleNum = 0;
function updateItem(items){
    if($$('resume')) $$('resume').remove();
    if($$('contact')) $$('contact').remove();
    if($$('link')) $$('link').remove();
    if($$('main')) $$('main').remove();
    if($$('simditorEdit')) $$('simditorEdit').remove();
    if(getstate() == "contact") {
        updateItemFromContact(items);
        return;
    }else if(getstate() == "resume") {
        updateItemFromResume(items);
        return;
    }else if(getstate() == "main") {
	updateItemFromMain(items);
	return;
    }
    //if(!isempty(items)){
	$$('articletree').style.display='';
	var box = $$("articletree");
	var artlist = box.children;
	var a = document.getElementsByClassName("article");
	for(i=0;i<a.length;)a[0].remove(); // remove()后a.length自动减一，故不必i++已经可以
	var fchild = box.children[0];
	for(post in items){
    	    var art = createItem();
            art.id = "article-"+items[post]["id"]; // post即为序号
            if(fchild==undefined)
		box.appendChild(art);
            else
		box.insertBefore(art,fchild);
            for(i=0;i<art.children.length;i++){
		var p = art.children[i];
		var attr = p.getAttribute("class");
		if(items[post][attr]==undefined||items[post][attr]==""){
                    p.style.display="none";
                    continue;
		}	   
		if(attr == "label"){
                    var labels = unescape(items[post][attr]).split(',');
                    for(j=0;j<labels.length;j++)
                    {
            		var sp = document.createElement("span");
			sp.innerHTML = labels[j];
			p.appendChild(sp);
                    }
		}else if(attr == "content"){
		    var cont = unescape(items[post][attr]).split("\n");
		    p.innerHTML = "<p>"+cont.join("</p><p>")+"</p>";
    		}else 
                    p.innerHTML = unescape(items[post][attr]);
		
	        if(attr == "title")
		    //p.setAttribute('onclick','ajaxhandler("POST","post/item",updateItem,{"type":type,"id":"'+items[post]['id']+'"});');
		    p.onclick=eval("(function(){ajaxhandler('POST','post/item',updateItem,{'type':'"+getstate()+"','id':'"+items[post]['id']+"'});scrollToArticle();})");
            }
	}



    if(jblog.getUser()) {
        if(getstate() == "project") {
            var art = createItem();
            art.style.border = "1px dashed #000";
            for(i=1;i<art.children.length;i++) {
                if(art.children[i].className == "abstract")
                    art.children[i].innerHTML = "<textarea type=text class='editInputProject " + "editor_"+art.children[i].className + "'></textarea>";
                else if(art.children[i].className != "content")
                    art.children[i].innerHTML = "<input type='text' class='editInputProject " + "editor_"+art.children[i].className + "'>";
            }
            var eb = createEditButton();
	    //var ebonclick = "(function() {var inputs = document.getElementsByClassName('editInputProject'); ajaxhandler('POST','post/edit',NewResult, {'title':inputs[0].value, 'abstract':inputs[1].value, 'label':inputs[2].value.split(','),'operation':'new','type':getstate() });})";
	    
	    eb.onclick = eval("(function(){\
		var inputs = document.getElementsByClassName('editInputProject');\
		var labels = inputs[2].value.split(',');\
		var itemattr = $$('itemlist').attr;\
		var ebonclick = {\
		    'title':inputs[0].value,\
		    'abstract':inputs[1].value,\
		    'operation':'new',\
		    'type':getstate()\
                };\
		if(labels.length<itemattr['notnull'].length) alert('too few labels');\
		else{\
		    for(i in itemattr['notnull'])\
			ebonclick[itemattr['notnull'][i]]=labels[i];\
		    for(i=0;i<labels.length-itemattr['notnull'].length;i++){\
			ebonclick[itemattr['null'][i]]=labels[i+itemattr['notnull'].length];\
		    }\
		}\
		ajaxhandler('POST','post/edit',NewResult, ebonclick);\
	    })")
	
            //var in = document.getElementsByClassName('editIpnutProject'); console.log(in);  }
            art.appendChild(eb);
            box.appendChild(art);
        }  else if (getstate() == "experience"||getstate() == "honor") {
            var art = createItem();
            art.style.border = "1px dashed #000";
            art.children[1].innerHTML = "<input type='text' class='editInputEH editor_title'>";
            art.children[4].innerHTML = "<input type='text' class='editInputEH editor_label'>";
            var eb = createEditButton();
            //eb.onclick = eval("(function() {var inputs = document.getElementsByClassName('editInputEH'); ajaxhandler('POST','post/edit',NewResult, {'title':inputs[0].value,  'label':inputs[1].value.split(','),'operation':'new','type':getstate() });})");
	    eb.onclick = eval("(function(){\
		var inputs = document.getElementsByClassName('editInputEH');\
		var labels = inputs[1].value.split(',');\
		var itemattr = $$('itemlist').attr;\
		var ebonclick = {\
		    'title':inputs[0].value,\
		    'operation':'new',\
		    'type':getstate()\
                };\
		if(labels.length<itemattr['notnull'].length) alert('too few labels');\
		else{\
		    for(i in itemattr['notnull'])\
			ebonclick[itemattr['notnull'][i]]=labels[i];\
		    for(i=0;i<labels.length-itemattr['notnull'].length;i++){\
			ebonclick[itemattr['null'][i]]=labels[i+itemattr['notnull'].length];\
		    }\
		}\
		ajaxhandler('POST','post/edit',NewResult, ebonclick);\
	    })")
            art.appendChild(eb);
            box.appendChild(art);
        }
    }

	articleNum = items.length;
	updateArticleDisplay(1);
//    }else{
//	$$('articletree').style.display='none';
 //   }


}

var APP = 5; // article per page
function updateTextButton(CurrentPage) {
    clearTextButton();
    var buttonNum = Math.ceil(articleNum/APP);
    var box = $$("articletree");
    for(var i=1; i<=buttonNum; i++) {
        var textButton = null;
        if(i == CurrentPage) {
            textButton = createTextButton(i.toString(), true);
        } else {
            textButton = createTextButton(i.toString(), false);
            textButton.onclick = eval("(function(){updateArticleDisplay(" + i.toString() + ")})");
        }
        box.appendChild(textButton);
    }
    if(CurrentPage < buttonNum) {
        var textButton = createTextButton("下一页", false);
        textButton.onclick = eval("(function(){updateArticleDisplay(" + (CurrentPage+1).toString() + ")})")
        box.appendChild(textButton);
    }
}
function clearTextButton() {
    var a = document.getElementsByClassName("textbutton");
    for(i=0;i<a.length;)a[0].remove(); // remove()后a.length自动减一，故不必i++已经可以
}

function updateArticleDisplay(page) {
    updateTextButton(page);
    var a = document.getElementsByClassName("article");
    for(var i=0; i<a.length; i++) {
        a[i].style.display = "none";
    }
    for(var i=(page-1)*APP; i<page*APP && i<a.length; i++) {
        a[i].style.display = "block";
    }

}

function updateTitle(items){
    //console.log(items);
    var title = document.getElementsByTagName("h1")[0];
    var description = document.getElementsByTagName("h3")[0];
    title.innerHTML = items["title"];
    description.innerHTML = items["description"];
}

function updateResume(items){
    if(items['status']=='1')console.log('UPLOAD OK!');
    else console.log('UPLOAD FAILED');
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

