var User = null;
function initialUser() {
    User = $$("UserArea");
    //ajaxhandler("POST","post/getuser",updateUserArea,{});
    if(jblog.cookie.get('jbloguser') != null)
        updateUserArea({'status':'1' });
    else
        updateUserArea({'status':'0' });
}

function updateUserArea(items) {
    //Judge here
    clearArea();
    if(items['status'] == '1') {
        User.innerHTML = "Logout";
        User.onclick = eval("(function() { logout(); })");
	display();
    } else {
        User.innerHTML = "Login";
        User.onclick = eval("(function() { loginArea(); })");
	jblog.cookie.del('jbloguser');
	display();
    }
}
function logout() {
    ajaxhandler("POST","post/logout",updateUserArea,{});
}
function createInput(name,type,value) {
    var view = document.createElement("input");
    view.setAttribute("type", type);
    view.setAttribute("name", name);
    view.setAttribute("value", value);
    view.setAttribute("default", value);
    if(name != 'password') {
        view.onfocus = eval("(function() { if(this.value == '"+value+"') this.value = ''; })");
        view.onblur =  eval("(function() { if(this.value == '') this.value = '"+value+"'; })");
    } else {
        view.onfocus = eval("(function() { if(this.value == '"+value+"') { this.value = ''; this.type = 'password'}})");
        view.onblur =  eval("(function() { if(this.value == '') { this.value = '"+value+"'; this.type = 'text' }})");
    }
    return view;
}
function createLayout() {
    var layout = document.createElement("div");
    layout.setAttribute("id","layout");
    layout.onclick = eval("(function() { clearArea(); })");
    return layout
}
function clearArea() {
    if(document.getElementsByClassName('org_box').length != 0)
        document.getElementsByClassName('org_box')[0].remove();
    if(document.getElementById('layout') != null)
        document.getElementById('layout').remove();
}
function loginArea() {
    var body = document.getElementsByTagName("body")[0];
    clearArea();
    body.appendChild(createLayout());
    var orgbox = document.createElement("div");
    orgbox.setAttribute("class","org_box");
    var orgboxcor = document.createElement("span");
    orgboxcor.setAttribute("class","org_box_cor");
    orgbox.appendChild(orgboxcor);
    orgbox.appendChild(createInput("username","text","Username"));
    orgbox.appendChild(createInput("password","text","Password"));
    var loginbutton = document.createElement("button");
    loginbutton.innerHTML = "SIGN IN";
    loginbutton.onclick = eval("(function(){ login(); })");
    orgbox.appendChild(loginbutton);
    //if(jblog.cookie.get('registered')==null)
    {
	var text = document.createElement("p");
	text.innerHTML = "Register Here";
	text.onclick = eval("(function(){ registerArea();})");
	orgbox.appendChild(text);
	body.appendChild(orgbox);
    }
}
function registerArea() {
    var body = document.getElementsByTagName("body")[0];
    clearArea();
    body.appendChild(createLayout());
    var orgbox = document.createElement("div");
    orgbox.setAttribute("class","org_box");
    var orgboxcor = document.createElement("span");
    orgboxcor.setAttribute("class","org_box_cor");
    orgbox.appendChild(orgboxcor);
    orgbox.appendChild(createInput("username","text","Username"));
    orgbox.appendChild(createInput("email","text","Email"));
    orgbox.appendChild(createInput("password","text","Password"));
    var loginbutton = document.createElement("button");
    loginbutton.innerHTML = "REGISTER";
    loginbutton.onclick = eval("(function(){ register(); })");
    orgbox.appendChild(loginbutton);
    var text = document.createElement("p");
    text.onclick = eval("(function(){ loginArea();})");
    text.innerHTML = "Login Here";
    orgbox.appendChild(text);
    body.appendChild(orgbox);
}

function login() {
    var box = document.getElementsByClassName("org_box")[0];
    var inputs = box.getElementsByTagName("input");
    ajaxhandler("POST","post/login",updateUserArea,{"username":inputs[0].value, "password":inputs[1].value});
}
function register() {
    var box = document.getElementsByClassName("org_box")[0];
    var input = box.getElementsByTagName("input");
    var username = (input[0].value == input[0].getAttribute('default'))?"":input[0].value;
    var email = (input[1].value == input[1].getAttribute('default'))?"":input[1].value;
    var password = (input[2].value == input[2].getAttribute('default'))?"":input[2].value;

    console.log(username,email,password);
    console.log(input[0].value,input[1].value,input[2].value);
    ajaxhandler("POST","post/register",loginArea,{"username":username, "email":email, "password":password});
}
