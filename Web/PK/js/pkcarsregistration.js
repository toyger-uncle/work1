//注册事件
var iniEvent = function () {
    $("#search").click(function () {
        var p = datatable.datagrid('getPager');
        p.pagination('select', 1);
        loaddata();
    });

    $("#close").click(function () {
        $('#win').window('close');

    });
    $("#save").click(function () {
        if ($("#user_kind").val() == "") {
            $.messager.alert("提示", "<p class='infoReport'>用户种类不能为空</p>", "error");
            return;
        }
        if ($("#dhfl").numberbox('getValue') == "") {
            $.messager.alert("提示", "<p class='infoReport'>搭伙费率不能为空</p>", "error");
            return;
        } else if ($("#dhfl").numberbox('getValue') > 100) {
            $.messager.alert("提示", "<p class='infoReport'>搭伙费率不能超过100</p>", "error");
            return;
        }
        if ($("#card_price").numberbox('getValue') == "") {
            $.messager.alert("提示", "<p class='infoReport'>卡成本不能为空</p>", "error");
            return;
        }
        //取值

        if ($("#recycard_price").numberbox('getValue') == "") {
            $.messager.alert("提示", "<p class='infoReport'>回收成本不能为空</p>", "error");
            return;
        }
        var user_kind = $("#user_kind").val();
        var dhfl = $("#dhfl").numberbox('getValue');
        var card_price = $("#card_price").numberbox('getValue');
        var recycard_price = $("#recycard_price").numberbox('getValue');
        //建立数据
        var dataTemp = {
            LoginID: LocalID,
            user_kind: user_kind,
            dhfl: dhfl,
            id: id,
            card_price: card_price,
            recycard_price: recycard_price
        };

        //新增
        if (id === null) {
            delete dataTemp.id;
            Ajax(true, sys["NewUserKind"], dataTemp, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                $.messager.alert("提示", "<p class='infoReport'>保存成功</p>", "info");
                $('#win').window('close');
                loaddata();
            });    //修改
        } else if (id) {
            Ajax(true, sys["UpdateUserKind"], dataTemp, function (data) {
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

};

function loaddata() {
    datatable.datagrid('unselectAll');
    var temp = $('#user_kind1').val();
    var dataTemp;
    if (temp != '' && temp != undefined && typeof (temp) == 'string') {
        dataTemp = { LoginID: LocalID, user_kind: temp };
    } else {
        dataTemp = { LoginID: LocalID };
    }
    Ajax(true, sys["GetUserKindList"], dataTemp, function (data) {
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
    $('#user_kind').val(rowData.user_kind);
    $('#dhfl').numberbox('setValue', rowData.dhfl);
    $('#card_price').numberbox('setValue', rowData.card_price);
    $('#recycard_price').numberbox('setValue', rowData.recycard_price);
}


//清空旧数据
function clearForm() {
    $('#user_kind').val('');
    $('#dhfl').numberbox('setValue', '');
    $('#card_price').numberbox('setValue', '');
    $("#recycard_price").numberbox('setValue', '');
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
        title: "用户类别",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        //                sortName: sortName,
        //                sortOrder: sortOrder,
        columns: [[{
            field: 'user_kind',
            title: '用户类别',
            //sortable: true,
            width: 100,
            align: 'center'
        }, {
            field: 'dhfl',
            title: '姓名',
            //sortable: true,
            width: 100,
            align: 'center'

        },
                {
                    field: 'card_price',
                    title: '卡号（车牌号）',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }, {
                    field: 'card_price',
                    title: '卡有效期',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }, {
                    field: 'card_price',
                    title: '卡余额',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }, {
                    field: 'card_price',
                    title: '进出时间',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }, {
                    field: 'card_price',
                    title: '进出通道',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                },
                {
                    field: 'recycard_price',
                    title: '进出状况',
                    //sortable: true,
                    width: 100,
                    align: 'center'
                }
                ]],
        toolbar: [
             {
                 text: "修改", iconCls: "icon-edit", handler: function () {
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
                     clearForm();
                     var rowData = datatable.datagrid('getSelected');
                     $('#win').window('open');
                     //父部门
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
                          if (data) {                                               //传递参数注意
                              Ajax(true, sys["RemoveUserKind"], { LoginID: LocalID, id: id }, function (data) {
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
        //双击排列
        onDblClickCell: function (rowIndex, field, value) {
            var rowData = datatable.datagrid('getSelected');
            if (rowData == null) {
                $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                return;
            }
            $('#win').window({
                title: '修改类别',
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