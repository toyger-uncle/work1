var LocalID = $.cookie("LocalID");
//var theme = $.cookie("theme"); //主题
//var skins = $.cookie("skins");//皮肤
//var scene = $.cookie("scene"); //场景
//var lan = $.cookie("lan"); //语言
//var error = $.cookie("error");//最大错误次数
$(function () {
//    //初始化
//    if (theme == null) {
//        theme = "01";
//    }
//    if (skins == null) {
//        skins = "aq";
//    }
//    if (scene == null) {
//        scene = "co";
//    }
//    if (lan == null) {
//        lan = "ch";
//    }
//    if (error == null) {
//        error = "3";
//    }
//    $("head").append("<link href=\"../../" + skin_links[skins] + "\" rel=\"stylesheet\" type=\"text/css\"></script>");
//    $("head").append("<script src=\"../../Scripts/scene_" + scene + "_" + lan + ".js\" type=\"text/javascript\"></script>");
//    $(document).attr("title", title["setpara"]);
//    //主题
//    var themeSelect = $("#themeSelect");
//    themeSelect.empty();
//    jsAddItemToSelect(themeSelect, "01", pageattr["theme1"]);
//    jsAddItemToSelect(themeSelect, "02", pageattr["theme2"]);
//    themeSelect.val(theme);
//    //语言
//    var languageSelect = $("#languageSelect");
//    languageSelect.empty();
//    jsAddItemToSelect(languageSelect, "ch", pageattr["chinese"]);
//    jsAddItemToSelect(languageSelect, "en", pageattr["english"]);
//    languageSelect.val(lan);
//    //皮肤
//    var skinSelect = $("#skinSelect");
//    skinSelect.empty();
//    jsAddItemToSelect(skinSelect, "aq", pageattr["default"]);
//    jsAddItemToSelect(skinSelect, "gr", pageattr["gray"]);
//    jsAddItemToSelect(skinSelect, "sy", pageattr["silvery"]);
//    jsAddItemToSelect(skinSelect, "wt", pageattr["white"]);
//    skinSelect.val(skins);
//    //应用场景
//    var SysAppScence = $("#SysAppScence");
//    SysAppScence.empty();
//    jsAddItemToSelect(SysAppScence, "co", pageattr["company"]);
//    jsAddItemToSelect(SysAppScence, "so", pageattr["school"]);
//    SysAppScence.val(scene);

    $('#themeSelect').combobox({
        data: zhuti,
        valueField: 'value',
        textField: 'text'
    });
    $('#languageSelect').combobox({
        data: yuyan,
        valueField: 'value',
        textField: 'text'
    });
    $('#skinSelect').combobox({
        data: pifu,
        valueField: 'value',
        textField: 'text'
    });
    $('#SysAppScence').combobox({
        data: changjing,
        valueField: 'value',
        textField: 'text'
    });
    Ajax(true, sys["GetSysTheme"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#themeSelect").combobox("setValue",data.Data.variablechar);
    });
    Ajax(true, sys["GetSysLan"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#languageSelect").combobox("setValue", data.Data.variablechar);
    });
    Ajax(true, sys["GetSysSkin"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#skinSelect").combobox("setValue", data.Data.variablechar);
    });
    Ajax(true, sys["GetSysAppScence"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#SysAppScence").combobox("setValue", data.Data.variablechar);
    });
    Ajax(true, sys["GetSysMaxError"], {}, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $("#SysMaxError").val(data.Data.variablechar);
    });
    //主题
    $("#btn1").click(function () {

        var themeSelect = $("#themeSelect").combobox('getValue');
        //                    if (SysCardDay == "") {
        //                        $.ligerDialog.question('主题不能为空！');
        //                        setTimeout(function () {
        //                            $.ligerDialog.close();
        //                        }, 10000);
        //                        $("#SysCardDay").select(); //光标定位
        //                        return;
        //                    }
        Ajax(true, sys["UpdateSysTheme"], { SysTheme: themeSelect, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                
                return;
            }
        });
    });

    //语言
    $("#btn2").click(function () {

        var languageSelect = $("#languageSelect").combobox('getValue');
        Ajax(true, sys["UpdateSysLan"], { SysLan: languageSelect, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                
                return;
            }
        });
    });


    //皮肤
    $("#btn3").click(function () {

        var skinSelect = $("#skinSelect").combobox('getValue');

        Ajax(true, sys["UpdateSysSkin"], { SysSkin: skinSelect, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                
                return;
            }
        });
    });


    //应用场景
    $("#btn4").click(function () {

        var SysAppScence = $("#SysAppScence").combobox('getValue');
        //                    if (SysCardDay == "") {
        //                        $.ligerDialog.question('主题不能为空！');
        //                        setTimeout(function () {
        //                            $.ligerDialog.close();
        //                        }, 10000);
        //                        $("#SysCardDay").select(); //光标定位
        //                        return;
        //                    }
        Ajax(true, sys["UpdateSysAppScence"], { SysAppScence: SysAppScence, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                
                return;
            }
        });
    });


    //最大错误次数

    $("#btn5").click(function () {
        
        var SysMaxError = $("#SysMaxError").val();
        if (SysMaxError == "") {
            alert('最大错误次数不能为空！');
           
            $("#SysMaxError").select(); //光标定位
            return;
        }

        Ajax(true, sys["UpdateSysMaxError"], { SysMaxError: SysMaxError, LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            else {
                alert('保存成功！');
                
                return;
            }
        });
    });


});

 
    