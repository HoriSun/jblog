//======== Jblog Namespace definition ========// 
//[ imitate Google's Closure Library ]

/** 
 * Base namespace for JBLOG front end.  
 * Checks to see jblog is already defined in the current scope 
 * before assigning to prevent clobbering if
 * main.js is loaded more than once.
 *
 * @const
 */
var jblog = jblog || {}

/**
 * List of blog pages
 * used for querying if a state is legal or not.
 * used dictionary to make using ('main' in jblog.typelist) possible
 *
 * @const
 */ 
jblog.typelist = {"main":"","project":"","experience":"","honor":"","resume":"","contact":"","blog":""};

/**
 * A simple Cookie manager.
 * still not robust enough, but usable.
 * 
 * @const
 */
jblog.cookie = jblog.cookie || {
    /**
     * Clean all of the Cookies.
     */
    clean : function(){
        var cook = document.cookie.replace(" ","").split(";");
        for(i in cook){
	        if(cook[i].match("([^=]*)=(.*)")==null) 
	            this.del(cook[i]);
        }
    },

    /**
     * Get all of the Cookies.
     *
     * @return {?} dict of all of the cookies , or empty Object.
     */
    all : function(){
        var cookie = {};
        document.cookie.replace(" ","").split(";").forEach(
	        function(x){
	            var ck = x.match("([^=]*)=(.*)");
	            if(ck)cookie[ck[1]]=ck[2].match("[\"]?([^\"]*)[\"]?")[1];
	        });
        return cookie;
    },

    /**
     * Get a Cookie.
     *
     * @param {string} name : key of the cookie.
     * @return {?} value of the cookie , or null.
     */
    get : function(name){
        var ret = document.cookie.match(name+"=([^;]*)[;]?");
        if(ret==null) return ret;
        else return ret[1].match("[\"]?([^\"]*)[\"]?")[1];
    },

    /**
     * Set Cookies.
     *
     * @param {string} key : list of the keys
     * @param {string} value : list of the values, each one corresponds to each of the keys
     * @param {number} days=null : expire time of these cookies
     */
    set : function(key,value,days){
        var d = new Date();
        var cookie;
        d.setTime(d.getTime() + (days*24*60*60*1000));
        if(days<0){
	        var gki = this.get(key);
	        if(gki) cookie = key+"=\""+gki+"\"; expires="+d.toGMTString();
	        else cookie = key+"=\"\"; expires="+d.toGMTString();
        }else{
	        cookie = key+"=\""+value+"\";";
	        if(days)
	            cookie += " expires="+d.toGMTString();
        }
        document.cookie = cookie;
    },

    /**
     * Delete Cookies.
     *
     * @param {string} key : the key of the cookie to be deleted.
     */
    del : function(key){
        this.set(key,null,-1);
    },
}


jblog.getUser = jblog.getUser || function() {
    return (this.cookie.get('jbloguser') != null)? true:false;
}

//======== Common Functions ========//

/**
 * Short form to get a tag by id.
 *
 * @param {string} name : get by id
 * @return {Object} the element Object
 */
function $$(name){ 
    return document.getElementById(name); 
} 

/**
 * Reference to : W3SChool.com.cn
 * send AJAX request and process the responded data.
 * to adapt with the SAE environment, which will append some code to 
 * the response from the server to WARN the visitors when the developer 
 * hasn't do the identification certification, the handler is slightly modefied. 
 *
 * @param {string} method : "GET"|"POST"
 * @param {string} url : the requested url
 * @param {Function} callback : the callback function to process the returned data
 * @param {string} content : the data attached to the request
 * @param {Object} vargs : appended arguments for the callback, for multiple arguments, use Array[].
 */
function ajaxhandler(method,url,callback,content,vargs){
    var xmlhttp;
    if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
    }
    else{
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4){
	        if(xmlhttp.status==200){
		        rtext = xmlhttp.responseText.split("======")[0]; //拆掉SAE小尾巴
		        rtext = JSON.parse(rtext);
		        //console.log(rtext['request']);
		        //console.log(xmlhttp.responseText);
		        //console.log(rtext);
		        callback(rtext['data'],vargs);
	        }else{
		        callback({'status':'0'},vargs);
	        }
        }
    }
    if(method == "GET" || method == "POST"){
	    //console.log([method,url,content].join("====="));
	    //console.log(content);
	    url = url.split("&");
	    url[0] = url[0].split("?");
	    url[0][0] += "?_xsrf="+jblog.cookie.get("_xsrf");
	    url[0] = url[0].join("&");
	    url = url.join("&");
        xmlhttp.open(method,url,true);//true意为async=true
        if(content!=undefined){
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            contstring = JSON.stringify(content);
            xmlhttp.send(contstring);
            //console.log(contstring);
        }
        else{
            xmlhttp.send();
        }
    }
}

/**
 * loading CSS & JS files.
 * @param {string} path : file path
 * @param {string} type : "css"|"js"
 * @param {string} afterfunc : execute when "onload" event is triggered
 */
function loadfile(path,type,afterfunc){
    function addcss(hashpath,afterfunc){
        hashpath = hashpath["path"];
        var head = document.getElementsByTagName("head")[0];    
        var tag = document.createElement("link");
        tag.rel = "stylesheet";
        tag.type = "text/css";
        tag.href = hashpath;
        if(afterfunc!=undefined)tag.setAttribute("onload",afterfunc);
        head.appendChild(tag);
    }
    function addjs(hashpath,afterfunc){        
        //console.log(hashpath);
        //var fjs = document.getElementsByTagName('link')[0]
        hashpath = hashpath["path"];
        var head = document.getElementsByTagName("head")[0];
        var tag = document.createElement("script");
        tag.type = "text/javascript";
        tag.src = hashpath;
        //tag.id = hashpath;
        if(afterfunc!=undefined) tag.setAttribute("onload",afterfunc);//{"onload":afterfunc};
  
        //console.log(tag.onload,tag.attributes[3].value,afterfunc);
        head.appendChild(tag);
        //fjs.parentNode.insertBefore(tag,fjs)        
    }
    
    var addfunc;
    type = type.toLowerCase();
    if(type=="css") addfunc = addcss;
    else if(type=="js") addfunc = addjs;
    ajaxhandler("POST","post/statichash",addfunc,{"path":path},afterfunc);
}

function load(){
    loadfile("css/style.css","css");
    loadfile("script/display.js","js","display();document.getElementsByTagName('body')[0].style.display='';"); 
    loadfile("script/usermanage.js","js","initialUser()");  
}

window.onload = load();
//load();
