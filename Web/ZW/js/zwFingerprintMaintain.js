//初始化人员表格
var iniTbUser = function () {
    tbUser = $('#tb_user').datagrid({
        idField: "id",
        //显示分页
        pageSize: PageSize, //分页大小
        pageList: [5], //每页的个数
        striped: true,
        iconCls: "icon-search", //图标
        remotesort: false,
        sortName: sortName,
        sortOrder: sortOrder,
        rownumbers: true,
        pagination: true,
        singleSelect: true,
        fitColumns: true,
        collapsible: true,
        columns: [[{
            field: 'user_name',
            title: '用户名称',
            sortable: true,
            align: 'center',
            width: 100
        }, {
            field: 'depart_id',
            title: '部门',
            sortable: true,
            align: 'center',
            width: 100,
            formatter: function (value, row, index) {
                if (allDepart != null) {
                    for (var i = 0; i < allDepart.length; i++) {
                        if (allDepart[i]['id'] == row.depart_id)
                            return allDepart[i]['department'];
                    }
                    return '高部门等级';
                }
            }
        }, {
            field: 'user_kind',
            title: '人员种类',
            sortable: true,
            align: 'center',
            width: 100,
            formatter: function (value, row, index) {
                if (allUserKind != null) {
                    for (var i = 0; i < allUserKind.length; i++) {
                        if (allUserKind[i]['id'] == row.user_kind)
                            return allUserKind[i]['user_kind'];
                    }
                    return row.user_kind;
                }
            }
        }, {
            field: 'userid_num',
            title: '工号',
            sortable: true,
            width: 100,
            align: 'center'
        },
             {
                 field: 'sex',
                 title: '性别',
                 sortable: true,
                 width: 100,
                 align: 'center'
             },
             {
                 field: 'hand_tel',
                 title: '手机',
                 sortable: true,
                 width: 100,
                 align: 'center'
             }]],
        //排列行
        onSortColumn: function (sort, order) {
            sortName = sort;
            sortOrder = order;
            loadUserTb($("#user_name1").val(), $("#userid_num1").val(), $("#depart_id1").combobox("getValue"), $("#user_kind1").combobox("getValue"));
        },
        //单击事件-将数据置于文本框   先清空,加载数据
        onClickRow: function (rowIndex, rowData) {
            if (rowData) {
                tbUserClearData();
                tbUserSetData(rowData);
                getUserDoor(rowData.id);
                getZWInfo(rowData.id);
            }
        }
    });
};
//初始化分页数据
var inipageSet = function () {
    var pager = $("#tbRightUser").datagrid("getPager");
    pager.pagination({
        total: jsondataRight.total,
        onSelectPage: function (pageNo, pageSize) {
            var start = (pageNo - 1) * pageSize;
            var end = start + pageSize;
            //本地分页
            $("#tbRightUser").datagrid("loadData", jsondataRight.rows.slice(start, end));
            pager.pagination('refresh', {
                total: jsondata.total,
                pageNumber: pageNo
            });
        }
    });
};


//获取区域
var getAreaData = function () {
    Ajax(true, global.mj["GetMJWhereGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        var temp = { 'address_group_id': '', 'address_group': '全部' };
        data.Data.push(temp);
        $('#area1').combobox({
            data: data.Data,
            valueField: 'address_group_id',
            textField: 'address_group',
            onSelect: function (value) {
                if (value != null) {
                    var data = $('#id').val() || '';
                    if (data != '') {
                        getUserDoor(data);
                    }
                }
            }
        });
    });
};
var getColumZX = function (value, row, index) {
    if (row.apb == '1') {
        return '执行';
    } else {
        return '不执行 ';
    }
}

//保存按钮事件
var clickSave = function () {
    var dataUser = $('#id').val() || '';
    if ($("#door_id").combobox("getValue").trim() == '') {
        $.messager.alert("提示", "<p class='infoReport'>门不能为空</p>", "error");
        return;
    }
    var door_id = $("#door_id").combobox("getValue");
    var apb = $("#apb").combobox("getValue");
    if (!apb) {
        apb = '0';
    }
    var group_name = $("#group_name").combobox("getValue");
    var result = true;
    var allData = $("#door_id").combobox("getData");   //获取combobox所有数据
    for (var i = 0; i < allData.length; i++) {

        if (door_id == allData[i]["id"]) {
            result = false;
            break;
        }
    }
    if (result) {
        $.messager.alert("提示", "<p class='infoReport'>门名选择错误</p>", "error");
        return;
    }
    if (dataUser == '') {
        $.messager.alert("提示", "<p class='infoReport'>请先选择人员</p>", "error");
        return;
    }

    if (apb != "1" && apb != "0") {
        $.messager.alert("提示", "<p class='infoReport'>门层次管制选择错误</p>", "error");
        return;
    }

    result = true;
    allData = $("#group_name").combobox("getData");   //获取combobox所有数据
    for (i = 0; i < allData.length; i++) {

        if (group_name == allData[i]["id"]) {
            result = false;
            break;
        }
    }
    if (result) {
        $.messager.alert("提示", "<p class='infoReport'>群组名选择错误</p>", "error");
        return;
    }
    var dataTemp = {
        LoginID: LocalID,
        user_file: dataUser,
        door_id: door_id,
        right_group: group_name,
        apb: apb
    };

    //新增

    Ajax(true, global.mj["NewMjUserDoor"], dataTemp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加</p>", function (r) {
            if (r) {
            } else {
                $('#win').window('close');
            }
            $('#door_id').combobox('setValue', '');
            $('#group_name').combobox('setValue', '');
            $('#apb').combobox('setValue', '');
            getUserDoor(dataUser);
        });
    });
};
//获取人员对应的权限
var getUserDoor = function (user_id) {
    //获取部门-门权限
    var area = $('#area1').combobox('getValue');
    var temp;
    if (area != '') {
        temp = { LoginID: LocalID, user_file: user_id, address_group_id: area };
    } else {
        temp = { LoginID: LocalID, user_file: user_id };
    }
    Ajax(true, global.mj["GetMjUserDoorList"], temp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        jsondataRight.total = data.Data.length;
        jsondataRight.rows = data.Data;
        var datatable = $("#tbRightUser").datagrid();
        datatable.datagrid('loadData', jsondataRight);
        datatable.datagrid("getPager").pagination('select');
    });
};



//清空文本框中的人员内容
var tbUserClearData = function () {
    $('#id').val('');
    $('#user_name').val('');

    $('#hand_tel').val('');
    $('#depart_id').combobox('setValue', '');
    $('#EndTime').datetimebox('setValue', '');
    var data = XCommon.getNowFormatDate();
    $("#BeginTime").datetimebox("setValue", data);
    $('#xunjian').switchbutton('uncheck');
};

var tbUserSetData = function (row) {
    $('#id').val(row.id);
    $('#user_name').val(row.user_name);
    $('#hand_tel').val(row.hand_tel);
    $('#depart_id').combobox('setValue', row.depart_id);
    Ajax(false, global.mj["GetDefaultEndDate"], { LoginID: LocalID, user_id: row.id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#EndTime').datetimebox('setValue', data.Data);
    });
};



//获取部门
var getDepartInfo = function () {
    Ajax(true, global.sys.GetDepartList, { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            // $('#text').select();
            return;
        };
        var temp = { 'id': '', 'department': '全部' };
        data.Data.push(temp);
        allDepart = data.Data;

        $('#depart_id1').combobox({
            data: allDepart,
            valueField: 'id',
            textField: 'department'
        });
        $('#depart_id').combobox({
            data: allDepart,
            valueField: 'id',
            textField: 'department'
        });
        tbUser.datagrid('loadData', jsondata);
    });
};

//人员种类
var getUserKindInfo = function () {

    Ajax(false, global.sys["GetUserKindList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var temp = { 'id': '', 'user_kind': '全部' };
        data.Data.push(temp);
        allUserKind = data.Data;
        $('#user_kind1').combobox({
            data: allUserKind,
            valueField: 'id',
            textField: 'user_kind'
        });
        tbUser.datagrid('loadData', jsondata);
    });
};

//搜索用户方法
var iniSearchUser = function () {
    PageNum = 1;
    var p = tbUser.datagrid('getPager');
    p.pagination('select', 1);
    loadUserTb($("#user_name1").val(), $("#userid_num1").val(), $("#depart_id1").combobox("getValue"), $("#user_kind1").combobox("getValue"));
};


//定义增删改方法-门权限
var toolAddClick = function () {

    var dataUser = $('#id').val() || '';
    if (dataUser == '') {
        $.messager.alert("提示", "<p class='infoReport'>请先选择人员</p>", "error");
        return;
    }

    $('#win').window({
        title: '新增权限',
        iconCls: 'icon-add',
        maximizable: false,
        minimizable: false
    });
    $('#win').window('open');

}


//删除-门权限
var toolRemoveClick = function () {

    var rowData = $('#tbRightUser').datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
        return;
    }
    var dataUser = $('#id').val() || '';
    if (dataUser == '') {
        $.messager.alert("提示", "<p class='infoReport'>未选择用户项</p>", "error");
        return;
    }
    if (dataUser != rowData.user_file) {
        $.messager.alert("提示", "<p class='infoReport'>未知错误,请重试</p>", "error");
        return;
    };
    $.messager.confirm("提示", "<p class='infoReport'>确定删除选中项数据</p>", function (data) {
        if (data) {                                               //传递参数注意
            Ajax(true, global.mj["RemoveMjUserDoorSim"], { LoginID: LocalID, user_file: rowData.user_file, door_id: rowData.door_id }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                getUserDoor(rowData.user_file);
            });
        }
    });
}




//加载人员表格数据
var loadUserTb = function (user_name, userid_num, depart_id, user_kind) {
    tbUser.datagrid('unselectAll');
    Ajax(true, global.sys["GetUserFilePageList"], {
        LoginID: LocalID, user_name: user_name, depart_id: depart_id, userid_num: userid_num, user_kind: user_kind, sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
    }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            $('#user_name1').select();
            return;
        }
        jsondata.total = data.Ex;
        jsondata.rows = data.Data;
        tbUser.datagrid('loadData', jsondata);
        if (jsondata.total == 0) {
            PageNum = 1;
        }
        var p = tbUser.datagrid('getPager');
        $(p).pagination({
            beforePageText: '第', //页数文本框前显示的汉字
            afterPageText: '页    共 ' + Math.ceil(jsondata.total / PageSize) + ' 页',
            displayMsg: '当前显示 ' + (PageSize * (PageNum - 1) + (jsondata.total == 0 ? 0 : 1)) + ' - ' + (PageSize * (PageNum - 1) + jsondata.rows.length) + ' 条记录   共 ' + jsondata.total + ' 条记录',
            onSelectPage: function (pageNumber, pageSize) {
                PageSize = pageSize;
                PageNum = pageNumber;
                if (PageNum < 1) {
                    PageNum = 1;
                }
                loadUserTb($("#user_name1").val(), $("#userid_num1").val(), $("#depart_id1").combobox("getValue"), $("#user_kind1").combobox("getValue"));
            }
        });

        //刷新
    });
};
//获取应用群组
function getApplyGroup() {
    Ajax(true, global.mj["GetMjRightGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        $('#group_name').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'name'
        });
    });
};
//设置门层次管制
function getApb() {
    $('#apb').combobox({
        data: [{ 'id': 0, 'text': '不执行' }, { 'id': 1, 'text': '执行'}],
        valueField: 'id',
        textField: 'text'
    });
};

//关闭页面
var CloseForm = function () {
    $('#win').window('close');
};

//获取门
var getDoor = function () {
    Ajax(true, global.mj["GetMJControlDoorList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }; //修改id
        $('#door_id').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'door_name'
        });
        allDoor = data.Data;
    });
};
var getColumZX = function (value, row, index) {
    if (row.apb == '1') {
        return '执行';
    } else {
        return '不执行 ';
    }
};
//初始化读卡器
var iniCardRead = function () {
    while (true) {
        var ActiveX;
        var ret;
        try {
            ActiveX = $("#ActiveXPZ")[0];
            ret = ActiveX.GetVersion();
        }
        catch (e) {

        }
        if (ret != "1.0") {
            alert("做卡插件版本不匹配，请重新安装对应版本，重试！" + "(当前" + ret + "软件需要1.0)");
            isReader = false;
            return;
        }
        ret = ActiveX.OpenCom();
        if (ret != 0) {
            $.messager.alert('提示', "读卡器未连接", 'info');
            isReader = false;
            return;
        } else {
            $.messager.alert('提示', "读卡器已连接，请放上门禁卡", 'info');
            //            return;
            isReader = true;
            $('#card_id').validatebox('readonly', true);
        }
        break;
    };
};
//初始化指纹器
var ComInt = function () {
    var test;
    try {
        test = ActiveXPZ.Zw_Int();
    }
    catch (e) {
        $.messager.alert("提示", "<p class='infoReport'>请安装指纹驱动</p>", "error");
        return;
    }
    if (test != 0) {
        if ($('#errorInfo').length) {
            $(".messager-body").window('close');
        }
        $.messager.show({
            id: 'errorInfo',
            title: '提示',
            msg: "<center>初始化失败，请接指纹仪！<br /><br /><a href='#' onclick=ComInt()>重试<a></center>",
            timeout: 0,
            showType: 'fade',
            style: {
                right: '',
                bottom: ''
            },
            width: 275,
            height: 140
        });
        return;
    }
};

var getZWInfo = function (userID) {
    Ajax(true, global.zw["GetZwInfoList"], { LoginID: LocalID, user_id: userID, lsenabled: '1' }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        var jsondataZWInfo = { 'total': 0, 'rows': [] };
        jsondataZWInfo.total = data.Data.length;
        jsondataZWInfo.rows = data.Data;
        var datatable1 = $("#tbZWInfo").datagrid();
        datatable1.datagrid('loadData', jsondataZWInfo);
    });
}
var showZWNum = function (rowIndex, rowData) {
    if (rowData) {
        $('#zwNum').val(rowData.id);
    }
};

var GrantCard = function () {
    var id = $("#id").val();
    var user_name = $("#user_name").val();
    var depart_id = $("#depart_id").combobox('getValue');
    var BeginTime = $('#BeginTime').datetimebox('getValue');
    var EndTime = $('#EndTime').datetimebox('getValue');
    var xunjian = $('#xunjian').switchbutton('options');
    var card_kind = '03';
    if (xunjian.checked) {
        card_kind = "22";
    }
    if (!id) {
        $.messager.alert('提示', "<p class='infoReport'>请选择用户</p>", 'error');
        return;
    }
    if (!BeginTime) {
        $.messager.alert('提示', "<p class='infoReport'>请输入正确的生效时间</p>", 'error');
        return;
    }
    if (!EndTime) {
        $.messager.alert('提示', "<p class='infoReport'>请输入正确的失效时间</p>", 'error');
        return;
    }

    if (Date.parse(BeginTime) > Date.parse(EndTime)) {
        $.messager.alert('提示', "<p class='infoReport'>开始时间大于结束时间，请重新输入</p>", 'error');
        return;
    }
    var data = $('#tbZWInfo').datagrid('getData');
    if (data) {
        if (data.rows.length >= 2) {
            $.messager.alert('提示', "<p class='infoReport'>指纹数已到上限（2个）</p>", 'error');
            return;
        }
    }
    if (rool != null) {
        clearTimeout(rool);
    }
    rool = setTimeout(Grant, 500);
}

var Grant = function () {
    COT = 0;
    ActiveXPZ.Zw_FpCancel();
    if ($('#info').length) {
        $(".messager-body").window('close');
    }
    $.messager.show({
        id: 'info',
        title: '录入指纹',
        msg: "<center><p id='zwxssp'>请按指纹！1 <br /><br /></p>&nbsp;<a id='nextsubmit' onClick='Grant()' href='#'><a></center>",
        timeout: 0,
        showType: 'fade',
        style: {
            right: '',
            bottom: ''
        },
        width: 275,
        height: 140
    });
    ActiveXPZ.Zw_Start();
    rool = setTimeout(GrantX, 500);
};
var GrantX = function () {
    if (ActiveXPZ.Zw_IsFingerPress()) {
        rool = setTimeout(GrantX, 500);
        return;
    }
    ActiveXPZ.Zw_End();
    var ret = "";
    ret = ActiveXPZ.Zw_CaptureFinger(0);
    COT = 1;
    rool = setTimeout(GrantY, 500);
}
function GrantY() {
    $("#zwxssp")[0].innerHTML = "请按指纹！2";
    if (ActiveXPZ.Zw_IsFingerPress()) {
        ActiveXPZ.Zw_End();
        ActiveXPZ.Zw_Start();
        rool = setTimeout(GrantY, 1000);
        return;
    }
    COT = 2;
    ActiveXPZ.Zw_End();
    var ret = "";
    ret = ActiveXPZ.Zw_CaptureFinger(1);
    ActiveXPZ.Zw_Start();
    rool = setTimeout(GrantZ, 500);
}
var GrantZ = function () {
    $("#zwxssp")[0].innerHTML = "请按指纹！3";
    if (ActiveXPZ.Zw_IsFingerPress()) {
        ActiveXPZ.Zw_End();
        ActiveXPZ.Zw_Start();
        rool = setTimeout(GrantZ, 1000);
        return;
    }
    ActiveXPZ.Zw_End();
    var ret = "";
    ret = ActiveXPZ.Zw_CaptureFinger(2);
    var data = JSON.parse(ret);


    if (data.Success && data.Data) {
        $("#zwxssp")[0].innerHTML = "生成指纹数据成功！";
    }
    else {
        if (data.Ex) {
            $("#zwxssp")[0].innerHTML = "指纹3采集失败！";
            ActiveXPZ.Zw_End();
            ActiveXPZ.Zw_Start();
            rool = setTimeout(GrantZ, 1000);
            return;
        } else if (!data.EX) {
            ActiveXPZ.Zw_End();
            $("#zwxssp")[0].innerHTML = "生成指纹数据失败！";
            $("#nextsubmit")[0].innerHTML = "重试";
            return;
        } else {
            ActiveXPZ.Zw_End();
            $("#zwxssp")[0].innerHTML = "生成指纹数据失败！";
            $("#nextsubmit")[0].innerHTML = "重试";
        }
    }
    var zw = data.Data;
    //使用方法
    var id = $("#id").val();
    var BeginTime = $('#BeginTime').datetimebox('getValue');
    var EndTime = $('#EndTime').datetimebox('getValue');
    var xunjian = $('#xunjian').switchbutton('options');
    var card_kind = '';
    if (xunjian.checked) {
        card_kind = "22";
    }
    Ajax(true, global.zw.NewZwInfo, { LoginID: LocalID, zw: zw, user_id: id, card_kind: card_kind, begin_date: BeginTime, end_date: EndTime }, function (data) {
        if (!data.Success) {
            $.messager.alert('提示', data.Message, 'error');
            if ($('#info').length) {
                $(".messager-body").window('close');
            }
            return;
        }
        if ($('#info').length) {
            $(".messager-body").window('close');
        }
        $.messager.alert('提示', "<p class='infoReport'>保存成功</p>", 'info');
        //查询
        getZWInfo(id);
        $('#zwNum').val('');
    });
};
//读卡
function readcard() {
    if (!isReader) {
        return;
    }
    var currentcardsnr = ActiveXPZ.RFMifare_GetSnr();
    if (currentcardsnr == "") {
        if (cardsnr != "") {
            $("#card_id").val("");
        }
        cot++;
        if (cot > maxcot) {
            alert("长时间未读到卡，已停止工作，要继续请刷新页面");
            return;
        }
    }
    else {
        cot = 0;
    }
    if (currentcardsnr == "" || currentcardsnr == cardsnr) {

        cardsnr = currentcardsnr;
        if (rools) {
            clearTimeout(rools);
        }
        rools = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    cardsnr = currentcardsnr;
    $("#card_id").val(cardsnr);
    Ajax(true, global.mj["GetMjCardUsing"], { LoginID: LocalID, card_id: cardsnr }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            if (rool) {
                clearTimeout(rool);
            }
            rools = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        ext = true;
        if (rools) {
            clearTimeout(rools);
        }
        rools = setTimeout(function () { readcard() }, rooltime);
        if (data.Data.card_id != null) {
            tbUserClearData();
            $("#EndTime").datebox("setValue", data.Data.end_date);
            $("#BeginTime").datebox("setValue", data.Data.begin_date);

            $("#depart_id").combobox('setText', data.Data.depart_name);
            $('#id').val(data.Data.user_file_id);
            $('#user_name').val(data.Data.user_name);
            getZWInfo(data.Data.user_file_id);
            getUserDoor(data.Data.user_file_id);
            var hs = "";
            workStatus = data.Data.work_status;
            if (data.Data.work_status == "us") {
                hs = "，已制卡,可正常退卡";
            }
            if (data.Data.work_status == "lt") {
                hs = "，挂失卡";
            }

            if (data.Data.work_status == "") {
                hs = "，未制卡,可正常制卡";
            }
            if (data.Data.work_status == "re") {
                hs = "，可正常制卡";
            }
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + hs);
        }
        else if (data.Data.card_id == null) {
            workStatus = 're';
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + ",是否制卡");
            ext = false;
        }
    });
}
//指纹表单击行事件
var ClickZWRow = function (rowIndex, rowData) {
    if (rowData) {
        $('#zwNum').val(rowData.zw_id);
        Ajax(true, global.mj.GetMjCardUsing, { LoginID: LocalID, card_id: rowData.zw_id }, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                if ($('#info').length) {
                    $(".messager-body").window('close');
                }
                return;
            }
            if (data.Data.end_date) {
                $('#EndTime').datetimebox('setValue', data.Data.end_date);
            }
        });
    }
};

//注销指纹
var RemoveZWInfo = function () {
    var rowZW = $('#tbZWInfo').datagrid('getSelected');
    if (!rowZW) {
        $.messager.alert('提示', "<p class='infoReport'>未选择要需要删除的指纹</p>", 'error');
        return;
    }
    $.messager.confirm('提示', "<p class='infoReport'>确定删除选中项数据</p>", function (r) {
        if (r) {
            var useId = $('#id').val().trim();
            RemoveZWInfoCore(useId, rowZW.id);
        }
    });
};

//注销指纹核心方法
var RemoveZWInfoCore = function (UseID, id) {
    Ajax(true, global.zw["RemoveZwInfo"], { LoginID: LocalID, id: id }, function (data) {
        if (!data.Success) {
            $.messager.alert('提示', data.Message, 'error');
            return;
        };
        $.messager.alert('提示', "<p class='infoReport'>删除成功</p>", 'info');
        //重新加载数据
        getZWInfo(UseID);
        $('#zwNum').val('');
    });
};
//更新结束时间
var CardUpdateEndDate = function () {
    //zw_id及为卡号
    var card_id = $('#zwNum').val();
    var end_date = $('#EndTime').datetimebox('getValue');
    if ((card_id == '' || card_id == null)) {
        $.messager.alert("提示", "<p class='infoReport'>未输入卡号</p>", "error");
        return;
    }
    if (end_date == '' || end_date == null) {
        $.messager.alert("提示", "<p class='infoReport'>请设置失效时间</p>", "error");
        return;
    }
    Ajax(true, global.mj["UpdateMjCardUsingEndDateSim"], { LoginID: LocalID, card_id: card_id, end_date: end_date }, function (data) {
        if (!data.Success) {
            $.messager.alert('提示', data.Message, 'error');
            return;
        }
        else {
            $.messager.alert("提示", "<p class='infoReport'>更新成功</p>", "info");
            $('#zwNum').val('');
        }
    });
};