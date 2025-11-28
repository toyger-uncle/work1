var scene = $.cookie("scene");
var lan = $.cookie("lan"); 
var mode = 0;
var useridvalue = $.cookie("LocalID");
var pswvalue = $.cookie("psw");
if (pswvalue != null) {//自动登录
    Ajax(true, lg["UserLogin"], { uservalue: useridvalue, psw: pswvalue }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        } 
        window.location.href = "Web/HomePage.htm";
    });
}
$(function () {
    if (scene == null) {
        scene = "co";
    }
    if (lan == null) {
        lan = "ch";
    }
    Ajax(true, lg["IsRegister"], {}, function (data) {
                var ww = data.Data;
                if (data.Ex <= 7 && data.Ex>0 && data.Ex != null) {
                    $.messager.confirm("提示", "软件有效期还剩" + data.Ex + "天，请确定是否现在就注册？", function (data) {
                    if (data) {
                        window.location.href = "register.htm?id=" + ww;
                    }
                });
            }
        else if (data.Success == false) {
            window.location.href = "register.htm?id=" + data.Data;
        }
    });
    $("#close").click(function () {
        $('#win').window('close');
    });
    $("#save").click(function () {
        var ids = $("#id").val();
        var zcids = $("#zcid").val();
    });
    $("head").append("<script src=\"Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
    $(document).attr("title", title["login"]);
    $("#user").click(function () {
        mode = 0;
        $("#user").attr("class", "user");
        $("#phone").attr("class", "phoneno");
        $("#userphone1").css("display", "none");
        $("#userphone").css("display", "block");
        $("#userpsw").css("display", "block");
        $("#userver").css("display", "none");
        $("#nextlog").css("display", "block");
        var handphonevalue = $("#phonetxt").val();
        if (handphonevalue.length != 11) {
            $("#phonetxt").select();
        }
        else {
            $("#pswtxt").select();
        }
    });
    $("#imageid").click(function () {
        this.src = "aspx/make_image.aspx?rmd=" + Math.random();
        $("#yantxt").select();
    });
    $("#phone").click(function () {
        mode = 1;
        $("#user").attr("class", "userno");
        $("#phone").attr("class", "phone");
        $("#userpsw").css("display", "none");
        $("#userphone").css("display", "none");
        $("#userphone1").css("display", "block");
        $("#userver").css("display", "block");
        $("#nextlog").css("display", "none");
        var handphonevalue = $("#phonetxt").val();
        if (handphonevalue.length != 11) {
            $("#phonetxt1").select();
        }
        else {
            $("#vertxt").select();
        }
    });
    $("#verdiv").one("click", function () { getver(); });
    $("#phonetxt1").select();
});
function changyz() {
    if (mode == 0) {
        var handphonevalue = $("#phonetxt").val();
        if (handphonevalue == "") {
            return;
        }

        Ajax(true, lg["GetUserLoginError"], { uservalue: handphonevalue }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            if (data.Ex > 3) {
                $("#yanzheng").css("display", "block");
                document.getElementById("imageid").src = "aspx/make_image.aspx?rmd=" + Math.random();
            }
            else {
                $("#yanzheng").css("display", "none");
            }
        });
    }
    if (mode == 1) {
        var handphonevalue = $("#phonetxt1").val();
        if (handphonevalue == "") {
            return;
        }

        Ajax(true, lg["GetUserLoginError"], { uservalue: handphonevalue }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            if (data.Ex > 3) {
                $("#yanzheng").css("display", "block");
                document.getElementById("imageid").src = "aspx/make_image.aspx?rmd=" + Math.random();
                $("#yantxt").select();
            }
            else {
                $("#yanzheng").css("display", "none");
            }
        });
    }
}
function UserLogin() {
    login();
}
function LoginPress() {

   
    var even = getEvent();
    if(even.keyCode == 13)
    { 
        login();
    } 
} 
 function getEvent(){     //同时兼容ie和ff的写法
     if(document.all)    return window.event;        
     func=getEvent.caller;            
     while(func!=null){    
         var arg0=func.arguments[0];
         if(arg0){
             if((arg0.constructor==Event || arg0.constructor ==MouseEvent)
                 || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){    
                 return arg0;
             }
         }
         func=func.caller;
     }
     return null;
 }
function getpsw() {
    var handphonevalue = $("#phonetxt1").val();
    if (handphonevalue == "") {
        alert("手机号不能为空");
        $("#phonetxt1").select();
        return;
    }
    if (handphonevalue.length != 11) {
        alert("手机号长度不对");
        $("#phonetxt1").select();
        return;
    }
    Ajax(true, lg["GetPSW"], { uservalue: handphonevalue }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
    });
}
function getver() {
    var handphonevalue = $("#phonetxt1").val();
    if (handphonevalue == "") {
        alert("手机号不能为空");
        $("#phonetxt1").select();
        return;
    }
    if (handphonevalue.length != 11) {
        alert("手机号长度不对");
        $("#phonetxt1").select();
        return;
    }
//    Ajax(true, lg["MackPhoneVer"], { handphone: handphonevalue }, function (data) {
//        if (!data.Success) {
//            alert(data.Message);
//            return;
//        }
        $("#verdiv").html("59");
        $("#verdiv").unbind("click");
        setTimeout(daoji(), 1000);
//    });
}
function daoji() {
    var j = parseInt($("#verdiv").html()) - 1;
    if (j == 0) {
        $("#verdiv").html("获取验证码");
        $("#verdiv").one("click", function () { getver(); });
    }
    else {
        $("#verdiv").html(j);
        setTimeout(daoji(), 1000);
    }
}
function pswback() {
    if (mode == 0) {
        var handphonevalue = $("#phonetxt").val();
        if (handphonevalue == "") {
            alert("登录名不能为空");
            return;
        }
        Ajax(true, lg["ResetPSW"], { uservalue: handphonevalue }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
        });
    }
    if (mode == 1) {
        var handphonevalue = $("#phonetxt1").val();
        if (handphonevalue == "") {
            alert("登录名不能为空");
            return;
        }
        Ajax(true, lg["ResetPSW"], { uservalue: handphonevalue }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
        });
    }
}
function login() {
    
    if (mode == 0) {
//        if (handphonevalue.length < 11) {
//            alert("登录名长度不对");
//            $("#phonetxt").select();
//            return;
        //        }
    var handphonevalue = $("#phonetxt").val();
    if (handphonevalue == "") {
        alert("登录名不能为空");
        $("#phonetxt").select();
        return;
    }
        var userpswvalue = $("#pswtxt").val();
        var yanzheng = $("#yantxt").val();
        if (userpswvalue == "") {
            alert("密码不能为空");
            $("#pswtxt").select();
            return;
        }
        if (document.getElementById("yanzheng").style.display == "block") {
            if (yanzheng == "") {alert("验证码不能为空");return;}
        }
        Ajax(true, lg["UserLoginValidate"], { uservalue: handphonevalue, psw: userpswvalue, Validate: yanzheng }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                changyz();
                return;
            }
            $.cookie("LocalID", data.Ex, { path: '/', expires: 365 });
            var isauto = $("#zidong").is(":checked");
            if (isauto) {
                $.cookie("psw", userpswvalue, { path: '/', expires: 365 });
            }
            window.location.href = "Web/HomePage.htm";
        });
    }
    else {
        var handphonevalue = $("#phonetxt1").val();
        if (handphonevalue == "") {
            alert("登录名不能为空");
            $("#phonetxt1").select();
            return;
        }
        if (handphonevalue.length != 11) {
            alert("手机号长度不对");
            $("#phonetxt1").select();
            return;
        }
        var uservervalue = $("#vertxt").val();
        if (uservervalue == "") {
            alert("短信验证码不能为空");
            $("#vertxt").select();
            return;
        }
        if (uservervalue.length != 6) {
            alert("短信验证码长度不对");
            $("#vertxt").select();
            return;
        }
        var userpswvalue = $("#pswtxt").val();

        var yanzheng = $("#yantxt").val();
        if (document.getElementById("yanzheng").style.display == "block") {
            if (yanzheng == "") { alert("验证码不能为空"); return; }
        }
        Ajax(true, lg["UserLoginValidate"], { uservalue: handphonevalue, psw: userpswvalue, Validate: yanzheng }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                changyz();
                return;
            }
            $.cookie("LocalID", data.Ex, { path: '/', expires: 365 });
            var isauto = $("#zidong").is(":checked");
            if (isauto) {
                $.cookie("psw", userpswvalue, { path: '/', expires: 365 });
            }
            window.location.href = "Web/HomePage.htm";
        });
    }
}