var doPKRecordInOutRealTime = (!document.getElementById) ? null : function () {
    var LocalID = $.cookie("LocalID"),
    jsondata = { "total": 0, "rows": [] },
    datatable,
    rool,
    maxId = -1,
    id = -1,

    //table最大索引
    index = -1,
    getMaxId = function () {
        Ajax(true, global.pk["GetEventRecorderPkMaxID"], { LoginID: LocalID
        }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            maxId = data.Data;
            loaddata();
        });
    },

    //初始化表格
    iniGrid = function () {
        datatable = $("#tbInfo").datagrid({
            idField: "id",
            title: "实时进出记录",
            fit: true, //自动补全
            rownumbers: true,
            singleSelect: true,
            fitColumns: true,
            striped: true,
            pagination: false,
            collapsible: false,
            iconCls: 'icon-search',
            pageList: [10, 20, 50],
            columns: [[
            { field: 'user_name', title: '用户姓名', width: 100, align: "center" },
        { field: 'user_kind', title: '用户类型', width: 100, align: "center" },
		{ field: 'event_cardid', title: "卡号/车牌号", width: 100, align: "center" },
        { field: 'door_name', title: '进出通道', width: 100, align: "center" },
		{ field: 'event_date', title: '进出时间', width: 100, align: "center" },
        { field: 'flag', title: '状态', width: 100, align: "center", formatter: getFlag },
        { field: 'left_carnum', title: '车位数', width: 100, align: "center" },
		{ field: 'in_out', title: '进出情况', width: 100, align: "center", formatter: getInOut }
        ]],
            onClickRow: function (rowIndex, rowData) {
                var newPhoto = "../../CarNumber/" + rowData.picture_save;
                if (!rowData.photo) {
                    //$.messager.alert("提示", "<p class='infoReport'>无图片</p>", "error");
                    return;
                };
                if ($('#info1').length) {
                    try {
                        $(".messager-body").window('close');
                    } catch (e) {
                    }
                }
                if ($('#info').length) {
                    try {
                        $(".messager-body").window('close');
                    } catch (e) {
                    }
                }
                //如果图片路径有效.则弹出图片
                if (XCommon.isHasImg(newPhoto)) {
                    var msg = "<img alt='图片显示错误' style='width:100%;height:100%;padding:0px;margin:0px;'  src='" + newPhoto + "' />";
                    $.messager.show({
                        id: 'info1',
                        title: '图片',
                        width: 260,
                        height: 180,
                        msg: msg,
                        timeout: 3000,
                        showType: 'fade',
                        style: {
                            right: '',
                            bottom: '',
                            border: 0,
                            padding: 0,
                            margin: 0
                        }
                    });
                }
            },
            onDblClickRow: function (rowIndex, rowData) {
                var newPhoto = "../../CarNumber/" + rowData.picture_save;
                if (!rowData.photo) {
                    //$.messager.alert("提示", "<p class='infoReport'>无图片</p>", "error");
                    return;
                };
                if ($('#info').length) {
                    try {
                        $(".messager-body").window('close');
                    } catch (e) {
                    }
                }
                if ($('#info1').length) {
                    try {
                        $(".messager-body").window('close');
                    } catch (e) {
                    }
                }
                //如果图片路径有效.则弹出图片
                if (XCommon.isHasImg(newPhoto)) {
                    var msg = "<img alt='图片显示错误' style='width:100%;height:100%;padding:0px;margin:0px;' src='" + newPhoto + "' />";
                    $.messager.show({
                        id: 'info',
                        title: '图片',
                        width: innerWidth - 100,
                        height: innerHeight - 71,
                        msg: msg,
                        timeout: 0,
                        showType: 'fade',
                        style: {
                            right: '',
                            bottom: ''
                        }
                    });
                }
            }
        });
    },

    //获取所有数据
     loaddata = function () {
         if (maxId < 0) {
             return;
         }
         Ajax(true, global.pk["GetEventRecorderPkPageList"], { LoginID: LocalID, id: maxId, sortName: 'id', sortOrder: true, pageSize: 20, pageNum: 1
         }, function (data) {
             if (!data.Success) {
                 alert(data.Message);
                 return;
             }
             //将id值赋给最大值
             if (data.Data.length && data.Data.length != 0) {
                 for (var i = 0; i < data.Data.length; i++) {
                     if (data.Data[i].id > parseInt(maxId)) {
                         maxId = data.Data[i].id;
                     }
                     datatable.datagrid('insertRow', {
                         index: 0,
                         row: data.Data[i]
                     });
                     index++;
                 }
             }
             if (index > 49) {
                 for (var i = index; i > 49; i--) {
                     datatable.datagrid('deleteRow', i);
                     index--;
                 }
             }
         });
     },

    //获取进出
     getInOut = function (val, row) {
         var inOutTemp = row.in_out;
         if (inOutTemp == 0) {
             return "进";
         } else if (inOutTemp == 1) {
             return "出";
         } else if (inOutTemp == "") {
             return "未处理";
         } else {
             return "未定义";
         }
     },

    //获取状态
     getFlag = function (value, row) {
         var tempflag = row.flag;
         if (tempflag == "xx") {
             return '有效';
         }
         if (tempflag == "yy") {
             return '已处理';
         }
         if (tempflag == "") {
             return "未处理";
         } else {
             return '未定义';
         }
     };
    $(function () {

        //隐藏提示
        document.getElementById('jscheck').style.display = 'none';
        iniGrid();
        getMaxId();
        setInterval(loaddata, 10000);
    })
} ();