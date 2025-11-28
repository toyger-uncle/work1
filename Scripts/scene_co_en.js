var scene = 
{
    homepage:
    {title:'homepage'},
    //{".companyname":'平治科技'}
    //{leftmenu:'我的菜单'}
}
$(document).ready(function () {
    //alert(scene.homepage.title);
    $(document).attr("title", scene.homepage.title);
    $("#companyname").html("PingZhi Scientific");
    $("#aqua").html("default");
    $("#silvery").html("silvery");
    $("#gray").html("gray");
    $("#gray2014").html("gray2014");
    $(".l-link2").html("English");
    $("#down").html("HangZhou PingZhi Scientific Technology");
 
});