var iniTree = function () {
    tree = $('#tt').tree({
        onSelect: function (node) {
            if (node.attributes.kind == "A") {
                nowDoor = "";
                nowAddr = node.id;
                loaddata(nowDoor, node.id);
                //如果为区域
            } else if (node.attributes.kind == "D") {
                //如果为门
                nowDoor = node.id;
                loaddata(nowDoor);
            }
        }
    });
};
var iniEvent = function () {
    $("#close").click(function () {
        $('#win').window('close');
    });
    $("#save").click(function () {
        if ($("#door_id").combobox("getValue") == "") {
            $.messager.alert("提示", "<p class='infoReport'>门名不能为空</p>", "error");
            return;
        }
        if ($("#week_num").combobox("getValue") == "") {
            $.messager.alert("提示", "<p class='infoReport'>时间不能为空</p>", "error");
            return;
        }
        if ($('#ck_time').combobox('getValue') == '') {
            $.messager.alert("提示", "<p class='infoReport'>常开时段不能为空</p>", "error");
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
            $.messager.alert("提示", "<p class='infoReport'>门选择错误</p>", "error");
            return;
        }
        //取值
        var week_num = $("#week_num").combobox("getValue");
        result = true;
        allData = $("#week_num").combobox("getData");   //获取combobox所有数据
        for (var i = 0; i < allData.length; i++) {
            if (week_num == allData[i]["value"]) {
                result = false;
                break;
            }
        }
        if (result) {
            $.messager.alert("提示", "<p class='infoReport'>星期选择错误</p>", "error");
            return;
        }
        //取值
        var ck_time = $("#ck_time").combobox("getValue");
        result = true;
        allData = $("#ck_time").combobox("getData");   //获取combobox所有数据
        for (var i = 0; i < allData.length; i++) {
            if (ck_time == allData[i]["id"]) {
                result = false;
                break;
            }
        }
        if (result) {
            $.messager.alert("提示", "<p class='infoReport'>常开时段选择错误</p>", "error");
            return;
        }

        var dataTemp = {
            LoginID: LocalID,
            id: id,
            door_id: door_id,
            week_num: week_num,
            ck_time: ck_time
        };
        //新增
        if (id === null) {
            delete dataTemp.id;
            Ajax(true, mj["NewMjDoorCk"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                if (nowDoor) {
                    loaddata(nowDoor, '');
                } else if (nowAddr) {
                    loaddata('', nowAddr);
                }
                $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续添加</p>", function (r) {
                    if (r) {
                        $('#week_num').combobox('setValue', '');
                        $('#ck_time').combobox('setValue', '');
                    } else {
                        clearForm();
                        $('#win').window('close');
                    }
                });
            });
            //修改
        } else if (id) {
            Ajax(true, mj["UpdateMjDoorCk"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                if (nowDoor) {
                    loaddata(nowDoor, '');
                } else if (nowAddr) {
                    loaddata('', nowAddr);
                }
                clearForm();
                $.messager.alert("提示", "<p class='infoReport'>修改成功</p>", "info");
                $('#win').window('close');

            });
        }
        else {
            $.messager.alert("提示", "<p class='infoReport'>查看状态下不保存数据</p>", "info");
            $('#win').window('close');
        }
    });
};

//加载时段数据到cbo
var loadCboSD = function () {
    Ajax(true, mj["GetMjTimeGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#ck_time').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'name'
        });
    });
};
//获取所有的门数据
function loadTreedata() {
    Ajax(true, mj["GetAllWhereDoorTree"], { LoginID: LocalID, iconUls: 'icon-tool', iconCls: 'icon-group', state: 'closed' }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsonTreeData.total = data.Data.length;
        jsonTreeData.rows = JSON2.parse(data.Data);
        tree.tree('loadData', jsonTreeData.rows);
        if (data.Data.length > 0) {
            if (tree.tree('getSelected') == null) {
                var root = tree.tree("getRoot");
                if (root != null) {
                    tree.tree('select', root.target);
                }
            }
        }
    });
}
//获取所有数据     
function loaddata(door_id, address_group_id) {
    datatable.datagrid('unselectAll');
    var dataTemp = { LoginID: LocalID, door_id: door_id, address_group_id: address_group_id };
    if (!door_id) {
        delete dataTemp.door_id;
    } else if (!address_group_id) {
        delete dataTemp.address_group_id;
    }
    XCommon.ShowWaiting("查询中,请稍候");
    Ajax(true, mj["GetMjDoorCkList"], dataTemp, function (data) {
        XCommon.ClosWating();
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsondata.total = data.Ex;
        jsondata.rows = data.Data;
        datatable.datagrid('loadData', jsondata);
    });
};
//加载数据
function loadDataToWin(rowData) {
    $('#door_id').combobox('setValue', rowData.door_id);
    $('#week_num').combobox('setValue', rowData.week_num);
    $('#ck_time').combobox('setValue', rowData.ck_time);
};
//清空旧数据
function clearForm() {
    $('#door_id').combobox('setValue', '');
    $('#week_num').combobox('setValue', '');
    $('#ck_time').combobox('setValue', '');
};
function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function myformatterx(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate() - 1;
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function getNull(data) {
    if (data == '') {
        return null;
    } else {
        return data;
    }
};
//初始化表格
function iniGrid() {
    datatable = $("#dg").datagrid({
        idField: "id",
        //fit: true, //自动补全  
        fitColumns: true,
        striped: true,
        iconCls: "icon-search", //图标  
        title: "常开信息",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        //                sortName: sortName,
        //                sortOrder: sortOrder,
        columns: [[{
            field: 'door_name',
            title: '门名',
            //sortable: true,
            width: 400,
            align: 'center'
        }, {
            field: 'week_num',
            title: '星期',
            //sortable: true,
            width: 400,
            align: 'center',
            formatter: function (value, row, index) {
                if (row.week_num == 1) {
                    return '星期一';
                } else if (row.week_num == 2) {
                    return '星期二';
                } else if (row.week_num == 3) {
                    return '星期三';
                } else if (row.week_num == 4) {
                    return '星期四';
                } else if (row.week_num == 5) {
                    return '星期五';
                } else if (row.week_num == 6) {
                    return '星期六';
                } else if (row.week_num == 7) {
                    return '星期日';
                } else {
                    return '未知错误';
                }
            }
        }, {
            field: 'time_name',
            title: '常开时段',
            //sortable: true,
            width: 400,
            align: 'center'
        }]],
        toolbar: [
             {
                 text: "修改", id: 'barUpdate', iconCls: "icon-edit", handler: function () {
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
                     getDoorData(rowData);
                     //////////
                     $('#win').window('open');
                     //添加数据
                     id = rowData.id;
                     clearForm();

                 }
             },
                   { text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
                       var rowData = datatable.datagrid('getSelected');
                       if (rowData == null) {
                           $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                           return;
                       }
                       var id = rowData.id;
                       $.messager.confirm("提示", "<p class='infoReport'>确定删除选中项数据</p>", function (data) {
                           if (data) {                                               //传递参数注意
                               Ajax(true, mj["RemoveMjDoorCk"], { LoginID: LocalID, id: id }, function (data) {
                                   if (!data.Success) {
                                       alert(data.Message);
                                       return;
                                   }
                                   if (nowDoor) {
                                       loaddata(nowDoor, '');
                                   } else if (nowAddr) {
                                       loaddata('', nowAddr);
                                   }
                                   $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                               });
                           }
                       });
                   }
                   },
             {
                 text: "增加", id: 'barAdd', iconCls: "icon-add", handler: function () {
                     $('#win').window({
                         title: '新增项',
                         iconCls: 'icon-add',
                         maximizable: false,
                         minimizable: false
                     });
                     getDoorData();
                     clearForm();
                     id = null;
                     //                     if (nowDoor) {
                     //                         $('#door_id').combobox('setValue', nowDoor);
                     //                     }
                     $('#win').window('open');
                 }
             }],
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
            id = rowData.id;
            //添加数据
            clearForm();
            loadDataToWin(rowData);
        }
    });
}
var getDoorData = function (rowData) {
    Ajax(true, mj["GetMJControlDoorList"], { LoginID: LocalID, address_group_id: nowAddr, flag: "0" }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        $('#door_id').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'door_name'
        });
        if (nowDoor) {
            $('#door_id').combobox('setValue', nowDoor);
        }
        if (rowData) {
            loadDataToWin(rowData);
        }
    });
}
