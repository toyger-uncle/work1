var LocalID = $.cookie("LocalID");
var zCardNOFlag = false; //正卡号标志
var cardsnr = "";
var TKPlaintext = "";
var rooltime = 500;
var cot = 0;
var maxcot = 12000;
var datagrid;
var jsondata = { "total": 0, "rows": [] };
var jsondataRight = { "total": 0, "rows": [] };
var jsondataRightWX = { "total": 0, "rows": [] };
var sortName = "id";
var sortOrder = "asc";
var PageSize = 10;
var PageNum = 1;
var rool;
var allDoor;
var allDoorWX;
//工作状态标识
var workStatus;
//是否有硬件插件
var isReader;
var ext = false;
var rool;
var cardsnr;
var cot = 0;
var maxcot = 12000;
//用户表
var tbUser;
var sortName;
var sortOrder;
//部门数 
var allDepart;
//用户种类
var allUserKind;
var jsonCardData = { "total": 0, "rows": [] }; ;
var PageCardSize = 5;
var PageCardNum = 1;

//获取卡种类 表格用
var getCardKind = function (value, row, index) {
    var cardKind = row.card_kind;
    if (cardKind) {
        var kindName = scene.cardKindName[cardKind];
        if (kindName) {
            return kindName;
        } else {
            return "未定义";
        }
    }
};

//获取卡状态表格用
var getCardState = function (value, row, index) {
    var workStatus = row.work_status;
    if (workStatus) {
        var statusName = scene.kazhuangtai[workStatus];
        if (statusName) {
            return statusName;
        } else {
            return "未定义";
        }
    }
};

//初始化人员表格
var iniTbUser = function () {
    tbUser = $('#tb_user').datagrid({
        idField: "id",
        //显示分页  
        pageSize: PageSize, //分页大小  
        pageList: [10], //每页的个数
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
                 field: 'role_name',
                 title: '角色',
                 sortable: true,
                 width: 100,
                 align: 'center'
             }]],
        //             {
        //                 field: 'hand_tel',
        //                 title: '手机',
        //                 sortable: true,
        //                 width: 100,
        //                 align: 'center'
        //             }]],
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
                var LoginIDTemp = rowData.id;
                getUserDoor(LoginIDTemp);
                getUserDoorWX(LoginIDTemp);
                //setCardData(LoginIDTemp);
            }
        },
        onDblClickRow: function (rowIndex, rowData) {
            if (rowData) {
                // tbUserClearData();
                //tbUserSetData(rowData);
                var LoginIDTemp = rowData.id;
                //getUserDoor(LoginIDTemp);
                //getUserDoorWX(LoginIDTemp);
                setCardData(LoginIDTemp);
            }
        }
    });
};

//获取无线门
var getDoorWX = function () {
    Ajax(true, mj["GetMJControlDoorList"], { LoginID: LocalID, flag: "1" }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }; //修改id
        $('#door_idWX').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'door_name'
        });
        allDoorWX = data.Data;
    });
};

//加载卡数据
var setCardData = function (loginID) {
    Ajax(true, global.mj["GetMjCardUsingPageList"], { LoginID: loginID, pageSize: PageCardSize, pageNum: PageCardNum }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        var Data = data.Data;
        jsonCardData.total = data.Ex;
        jsonCardData.rows = Data;
        if (jsonCardData.total > 1) {
            $("#winShowCard").window("open");
            $("#tbCardUsing").datagrid('loadData', jsonCardData);
        }
        var p = $("#tbCardUsing").datagrid('getPager');
        $(p).pagination({
            beforePageText: '第', //页数文本框前显示的汉字
            afterPageText: '页    共 ' + Math.ceil(jsonCardData.total / PageCardSize) + ' 页',
            displayMsg: '当前显示 ' + (PageCardSize * (PageCardNum - 1) + (jsonCardData.total == 0 ? 0 : 1)) + ' - ' + (PageCardSize * (PageCardNum - 1) + data.Data.length) + ' 条记录   共 ' + jsonCardData.total + ' 条记录',
            onSelectPage: function (pageNumber, pageSize) {
                PageCardSize = pageSize;
                PageCardNum = pageNumber;
                if (PageCardNum < 1) {
                    PageCardNum = 1;
                }
                setCardData(loginID);
            }
        })
    })
}

//加载无线权限
var getUserDoorWX = function (user_id) {
    var area = $('#areaWX').combobox('getValue');
    var temp;
    if (area != '') {
        temp = { LoginID: LocalID, user_file: user_id, address_group_id: area };
    } else {
        temp = { LoginID: LocalID, user_file: user_id };
    }
    Ajax(true, global.yj["GetYjUserDoorRightList"], temp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        jsondataRightWX.total = data.Data.length;
        jsondataRightWX.rows = data.Data;
        var datatable = $("#tbRightUserWX").datagrid();
        datatable.datagrid('loadData', jsondataRightWX);
        datatable.datagrid("getPager").pagination('select');
    });
}

//无线权限新增方法
var toolAddClickWX = function () {
    var dataUser = $('#id').val() || '';
    if (dataUser == '') {
        $.messager.alert("提示", "<p class='infoReport'>请先选择人员</p>", "error");
        return;
    }

    $('#winWX').window({
        title: '新增无线权限',
        iconCls: 'icon-add',
        maximizable: false,
        minimizable: false
    });
    $('#winWX').window('open');
    $('#door_idWX').combobox('setValue', '');
    $('#group_nameWX').combobox('setValue', '');
}

//无线权限删除方法
var toolRemoveClickWX = function () {
    var rowData = $('#tbRightUserWX').datagrid('getSelected');
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
            Ajax(true, global.yj["RemoveYjUserDoorRight"], { LoginID: LocalID, id: rowData.id }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                getUserDoorWX(rowData.user_file);
            });
        }
    });
}

//无线关闭按钮方法
var CloseFormWX = function () {
    $('#winWX').window('close');
    $('#winPsw').window('close');
}

//无线保存按钮方法
var clickSaveWX = function () {
    var dataUser = $('#id').val() || '';
    if ($("#door_idWX").combobox("getValue").trim() == '') {
        $.messager.alert("提示", "<p class='infoReport'>门不能为空</p>", "error");
        return;
    }
    var door_id = $("#door_idWX").combobox("getValue");
    var group_name = $("#group_nameWX").combobox("getValue");
    var result = true;
    var allData = $("#door_idWX").combobox("getData");   //获取combobox所有数据
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
    result = true;
    allData = $("#group_nameWX").combobox("getData");   //获取combobox所有数据
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
        right_id: group_name
    };

    //新增
    Ajax(true, global.yj["NewYjUserDoorRight"], dataTemp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加</p>", function (r) {
            if (r) {
            } else {
                $('#winWX').window('close');
            }
            $('#door_idWX').combobox('setValue', '');
            $('#group_nameWX').combobox('setValue', '');
            getUserDoorWX(dataUser);
        });
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
    Ajax(true, mj["GetMJWhereGroupList"], { LoginID: LocalID }, function (data) {
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
        $('#areaWX').combobox({
            data: data.Data,
            valueField: 'address_group_id',
            textField: 'address_group',
            onSelect: function (value) {
                if (value != null) {
                    var data = $('#id').val() || '';
                    if (data != '') {
                        getUserDoorWX(data);
                    }
                }
            }
        });
    });
};

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

    Ajax(true, mj["NewMjUserDoor"], dataTemp, function (data) {
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
    Ajax(true, mj["GetMjUserDoorList"], temp, function (data) {
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
    $('#inNum').val('');
    $('#hand_tel').val('');
    $('#depart_id').combobox('setValue', '');
    $('#EndTime').datebox('setValue', '');
    var data = XCommon.getNowFormatDate();
    $("#BeginTime").datebox("setValue", data);
};

var tbUserSetData = function (row) {
    $('#id').val(row.id);
    $('#user_name').val(row.user_name);
    $('#hand_tel').val(row.hand_tel);
    $('#depart_id').combobox('setValue', row.depart_id);

    Ajax(false, mj["GetDefaultEndDate"], { LoginID: LocalID, user_id: row.id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#EndTime').datebox('setValue', data.Data);
    });
};

//获取部门
var getDepartInfo = function () {
    Ajax(true, sys["GetDepartList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            // $('#text').select();
            return;
        };
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

    Ajax(false, sys["GetUserKindList"], { LoginID: LocalID }, function (data) {
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
    //loadUserTb($("#user_name1").val(), $("#userid_num1").val(), $("#depart_id1").combobox("getValue"), $("#user_kind1").combobox("getValue"));
};

//定义增删改方法-门权限
var toolAddClick = function () {
    var dataUser = $('#id').val() || '';
    if (dataUser == '') {
        $.messager.alert("提示", "<p class='infoReport'>请先选择人员</p>", "error");
        return;
    }

    $('#win').window({
        title: '新增有线权限',
        iconCls: 'icon-add',
        maximizable: false,
        minimizable: false
    });
    $('#win').window('open');
    $('#door_id').combobox('setValue', '');
    $('#group_name').combobox('setValue', '');
    $('#apb').combobox('setValue', '');
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
            Ajax(true, mj["RemoveMjUserDoorSim"], { LoginID: LocalID, user_file: rowData.user_file, door_id: rowData.door_id }, function (data) {
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
    var kind = "";
    var notMakeTemp = $('#notMake').switchbutton('options');
    if (notMakeTemp.checked == true) {
        kind = "1";
    } else {
        kind = "0";
    }
    var makeTemp = $('#maked').switchbutton('options');
    if (makeTemp.checked == true) {
        kind += "1";
    } else {
        kind += "0";
    }
    XCommon.ShowWaiting("查询中,请稍候");
    Ajax(true, global.sys["GetUserFilePageListOfMJ"], { kind: kind, LoginID: LocalID, user_name: user_name, depart_id: depart_id, userid_num: userid_num, user_kind: user_kind, sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
    }, function (data) {
        XCommon.ClosWating();
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
                // p.pagination('select');	
            }
        });
    });
};

//初始化读卡器
var iniCardRead = function () {
    $("#used_mode").combobox('setValue', 0);
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
            isReader = false;
            $('#reader').combobox('setValue', 0);
            $('#card_id').validatebox('readonly', false);
            workStatus = 'noDevice';
            return;
            continue;
        }
        if (ret != "1.0") {
            $("#info").css("color", "Red");
            $("#info").html("做卡插件版本不匹配，请重新安装对应版本，重试！" + "(当前" + ret + "软件需要1.0)");
            isReader = false;
            $('#reader').combobox('setValue', 0);
            $('#card_id').validatebox('readonly', false);
            workStatus = 'noDevice';
            return;
            continue;
        }
        ret = ActiveX.OpenCom();
        if (ret != 0) {
            $("#info").css("color", "Red");
            $("#info").html("初始化失败，请插好读卡器，重试！");
            isReader = false;
            $('#reader').combobox('setValue', 0);
            $('#card_id').validatebox('readonly', false);
            workStatus = 'noDevice';
            return;
            continue;
        } else {
            isReader = true;
            $('#reader').combobox('setValue', 1);
            $('#card_id').validatebox('readonly', true);
        }
        break;
    };
};

//退卡
var cardRecycle = function () {
    var card_id = $('#card_id').val();

    if (card_id == '' || card_id == null) {
        $.messager.alert("提示", "<p class='infoReport'>未输入卡号</p>", "error");
        return;
    }
    //所有都能退卡
    if (workStatus == "lk") {
        $.messager.alert("提示", "<p class='infoReport'>当前状态不能退卡</p>", "error");
        return;
    }
    //            //卡号补齐8位
    //            if (card_id.length < 8) {
    //                card_id = '00000000' + card_id;
    //                card_id = card_id.substring(card_id.length - 8);
    //            }
    var reg = new RegExp(/^[0-9a-fA-F]{8}$/);
    if (!card_id.match(reg)) {
        $.messager.alert("提示", "<p class='infoReport'>卡号不正确,卡号为8位数字或字母</p>", "error");
        return;
    }
    Ajax(true, mj["RecycleCardMjCardUsing"], { LoginID: LocalID, card_id: card_id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        if (isReader) {
            cardsnr = '';
            readcard();
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
        }
        $.messager.alert("提示", "<p class='infoReport'>退卡成功</p>", "success");
    });
};

//普通制卡
var cardMake = function () {
    var rowData = tbUser.datagrid('getSelected');
    var temp = $('#id').val();
    if (!temp || !rowData) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return;
    }
    var card_id = $('#card_id').val();
    if (card_id == '' || card_id == null) {
        $.messager.alert("提示", "<p class='infoReport'>请读卡或输入卡号</p>", "error");
        return;
    }
    //制卡:只有回收报废才能制卡
    if (workStatus != 'kl' && workStatus != 're' && workStatus != "noDevice") {
        $.messager.alert("提示", "<p class='infoReport'>当前状态无法制卡</p>", "error");
        return;
    }
    var reg = new RegExp(/^[0-9a-fA-F]{8}$/);
    if (!card_id.match(reg)) {
        $.messager.alert("提示", "<p class='infoReport'>卡号不正确,卡号为8位数字或字母</p>", "error");
        return;
    }
    var begin_date = $('#BeginTime').datebox('getValue');
    begin_date = begin_date + " 00:00:00";
    var end_date = $('#EndTime').datebox('getValue');
    end_date = end_date + " 23:59:59";
    //卡面编号
    var num_incard = $('#inNum').val();
    var reg1 = new RegExp(/^[0-9a-fA-F]{0,10}$/);
    if (!num_incard.match(reg1)) {
        $.messager.alert("提示", "<p class='infoReport'>卡面编号不正确,卡面编号为10位数字或字母</p>", "error");
        return;
    }
    //03 普通卡 22巡检卡
    var card_kind = '03';
    var xunjian = $('#xunjian').switchbutton('options');
    if (xunjian.checked) {
        card_kind = "22";
    }
    var work_status = rowData.work_status;
    var is_psw = '0'; // rowData.is_psw;
    var user_file_id = $('#id').val();
    var userMode = $("#used_mode").combobox("getValue");
    Ajax(true, mj["NewMjCardUsing"], { LoginID: LocalID, card_id: card_id, user_file_id: user_file_id,
        num_incard: num_incard, card_kind: card_kind, begin_date: begin_date, end_date: end_date,
        work_status: work_status, is_psw: is_psw, used_mode: userMode
    }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        if (isReader) {
            cardsnr = '';
            readcard();
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
        }
        $.messager.alert("提示", "<p class='infoReport'>制卡成功</p>", "success");
    });
};

//获取应用群组   
function getApplyGroup() {
    Ajax(true, mj["GetMjRightGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        $('#group_name').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'name'
        });
        $('#group_nameWX').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'name'
        });
    });
}

//设置门层次管制
function getApb() {
    $('#apb').combobox({
        data: [{ 'id': 0, 'text': '不执行' }, { 'id': 1, 'text': '执行'}],
        valueField: 'id',
        textField: 'text'
    });
}

//读卡
function readcard() {
    if (!isReader) {
        return;
    }
    var currentcardsnr = ActiveX.RFMifare_GetSnr();
    if (!zCardNOFlag) {
        if (currentcardsnr) {
            currentcardsnr = convertZCardNO(currentcardsnr)
        }
    }
    if (currentcardsnr == "") {
        if (cardsnr != "") {
            $("#card_id").val("");
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
        if (rool) {
            clearTimeout(rool);
        }
        rool = setTimeout(function () { readcard() }, rooltime);
        return;
    }
    cardsnr = currentcardsnr;
    $("#info").css("color", "Green");
    $("#info").html("读卡成功，卡号：" + cardsnr);
    $("#card_id").val(cardsnr);

    Ajax(true, mj["GetMjCardUsing"], { LoginID: LocalID, card_id: cardsnr }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            if (rool) {
                clearTimeout(rool);
            }
            rool = setTimeout(function () { readcard() }, rooltime);
            return;
        }
        ext = true;
        if (rool) {
            clearTimeout(rool);
        }
        rool = setTimeout(function () { readcard() }, rooltime);

        //kl与re不显示卡信息
        if (data.Data.card_id != null) {
            if (data.Data.work_status != "kl" || data.Data.work_status != "re") {
                tbUserClearData();
                $("#EndTime").datebox("setValue", data.Data.end_date);
                $("#BeginTime").datebox("setValue", data.Data.begin_date);
                $("#depart_id").combobox('setText', data.Data.depart_name);
                $('#id').val(data.Data.user_file_id);
                $('#user_name').val(data.Data.user_name);
            }

            var hs = "";
            workStatus = data.Data.work_status;
            switch (workStatus) {
                case 'us': hs = "，已制卡,可正常退卡"; break;
                case 'lt': hs = "，已制卡,可正常退卡"; break;
                case '': hs = "，未制卡,可正常制卡"; break;
                case 're': hs = "，可正常制卡"; break;
                case 'lk': hs = " ，卡已锁,请先解锁"; break;
                default: hs = " ，未知卡状态"; break;
            }
            //            if (data.Data.work_status == "us") {
            //                hs = "，已制卡,可正常退卡";
            //            }
            //            if (data.Data.work_status == "lt") {
            //                hs = "，挂失卡";
            //            }

            //            if (data.Data.work_status == "") {
            //                hs = "，未制卡,可正常制卡";
            //            }
            //            if (data.Data.work_status == "re") {
            //                hs = "，可正常制卡";
            //            }
            if (data)
                $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + hs);

            //卡锁住.弹出框
            if (workStatus == "lk") {
                $.messager.confirm('提示', "<p class='infoReport'>是否解锁该卡</p>", function (r) {
                    if (r) {
                        var card_idTemp = cardsnr;
                        if (cardsnr.length < 8) {
                            card_idTemp = '00000000' + cardsnr;
                        }
                        card_idTemp = card_idTemp.substring(card_idTemp.length - 8);
                        Ajax(true, global.mj.ClearLockCardMjCardUsing, { LoginID: LocalID, card_id: card_idTemp }, function (data1) {
                            if (!data1.Success) {
                                $.messager.alert("提示", "<p class='infoReport'>" + data1.Message + "</p>");
                            } else {
                                $.messager.alert("提示", "<p class='infoReport'>解锁成功</p>");
                                $("#info").css("color", "Green");
                                $("#info").html("读卡成功，卡号：" + cardsnr + "，已制卡,可正常退卡");
                                workStatus = "us";
                            }
                        })
                    }
                });
            }
        }
        else if (data.Data.card_id == null) {
            workStatus = 're';
            $("#info").css("color", "Green");
            $("#info").html("读卡成功，卡号：" + cardsnr + ",是否制卡");
            ext = false;
        }
    });
}

//更新结束时间
var CardUpdateEndDate = function () {
    var card_id = $('#card_id').val();
    var end_date = $('#EndTime').datebox('getValue');
    if (workStatus == "lk") {
        $.messager.alert("提示", "<p class='infoReport'>当前状态无法更新结束时间</p>", "error");
        return;
    }
    if ((card_id == '' || card_id == null)) {
        $.messager.alert("提示", "<p class='infoReport'>未输入卡号</p>", "error");
        return;
    }
    if (card_id.length < 8) {
        card_id = '00000000' + card_id;
    }
    card_id = card_id.substring(card_id.length - 8);
//    if (card_id.length < 8) {
//        if (zCardNOFlag) {
//            card_id = '00000000' + card_id;
//            card_id = card_id.substring(card_id.length - 8, 8);
//        }
//        else {
//            card_id = card_id + '00000000';
//            card_id = card_id.substring(0, 8);
//        }
//    }
    if (end_date == '' || end_date == null) {
        $.messager.alert("提示", "<p class='infoReport'>请设置失效时间</p>", "error");
        return;
    }

    Ajax(true, mj["UpdateMjCardUsingEndDate"], { LoginID: LocalID, card_id: card_id, end_date: end_date }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        if (isReader) {
            ActiveX.RFMifare_Alarm(4, 10, 0, 1);
        }
        $.messager.alert("提示", "<p class='infoReport'>更新成功</p>", "success");

    });
};

//获取卡内容
var CardGetInfo = function () {
    var card_id = $('#card_id').val();


    if (card_id == '' || card_id == null) {
        $.messager.alert("提示", "<p class='infoReport'>请先读卡</p>", "error");
        return;
    }
    Ajax(true, mj["GetMjCardUsing"], { LoginID: LocalID, card_id: card_id }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        else {
            //在这里将卡内容输入到方框内
        }
    });
};

//选卡界面单选方法
var SelectCard = function () {
    var rowData = $("#tbCardUsing").datagrid('getSelected');
    var card_id = rowData.card_id;
    var num_incard = rowData.num_incard;
    var begin_date = rowData.begin_date;
    var end_date = rowData.end_date;
    $("#card_id").val(card_id);
    $("#inNum").val(num_incard);
    $("#BeginTime").datebox("setValue", begin_date);
    $("#EndTime").datebox("setValue", end_date);
    $("#winShowCard").window("close");
};

//关闭页面
var CloseForm = function () {
    $('#win').window('close');
    $('#winPsw').window('close');
    $("#winShowCard").window("close");
};

//获取有线门
var getDoor = function () {
    Ajax(true, mj["GetMJControlDoorList"], { LoginID: LocalID, flag: "0" }, function (data) {
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

var convertZCardNO = function (cardNO) {
    if (cardNO.length != 8) {
        return "";
    } else {
        var card = cardNO.slice(6, 8) + cardNO.slice(4, 6) + cardNO.slice(2, 4) + cardNO.slice(0, 2);
        return card;
    }
}

//设置是否读卡器模式
var setReader = function (temp) {
    if (temp == 0) {
        isReader = false;
        $('#card_id').validatebox('readonly', false);
        workStatus = 'noDevice';
        if (rool != null) {
            clearTimeout(rool);
        }
    } else if (temp == 1) {
        if (isReader) {
            return;
        }
        isReader = true;
        if (rool != null) {
            clearTimeout(rool);
        }
        iniCardRead();
        readcard();
    }
};

var getColumZX = function (value, row, index) {
    if (row.apb == '1') {
        return '执行';
    } else {
        return '不执行 ';
    }
}

var openGMM = function () {
    var rowData = tbUser.datagrid('getSelected');
    var temp = $('#id').val();
    if (!temp || !rowData) {
        $.messager.alert("提示", "<p class='infoReport'>请选择用户</p>", "error");
        return;
    }
    $('#winPsw').window({
        title: '开门密码设置',
        iconCls: 'icon-edit',
        maximizable: false,
        minimizable: false
    });
    $('#winPsw').window('open');
    $('#pswOld').numberbox('setValue', '');
    $('#pswNew1').numberbox('setValue', '');
    $('#pswNew2').numberbox('setValue', '');
};
var pswDelete = function () {
    var psw = $('#pswOld').numberbox('getValue', '') || '';
    if (!psw.match(/^[0-9]{8}$/)) {
        $.messager.alert('提示', "<p class='infoReport'>请输入8位数字的旧密码</p>", 'error');
        return;
    }
    var rowData = tbUser.datagrid('getSelected');
    $.messager.confirm('提示', "<p class='infoReport'>确定删除旧密码</p>", function (r) {
        if (r) {
            Ajax(true, global.mj["DeOpenUserPsw"], { LoginID: LocalID, user_file_id: rowData.id, old_psw: psw }, function (data) {
                if (!data.Success) {
                    $.messager.alert('提示', data.Message, 'error');
                    return;
                }
                $.messager.alert('提示', "<p class='infoReport'>删除成功</p>", 'info');
                $('#pswOld').numberbox('setValue', '');
            });
        }
    });
};
var pswUpdate = function () {
    var psw = $('#pswOld').numberbox('getValue', '') || '';
    var newPsw1 = $('#pswNew1').numberbox('getValue', '') || '';
    var newPsw2 = $('#pswNew2').numberbox('getValue', '') || '';
    if (!psw.match(/^[0-9]{8}$/) && psw.length != 0) {
        $.messager.alert('提示', "<p class='infoReport'>请输入8位数字的旧密码</p>", 'error');
        return;
    }
    if (!newPsw1.match(/^[0-9]{8}$/) || !newPsw1.match(/^[0-9]{8}$/)) {
        $.messager.alert('提示', "<p class='infoReport'>请输入8位数字的新密码</p>", 'error');
        return;
    }
    if (newPsw1 != newPsw2) {
        $.messager.alert('提示', "<p class='infoReport'>新密码和确认密码不一致</p>", 'error');
        return;
    }
    if (psw == newPsw1) {
        $.messager.alert('提示', "<p class='infoReport'>新密码不能和旧密码相同</p>", 'error');
        return;
    }
    var rowData = tbUser.datagrid('getSelected');
    $.messager.confirm('提示', "<p class='infoReport'>确定修改该密码</p>", function (r) {
        if (r) {
            Ajax(true, global.mj["SetOpenUserPsw"], { LoginID: LocalID, user_file_id: rowData.id, old_psw: psw, new_psw: newPsw1 }, function (data) {
                if (!data.Success) {
                    $.messager.alert('提示', data.Message, 'error');
                    return;
                }
                $.messager.alert('提示', "<p class='infoReport'>修改成功</p>", 'info');
                $('#pswOld').numberbox('setValue', '');
                $('#pswNew1').numberbox('setValue', '');
                $('#pswNew2').numberbox('setValue', '');
            });
        }
    });
};

//获取卡号正反
var getZFFlag = function () {
    Ajax(true, global.mj["GetCardSnr"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };

        //正卡号
        if (data.Data != "1") {
            zCardNOFlag = true;
        }
    });
}

$(function () {
    CloseForm();
    CloseFormWX();
    getZFFlag();
    var data = XCommon.getNowFormatDate();
    $("#BeginTime").datebox("setValue", data);
    iniTbUser();
    iniCardRead();
    getDepartInfo();
    getUserKindInfo();
    getAreaData();
    loadUserTb();
    getDoor();
    getDoorWX();
    inipageSet();
    getApb();
    getApplyGroup();
    readcard();
});    