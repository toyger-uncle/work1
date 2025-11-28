var sortName = "user_name";
var sortOrder = "asc";
var PageSize = 10;
var PageNum = 1;
var allRole;
var id = undefined;
var LocalID = $.cookie("LocalID");
var datatable;
var leval;
var jsondata = { "total": 0, "rows": [] };
var fileChange = false; //文件改变标识


//加载数据
function loaddata() {
    datatable.datagrid('unselectAll');
    var BeginTime = $("#BeginTime1").datetimebox('getValue');
    var EndTime = $("#EndTime1").datetimebox("getValue");
    var departName = $("#departName1").combobox("getText").trim();
    if (departName == '全部') {
        departName = '';
    }
    var userName = $("#userName1").val();
    //进出标志数据
    var inOutNull;
    var inTemp = $('#in1').switchbutton('options');
    if (inTemp.checked == true) {
        inOutNull = '1';
    } else {
        inOutNull = '0';
    };

    var outTemp = $('#out1').switchbutton('options');
    if (outTemp.checked == true) {
        inOutNull += '1';
    } else {
        inOutNull += '0';
    }
    XCommon.ShowWaiting("查询中,请稍候");
    Ajax(true, mj["GetEventRecorderMjInOutPageList"], {
        LoginID: LocalID, BeginTime: BeginTime, EndTime: EndTime, user_name: userName, event_reason: inOutNull, depart_name: departName, sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
    }, function (data) {
        XCommon.ClosWating();
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        jsondata.total = data.Ex;
        jsondata.rows = data.Data;
        datatable.datagrid('loadData', jsondata);
        if (jsondata.total == 0) {
            PageNum = 1;
        }
        var p = datatable.datagrid('getPager');
        $(p).pagination({
            beforePageText: '第', //页数文本框前显示的汉字
            afterPageText: '页    共 ' + Math.ceil(jsondata.total / PageSize) + ' 页',
            displayMsg: '当前显示 ' + (PageSize * (PageNum - 1) + (jsondata.total == 0 ? 0 : 1)) + ' - ' + (PageSize * (PageNum - 1) + data.Data.length) + ' 条记录   共 ' + jsondata.total + ' 条记录',
            onSelectPage: function (pageNumber, pageSize) {
                PageSize = pageSize;
                PageNum = pageNumber;
                if (PageNum < 1) {
                    PageNum = 1;
                }
                loaddata();
            }
        });
    });
}

var iniSearch = function () {
    PageNum = 1;
    var p = datatable.datagrid('getPager');
    p.pagination('select', 1);
};

function getNull(data) {
    if (data == '') {
        return null;
    } else {
        return data;
    }
};
//获取部门
var SetDepart = function () {
    Ajax(true, sys["GetDepartList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        };
        if (data.Data.length) {
            var temp = { 'id': '', 'department': '全部' };
            data.Data.push(temp);
            $('#departName1').combobox({
                data: data.Data,
                valueField: 'id',
                textField: 'department'
            });
        }
    });
};

//初始化表格
function iniGrid() {
    datatable = $("#dg").datagrid({
        idField: "id",
        pagination: true, //显示分页
        pageSize: PageSize, //分页大小
        pageList: [10, 20, 50, 100], //每页的个数
        //fit: true, //自动补全
        fitColumns: true,
        striped: true,
        iconCls: "icon-search", //图标
        title: "首进最后出记录",
        collapsible: true,
        remotesort: false,
        rownumbers: true,
        singleSelect: true,
        sortName: sortName,
        sortOrder: sortOrder,
        columns: [[{
            field: 'user_name',
            title: '姓名',
            align: 'center',
            sortable: true,
            width: 100
        }, {
            field: 'event_cardid',
            title: '卡号',
            align: 'center',
            sortable: true,
            width: 100

        },
                {
                    field: 'depart_name',
                    title: '部门',
                    align: 'center',
                    sortable: true,
                    width: 100
                },
                {
                    field: 'event_date',
                    title: '进出时间',
                    align: 'center',
                    sortable: true,
                    width: 100
                },
                {
                    field: 'door_name',
                    title: '进出门区',
                    align: 'center',
                    sortable: true,
                    width: 100
                },
                 {
                     field: 'event_reason',
                     title: '进出状况',
                     align: 'center',
                     sortable: true,
                     width: 100,
                     formatter: function (val, row) {
                         if (eventReasons[val] !== undefined) {
                             return eventReasons[val];
                         } else {
                             return '未定义';
                         }
                     }
                 },
                  {
                      field: 'net_flag',
                      title: '类型',
                      align: 'center',
                      sortable: true,
                      width: 100,
                      formatter: function (value, row) {
                          if (netFlags[value] !== undefined) {
                              return netFlags[value];
                          } else {
                              return '未定义';
                          };
                      }
                  }

                ]],
        //排列行
        onSortColumn: function (sort, order) {
            sortName = sort;
            sortOrder = order;
            loaddata();
        }
    });
};

var ResetInput = function () {
    var data = XCommon.getLastFormatDate();
    $("#BeginTime1").datetimebox("setValue", data);
    var dataAfter = XCommon.getNowFormatDate();
    $("#EndTime1").datetimebox("setValue", dataAfter);

    $('#departName1').combobox('setValue', '');
    $('#userName1').val('');
    $('#in1').switchbutton('check');
    $('#out1').switchbutton('check');
};


var fileConfirmClick = function () {
    var display = $('#winExport').css('display');
    //根据display判断是导出还是导入
    var basicData = {
        'temp1': 'depart_name',
        'temp2': 'user_name',
        'temp3': 'event_cardid',
        'temp4': 'caller_name',
        'temp5': 'door_id',
        'temp6': 'door_name',
        'temp7': 'event_reason',
        'temp8': 'net_flag',
        'temp9': 'event_date'
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
        var BeginTime1 = $("#BeginTime1").datetimebox('getValue');
        var EndTime1 = $("#EndTime1").datetimebox("getValue");
        var departName1 = $("#departName1").combobox("getText").trim();
        if (departName1 == '全部') {
            departName1 = '';
        }
        var userName1 = $("#userName1").val();
        //进出标志数据
        var inOutNull1;
        var inTemp = $('#in1').switchbutton('options');
        if (inTemp.checked == true) {
            inOutNull1 = '1';
        } else {
            inOutNull1 = '0';
        };

        var outTemp = $('#out1').switchbutton('options');
        if (outTemp.checked == true) {
            inOutNull1 += '1';
        } else {
            inOutNull1 += '0';
        }
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
        var di = $('#space').combobox('getValue');	
        XCommon.ShowWaiting("导出中,请稍候");

        var url = RTURL + global.export["ExportEventRecorderMjInOutPageFile"] + "?LoginID=" + LocalID + "&BeginTime=" + BeginTime1 + "&EndTime=" + EndTime1 + "&depart_name=" + departName1 + "&user_name=" + userName1 + "&kind=" + inOutNull1 + "&columname=" + myData + "&di=" + di + "&exporttype=" + kinds + "&sortName=" + yilai + "&sortOrder=" + (paixu == "asc" ? false : true) + "&pageSize=" + "100000" + "&pageNum=" + "1";
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

var allClick = function () {
    $("#all").change(function () {
        if ($("#all").prop("checked")) {
            var d = $("#do").find("input:checkbox");
            d.prop("checked", true);
        } else {
            var d = $("#do").find("input:checkbox");
            d.prop("checked", false);
        }
        clkdada();
    });
    $("#notAll").change(function () {
        var d = $("#do").find("input:checkbox");
        d.prop("checked", function (index, oldPropertyValue) {
            if (oldPropertyValue) {
                d[index].checked = false;
            } else {
                d[index].checked = true;
            }
        });
        clkdada();
    });
}

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
    $('#yilai').combobox('setValue', 'user_name');
    $('#paixu').combobox('setValue', 'asc');
    $('#com').combobox('setValue', 'text');
    $("#notAll").attr("checked", false);
    $("#all").attr("checked", true);
    var d = $("#do").find("input:checkbox");
    d.prop("checked", true);
    $('#winExport').css('display', 'block');
    $('#commonPart').css('display', 'none');
    $('#do').css('display', 'block');
    $('#winFile').panel({ title: '导出', height: '170px', width: '610px' }).window('open');
};

var iniEvent = function () {
    $('#fileConfirm').click(fileConfirmClick);
    $('#fileImport').click(fileImport);
    $('#fileExport').click(fileExport);
    allClick();
    iniFileUpload();
    fileKindChange();
};

$(function () {
    $('#winFile').window('close');
    iniEvent();
    iniGrid();
    SetDepart();
    ResetInput();
    loaddata();
    XCommon.IniMM();
});