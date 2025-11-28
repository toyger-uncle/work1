var LocalID = $.cookie("LocalID");
//var skins = $.cookie("skins");
//var scene = $.cookie("scene"); //场景
//var lan = $.cookie("lan");

$(function () {

    //初始化
    //    if (skins == null) {
    //        skins = "aq";
    //    }
    //    if (scene == null) {
    //        scene = "co";
    //    }
    //    if (lan == null) {
    //        lan = "ch";
    //    }
    //    $("head").append("<link href=\"../../" + skin_links[skins] + "\" rel=\"stylesheet\" type=\"text/css\"></script>");
    //    $("head").append("<script src=\"../../Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
    //    $(document).attr("title", title[""]);
    //    $("#btn1").html(button["baocun"]);
    //    $("#btn2").html(button["reset"]);
    //    $("#btn3").html(button["derive"]);
    //婚姻状况
    //    var marrysel = $("#marrysel");
    //    marrysel.empty();
    //    jsAddItemToSelect(marrysel, "01", message["unmarried"]);
    //    jsAddItemToSelect(marrysel, "02", message["married"]);
    //    jsAddItemToSelect(marrysel, "03", message["divorce"]);
    //    marrysel.val();
    //    //政治面貌
    //    var politfacesel = $("#politfacesel");
    //    politfacesel.empty();
    //    jsAddItemToSelect(politfacesel, "01", message["Party"]);
    //    jsAddItemToSelect(politfacesel, "02", message["member"]);
    //    jsAddItemToSelect(politfacesel, "03", message["people"]);
    //    politfacesel.val();
    $('#politfacesel').combobox({
        data: polit_face_id,
        valueField: "value",
        textField: "text"
    });
    $('#marrysel').combobox({
        data: marrysel,
        valueField: "value",
        textField: "text"
    });
    Ajax(true, global.sys["GetUserFile"], { LoginID: LocalID, id: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#usernametxt").textbox("setValue", data.Data.user_name);
        if (data.Data.sex == "男") {
            $("input[name=sexrad][value=男]").attr("checked", true);
        }
        else {
            $("input[name=sexrad][value=女]").attr("checked", true);
        }
        $("#birthday").datebox("setValue", data.Data.birthday);
        $("#marrysel").combobox("setValue", data.Data.marry);
        $("#politfacesel").combobox("setValue", data.Data.polit_face);
        $("#htelephonenumbertxt").textbox("setValue", data.Data.h_telephonenumber);
        $("#haddresstxt").textbox("setValue", data.Data.h_address);
        document.getElementById("preview").src = "../../Photo/" + data.Data.photo;
    });


    //获取图片
    $("#file_upload").change(function () {
        var $file = $(this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $("#preview");

        if (fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src', dataURL);
        } else {
            dataURL = $file.val();
            var imgObj = document.getElementById("preview");
            // 两个坑:
            // 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
            // 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

        }
    });

    $("#btn1").click(function () {
        var s = $("#file_upload").val();
        var usernametxt = $("#usernametxt").val(); //姓名
        var sex = $(":radio:checked").val(); //性别
        var birthdaytxt = $("#birthday").datebox('getValue'); //出生日期
        var marrysel = $("#marrysel").combobox('getValue'); //婚姻状况
        var politfacesel = $("#politfacesel").combobox('getValue'); //政治面貌
        var htelephonenumbertxt = $("#htelephonenumbertxt").val(); //联系电话
        var haddresstxt = $("#haddresstxt").val(); //家庭地址
        var photo = $(".image_container img").attr("src")
        if (usernametxt == "") {
            $.messager.alert("提示", "姓名不能为空！", "error");

            $("#usernametxt").select();
            return;
        }

        if (sex_man == "") {
            $.messager.alert("提示", "性别不能为空！", "error");
            $("#sex_man").select();
            return;
        }

        if (birthdaytxt == "") {
            $.messager.alert("提示", "出生日期不能为空！", "error");
            $("#birthday").select();
            return;
        }


        if (marrysel == "") {
            $.messager.alert("提示", "婚姻状况不能为空！", "error");
            $("#marrysel").select();
            return;
        }

        if (politfacesel == "") {
            $.messager.alert("提示", "政治面貌不能为空！", "error");
            $("# politfacesel").select();
            return;
        }
        var x = document.getElementById("htelephonenumbertxt").value.length;
        if (x != 11) {
            $.messager.alert("提示", "请输入正确长度的电话号码！", "error");
            $("#htelephonenumbertxt").select();
            return;
        }
        //        if (htelephonenumbertxt && /^1[38]\d{9}$/.test(htelephonenumbertxt)) {

        //        } else {
        //            $.messager.alert("提示", "请输入正确的电话号码！", "error");
        //            $("#htelephonenumbertxt").select();
        //            return;
        //        }


        Ajax(true, global.sys["UpdateUserFile"], { LoginID: LocalID, id: LocalID, user_name: usernametxt, sex: sex, birthday: birthdaytxt, marry: marrysel, polit_face: politfacesel, h_telephonenumber: htelephonenumbertxt, h_address: haddresstxt }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                //                $("#").select(); //光标定位
                return;
            }
            if (s != "") {
                ajaxFileUpload(global.sys["UpUserFilePhoto"], { LoginID: LocalID, id: LocalID }, "file_upload", function (data, status) {
                    if (!data.Success) {
                        alert(data.Message);
                        return;
                    }
                    $.messager.alert("提示", "保存成功", "info");
                    return;
                });
            }
            else {
                $.messager.alert("提示", "保存成功", "info");
                return;
            }
        });
    });

    $("#btn2").click(function () {
        window.location.href = "BasicMessage_H.htm";
    });
});