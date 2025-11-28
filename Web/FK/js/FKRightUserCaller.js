var LocalID = $.cookie("LocalID");
var tree;
var datatable;
var jsondata = { "total": 0, "rows": [] };
var jsonright = { "total": 0, "rows": [] };

var treeEvent = function (node) {
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

var iniTree = function () {
    tree = $("#tt").tree({
        animate: true,
        checkbox: false,
        onSelect: function (node) {
            if (node.attributes.kind == "U") {
                loadright();
            }
            else if (node.attributes && node.attributes.kind && node.attributes.kind == "D") {
                $('div.datagrid-toolbar a').eq(0).hide();
                $('div.datagrid-toolbar a').eq(1).hide();
                jsondata = { "total": 0, "rows": [] };
                treeEvent(node);
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
    datatable = $("#tb").datagrid({
        idField: "group_id",
        fitColumns: true,
        striped: true,
        iconCls: "icon-save", //图标
        title: "门列表",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        columns: [[{
            field: 'right_id',
            title: '编号',
            align: 'center',
            width: 100
        }, {
            field: 'door_name',
            title: '门',
            align: 'center',
            width: 100
        }]],
        toolbar: [{
            text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
                var rowData = datatable.datagrid('getSelected');
                if (rowData == null) {
                    $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                    return;
                }
                var node = tree.tree('getSelected');
                if (node.attributes.kind != "U" || !node) {
                    $.messager.alert("提示", "<p class='infoReport'>未选择人员</p>", "error");
                    return;
                }
                var rightid = rowData.door_id;
                var userid = node.id;
                $.messager.confirm("提示", "<p class='infoReport'>确定删除选中项数据</p>", function (data) {
                    if (data) {
                        Ajax(true, fk["RemoveFkKmRight"], { LoginID: LocalID, user_file: userid, door_id: rightid }, function (data) {
                            if (!data.Success) {
                                alert(data.Message);
                                return;
                            }
                            $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                            loadright();
                        });
                    }
                });
            }
        }, {
            text: "增加", id: 'barAdd', iconCls: "icon-add", handler: function () {
                var node = tree.tree('getSelected');
                if (!node) {
                    $.messager.alert("提示", "<p class='infoReport'>未选择人员</p>", "error");
                    return;
                }
                if (node.attributes.kind != "U" || !node) {
                    $.messager.alert("提示", "<p class='infoReport'>未选择人员</p>", "error");
                    return;
                }
                $('#win').window({
                    title: '新增权限',
                    iconCls: 'icon-add',
                    maximizable: false,
                    minimizable: false
                });
                $('#select').combobox("setValue", '');
                $('#win').window('open');
            }
        }]
    });
};

var iniEvent = function () {
    $("#close").click(function () {
        $('#win').window('close');
    });
    $("#save").click(function () {
        if ($("#select").combobox("getValue") == "") {
            $.messager.alert("提示", "<p class='infoReport'>权限名不能为空</p>", "error");
            return;
        }
        var rightid = $("#select").combobox("getValue");
        var node = tree.tree('getSelected');
        if (!node) {
            $.messager.alert("提示", "<p class='infoReport'>未选择人员</p>", "error");
            return;
        }
        var userid = node.id;
        Ajax(true, fk["NewFkKmRight"], { LoginID: LocalID, user_file: userid, door_id: rightid }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            $.messager.confirm("提示", "<p class='infoReport'>保存成功，是否继续添加</p>", function (data) {
                if (!data) {
                    $('#win').window('close');
                } else {
                    $('#select').combobox("setValue", '');
                }
            });
            loadright();
        });
    });
};

//获取所有门的数据
var loadDoor = function () {
    Ajax(true, mj["GetMJControlDoorList"], { LoginID: LocalID,flag:"0" }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#select').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'door_name'
        });
    });
};

function loaddata() {
    Ajax(true, global.sys.GetAllDepartTree, { LoginID: LocalID, iconCls: 'icon-tool', state: 'closed' }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsondata.total = data.Data.length;
        jsondata.rows = JSON2.parse(data.Data);
        tree.tree('loadData', jsondata.rows);
        if (data.Data.length > 0) {
            if (tree.tree('getSelected') == null) {
                var root = tree.tree("getRoot");
                tree.tree('select', root.target);
            }
        }
    });
}

function loadright() {
    datatable.datagrid('unselectAll');
    var node = tree.tree('getSelected');
    XCommon.ShowWaiting("查询中,请稍候");
    Ajax(true, fk["GetFkKmRightList"], { LoginID: LocalID, user_file: node.id }, function (data) {
        XCommon.ClosWating();
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsonright.total = data.Data.length;
        jsonright.rows = data.Data;
        datatable.datagrid('loadData', jsonright);
        if (data.Data.length > 0) {
            $('div.datagrid-toolbar a').eq(0).show();
            $('div.datagrid-toolbar a').eq(1).show();
        }
        else {
            $('div.datagrid-toolbar a').eq(0).hide();
            $('div.datagrid-toolbar a').eq(1).show();
        }
    });
}

$(function () {
    iniTree();
    iniEvent();
    loadDoor();
    XCommon.IniMM();
    $('#win').window('close');
    $('div.datagrid-toolbar a').eq(0).hide();
    $('div.datagrid-toolbar a').eq(1).hide();
    loaddata();
});