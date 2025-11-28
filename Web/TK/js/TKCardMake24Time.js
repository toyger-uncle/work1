var iniConnec = function () {
    while (true) {
        var ActiveX;
        var ret;
        try {
            ActiveX = $("#ActiveX")[0];
            ret = ActiveX.GetVersion();
        }
        catch (e) {
            $("#info").css("color", "Red");
            $("#info").html("初始化失败，请安装做卡插件，重试！");
            return false;
            continue;
        }
        if (ret != "1.0") {
            $("#info").css("color", "Red");
            $("#info").html("做卡插件版本不匹配，请重新安装对应版本，重试！" + "(当前" + ret + "软件需要1.0)");
            return false;
            continue;
        }
        ret = ActiveX.OpenCom();
        if (ret != 0) {
            $("#info").css("color", "Red");
            $("#info").html("初始化失败，请插好读卡器，重试！");
            return false;
            continue;
        }
        return true;
        break;
    }
};

var iniTable = function () {
    datagrid = $("#dg").datagrid({
        idField: "id",
        pagination: true, //显示分页
        pageSize: PageSize, //分页大小
        pageList: [10, 20, 50, 100], //每页的个数
        //fit: true, //自动补全
        fitColumns: true,
        striped: true,
        iconCls: "icon-search", //图标
        title: "选择用户",
        collapsible: true,
        remotesort: false,
        singleSelect: true,
        //rownumbers:true,
        sortName: sortName,
        sortOrder: sortOrder,
        columns: [[{
            field: 'id',
            title: '编号',
            sortable: true,
            width: 50
        }, {
            field: 'user_name',
            title: '用户',
            sortable: true,
            width: 50
        }, {
            field: 'depart_name',
            title: '部门',
            sortable: true,
            width: 80
        }, {
            field: 'kind_name',
            title: '类型',
            sortable: true,
            width: 50
        }, {
            field: 'userid_num',
            title: '工号',
            sortable: true,
            width: 50
        }, {
            field: 'role_name',
            title: '角色',
            sortable: true,
            width: 80
        }, {
            field: 'room_name',
            title: '房间',
            sortable: true,
            width: 80
        }]],
        onSelect: function (rowIndex, rowData) {
            if (rowData == null) {
                $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                return;
            }
            $("#depart").val(rowData.depart_name);
            $("#text").val(rowData.user_name);
            $("#room").val(rowData.room_name);
            var newValue = $('#select').combobox("getValue");
            if (newValue == "44" || newValue == "31") {
                getcard(rowData.id, newValue);
            }
            if (newValue == "40" || newValue == "44") {
                Ajax(true, tk["GetTkUserRight"], { LoginID: LocalID, user_file: rowData.id }, function (data) {
                    if (!data.Success) {
                        alert(data.Message);
                        rool = setTimeout(function () { readcard() }, rooltime);
                        return;
                    }
                    if (data.Data.group_id != null) {
                        $('#rightsel').combogrid('setValue', data.Data.group_id);
                    }
                });
            }
        },
        onSortColumn: function (sort, order) {
            sortName = sort;
            sortOrder = order;
            loaddata($("#departname").val(), $("#kindname").val(), $("#roomname").val(), $("#username").val(), $("#useridnum").val());
        }
    });
};
var iniEvent = function () {
    $("#search").click(function () {
        loaddata($("#departname").val(), $("#kindname").val(), $("#roomname").val(), $("#username").val(), $("#useridnum").val());
    });
    $("#make").click(function () {
        if (ext) {
            $.messager.alert("提示", "<p class='infoReport'>卡已存在</p>", "error", function () { });
            return;
        }
        var o = $("#make").linkbutton('options');
        clearTimeout(rool);
        var bl = true;
        var newValue = $('#select').combobox("getValue");
        if (newValue == "40") {
            bl = make40();
        }
        else if (newValue == "44") {
            bl = make44();
        }
        if (bl) {
            rool = setTimeout(function () { readcard() }, rooltime);
        }
    });
    $("#recy").click(function () {
        if (cardsnr == "") {
            $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error", function () { });
            return;
        }
        clearTimeout(rool);
        var cardinfo = "{\"card_snr\":\"" + cardsnr + "\",\"card_key\":\"" + TKPlaintext
                    + "\",\"blockdatas\":[{\"Key\":37,\"Value\":\"00000000000000000000000000000000\"},{\"Key\":38,\"Value\":\"00000000000000000000000000000000\"},{\"Key\":40,\"Value\":\"00000000000000000000000000000000\"}]}";
        cardinfo = ActiveX.RFMifare_AllWriteCard(cardinfo);
        var cardinfojson = JSON2.parse(cardinfo);
        if (!cardinfojson.Success) {
            $("#info").css("color", "Red");
            $("#info").html("退卡失败，卡号：" + cardsnr + "，原因：错误信息：" + cardinfojson.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        else {
            Ajax(true, tk["UpdateTkCard"], { LoginID: LocalID, card_id: cardsnr, isused: "0" }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    rool = setTimeout(function () { readcard() }, rooltime);
                    return;
                }
                $("#info").css("color", "Green");
                $("#info").html("退卡成功，卡号：" + cardsnr);
                ActiveX.RFMifare_Alarm(4, 10, 0, 1);
                rool = setTimeout(function () { readcard() }, rooltime);
            });
        }
    });
    $("#automake").click(function () {
        if ($("#automake").is(":checked")) {
            $("#autorecy").prop('checked', false);
            $("#tou").html("自动制卡中……");
        }
        else {
            $("#tou").html("手动操作中……");
        }
        if ($("#automake").is(":checked") || $("#autorecy").is(":checked")) {
            $("#make").linkbutton("disable");
            $("#recy").linkbutton("disable");
        }
        else {
            $("#make").linkbutton("enable");
            $("#recy").linkbutton("enable");
        }
    });
    $("#autorecy").click(function () {
        if ($("#autorecy").is(":checked")) {
            $("#automake").prop('checked', false);
            $("#tou").html("自动退卡中……");
        }
        else {
            $("#tou").html("手动操作中……");
        }
        if ($("#automake").is(":checked") || $("#autorecy").is(":checked")) {
            $("#make").linkbutton("disable");
            $("#recy").linkbutton("disable");
        }
        else {
            $("#make").linkbutton("enable");
            $("#recy").linkbutton("enable");
        }
    });
    
   
    Ajax(true, tk["GetTkRightList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#rightsel').combogrid({
            panelWidth: 500,
            data: data.Data,
            idField: 'id',
            valueField: 'id',
            textField: 'group_name',
            columns: columnsone
        });
        $('#rigsel').combogrid({
            panelWidth: 500,
            data: data.Data,
            idField: 'id',
            valueField: 'id',
            textField: 'group_name',
            columns: columnstwo
        });
    });
    Ajax(true, tk["GetTkElevatorList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#elevatorsel').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'elevator_name'
        });
    });
    Ajax(true, tk["GetTkRoomList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var you = "";
        for (var i = 0; i < data.Data.length; i++) {
            you += "<input type='checkbox' name='lan' value='" + (data.Data[i].id) + "'/><span>" + (data.Data[i].room_name) + "</span>";
            if (i != data.Data.length - 1) {
                you += "<br/>";
            }
        }
        $("#sp").children().eq(1).html(you);
        $('#sp input').click(function () {
            var x = 0;
            var value = "";
            var text = "";
            $('input[name="lan"]:checked').each(function () {
                x++;
                if (x > 9) {
                    $(this).prop('checked', false);
                    $.messager.alert("提示", "<p class='infoReport'>最多9个房间</p>", "error");
                    return;
                }
                if (value != "") {
                    value += ",";
                }
                value += $(this).val();
                if (text != "") {
                    text += ",";
                }
                text += $(this).next('span').text();
            });
            $('#roomsel').combo('setValue', value).combo('setText', text);
        });
    });
    $('#sp').appendTo($('#roomsel').combo('panel'));
    $('#spf').appendTo($('#floorsel').combo('panel'));
    $("#info").html("获取梯控密钥……");
    Ajax(true, tk["GetTKPlaintext"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        TKPlaintext = data.Data.variablechar;
        $("#info").html("获取梯控密钥成功");
        readcard();
    });
    loaddata($("#departname").val(), $("#kindname").val(), $("#roomname").val(), $("#username").val(), $("#useridnum").val());
};

var cboValue = function () {
    var Data = [{ "id": 40, "kind_name": "时段卡" }, { "id": 44, "kind_name": "补时段卡"}];
    $('#select').combobox({
        data: Data,
        valueField: 'id',
        textField: 'kind_name',
        onChange: function (newValue, oldValue) {
            displaynone();
            if (newValue == null) {
                return;
            }
            else if (newValue == "40") {
                $("#leveldiv").css("display", "inline");
                $("#rightdiv").css("display", "inline");
                $("#automakediv").css("display", "inline");
                setcombogrid(500, columnsone);
            }
            else if (newValue == "44") {
                $("#leveldiv").css("display", "inline");
                $("#rightdiv").css("display", "inline");
                $("#automakediv").css("display", "inline");
                $("#carddiv").css("display", "inline");
                setcombogrid(500, columnsone);
                var rowData = datagrid.datagrid('getSelected');
                if (rowData != null) {
                    getcard(rowData.id, '44');
                }
            }
        }
    }).combobox("setValue", "40");
};

function getcard(user_id, kind) {
    if (kind == '31') {
        kind = '30';
    }
    else if (kind == '44') {
        kind = '40'
    }
    Ajax(true, tk["GetTkCardList"], { LoginID: LocalID, user_id: user_id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#cardsnrsel').combogrid({
            panelWidth: 300,
            data: data.Data,
            idField: 'card_id',
            valueField: 'card_id',
            textField: 'card_id',
            columns: [[{
                field: 'card_id',
                title: '卡号',
                width: 80
            }, {
                field: 'kind_name',
                title: '类型',
                width: 50
            }, {
                field: 'user_name',
                title: '用户',
                width: 100
            }, {
                field: 'card_no',
                title: '梯卡号',
                width: 50
            }]]
        });
    });
}
function make40() {
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "请选择用户", "error");
        return true;
    }
    var userid = rowData.id;
    var level = $("#levelsel").combobox("getValue");
    if (level == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择级别</p>", "error");
        return true;
    }
    var right = $("#rightsel").combogrid("getValue");
    if (right == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择权限</p>", "error");
        return true;
    }
    var g = $('#rightsel').combogrid('grid');
    var r = g.datagrid('getSelected');
    //做卡
    Ajax(true, tk["GetTKElevatorCardNo"], { LoginID: LocalID, elevator_id: r.elevator_id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        var lonElevatorNo = parseInt(r.elevator_id);
        var lonCardNo = data.Data;
        var strFloor = padLeft(parseInt(r.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(r.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
        var num = 0
        for (var i = 0; i < r.floor.length && i < 56; i++) {
            if (r.floor.substr(i, 1) == "1") {
                num++;
            }
        }
        var lonCallType = 0;
        if (num == 1) {
            lonCallType = 1;
        }
        var strValidDate = r.begin_date.substr(2, 2) + r.begin_date.substr(5, 2) + r.begin_date.substr(8, 2) + "0000"
        + r.end_date.substr(2, 2) + r.end_date.substr(5, 2) + r.end_date.substr(8, 2) + "0000";
        var strAvailablePeriod = r.begin_time.substr(0, 2) + r.begin_time.substr(3, 2) + r.end_time.substr(0, 2) + r.end_time.substr(3, 2);
        var strAvailableDate = r.week;
        var lonMultiElevatorNo = 0;
        var TKMadeTimeCard = {
            "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext, "lonElevatorNo": lonElevatorNo,
            "lonCardNo": lonCardNo, "strRoomNo": padLeft(rowData.room_id, 4), "lonCardType": level, "strFloor": strFloor, "lonCallType": lonCallType,
            "strValidDate": strValidDate, "strAvailablePeriod": strAvailablePeriod, "strAvailableDate": strAvailableDate, "lonMultiElevatorNo": lonMultiElevatorNo
        };
        var cardinfo = ActiveX.RFMifare_MadeTimeCard(JSON2.stringify(TKMadeTimeCard));
        var cardinfojson = JSON2.parse(cardinfo);
        if (!cardinfojson.Success) {
            $("#info").css("color", "Red");
            $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        else {
            var yo = formatfloor(r.floor);
            var you = formatweek(r.week);
            var demo = "梯卡号：" + lonCardNo + ",楼层：" + yo + "，级别：" + $("#levelsel").combobox("getText")
            + "日期：" + r.begin_date + "~" + r.end_date + "时间：" + r.begin_time + "~" + r.end_time + "星期：" + you;
            Ajax(true, tk["NewTkCard"], {
                LoginID: LocalID, card_id: card, card_kind: "40", elevator_id: r.elevator_id, card_no: lonCardNo, user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: r.elevator_name, demo: demo
            }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    rool = setTimeout(function () { readcard() }, rooltime);
                    return;
                }
                $("#info").css("color", "Green");
                $("#info").html("制卡成功，卡号：" + card + "," + demo);
                ActiveX.RFMifare_Alarm(4, 10, 0, 1);
                rool = setTimeout(function () { readcard() }, rooltime);
            });
        }
    });
    return false;
}
function make44() {
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return true;
    }
    var userid = rowData.id;
    var level = $("#levelsel").combobox("getValue");
    if (level == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择级别</p>", "error");
        return true;
    }
    var right = $("#rightsel").combogrid("getValue");
    if (right == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择权限</p>", "error");
        return true;
    }
    var g = $('#rightsel').combogrid('grid');
    var r = g.datagrid('getSelected');
    var cardgrid = $("#cardsnrsel").combogrid("getValue");
    if (cardgrid == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择卡</p>", "error");
        return true;
    }
    var cg = $('#cardsnrsel').combogrid('grid');
    var cr = cg.datagrid('getSelected');
    if (r.elevator_id != cr.elevator_id) {
        $.messager.alert("提示", "<p class='infoReport'>电梯必须一致</p>", "error");
        return true;
    }
    //做卡
    var lonElevatorNo = parseInt(r.elevator_id);
    var lonCardNo = cr.card_no; //选择卡
    var strFloor = padLeft(parseInt(r.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(r.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
    var num = 0
    for (var i = 0; i < r.floor.length && i < 56; i++) {
        if (r.floor.substr(i, 1) == "1") {
            num++;
        }
    }
    var lonCallType = 0;
    if (num == 1) {
        lonCallType = 1;
    }
    var strValidDate = r.begin_date.substr(2, 2) + r.begin_date.substr(5, 2) + r.begin_date.substr(8, 2) + "0000"
    + r.end_date.substr(2, 2) + r.end_date.substr(5, 2) + r.end_date.substr(8, 2) + "0000";
    var strAvailablePeriod = r.begin_time.substr(0, 2) + r.begin_time.substr(3, 2) + r.end_time.substr(0, 2) + r.end_time.substr(3, 2);
    var strAvailableDate = r.week;
    var lonMultiElevatorNo = 1;
    if (r.elevator_idex && r.r.elevator_idex2) {
        lonMultiElevatorNo = 0;
    }
    var elevator2 = r.elevator_idex;
    var elevator3 = r.elevator_idex2;
    var floor2 = r.floorex;
    var floor3 = r.floorex2;
    var TKMadeTimeCard = {
        "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext, "lonElevatorNo": lonElevatorNo,
        "lonCardNo": lonCardNo, "strRoomNo": padLeft(rowData.room_id, 4), "lonCardType": level, "strFloor": strFloor, "lonCallType": lonCallType,
        "strValidDate": strValidDate, "strAvailablePeriod": strAvailablePeriod, "strAvailableDate": strAvailableDate, "lonMultiElevatorNo": lonMultiElevatorNo, "ElevatorFloor": [{ "Key": elevator2, "Value": floor2 }, { "Key": elevator3, "Value": floor3}]
    };
    var cardinfo = ActiveX.RFMifare_ComplementTimeCard(JSON2.stringify(TKMadeTimeCard));
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
        return true;
    }
    else {
        var yo = formatfloor(r.floor);
        var you = formatweek(r.week);
        var demo = "梯卡号：" + lonCardNo + "，楼层：" + yo + "，级别：" + $("#levelsel").combobox("getText")
        + "，日期：" + r.begin_date + "~" + r.end_date + "，时间：" + r.begin_time + "~" + r.end_time + "，星期：" + you;
        Ajax(true, tk["NewTkCard"], {
            LoginID: LocalID, card_id: card, card_kind: "44", elevator_id: r.elevator_id, old_card: cr.card_id, user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: r.elevator_name, demo: demo
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("制卡成功，卡号：" + card + "," + demo);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
        });
    }
    return false;
}
function make4c() {
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return true;
    }
    var userid = rowData.id;
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var TKMadeCard = { "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext };
    var cardinfo = ActiveX.RFMifare_SysManagementCard(JSON2.stringify(TKMadeCard));
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
        return true;
    }
    else {
        Ajax(true, tk["NewTkCard"], {
            LoginID: LocalID, card_id: card, card_kind: "4c", user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: rowData.elevator_name
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("制卡成功，卡号：" + card);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
        });
    }
    return false;
}
function make52() {
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return true;
    }
    var userid = rowData.id;
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var right = $("#rightsel").combogrid("getValue");
    if (right == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择权限</p>", "error");
        return true;
    }
    var g = $('#rightsel').combogrid('grid');
    var r = g.datagrid('getSelected');
    var rig = $("#rigsel").combogrid("getValue");
    if (rig != "") {
        var gl = $('#rigsel').combogrid('grid');
        var rl = g.datagrid('getSelected');
        if (r.elevator_id != rl.elevator_id) {
            $.messager.alert("提示", "<p class='infoReport'>权限和副权限所属电梯不一致</p>", "error");
            return true;
        }
    }
    var lonElevatorNo = parseInt(r.elevator_id);
    var lonDisableTime = "0";
    if (!$("#ckck").prop('checked')) {
        lonDisableTime = "1"
    }
    var strFloor = padLeft(parseInt(r.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(r.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
    var strSetPeriod = r.begin_time.substr(0, 2) + r.begin_time.substr(3, 2) + r.end_time.substr(0, 2) + r.end_time.substr(3, 2);
    if ($("#qxck").prop('checked')) {
        strSetPeriod = "00000000"
    }
    var strSetdate = r.week;
    var TKMadeCard = { "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext };
    var ElevatorRunningTime = "{\"lonTimePeriodNo\":" + r.id + ",\"lonDisableTime\":" + lonDisableTime + ",\"strFloor\":\"" + strFloor
    + "\",\"strSetPeriod\":\"" + strSetPeriod + "\",\"strSetdate\":\"" + strSetdate + "\"}";
    var yo = formatfloor(r.floor);
    var you = formatweek(r.week);
    var demo = "编号：" + r.id + "，楼层：" + yo + "，时间：" + r.begin_time + "~" + r.end_time + "，星期：" + you;
    if (rig != "") {
        strFloor = padLeft(parseInt(rl.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(rl.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
        if (!$("#qxck").prop('checked')) {
            strSetPeriod = rl.begin_time.substr(0, 2) + rl.begin_time.substr(3, 2) + rl.end_time.substr(0, 2) + rl.end_time.substr(3, 2);
        }
        var strSetdate = rl.week;
        ElevatorRunningTime += ",{\"lonTimePeriodNo\":" + r.id + ",\"lonDisableTime\":" + lonDisableTime + ",\"strFloor\":\"" + strFloor
            + "\",\"strSetPeriod\":\"" + strSetPeriod + "\",\"strSetdate\":\"" + strSetdate + "\"}";
        yo = formatfloor(rl.floor);
        you = formatweek(rl.week);
        demo += "编号：" + rl.id + ",楼层：" + yo + "，时间：" + rl.begin_time + "~" + rl.end_time + "，星期：" + you;
    }
    ElevatorRunningTime = "[" + ElevatorRunningTime + "]";
    var cardinfo = ActiveX.RFMifare_ElevatorRunningTimeCard(JSON2.stringify(TKMadeCard), lonElevatorNo, ElevatorRunningTime);
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
        return true;
    }
    else {
        if ($("#qxck").prop('checked')) {
            demo += "；取消";
        }
        else {
            if ($("#ckck").prop('checked')) {
                demo += "；启用";
            }
            else {
                demo += "；禁用";
            }
        }
        Ajax(true, tk["NewTkCard"], {
            LoginID: LocalID, card_id: card, card_kind: "52", elevator_id: r.elevator_id, user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: r.elevator_name, demo: demo
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("制卡成功，卡号：" + card + "," + demo);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
        });
    }
    return false;
}
function make55() {
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return true;
    }
    var userid = rowData.id;
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var right = $("#rightsel").combogrid("getValue");
    if (right == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择权限</p>", "error");
        return true;
    }
    var g = $('#rightsel').combogrid('grid');
    var r = g.datagrid('getSelected');
    var lonElevatorNo = parseInt(r.elevator_id);
    var lonDisableTime = "0";
    if (!$("#ckck").prop('checked')) {
        lonDisableTime = "1"
    }
    var strFloor = padLeft(parseInt(r.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(r.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
    var strSetDatePeriod = r.begin_date.substr(2, 2) + r.begin_date.substr(5, 2) + r.begin_date.substr(8, 2)
    + r.end_date.substr(2, 2) + r.end_date.substr(5, 2) + r.end_date.substr(8, 2);
    var strSetPeriod = r.begin_time.substr(0, 2) + r.begin_time.substr(3, 2) + r.end_time.substr(0, 2) + r.end_time.substr(3, 2);
    if ($("#qxck").prop('checked')) {
        strSetDatePeriod = "000000000000";
        strSetPeriod = "00000000"
    }
    var strSetdate = r.week;
    var TKMadeCard = { "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext };
    var ElevatorRunningTime = "{\"lonTimePeriodNo\":" + r.id + ",\"lonDisableTime\":" + lonDisableTime + ",\"strFloor\":\"" + strFloor
    + "\",\"strSetPeriod\":\"" + strSetPeriod + "\",\"strSetdate\":\"" + strSetdate + "\",\"strSetDatePeriod\":\"" + strSetDatePeriod + "\"}";
    var cardinfo = ActiveX.RFMifare_DateSettingCard(JSON2.stringify(TKMadeCard), lonElevatorNo, ElevatorRunningTime);
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
        return true;
    }
    else {
        var yo = formatfloor(r.floor);
        var you = formatweek(r.week);
        var demo = "编号：" + r.id + "，楼层：" + yo + "，日期：" + r.begin_date + "~" + r.end_date + "，时间：" + r.begin_time + "~" + r.end_time + "，星期：" + you;
        if ($("#qxck").prop('checked')) {
            demo += "；取消";
        }
        else {
            if ($("#ckck").prop('checked')) {
                demo += "；启用";
            }
            else {
                demo += "；禁用";
            }
        }
        Ajax(true, tk["NewTkCard"], {
            LoginID: LocalID, card_id: card, card_kind: "55", elevator_id: r.elevator_id, user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: r.elevator_name, demo: demo
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("制卡成功，卡号：" + card + "," + demo);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
        });
    }
    return false;
}
function make56() {
    var card = $("#card").val();
    if (card == "") {
        $.messager.alert("提示", "<p class='infoReport'>请放好卡</p>", "error");
        return true;
    }
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return true;
    }
    var userid = rowData.id;
    var elevatorid = $("#elevatorsel").combobox("getValue");
    if (elevatorid == "") {
        $.messager.alert("提示", "<p class='infoReport'>请选择电梯</p>", "error");
        return true;
    }
    var lonElevatorNo = parseInt(elevatorid);
    var floor = "";
    $('input[name="lang"]:checked').each(function () {
        for (var i = floor.length; i < parseFloat($(this).val()) - 1; i++) {
            floor += "0";
        }
        floor += "1";
    });
    if (floor == "") {
        $.messager.alert("提示", "<p class='infoReport'>不能没有楼层</p>", "error");
        return true;
    }
    for (var i = floor.length; i < 56; i++) {
        floor += "0";
    }
    var TKMadeCard = { "lonSecNo": 9, "strCdsnr": card, "card_key": TKPlaintext };
    var strFloor = padLeft(parseInt(floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
    var cardinfo = ActiveX.RFMifare_FlooringManagementCard(JSON2.stringify(TKMadeCard), lonElevatorNo, strFloor, 0, 0);
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，卡号：" + card + "，原因：错误信息：" + cardinfojson.Message);
        return true;
    }
    else {
        var you = formatfloor(floor);
        var demo = "电梯：" + $("#elevatorsel").combobox("getText") + "，楼层：" + you;
        Ajax(true, tk["NewTkCard"], {
            LoginID: LocalID, card_id: card, card_kind: "56", elevator_id: elevatorid, user_id: userid
         , kind_name: $("#select").combobox("getText"), user_name: rowData.user_name, depart_name: rowData.depart_name
         , room_name: rowData.room_name, elevator_name: $("#elevatorsel").combobox("getText"), demo: demo
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("制卡成功，卡号：" + card + "," + demo);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
        });
    }
    return false;
}
function formatweek(val) {
    var you = "";
    if (val.substr(0, 1) == "1") {
        you += "一";
    }
    if (val.substr(1, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "二";
    }
    if (val.substr(2, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "三";
    }
    if (val.substr(3, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "四";
    }
    if (val.substr(4, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "五";
    }
    if (val.substr(5, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "六";
    }
    if (val.substr(6, 1) == "1") {
        if (you != "") {
            you += "、";
        }
        you += "日";
    }
    return you;
}
function formatfloor(val) {
    var you = "";
    for (var i = 0; i < 56; i++) {
        if (val.substr(i, 1) == "1") {
            if (you != "") {
                you += ",";
            }
            you += (i + 1).toString();
        }
    }
    return you;
}
function loaddata(depart, kind, room, username, useridnum) {
    datagrid.datagrid('unselectAll');
    Ajax(true, sys["GetUserFilePageListOfTK"], {
        LoginID: LocalID, user_name: username, kind_name: kind, depart_name: depart, room_name: room, userid_num: useridnum,
        sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
    }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsondata.total = data.Ex;
        jsondata.rows = data.Data;
        datagrid.datagrid('loadData', jsondata);
        if (jsondata.total == 0) {
            PageNum = 1;
        }
        var p = datagrid.datagrid('getPager');
        $(p).pagination({
            beforePageText: '第', //页数文本框前显示的汉字
            afterPageText: '页    共 ' + Math.ceil(jsondata.total / PageSize) + ' 页',
            displayMsg: '当前显示 ' + (PageSize * (PageNum - 1) + (jsondata.total == 0 ? 0 : 1)) + ' - ' + (PageSize * (PageNum - 1) + data.Data.length) + ' 条记录   共 ' + jsondata.total + ' 条记录',
            onSelectPage: function (pageNumber, pageSize) {
                PageSize = pageSize;
                PageNum = pageNumber;
                if (PageNum < 1) {
                    PageNum = 1;
                }
                loaddata($("#departname").val(), $("#kindname").val(), $("#roomname").val(), $("#username").val(), $("#useridnum").val());
            }
        });
    });
}
function setcombogrid(lon, data) {
    $('#rightsel').combogrid({
        panelWidth: lon,
        columns: data
    });
}
function displaycardinfo(cardinfojson) {
    var htm = "卡类型：";
    switch (cardinfojson.Type) {
        case ("30"):
            htm += "管理卡；<br/>";
            htm += "卡号：";
            htm += cardinfojson.Data.lonCardNo + "；<br/>";
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor); ;
            htm += you + "；<br/>";
            break;
        case ("31"):
            if (cardinfojson.Ex.lonElevatorNo == 0) {
                htm += "补管理卡；<br/>";
                htm += "卡号：";
                htm += cardinfojson.Data.lonCardNo + "；<br/>";
                htm += "楼层：";
                var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
                var you = formatfloor(floor);
                htm += you + "；<br/>";
            }
            else {
                htm += "补收费卡；<br/>";
                //待做
            }
            break;
        case ("32"):
            htm += "收费卡；<br/>";
            //待做
            break;
        case ("33"):
            htm += "按钮响应卡；<br/>";
            htm += "响应时间：";
            htm += cardinfojson.Ex.lonCanUseNum + "秒；<br/>";
            break;
        case ("35"):
            htm += "时间卡；<br/>";
            htm += "日期：";
            htm += "20" + cardinfojson.Data.strValidDate.substr(0, 2) + "-" + cardinfojson.Data.strValidDate.substr(2, 2) + "-" + cardinfojson.Data.strValidDate.substr(4, 2);
            htm += " " + cardinfojson.Data.strValidDate.substr(6, 2) + ":" + cardinfojson.Data.strValidDate.substr(8, 2) + ":" + cardinfojson.Data.strValidDate.substr(10, 2) + "；<br/>";
            break;
        case ("39"):
            htm += "屏蔽卡；<br/>";
            htm += "房间：";
            for (var i = 0; i < 9; i++) {
                var room = cardinfojson.Data.strValidDate.substr(i * 3, 4);
                if (room == "0000") {
                    break;
                }
                if (i != 0) {
                    htm += ",";
                }
                htm += cardinfojson.Data.strValidDate.substr(i * 6, 4);
            }
            htm += "；<br/>";
            if (cardinfojson.Data.strValidDate.substr(4, 2) == "00") {
                htm += "禁用；<br/>";
            }
            else {
                htm += "启用；<br/>";
            }
            break;
        case ("40"):
            htm += "时段卡；<br/>";
            htm += "梯号：";
            htm += cardinfojson.Data.lonElevatorNo + "；<br/>";
            htm += "卡号：";
            htm += cardinfojson.Data.lonCardNo + "；<br/>";
            htm += "卡级别：";
            if (cardinfojson.Data.lonMultiElevatorNo == "1") {
                htm += "贵宾；<br/>";
            }
            else {
                htm += "普通；<br/>";
            }
            htm += "房间：";
            htm += cardinfojson.Data.strRoomNo + "；<br/>";
            htm += "呼梯方式：";
            if (cardinfojson.Data.lonCallType == "1") {
                htm += "直达；<br/>";
            }
            else {
                htm += "手选；<br/>";
            }
            htm += "是否多梯：";
            if (cardinfojson.Data.lonMultiElevatorNo == "1") {
                htm += "多梯；<br/>";
            }
            else {
                htm += "单梯；<br/>";
            }
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor); ;
            htm += you + "；<br/>";
            htm += "日期：";
            htm += "20" + cardinfojson.Data.strValidDate.substr(0, 2) + "-" + cardinfojson.Data.strValidDate.substr(2, 2) + "-" + cardinfojson.Data.strValidDate.substr(4, 2);
            htm += "~20" + cardinfojson.Data.strValidDate.substr(10, 2) + "-" + cardinfojson.Data.strValidDate.substr(12, 2) + "-" + cardinfojson.Data.strValidDate.substr(14, 2) + "；<br/>";
            htm += "时间：";
            htm += "" + cardinfojson.Data.strAvailablePeriod.substr(0, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(2, 2);
            htm += "~" + cardinfojson.Data.strAvailablePeriod.substr(4, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(6, 2) + "；<br/>";
            htm += "星期：";
            you = formatweek(cardinfojson.Data.strAvailableDate);
            htm += you + "；<br/>";
            break;
        case ("44"):
            htm += "补时段卡；<br/>";
            htm += "梯号：";
            htm += cardinfojson.Data.lonElevatorNo + "；<br/>";
            htm += "卡号：";
            htm += cardinfojson.Data.lonCardNo + "；<br/>";
            htm += "卡级别：";
            if (cardinfojson.Data.lonMultiElevatorNo == "1") {
                htm += "贵宾；<br/>";
            }
            else {
                htm += "普通；<br/>";
            }
            htm += "房间：";
            htm += cardinfojson.Data.strRoomNo + "；<br/>";
            htm += "呼梯方式：";
            if (cardinfojson.Data.lonCallType == "1") {
                htm += "直达；<br/>";
            }
            else {
                htm += "手选；<br/>";
            }
            htm += "是否多梯：";
            if (cardinfojson.Data.lonMultiElevatorNo == "1") {
                htm += "多梯；<br/>";
            }
            else {
                htm += "单梯；<br/>";
            }
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor);
            htm += you + "；<br/>";
            htm += "日期：";
            htm += "20" + cardinfojson.Data.strValidDate.substr(0, 2) + "-" + cardinfojson.Data.strValidDate.substr(2, 2) + "-" + cardinfojson.Data.strValidDate.substr(4, 2);
            htm += "~20" + cardinfojson.Data.strValidDate.substr(10, 2) + "-" + cardinfojson.Data.strValidDate.substr(12, 2) + "-" + cardinfojson.Data.strValidDate.substr(14, 2) + "；<br/>";
            htm += "时间：";
            htm += "" + cardinfojson.Data.strAvailablePeriod.substr(0, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(2, 2);
            htm += "~" + cardinfojson.Data.strAvailablePeriod.substr(4, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(6, 2) + "；<br/>";
            htm += "星期：";
            you = formatweek(cardinfojson.Data.strAvailableDate);
            htm += you + "；<br/>";
            break;
        case ("4c"):
            htm += "系统开关卡；<br/>";
            break;
        case ("52"):
            htm += "时段设定卡；<br/>";
            htm += "梯号：";
            htm += cardinfojson.Data.lonElevatorNo + "；<br/>";
            htm += "权限号：";
            htm += cardinfojson.Data.lonCardNo + "；<br/>";
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor);
            htm += you + "；<br/>";
            htm += "时间：";
            htm += cardinfojson.Data.strValidDate.substr(0, 2) + ":" + cardinfojson.Data.strValidDate.substr(2, 2);
            htm += "~" + cardinfojson.Data.strValidDate.substr(4, 2) + ":" + cardinfojson.Data.strValidDate.substr(6, 2) + "；<br/>";
            htm += "星期：";
            you = formatweek(cardinfojson.Data.strAvailableDate);
            htm += you + "；<br/>";
            htm += "权限号：";
            htm += cardinfojson.Data.lonCallType + "；<br/>";
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strRoomNo.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strRoomNo.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor);
            htm += you + "；<br/>";
            htm += "时间：";
            htm += cardinfojson.Data.strAvailablePeriod.substr(0, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(2, 2);
            htm += "~" + cardinfojson.Data.strAvailablePeriod.substr(4, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(6, 2) + "；<br/>";
            htm += "星期：";
            you = formatweek(cardinfojson.Data.strCdsnr);
            htm += you + "；<br/>";
            if (cardinfojson.Data.lonCardType == 0) {
                htm += "启用；<br/>";
            }
            else {
                htm += "禁用；<br/>";
            }
            break;
        case ("55"):
            htm += "日期管理卡；<br/>";
            htm += "梯号：";
            htm += cardinfojson.Data.lonElevatorNo + "；<br/>";
            htm += "权限号：";
            htm += cardinfojson.Data.lonCardNo + "；<br/>";
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor);
            htm += you + "；<br/>";
            htm += "日期：";
            htm += "20" + cardinfojson.Data.strValidDate.substr(0, 2) + "-" + cardinfojson.Data.strValidDate.substr(2, 2) + "-" + cardinfojson.Data.strValidDate.substr(4, 2);
            htm += "~20" + cardinfojson.Data.strValidDate.substr(6, 2) + "-" + cardinfojson.Data.strValidDate.substr(8, 2) + "-" + cardinfojson.Data.strValidDate.substr(10, 2) + "；<br/>";
            htm += "时间：";
            htm += "" + cardinfojson.Data.strAvailablePeriod.substr(0, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(2, 2);
            htm += "~" + cardinfojson.Data.strAvailablePeriod.substr(4, 2) + ":" + cardinfojson.Data.strAvailablePeriod.substr(6, 2) + "；<br/>";
            if (cardinfojson.Data.strAvailablePeriod == "00") {
                htm += "启用；<br/>";
            }
            else {
                htm += "禁用；<br/>";
            }
            break;
        case ("56"):
            htm += "分层管理卡；<br/>";
            htm += "楼层：";
            var floor = padLeft(parseInt(cardinfojson.Data.strFloor.substr(0, 8), 16).toString(2), 32) + padLeft(parseInt(cardinfojson.Data.strFloor.substr(8, 6), 16).toString(2), 24);
            var you = formatfloor(floor); ;
            htm += you + "；<br/>";
            break;
        default:
            htm = "未知" + cardinfojson.Type;
            break;
    }
    $("#wei").html(htm);
}
var ext = false;
function readcard() {
    var currentcardsnr = ActiveX.RFMifare_GetSnr();
    if (currentcardsnr == "") {
        if (cardsnr != "") {
            $("#card").val("");
            $("#cardno").val("");
            $("#depart").val("");
            $("#text").val("");
            $("#room").val("");
            $("#wei").html("");
        }
        $("#info").css("color", "Blue");
        $("#info").html("读卡中……");
        cot++;
        if (cot > maxcot) {
            $("#info").css("color", "Red");
            $("#info").html("长时间未读到卡，已停止工作，要继续请刷新页面");
            return;
        }
    }
    else {
        cot = 0;
    }
    if (currentcardsnr == "" || currentcardsnr == cardsnr) {
        cardsnr = currentcardsnr;
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    cardsnr = currentcardsnr;
    $("#info").css("color", "Green");
    $("#info").html("读卡成功，卡号：" + cardsnr);
    $("#card").val(cardsnr);
    var TKMadeCard = { "lonSecNo": 9, "strCdsnr": cardsnr, "card_key": TKPlaintext };
    var cardinfo = ActiveX.RFMifare_ReadCardInfo(JSON2.stringify(TKMadeCard));
    var cardinfojson = JSON2.parse(cardinfo);
    displaycardinfo(cardinfojson);
    Ajax(true, tk["GetTkCard"], { LoginID: LocalID, card_id: cardsnr }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        ext = true;
        if (data.Data.card_id != null) {
            $("#select").combobox("setValue", data.Data.card_kind);
            $("#cardno").val(data.Data.card_no);
            $("#depart").val(data.Data.depart_name);
            $("#text").val(data.Data.user_name);
            $("#room").val(data.Data.room_name);
            var hs = "";
            if (data.Data.isused == "0") {
                hs = "，回收卡";
            }
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + hs);
            if ($("#autorecy").is(":checked")) {
                //退卡
                recycard(data);
                return;
            }
            else {
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
        }
        else if (data.Data.card_id == null) {
            $("#cardno").val("");
            $("#depart").val("");
            $("#text").val("");
            $("#room").val("");
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + ",是否制卡");
            ext = false;
            if ($("#automake").is(":checked")) {
                makecard40();
                return;
            }
            else {
                if ($("#autorecy").is(":checked")) {
                    $("#info").html("读卡成功，卡号：" + cardsnr + "，非本系统卡");
                }
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
        }
        if (data.Data.isused == "0") {
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + ",是否制卡");
            ext = false;
            if ($("#automake").is(":checked")) {
                makecard40();
                return;
            }
            else {
                $("#info").html("读卡成功，卡号：" + cardsnr + "");
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
        }
        else {
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
    });
}
function recycard(data) {
    if (data.Data.isused == "0") {
        $("#info").css("color", "Green");
        $("#info").html("卡号：" + cardsnr + ",已回收卡");
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    var cardinfo = "{\"card_snr\":\"" + cardsnr + "\",\"card_key\":\"" + TKPlaintext
                    + "\",\"blockdatas\":[{\"Key\":37,\"Value\":\"00000000000000000000000000000000\"},{\"Key\":38,\"Value\":\"00000000000000000000000000000000\"},{\"Key\":40,\"Value\":\"00000000000000000000000000000000\"}]}";
    cardinfo = ActiveX.RFMifare_AllWriteCard(cardinfo);
    var cardinfojson = JSON2.parse(cardinfo);
    if (!cardinfojson.Success) {
        $("#info").css("color", "Red");
        $("#info").html("退卡失败，卡号：" + cardsnr + "，原因：错误信息：" + data.Message);
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    else {
        Ajax(true, tk["UpdateTkCard"], { LoginID: LocalID, card_id: cardsnr, isused: "0" }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                rool = setTimeout(function () { readcard() }, rooltime);
                return;
            }
            $("#info").css("color", "Green");
            $("#info").html("退卡成功，卡号：" + cardsnr);
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        });
    }
}
function makecard40() {
    var rowData = datagrid.datagrid('getSelected');
    if (rowData == null) {
        $("#info").css("color", "Red");
        $("#info").html("制卡失败，请选择起始项");
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    var userid = rowData.id;
    var level = $("#levelsel").combobox("getValue");
    if (level == "") {
        $("#info").css("color", "Red");
        $("#info").html("请选择级别，卡号：" + cardsnr + "");
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    var right = $("#rightsel").combogrid("getValue");
    if (right == "") {
        $("#info").css("color", "Red");
        $("#info").html("请选择权限，卡号：" + cardsnr + "");
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    var g = $('#rightsel').combogrid('grid');
    var r = g.datagrid('getSelected');
    //做卡
    Ajax(true, tk["GetTKElevatorCardNo"], { LoginID: LocalID, elevator_id: r.elevator_id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        var lonElevatorNo = parseInt(r.elevator_id);
        var lonCardNo = data.Data;
        var strFloor = padLeft(parseInt(r.floor.substr(0, 32), 2).toString(16).toUpperCase(), 8) + padLeft(parseInt(r.floor.substr(32, 24), 2).toString(16).toUpperCase(), 6);
        var num = 0
        for (var i = 0; i < r.floor.length && i < 56; i++) {
            if (r.floor.substr(i, 1) == "1") {
                num++;
            }
        }
        var lonCallType = 0;
        if (num == 1) {
            lonCallType = 1;
        }
        var strValidDate = r.begin_date.substr(2, 2) + r.begin_date.substr(5, 2) + r.begin_date.substr(8, 2) + "0000"
        + r.end_date.substr(2, 2) + r.end_date.substr(5, 2) + r.end_date.substr(8, 2) + "0000";
        var strAvailablePeriod = r.begin_time.substr(0, 2) + r.begin_time.substr(3, 2) + r.end_time.substr(0, 2) + r.end_time.substr(3, 2);
        var strAvailableDate = r.week;
        var lonMultiElevatorNo = 0;
        var TKMadeTimeCard = {
            "lonSecNo": 9, "strCdsnr": cardsnr, "card_key": TKPlaintext, "lonElevatorNo": lonElevatorNo,
            "lonCardNo": lonCardNo, "strRoomNo": padLeft(rowData.room_id, 4), "lonCardType": level, "strFloor": strFloor, "lonCallType": lonCallType,
            "strValidDate": strValidDate, "strAvailablePeriod": strAvailablePeriod, "strAvailableDate": strAvailableDate, "lonMultiElevatorNo": lonMultiElevatorNo
        };
        var cardinfo = ActiveX.RFMifare_MadeTimeCard(JSON2.stringify(TKMadeTimeCard));
        var cardinfojson = JSON2.parse(cardinfo);
        if (!cardinfojson.Success) {
            $("#info").css("color", "Red");
            $("#info").html("制卡失败，卡号：" + cardsnr + "，原因：错误信息：" + data.Message);
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        else {
            var yo = formatfloor(r.floor);
            var you = formatweek(r.week);
            var demo = "梯卡号：" + lonCardNo + ",楼层：" + yo + "，级别：" + $("#levelsel").combobox("getText")
            + "日期：" + r.begin_date + "~" + r.end_date + "时间：" + r.begin_time + "~" + r.end_time + "星期：" + you;
            Ajax(true, tk["NewTkCard"], { LoginID: LocalID, card_id: cardsnr, card_kind: "40", elevator_id: r.elevator_id, card_no: lonCardNo, user_id: userid, demo: demo }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    rool = setTimeout(function () { readcard() }, rooltime);
                    return;
                }
                $("#info").css("color", "Green");
                $("#info").html("制卡成功，卡号：" + cardsnr + "," + demo);
                ActiveX.RFMifare_Alarm(4, 10, 0, 1);
                var idx = datagrid.datagrid('getRowIndex', rowData);
                var rowDatas = datagrid.datagrid('getRows');
                if (rowDatas.length < PageSize && (idx + 1) == rowDatas.length) {
                    $("#info").css("color", "Green");
                    $("#info").html("制卡成功，卡号：" + cardsnr + "，已到最后一个人");
                    ActiveX.RFMifare_Alarm(4, 2000, 0, 1);
                    rool = setTimeout(function () { readcard() }, rooltime);
                    return;
                }
                if (idx++ > PageSize) {
                    PageNum++;
                    idx = 0;
                    Ajax(true, sys["GetUserFilePageListOfTK"], {
                        LoginID: LocalID, user_name: $("#username").val(),
                        kind_name: $("#kindname").val(), depart_name: $("#kindname").val(), room_name: $("#roomname").val(),
                        sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
                    }, function (data) {
                        if (!data.Success) {
                            alert(data.Message);
                            rool = setTimeout(function () { readcard() }, rooltime);
                            return;
                        }
                        jsondata.total = data.Ex;
                        jsondata.rows = data.Data;
                        datagrid.datagrid('loadData', jsondata);
                        if (jsondata.total == 0) {
                            $("#info").css("color", "Green");
                            $("#info").html("制卡成功，卡号：" + cardsnr + "，已到最后一个人");
                            ActiveX.RFMifare_Alarm(4, 2000, 0, 1);
                            rool = setTimeout(function () { readcard() }, rooltime);
                            return;
                        }
                        var p = datagrid.datagrid('getPager');
                        $(p).pagination({
                            beforePageText: '第', //页数文本框前显示的汉字
                            afterPageText: '页    共 ' + Math.ceil(jsondata.total / PageSize) + ' 页',
                            displayMsg: '当前显示 ' + (PageSize * (PageNum - 1) + (jsondata.total == 0 ? 0 : 1)) + ' - ' + (PageSize * (PageNum - 1) + data.Data.length) + ' 条记录   共 ' + jsondata.total + ' 条记录',
                            onSelectPage: function (pageNumber, pageSize) {
                                PageSize = pageSize;
                                PageNum = pageNumber;
                                if (PageNum < 1) {
                                    PageNum = 1;
                                }
                                loaddata($("#kindname").val(), $("#kindname").val(), $("#roomname").val(), $("#username").val(), $("#useridnum").val());
                            }
                        });
                        datagrid.datagrid('selectRow', idx);
                        rool = setTimeout(function () { readcard() }, rooltime);
                        return;
                    });
                }
                else {
                    datagrid.datagrid('selectRow', idx);
                    rool = setTimeout(function () { readcard() }, rooltime);
                    return;
                }
            });
        }
    });
}
function displaynone() {
    $("#leveldiv").css("display", "none");
    $("#rightdiv").css("display", "none");
    $("#elevatordiv").css("display", "none");
    $("#roomdiv").css("display", "none");
    $("#floordiv").css("display", "none");
    $("#leveldiv").css("display", "none");
    $("#leveldiv").css("display", "none");
    $("#automakediv").css("display", "none");
    $("#automake").prop('checked', false);
    $("#rigdiv").css("display", "none");
    $("#timediv").css("display", "none");
    $("#ckdiv").css("display", "none");
    $("#ckck").prop('checked', false);
    $("#qxdiv").css("display", "none");
    $("#qxck").prop('checked', false);
    $("#carddiv").css("display", "none");
}