var user_id;
var allDoor;
var allDepart;
var id;
var LocalID = $.cookie("LocalID");
var tree;
var datatable;
var jsondata = { "total": 0, "rows": [] };
var jsonright = { "total": 0, "rows": [] };

//实例树
var initializeTree = function () {
    tree = $("#tt").tree({
        animate: true,
        onSelect: function (node) {
            if (node.attributes.kind == "U") {
                user_id = node.id;
                getUserDoor(user_id);
            } else if (node.attributes && node.attributes.kind && node.attributes.kind == "D") {
                user_id = undefined;
                var target = node.children || undefined;
                if (target && target.length && target.length != 0) {
                    for (var i = 0; i < target.length; i++) {
                        if (target[i].attributes.kind == "U") {
                            $('#tt').tree('toggle', node.target);
                            return;
                        }
                    }
                }
                XCommon.ShowWaiting('加载人员信息中');
                Ajax(false, global.sys["GetUserTreeOfDepart"], { LoginID: LocalID, depart_id: node.id, iconUls: "icon-man" }, function (data) {
                    XCommon.ClosWating();
                    if (!data.Success) {
                        alert(data.Message);
                        return;
                    }
                    $('#tt').tree('append', {
                        parent: node.target,
                        data: JSON2.parse(data.Data)
                    });
                    $('#tt').tree('toggle', node.target);
                });
            }
        }, onBeforeExpand: function (node) {
            var target = node.children || undefined;
            if (target && target.length && target.length != 0) {
                for (var i = 0; i < target.length; i++) {
                    if (target[i].attributes.kind == "U") {
                        return;
                    }
                }
            }
            XCommon.ShowWaiting('加载人员信息中');
            Ajax(false, global.sys["GetUserTreeOfDepart"], { LoginID: LocalID, depart_id: node.id, iconUls: "icon-man" }, function (data) {
                XCommon.ClosWating();
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $('#tt').tree('append', {
                    parent: node.target,
                    data: JSON2.parse(data.Data)
                });
            });
        }
    });
};

var initializeGrid = function () {
    datatable = $("#tb").datagrid({

        columns: [[
                {
                    field: 'door_name',
                    title: '门号',
                    //sortable: true,
                    width: 500,
                    align: 'center'
                }]],
        onDblClickCell: function (rowIndex, field, value) {
            var rowData = datatable.datagrid('getSelected');
            if (rowData == null) {
                $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                return;
            }
            $('#win').window({
                title: '查看数据',
                iconCls: 'icon-edit',
                maximizable: false,
                minimizable: false
            });

            $('#win').window('open');
            id = 1;
            //清空数据
            clearForm();
            //填充数据
            $('#door_id').combobox('setValue', rowData.door_id);
        }
    });
    var pager = $("#tb").datagrid("getPager");
    pager.pagination({
        total: jsondata.total,
        onSelectPage: function (pageNo, pageSize) {
            var start = (pageNo - 1) * pageSize;
            var end = start + pageSize;
            $("#tb").datagrid("loadData", jsondata.rows.slice(start, end));
            pager.pagination('refresh', {
                total: jsondata.total,
                pageNumber: pageNo
            });
        }
    });


};

//定义增删改方法
var toolAddClick = function () {
    if (user_id === undefined) {
        $.messager.alert("提示", "<p class='infoReport'>未选择人员</p>", "error");
        return;
    }
    $('#win').window({
        title: '新增权限',
        iconCls: 'icon-add',
        maximizable: false,
        minimizable: false
    });

    $('#win').window('open');

    clearForm();
    id = undefined;
}

//删除
var toolRemoveClick = function () {
    var rowData = datatable.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
        return;
    }

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

//获取部门-门权限
function getUserDoor(user_id) {
    var area = $('#tool_area').combotree('getValue');
    var temp;
    if (area != '') {
        temp = { LoginID: LocalID, user_file: user_id, area_id: area };
    } else {
        temp = { LoginID: LocalID, user_file: user_id };
    }
    Ajax(true, mj["GetMjUserDoorList"], temp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        jsondata.total = data.Data.length;
        jsondata.rows = data.Data;
        datatable.datagrid('loadData', jsondata);
        $("#tb").datagrid("getPager").pagination('select');
    });
};

//获取区域
function getAreaCombo() {
    Ajax(true, sys.GetAllSysAreaTree, { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#tool_area').combotree({
            data: JSON2.parse(data.Data),
            onSelect: function (value) {
                if (value != null) {
                    getUserDoor(user_id);
                }
            }
        });
    });
}
//获取门
function getDoorCombo() {
    Ajax(true, mj["GetMJControlDoorList"], { LoginID: LocalID,flag:"0" }, function (data) {
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
}

//获取所有树数据
function loadTreeData() {
    Ajax(true, global.sys.GetAllDepartTree, { LoginID: LocalID, iconCls: 'icon-tool', state: 'closed' }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsondata.total = data.Data.length;
        jsondata.rows = JSON2.parse(data.Data)
        tree.tree('loadData', jsondata.rows);
        if (data.Data.length > 0) {
            if (tree.tree('getSelected') == null) {
                var root = tree.tree("getRoot");
                if (root != null) {
                    tree.tree('select', root.target);
                }
            }
        }
    });
};

//清空旧数据
function clearForm() {
    $('#door_id').combobox('setValue', '');
};

//加载数据
function loadDataToWin(rowData) {
    $('#door_id').combobox('setValue', rowData.door_id);
}

//定义按键内容
var initializeEvent = function () {
    $("#close").click(function () {
        $('#win').window('close');
    });

    $("#save").click(function () {
        if ($("#door_id").combobox("getValue").trim() == '') {
            $.messager.alert("提示", "<p class='infoReport'>门不能为空</p>", "error");
            return;
        }
        var door_id = $("#door_id").combobox("getValue");

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
        var dataTemp = {
            LoginID: LocalID,
            user_file: user_id,
            door_id: door_id
        };
        //新增
        if (id == null) {
            Ajax(true, mj["NewMjUserDoorSim"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加</p>", function (r) {
                    if (r) {
                        clearForm();

                    } else {
                        $('#win').window('close');
                    }
                    getUserDoor(user_id);
                });
            });    //修改
        } else {
            $.messager.alert("提示", "<p class='infoReport'>查看状态下不能修改</p>", "info");
            $('#win').window('close');
            return;
        }
    });
};

$(function () {
    initializeTree();
    initializeGrid();
    loadTreeData();
    getAreaCombo();
    getDoorCombo();
    initializeEvent();
    XCommon.IniMM();
    $('#win').window('close');
});