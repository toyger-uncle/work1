var depart_id;
var allDoor;
var allDepart;
var id;
var LocalID = $.cookie("LocalID");
var tree;
var datatable;
var jsondata = { "total": 0, "rows": [] };
var jsonright = { "total": 0, "rows": [] };

//无线部门权限

//树
var initializeTree = function () {
    tree = $("#tt").tree({
        animate: true,
        onSelect: function (node) {
            depart_id = node.id;
            getDepartDoor(depart_id);
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
                    width: 100,
                    align: 'center'
                }, {
                    field: 'group_name',
                    title: '群组名',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }
                ]],
        onDblClickCell: function (rowIndex, field, value) {
            var rowData = datatable.datagrid('getSelected');
            if (rowData == null) {
                $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                return;
            }
            $('#win').window({
                title: '修改信息',
                iconCls: 'icon-edit',
                maximizable: false,
                minimizable: false
            });
            ///
            $('#win').window('open');
            id = 1;
            //清空数据
            clearForm();
            //填充数据
            $('#door_id').combobox('setValue', rowData.door_id);
            $('#group_name').combobox('setValue', rowData.group_name);
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
    if (!depart_id) {
        $.messager.alert("提示", "<p class='infoReport'>未选择部门</p>", "error");
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
    id = null;
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
            Ajax(true, mj["RemoveMjDepartApplyGroup"], { LoginID: LocalID, depart_id: rowData.depart_id, door_id: rowData.door_id }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                getDepartDoor(rowData.depart_id);
            });
        }
    });
}

//修改
var toolUpdateClick = function () {
    var rowData = datatable.datagrid('getSelected');
    if (rowData == null) {
        $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
        return;
    }
    $('#win').window({
        title: '修改信息',
        iconCls: 'icon-edit',
        maximizable: false,
        minimizable: false
    });
    ///
    $('#win').window('open');
    id = 1;
    //清空数据
    clearForm();
    //填充数据
    $('#door_id').combobox('setValue', rowData.door_id);
    $('#group_name').combobox('setValue', rowData.group_name);
}


//获取部门-门权限
function getDepartDoor(depart_id) {
    var area = $('#tool_area').combobox('getValue');
    var temp;
    if (area != '') {
        temp = { LoginID: LocalID, depart_id: depart_id, address_group_id: area };
    } else {
        temp = { LoginID: LocalID, depart_id: depart_id };
    }
    Ajax(true, mj["GetMjDepartApplyGroupList"], temp, function (data) {
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

//获取部门树
function getDepartData() {
    Ajax(true, sys["GetDepartList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        $('#depart_id').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'department'
        });
    });
};
//获取区域
function getAreaCombo() {
    Ajax(true, mj["GetMJWhereGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        var temp = { 'address_group_id': '', 'address_group': '全部' };
        data.Data.push(temp);
        $('#tool_area').combobox({
            data: data.Data,
            valueField: 'address_group_id',
            textField: 'address_group',
            onSelect: function (value) {
                if (value != null) {
                    getDepartDoor(depart_id);
                }
            }
        });
    });
}
//获取门
function getDoorCombo() {
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
}
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
    });
}

//获取所有树数据
function loadTreeData() {
    Ajax(true, sys["GetAllDepartTree"], { LoginID: LocalID }, function (data) {
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
    $('#group_name').combobox('setValue', '');
};

//加载数据
function loadDataToWin(rowData) {
    $('#door_id').combobox('setValue', rowData.door_id);
    $('#group_name').combobox('setValue', rowData.group_name);
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
        if ($("#group_name").combobox("getValue").trim() == '') {
            $.messager.alert("提示", "<p class='infoReport'>应用群组名不能为空</p>", "error");
            return;
        }
        var door_id = $("#door_id").combobox("getValue");
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

        result = true;
        var allData = $("#group_name").combobox("getData");   //获取combobox所有数据
        for (i = 0; i < allData.length; i++) {
            if (group_name == allData[i]["id"]) {
                result = false;
                break;
            }
        }
        if (result) {
            $.messager.alert("提示", "<p class='infoReport'>应用群组名选择错误</p>", "error");
            return;
        }

        var dataTemp = {
            LoginID: LocalID,
            door_id: door_id,
            depart_id: depart_id,
            apply_group: group_name
        };
        //新增
        if (id == null) {
            Ajax(true, mj["NewMjDepartApplyGroup"], dataTemp, function (data) {
                if (!data.Success) {
                    $.messager.alert("提示", "<p class='infoReport'>已有该权限,请勿重复增加</p>", "error");
                    return;
                }
                $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加权限</p>", function (r) {
                    if (r) {
                        clearForm();
                        getDepartDoor(depart_id);
                    } else {
                        $('#win').window('close');
                        getDepartDoor(depart_id);
                    }
                });
            });    //修改
        } else if (id == 1) {
            Ajax(true, mj["UpdateMjDepartApplyGroup"], dataTemp, function (data) {
                if (!data.Success) {
                    $.messager.alert("提示", "<p class='infoReport'>" + data.Message + "</p>", "error");
                    return;
                }
                getDepartDoor(depart_id);
                $.messager.alert("提示", "<p class='infoReport'>" + "修改成功" + "</p>", "info");
            });    //修改
        } else {
            $.messager.alert("提示", "<p class='infoReport'>查看状态下不能修改</p>", "info");
            $('#win').window('close');
        }
    });
};

$(function () {
    initializeTree();
    initializeGrid();
    getDepartData();
    loadTreeData();
    getAreaCombo();
    getDoorCombo();
    getApplyGroup();
    initializeEvent();
    XCommon.IniMM();
    $('#win').window('close');
});