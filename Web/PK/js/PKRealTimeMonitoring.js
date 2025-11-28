var LocalID = $.cookie("LocalID");
var localName;
//LocalID = "0000001326";
//LocalID = "0000000000";
var doorDataJson = { "total": 0, "rows": [] };
var doorsIDArray = [];
var doorID = "";
var activeX = $("#ActiveX")[0];
var activeFlag = true;
var cameraDataJson = {};
var adminUpCameraData = [];
var admin = false;
var upCameraData = [];

//初始化表格
var initializeGrid = function () {
    $("#tbDoor").datagrid({
        onDblClickRow: function (rowIndex, rowData) {
            if (confirm("确认打开该通道吗?")) {
                openTongDao(rowIndex, rowData);
            }
        }
    });
};

//返回当前人员门id
var getDoorsID = function () {
    var rowData = doorDataJson.rows;

    //出门的个数
    var chuMenCount = 0;
    if (rowData) {
        for (var i = 0; i < rowData.length; i++) {
            if (rowData[i].user_id == LocalID) {
                localName = rowData[i].user_name;
                doorsIDArray.push(rowData[i].id);
                if (rowData[i].inout_flag == "1") {
                    chuMenCount++;
                }
            }
        }
        if (doorsIDArray.length >= 1) {
            doorID = doorsIDArray.join("|");
        } else {
            if (chuMenCount == 0) {
                admin = true;
            }
        }
    }
    getAllCamera();
}

//获取当前所有摄像机
var getAllCamera = function () {
    Ajax(true, global.pk["GetPKJkInfoList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        cameraDataJson = data.Data;
        var doorData = doorDataJson.rows;
        //如果用户门id找到相机,添加.否则.只可能是该门没添加摄像头.有则上传该门摄像头数据.
        for (var i = 0; i < cameraDataJson.length; i++) {

            //收银员添加当前相机
            if (!admin && doorID != "") {
                for (var j = 0; j < doorData.length; j++) {
                    if (cameraDataJson[i].id == doorData[j].master_id || cameraDataJson[i].id == doorData[j].sencond_id) {
                        upCameraData.push(cameraDataJson[i]);
                        signCheck(i, true);
                        break;
                    }
                }
            } else {

                //管理员添加前9个.并在页面上标记
                if (adminUpCameraData.length < 9) {
                    adminUpCameraData.push(cameraDataJson[i]);
                    signCheck(i, true);
                } else {
                    break;
                }
            }
        }
        if (activeFlag) {

            //检索到收银员摄像头数据,发送
            if (!admin) {
                {
                    var updateData = JSON.stringify(upCameraData);
                    try {
                        activeX.UploadCamera(updateData, localName);
                    } catch (e) {
                        activeFlag = false;
                        alert(e);
                    }

                }
            } else {
                var updateData = JSON.stringify(adminUpCameraData);
                try {
                    activeX.UploadAdminCamera(updateData);
                } catch (e) {
                    activeFlag = false;
                    alert(e);
                }

            }

            //启动服务
            startServer();
        }
    })
};

//复选中选中取消方法
//index,相机参数表index,flag 开启或关闭
var signCheck = function (index, flag) {
    var camera = cameraDataJson[index];
    var doorData = doorDataJson.rows;
    for (var i = 0; i < doorData.length; i++) {
        if (doorData[i].master_id == camera.id) {
            document.getElementById("Z" + doorData[i].master_id).checked = flag;
            return;
        } else if (doorData[i].sencond_id == camera.id) {
            document.getElementById("F" + doorData[i].sencond_id).checked = flag;
            return;
        }
    }
}

var startServer = function () {
    Ajax(true, global.pk["GetPKIPAndPort"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var ip = data.Data;
        var port = data.Ex;
        var widthData = document.body.clientWidth;
        var width = parseInt(widthData);
        if (activeFlag) {
            try {
                activeX.Start(width, 1500, ip, port, doorID, LocalID);
            } catch (e) {
                alert(e);
                activeFlag = false;
            }
        }
    });
}

var openTongDao = function (rowIndex, rowData) {
    var time1 = 1;
    var ztt = 1;
    if (!rowData) {
        alert("未选择通道");
        return;
    }
    var name1 = rowData.id;
    Ajax(true, global.pk["RemoteDoor"], { LoginID: LocalID, door_id: name1, openOrClose: ztt, time: time1 }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        var ab = data.Data;
        if (ab == true) {
            alert("打开通道成功");
        }
        else { alert("打开通道失败"); }
    });
}

//加载表格数据并开启服务
var loadTBData = function () {
    Ajax(true, global.pk["GetPKDoorList"], { LoginID: LocalID }, function (data) {
        if (!data.Success) {
            alert(data.Message);
            return;
        }
        doorDataJson.total = data.Data.length;
        doorDataJson.rows = data.Data;
        $("#tbDoor").datagrid('loadData', doorDataJson);
        $("#tbDoor").datagrid("getPager").pagination('select');
        getDoorsID();
    });
}

var iniPageData = function () {
    var pager = $("#tbDoor").datagrid("getPager");
    pager.pagination({
        total: doorDataJson.total,
        onSelectPage: function (pageNo, pageSize) {
            var start = (pageNo - 1) * pageSize;
            var end = start + pageSize;
            $("#tbDoor").datagrid("loadData", doorDataJson.rows.slice(start, end));
            pager.pagination('refresh', {
                total: doorDataJson.total,
                pageNumber: pageNo
            });
        }
    });
}

function ActiveXKiller(AcitveXObjectID, ContianerID) {
    var ce = document.getElementById(ContianerID);
    if (ce) {
        var cce = ce.children;
        for (var i = 0; i < cce.length; i = i + 1) {
            if (cce[i].id == AcitveXObjectID) {
                ce.removeChild(cce[i]);
            }
        }
    }
}

$(function () {
    initializeGrid();
    iniPageData();
    loadTBData();
    var sdkClosinging = false;
    //关闭页面前关闭端口
    window.onbeforeunload = function () {
        try {
            if (activeFlag) {
                if (!sdkClosinging) {
                    sdkClosinging = true;
                    var b = activeX.End();
                    ActiveXKiller("ActiveX", "divCenter");
                }
            }
        }
        catch (e) {
            return;
        }
    }
})
