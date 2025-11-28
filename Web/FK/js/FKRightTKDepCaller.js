//梯控 人员访客权限
var iniTree = function () {
    tree = $("#tt").tree({
        animate: true,
        onSelect: function (node) {
            loadright();
        }
    });
    datatable = $("#tb").datagrid({
        idField: "right_id",
        fitColumns: true,
        striped: true,
        iconCls: "icon-save", //图标
        title: "权限组列表",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        //sortName:"id",
        //sortOrder: 'desc',
        columns: [[{
            field: 'right_id',
            title: '编号',
            align: 'center',
            //sortable: true,
            width: 100
        }, {
            field: 'group_name',
            title: '权限组',
            align: 'center',
            //sortable: true,
            width: 100
        }]],
        toolbar: [{
            text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
                var rowData = datatable.datagrid('getSelected');
                if (rowData == null) {
                    $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                    return;
                }
                $.messager.confirm("提示", "<p class='infoReport'>确定删除选中项数据</p>", function (data) {
                    if (data) {
                        var node = tree.tree('getSelected');
                        var rightid = rowData.right_id;
                        var departid = node.id;
                        Ajax(true, fk["RemoveFkTkDepartRight"], { LoginID: LocalID, depart_id: departid, right_id: rightid }, function (data) {
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
        var departid = node.id;
        var flag = "0";
        Ajax(true, fk["NewFkTkDepartRight"], { LoginID: LocalID, depart_id: departid, right_id: rightid }, function (data) {
            if (!data.Success) {
                $.messager.alert("提示", "<p class='infoReport'>保存失败，请重试</p>", "info");
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


function loaddata() {
    Ajax(true, sys["GetAllDepartTree"], { LoginID: LocalID, iconCls: 'icon-tool' }, function (data) {
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
    var node = tree.tree('getSelected');
    datatable.datagrid('unselectAll');
    XCommon.ShowWaiting("查询中,请稍候");
    Ajax(true, fk["GetFkTkDepartRightList"], { LoginID: LocalID, depart_id: node.id }, function (data) {
        XCommon.ClosWating();
        if (!data.Success) {
            alert(data.Message);
            $('#text').select();
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