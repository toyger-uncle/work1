var scene = $.cookie("scene");
var lan = $.cookie("lan");
$(function () {
    if (scene == null) {
        scene = "co";
    }
    if (lan == null) {
        lan = "ch";
    }
    $("head").append("<script src=\"Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
    $(document).attr("title", title["test"]);
    $("#content").html(pageattr["standard"]);
    Test();
    function Test() {
        Ajax(true, test["Test"], { Parm: "pz" }, function (data) {
            if (data.Success) {
                alert(hint["success"]);
            }
            else {
                alert(hint["fail"]);
            }
            return data;
        });
    }
});