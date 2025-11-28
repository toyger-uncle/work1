var LocalID = $.cookie("LocalID");
var skins = $.cookie("skins");
var scene = $.cookie("scene"); //场景
var lan = $.cookie("lan");
$(function () {
    //初始化
    if (skins == null) {
        skins = "aq";
    }
    if (scene == null) {
        scene = "co";
    }
    if (lan == null) {
        lan = "ch";
    }
    $("head").append("<link href=\"../../" + skin_links[skins] + "\" rel=\"stylesheet\" type=\"text/css\"></script>");
    $("head").append("<script src=\"../../Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
    $(document).attr("title", title["adminchange"]);
    //    $("#old").html(title[""]);
    //    $("#new").html(title[""]);
    //    $("#rnew").html(title[""]);
//    $("#btn1").html(button["baocun"]);
//    $("#btn2").html(button["reset"]);

    $("#btn1").click(function () {
        var oldpsw = $("#oldpsw").val();
        var newpsw = $("#newpsw").val();
        var qrnewpsw = $("#qrnewpsw").val();

        if (oldpsw == "") {
            alert('旧密码不能为空！');
            
            $("#oldpsw").select();
            return;
        }
        if (newpsw == "") {
            alert('新密码不能为空！');
            
            $("#newpsw").select();
            return;
        }
        if (qrnewpsw == "") {
            alert('确认密码不能为空！');
           
            $("#qrnewpsw").select();
            return;
        }
        if (newpsw != qrnewpsw) {
            alert('新密码和确认密码不相同！');
            
            $("#qrnewpsw").select();
            return;
        }
        Ajax(true, sys["UpdateUserPsw"], { old_psw: oldpsw, new_psw: newpsw, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                $("#oldpsw").select(); //光标定位
                return;
            }
            alert("保存成功！");
            return;
        });
    });

    $("#btn2").click(function () {
        $("#oldpsw").val("");
        $("#newpsw").val("");
        $("#qrnewpsw").val("");
    });

});