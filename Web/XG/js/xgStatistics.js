var go = function () {
    var jsondata = { "total": 0, "rows": [] };
    var pageSize = 10;
    var pageNum = 1;
    var sortOrder = 'asc';
    var sortName = 'road_name';
    var LocalID = $.cookie("LocalID");
    var fileChange = false; //文件改变标识
    //初始化排列
    var iniDb = function () {
        $("#tb").datagrid({
            //排列行
            onSortColumn: function (sort, order) {
                sortName = sort;
                sortOrder = order;
                loadData();
            }
        });
    };
    var loadData = function () {
        var road_id = $('#road_id1').combobox('getValue') || '';
        if (road_id) {
            if (!XCommon.checkNum(road_id)) {
                $.messager.alert('提示', "<p class='infoReport'>线路暂不支持自定义输入</p>", 'error');
                return;
            }
        }
        var BeginTime = $('#BeginTime1').datetimebox('getValue')==""?XCommon.GetTimeFullYester():$('#BeginTime1').datetimebox('getValue');
        var EndTime = $('#EndTime1').datetimebox('getValue')==""?XCommon.GetTimeFullToday():$('#EndTime1').datetimebox('getValue');
        var window_name = $('#window_name1').combobox('getText').trim();
        var user_name = $('#user_name1').val();
        window_name == '全部' ? window_name = '' : {};
        var dataTemp = {
            LoginID: LocalID,
            road_id: road_id,
            BeginTime: BeginTime,
            EndTime: EndTime,
            window_name: window_name,
            user_name: user_name,
            pageSize: pageSize,
            pageNum: pageNum,
            sortOrder: sortOrder,
            sortName: sortName,
        };
        Ajax(true, global.xg["GetXGRoadResultStatisticsPageList"], dataTemp, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            }
            jsondata.total = data.Ex;
            jsondata.rows = data.Data;
            $('#tb').datagrid('loadData', jsondata);
            if (jsondata.total == 0) {
                pageNum = 1;
            }
            var p = $('#tb').datagrid('getPager');
            $(p).pagination({
                beforePageText: '第', //页数文本框前显示的汉字
                afterPageText: '页    共 ' + Math.ceil(jsondata.total / pageSize) + ' 页',
                displayMsg: '当前显示 ' + (pageSize * (pageNum - 1) + (jsondata.total == 0 ? 0 : 1)) + ' - ' + (pageSize * (pageNum - 1) + data.Data.length) + ' 条记录   共 ' + jsondata.total + ' 条记录',
                onSelectPage: function (pageNumber, pageSize) {
                    pageSize = pageSize;
                    pageNum = pageNumber;
                    if (pageNum < 1) {
                        pageNum = 1;
                    }
                    loadData();
                }
            });
        });
    }; 
    //重置
    var clearData = function () {
        $("#road_id1").combobox("setValue", '');
        var beTime = XCommon.GetTimeFullYester();
        var enTime = XCommon.GetTimeFullToday();
        $('#BeginTime1').datetimebox('setValue', beTime);
        $('#EndTime1').datetimebox('setValue', enTime);
        $('#window_name1').combobox('setValue', '');
        $('#user_name1').val('');
    };
    loadData();
    //加载线路
    var loadCboXX = function () {

        var dataTemp = {
            LoginID: LocalID
        };
        Ajax(true, global.xg["GetXGMngRoadList"], dataTemp, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            }
            if (data.Data) {
                var dataTemp = { id: '', road_name: '全部' };
                data.Data.push(dataTemp);
                $('#road_id1').combobox({
                    data: data.Data,
                    valueField: 'id',
                    textField: 'road_name'
                });
            }
        });
    };
    //加载巡点
    var loadCboXD = function () {
        var dataTemp = {
            LoginID: LocalID
        };
        Ajax(true, global.xg["GetXGRoadMachList"], dataTemp, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            }
            if (data.Data) {
                var dataTemp = { mach_id: '', window_name: '全部' };
                data.Data.push(dataTemp);
                $('#window_name1').combobox({
                    data: data.Data,
                    valueField: 'mach_id',
                    textField: 'window_name'
                });
            }
        });
    };

    var fileConfirmClick = function () {
        var display = $('#winExport').css('display');
        //根据display判断是导出还是导入
        var basicData = {
            'temp1': 'mach_id',
            'temp2': 'window_name',
            'temp3': 'road_name',
            'temp4': 'need_times',
            'temp5': 'normal_times',
            'temp6': 'loss_times',
            'temp7': 'error_times',
            'temp8': 'result'           
        };
        //导出数据
        if (display == 'block') {
            var myData = "|";
            //获取列数据
            var d = $("#do").find("input:checkbox");
            d.prop("checked", function (index, oldPropertyValue) {
                if (oldPropertyValue) {
                    myData += basicData["temp" + (index + 1)] + "|";
                }
            });
            myData = myData.slice(1, myData.length - 1);
            //获取查询条件
           var road_id = $('#road_id1').combobox('getValue') || '';
        if (road_id) {
            if (!XCommon.checkNum(road_id)) {
                $.messager.alert('提示', "<p class='infoReport'>线路暂不支持自定义输入</p>", 'error');
                return;
            }
        }
        var BeginTime = $('#BeginTime1').datetimebox('getValue')==""?XCommon.GetTimeFullYester():$('#BeginTime1').datetimebox('getValue');
        var EndTime = $('#EndTime1').datetimebox('getValue')==""?XCommon.GetTimeFullToday():$('#EndTime1').datetimebox('getValue');
        var window_name = $('#window_name1').combobox('getText').trim();
        var user_name = $('#user_name1').val();
        window_name == '全部' ? window_name = '' : {};
            //获取基本配置
            var kinds = $('#com').combobox('getValue');
            var yilai = $('#yilai').combobox('getValue');
            var paixu = $('#paixu').combobox('getValue');
            if (kinds == "") {
                $.messager.alert("提示", "<p class='infoReport'>未选择格式!</p>", "error");
                return;
            }
            if (myData == "") {
                $.messager.alert("提示", "<p class='infoReport'>未选择目录项!</p>", "error");
                return;
            }
            var di=$('#space').combobox('getValue');	
            XCommon.ShowWaiting("导出中,请稍候");
            var url = RTURL + global.export["ExportXGRoadResultStatisticsPageFile"] + "?LoginID=" + LocalID + "&user_name=" + user_name + "&road_id=" + road_id + "&window_name=" + window_name + "&BeginTime=" + BeginTime + "&EndTime=" + EndTime +"&di="+di+ "&columname=" + myData + "&exporttype=" + kinds + "&sortName=" + yilai + "&sortOrder=" + (paixu == "asc" ? false : true) + "&pageSize=" + "100000" + "&pageNum=" + "1";
            XCommon.ClosWating();
            window.open(url);
             $('#winFile').window('close');
        } else {
            //导入   
            if (fileChange) {
                XCommon.ShowWaiting("导入中,请稍候");
                ajaxFileUpload(global.sys["ImportUserFile"], { LoginID: LocalID }, "import", function (data, status) {
                    XCommon.ClosWating();
                    if (!data.Success) {
                        alert(data.Message);
                        return;
                    }
                    $.messager.alert("提示", "<p class='infoReport'>文件上传成功</p>", "info");
                    fileChange = false;
                    iniFileUpload();
                     $('#winFile').window('close');
                });
            } else {
                $.messager.alert("提示", "<p class='infoReport'>请选择上传文件</p>", "info");
            }
        };
    };

  var allClick=function(){
  $("#all").change(function () {
			if ($("#all").prop("checked")) {
				var d = $("#do").find("input:checkbox");
				d.prop("checked", true);
			}else {
				var d = $("#do").find("input:checkbox");
				d.prop("checked", false);
			}
            clkdada();
		});
   $("#notAll").change(function () {     
				var d = $("#do").find("input:checkbox");
				d.prop("checked", function(index, oldPropertyValue){
				if(oldPropertyValue){
				d[index].checked=false;
				}else{
				  d[index].checked=true;
				}               
				});
                 clkdada();
				});
};

 var fileKindChange = function () {
    $('#com').combobox({
        onSelect: function (record) {
            if (record.text == 'text') {
                $('#spaceDiv').show();
            } else {
                $('#spaceDiv').hide();
            }
        }
    });

};

    //初始化文件上传
    var iniFileUpload = function () {
        $("#import").change(function () {
            fileChange = true;
            var $file = $(this);
            var fileObj = $file[0];
            var windowURL = window.URL || window.webkitURL;
            var dataURL;
            if (fileObj && fileObj.files && fileObj.files[0]) {
                dataURL = windowURL.createObjectURL(fileObj.files[0]);
            } else {
                dataURL = $file.val();
            }
        });
    };

    var fileImport = function () {
        $('#notAll').attr("checked", false);
        $('#all').attr("checked", true);
        var d = $("#do").find("input:checkbox");
        d.prop("checked", true);
        $('#winExport').css('display', 'none');
        $('#do').css('display', 'none');
        $('#commonPart').css('display', 'block')
        $('#winFile').panel({ title: '导入', height: '150px', width: '290px' }).window('open');
    };

    var fileExport = function () {
        $('#yilai').combobox('setValue', 'mach_id');
        $('#paixu').combobox('setValue', 'asc');
        $('#com').combobox('setValue', 'text');
        $("#notAll").attr("checked", false);
        $("#all").attr("checked", true);
        var d = $("#do").find("input:checkbox");
        d.prop("checked", true);
        $('#winExport').css('display', 'block');
        $('#commonPart').css('display', 'none');
        $('#do').css('display', 'block');
        $('#winFile').panel({ title: '导出', height: '150px', width: '610px' }).window('open');
    };

    var ini = function () {
      $('#fileConfirm').click(fileConfirmClick);
        $('#fileImport').click(fileImport);
        $('#fileExport').click(fileExport);
         $('#winFile').window('close');
        allClick();
        iniFileUpload();
        fileKindChange();
        loadCboXX();
        loadCboXD();
        XCommon.IniMM();
        clearData();
        iniDb();
        $('#search').click(loadData);
        $('#clear').click(clearData);
    }
    ini();
};
var resultFatt = function (value, row, index) {
    var data = row.result || '';
    if (data) {
        if (data == '0') {
            return '完成';
        } else if (XCommon.CheckInt(data)) {
            return data+'次未完成';
        }  else {
            return '未定义';
        }
    }
};
function clkdada() {
    var databox = $("#do").find("input:checkbox");
    var j = 0;
    for (var i = 0; i < databox.length; i++) {
        if (databox[i].checked) {
            j++;
        }
    }
    if (j <= 2) {
        for (var i = 0; i < databox.length; i++) {
            if (databox[i].checked) {
                databox[i].disabled = true;
            }
        }
    }
    else if (j > 7) {
        for (var i = 0; i < databox.length; i++) {
            if (databox[i].disabled) {
                databox[i].disabled = false;
            }
        }
    }
    else {
        for (var i = 0; i < databox.length; i++) {
            if (databox[i].disabled) {
                databox[i].disabled = false;
            }
        }
    }
};

 $(function () {
            go();
        });