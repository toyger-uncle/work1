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
        Ajax(true, global.pk["GetPKLogRecordMaxID"], { LoginID: LocalID
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
            title: "实时收费记录",
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
		{ field: 'oper_name', title: "操作员", width: 100, align: "center" },
		{ field: 'what_do', title: '类别', width: 100, align: "center" },
        { field: 'case_cardno', title: '卡号/车牌号', width: 100, align: "center" },
          { field: 'picture_in', title: '进场图片', width: 100, align: "center", formatter: getImgIn },
         { field: 'picture_out', title: '出厂图片', width: 100, align: "center", formatter: getImgOut },
		{ field: 'user_name', title: '用户姓名', width: 100, align: "center" },
        { field: 'kind_name', title: '用户类别', width: 100, align: "center" },
        { field: 'event_date', title: '操作日期', width: 100, align: "center" },
        { field: 'begin_date', title: '进场时间', width: 100, align: "center" },
		{ field: 'end_date', title: '出场时间', width: 100, align: "center" },
        { field: 'ys_money', title: '应收金额', width: 100, align: "center" },
        { field: 'case_money', title: '实收金额', width: 100, align: "center" },
          { field: 'pk_time', title: '停车时间', width: 100, align: "center" },
        { field: 'in_door', title: '进通道', width: 100, align: "center" },
         { field: 'out_door', title: '出通道', width: 100, align: "center" }
        ]]
        });
    },

    //获取所有数据
     loaddata = function () {
         if (maxId < 0) {
             return;
         }
         Ajax(true, global.pk["GetPKLogRecordPageList"], { LoginID: LocalID, id: maxId, sortName: 'id', sortOrder: true, pageSize: 20, pageNum: 1
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

    //获取进入图片
     getImgIn = function (value, row) {
         var tempImg = row.picture_in || undefined;
         if (!tempImg) { return "无图片" }
         var img = "<a href='";
         var strEnd = "'>进入图片</a>";
         img = img + tempImg + strEnd;
         return img;
     },

    //获取离开图片
     getImgOut = function (value, row) {
         var tempImg = row.picture_out || undefined;
         if (!tempImg) { return "无图片" }
         var img = "<a href='";
         var strEnd = "'>离开图片</a>";
         img = img + tempImg + strEnd;
         return img;
     };

    $(function () {

        //隐藏提示
        document.getElementById('jscheck').style.display = 'none';
        iniGrid();
        getMaxId();
        setInterval(loaddata, 10000);
    })
} ();