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
    $(document).attr("title", title["companyupdate"]);
    $("#Companyname").html(title["Companyname"]);
    $("#baocun").html(button["baocun"]);
    Ajax(true, lg["GetCompanyName"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#company").val(data.Data);
    });
    function save() {
        var company = $("#company").val();
        if (company == "") {
            alert('公司名称不能为空！');
        
            $("#company").select();//光标定位
            return;
        }
        Ajax(true, sys["UpdateCompanyName"], { companyname: company, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                return;
            }
        });
    }
    $("#baocun").click(function () {
        if (save()) {
        }
    });
});