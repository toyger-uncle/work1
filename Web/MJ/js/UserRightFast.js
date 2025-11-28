var LocalID = $.cookie("LocalID");
//实例树
var iniDepTree = function () {
    $("#tDep").tree({
        checkbox: true,
        animate: true, //动画效果
        lines: true,
        onSelect: function (node) {

            //添加clickState属性
            node.attributes["clickState"] = "1";
            if (node.attributes && node.attributes.kind && node.attributes.kind == "D") {
                var target = node.children || undefined;
                if (target && target.length && target.length != 0) {
                    for (var i = 0; i < target.length; i++) {
                        if (target[i].attributes.kind == "U") {
                            $('#tDep').tree('toggle', node.target);
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
                    $('#tDep').tree('append', {
                        parent: node.target,
                        data: JSON2.parse(data.Data)
                    });
                    $('#tDep').tree('toggle', node.target);
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
                $('#tDep').tree('append', {
                    parent: node.target,
                    data: JSON2.parse(data.Data)
                });
            });
        }
    });
};

//有线树
var iniYXTree = function () {
    $("#tYX").tree({
        checkbox: true,
        animate: true, //动画效果
        onSelect: function (node) {
            if (node.attributes && node.attributes.kind && node.attributes.kind == "A") {
                $('#tYX').tree('toggle', node.target);
            }
        }
    });
};

//实例树
var iniWXTree = function () {
    $("#tWX").tree({
        checkbox: true,
        animate: true //动画效果
    });
};

//获取所有部门树数据
function loadDepData() {
    Ajax(true, global.sys.GetAllDepartTree, { LoginID: LocalID, iconCls: 'icon-tool', state: 'closed' }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var jsondata = { "total": 0, "rows": [] };
        jsondata.total = data.Data.length;
        jsondata.rows = JSON2.parse(data.Data);

        var treeDep = $('#tDep');
        treeDep.tree('loadData', jsondata.rows);
        //        if (data.Data.length > 0) {
        //            if (treeDep.tree('getSelected') == null) {
        //                var root = treeDep.tree("getRoot");
        //                if (root != null) {
        //                    treeDep.tree('select', root.target);
        //                }
        //            }
        //        }
    });
};

//获取有线门树数据
function loadYXdata() {
    Ajax(true, mj["GetAllWhereDoorTree"], { LoginID: LocalID, iconUls: 'icon-tool', iconCls: 'icon-group', state: 'closed', flag: "0" }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var jsonTreeData = { "total": 0, "rows": [] };
        jsonTreeData.total = data.Data.length;
        jsonTreeData.rows = JSON2.parse(data.Data);

        var tree = $('#tYX');
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

//获取应用群组   
function getApplyGroup() {
    Ajax(true, mj["GetMjRightGroupList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        var temp = { id: '', name: '无' };
        data.Data.push(temp);
        $('#tool_area').combobox({
            data: data.Data,
            valueField: 'id',
            textField: 'name'
        });
    });
};

//重置按钮
var toolResetClick = function () {
    var depSelected = $('#tDep').tree("getChecked", "checked");
    if (depSelected) {
        for (var i in depSelected) {
            $('#tDep').tree("uncheck", depSelected[i].target);
        }
    }
    var YXSelected = $('#tYX').tree("getChecked", "checked");
    if (YXSelected) {
        for (var o in YXSelected) {
            $('#tYX').tree("uncheck", YXSelected[o].target);
        }
    }
    //重置群组名
    var dQZ = $('#tool_area').combobox('getValue');
    if (dQZ) {
        $('#tool_area').combobox('unselect', dQZ);
    };
    //重置管制
    var apb = $('#apb').combobox('getValue');
    if (apb) {
        $('#apb').combobox('unselect', apb);
    };
};

//增加按钮
var toolAddClick = function () {
    var depSelected = $('#tDep').tree("getChecked", "checked");
    if (depSelected.length == 0) {
        $.messager.alert("提示", "<p class='infoReport'>人员未选择</p>", "error");
        return;
    };
    var YXSelected = $('#tYX').tree("getChecked", "checked");
    if (YXSelected.length == 0) {
        $.messager.alert("提示", "<p class='infoReport'>权限未选择</p>", "error");
        return;
    };
    var dQZ = $('#tool_area').combobox('getValue');
    var apb = $('#apb').combobox('getValue');
    if (!apb) {
        apb = "0";
    }
    if (apb != "1" && apb != "0") {
        $.messager.alert("提示", "<p class='infoReport'>门层次选择错误</p>", "error");
        return;
    }
    //为了避免选择数据太大.设定上限为10000.两项选中的乘积.人员选择上限1000
    //    var depCount = depSelected.length || 0;
    //    var yxCount = YXSelected.length || 0;

    //    var UpperLimit = parseInt(depCount) * parseInt(yxCount);
    //    if (parseInt(depCount) > 1000) {
    //        $.messager.alert("提示", "<p class='infoReport'>人员选择项过多</p>", "error");
    //        return;
    //    }
    //    if (UpperLimit > 10000) {
    //        $.messager.alert("提示", "<p class='infoReport'>选择项过多</p>", "error");
    //        return;
    //    }
    var dep = "";
    var deps = "";
    for (var i in depSelected) {
        if (depSelected[i].attributes.kind == "U") {
            deps += depSelected[i].id + "|";
        }
        if (!depSelected[i].attributes.clickState) {
            if (depSelected[i].attributes.kind == "D") {
                dep += depSelected[i].id + "|";
            }
        }
    }
    dep = dep.substring(0, dep.length - 1);
    deps = deps.substring(0, deps.length - 1);
    var YXs = "";
    for (var i in YXSelected) {
        if (YXSelected[i].attributes.kind == "D") {
            YXs += YXSelected[i].id + "|";
        }
    }
    if (YXs.length != 0) {
        YXs = YXs.slice(0, YXs.length - 1);
    } else {
        $.messager.alert("提示", "<p class='infoReport'>该区域下无门</p>", "error");
        return;
    }
    var data = {
        LoginID: LocalID,
        user_file: deps,
        door_id: YXs,
        depart_id: dep,
        apply_group: dQZ,
        apb: apb
    };
    XCommon.ShowWaiting("执行中,请稍候");
    Ajax(true, mj["QuickSetMjUserDoor"], data, function (data) {
        XCommon.ClosWating();
        if (!data.Success) {
            $.messager.alert("提示", "<p class='infoReport'>已有该权限,请勿重复增加</p>", "info");
            return;
        }
        $.messager.alert('提示', "<p class='infoReport'>保存成功</p>", "info");
        toolResetClick();
    });
};

$(function () {
    iniDepTree();
    loadDepData();
    iniYXTree();
    loadYXdata();
    getApplyGroup();
    XCommon.IniMM();
})
