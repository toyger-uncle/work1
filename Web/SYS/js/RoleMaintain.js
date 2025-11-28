var iniEvent = function () {
    $("#search").click(function () {
        PageNum = 1;
        var p = datatable.datagrid('getPager');
        p.pagination('select', 1);
        loaddata();
    });
    $("#close").click(function () {
        $('#win').window('close');
    });
    $("#save").click(function () {
        if ($("#rolename").val() == "") {
            $.messager.alert("提示", "<p class='infoReport'>角色名不能为空</p>", "error");
            return;
        }
        if ($("#level").numberbox('getValue') == "") {
            $.messager.alert("提示", "<p class='infoReport'>等级不能为空</p>", "error");
            return;
        }
        if ($("#level").numberbox('getValue') >= leval) {
            $.messager.alert("提示", "<p class='infoReport'>输入等级不能超过自身等级</p>", "error");
            return;
        }
        if (isNaN($("#level").numberbox('getValue'))) {
            $.messager.alert("提示", "<p class='infoReport'>角色等级请输入数字</p>", "error");
            return;
        }
        //取值

        var rolename = $("#rolename").val();
        var level = $("#level").numberbox('getValue')

        //建立数据
        var dataTemp = {
            LoginID: LocalID,
            rolename: rolename,
            level: level,
            id: id
        };

        //新增
        if (id === null) {
            delete dataTemp.id;
            Ajax(true, sys["NewPZUserRole"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>保存成功</p>", "info");
                $('#win').window('close');
                loaddata();
            });    //修改
        } else if (id) {
            Ajax(true, sys["UpdatePZUserRole"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>修改成功</p>", "info");
                $('#win').window('close');
                loaddata();
            });
        }
        else {
            $.messager.alert("提示", "<p class='infoReport'>查看状态下不保存数据</p>", "info");
            $('#win').window('close');
        }
    });
}
//获取角色等级
function getLeavel() {
    Ajax(true, sys["GetUserLevel"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            $('#rolename').select();
            return;
        }
        leval = data.Data;
        $('#leval').numberbox.max = parseInt(leval);
    });
}
function loaddata() {
    datatable.datagrid('unselectAll');
    var rolename = $('#rolename1').val();
    var dataTemp;
    if (rolename != '' && rolename != undefined && typeof (rolename) == 'string') {
        dataTemp = { LoginID: LocalID, rolename: rolename };
    } else {
        dataTemp = { LoginID: LocalID };
    }
    Ajax(true, sys["GetPZUserRoleList"], dataTemp, function (data) {
        if (!data.Success) {
            alert(data.Message);
            $('#rolename').select();
            return;
        }
        jsondata.total = data.Ex;
        jsondata.rows = data.Data;
        datatable.datagrid('loadData', jsondata);
        var pager = $("#dg").datagrid("getPager");
        pager.pagination({
            total: jsondata.total,
            onSelectPage: function (pageNo, pageSize) {
                var start = (pageNo - 1) * pageSize;
                var end = start + pageSize;
                $("#dg").datagrid("loadData", jsondata.rows.slice(start, end));
                pager.pagination('refresh', {
                    total: jsondata.total,
                    pageNumber: pageNo
                });
            }
        });
        pager.pagination('select');
    });
}
//加载数据
function loadDataToWin(rowData) {
    $('#rolename').val(rowData.rolename);
    $('#level').numberbox('setValue', rowData.level);
}


//清空旧数据
function clearForm() {
    $('#rolename').val('');
    $('#level').numberbox('setValue', '');
}
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
}
//初始化表格
function iniGrid() {
    datatable = $("#dg").datagrid({
        idField: "id",
        pagination: true, //显示分页
        pageSize: 10, //分页大小
        pageList: [10, 20, 50, 100], //每页的个数
        //fit: true, //自动补全
        fitColumns: true,
        striped: true,
        iconCls: "icon-search", //图标
        title: "角色信息",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        columns: [[{
            field: 'rolename',
            title: '角色名',
            //sortable: true,
            width: 100,
            align: 'center'
        }, {
            field: 'level',
            title: '角色等级',
            //sortable: true,
            width: 100,
            align: 'center'

        }]],
        toolbar: [
             {
                 text: "修改", iconCls: "icon-edit", handler: function () {
                     var rowData = datatable.datagrid('getSelected');
                     if (rowData == null) {
                         $.messager.alert("提示", "未选择项", "error");
                         return;
                     }
                     $('#win').window({
                         title: '修改信息',
                         iconCls: 'icon-edit',
                         maximizable: false,
                         minimizable: false
                     });
                     //////////
                     $('#win').window('open');
                     //添加数据
                     id = rowData.id; ;
                     clearForm();
                     loadDataToWin(rowData);

                 }
             },
             {
                 text: "增加", id: 'barAdd', iconCls: "icon-add", handler: function () {
                     $('#win').window({
                         title: '新增人员',
                         iconCls: 'icon-add',
                         maximizable: false,
                         minimizable: false
                     });
                     var rowData = datatable.datagrid('getSelected');
                     ///////////
                     $('#win').window('open');

                     //父部门
                     clearForm();
                     $('#level').numberbox('setValue', parseInt(leval) - 1);
                     id = null;
                 }
             },
              {
                  text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
                      var rowData = datatable.datagrid('getSelected');
                      if (rowData == null) {
                          $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                          return;
                      }
                      id = rowData.id;
                      $.messager.confirm("提示", "<p class='infoReport'>确定删除选中项数据</p>", function (data) {
                          if (data) {
                              Ajax(true, sys["RemovePZUserRole"], { LoginID: LocalID, id: id }, function (data) {
                                  if (!data.Success) {
                                      alert(data.Message);
                                      return;
                                  }
                                  $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                                  loaddata();
                              });
                          }
                      });
                  }
              }
                ],
        //排列行
        onDblClickCell: function (rowIndex, field, value) {
            var rowData = datatable.datagrid('getSelected');
            if (rowData == null) {
                $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                return;
            }
            $('#win').window({
                title: '修改角色',
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