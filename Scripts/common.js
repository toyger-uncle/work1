RTURL = "";    //生产使用
//RTURL = "http://192.168.18.37/Holographic"; //后台地址，非分布式部署设为空 联调使用
//RTURL = "http://192.168.10.18/Holographic"; //后台地址，非分布式部署设为空 联调使用
function Ajax(asc, url, data, func) {
    //url = ashxurl(url);
    $.ajax({
        async: true,
        //async: asc,
        type: "post",
        datatype: "json", //大数据（>4096字节），非跨域使用  生产使用
        // type: "get",
        //dataType: "jsonp", //数据格式，分布式跨域使用（<4096字节）开发使用
        //jsonp: "Callback", 
        //jsonpCallback: "TestCallback",
        url: RTURL + url,
        data: data,
        //contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        success: func,
        error: function (message) {
            alert("服务访问出错：" + message.status + message.statusText);
        }
    });
}
function ashxurl(url) {
    var x = url.lastIndexOf('/');
    url = "/Ashx" + url.substring(0, x) + ".ashx" + url.substring(x);
    return url;
}
function getQueryString(name) {
    var now_url = document.location.search.slice(1), q_array = now_url.split('&');
    for (var i = 0; i < q_array.length; i++) {
        var v_array = q_array[i].split('=');
        if (v_array[0] == name) {
            return v_array[1];
        }
    }
    return false;
}
function jsAddItemToSelect(objSelect, objItemValue, objItemText) {
    objSelect.append("<option value='" + objItemValue + "'>" + objItemText + "</option>");
}
function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}
function padRight(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padRight(str + "0", lenght);
}
function formatdatetime(datetime) {
    var year = datetime.getFullYear();
    var month = (datetime.getMonth() + 1);
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var getime = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date)
    + " " + (hour < 10 ? ('0' + hour) : hour) + ":" + (minute < 10 ? ('0' + minute) : minute) + ":" + (second < 10 ? ('0' + second) : second);
    return getime;
}
function formatdatetimeex(datetime) {
    var year = datetime.getFullYear();
    var month = (datetime.getMonth() + 1);
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var getime = year.toString() + (month < 10 ? ('0' + month) : month).toString() + (date < 10 ? ('0' + date) : date).toString() + (hour < 10 ? ('0' + hour) : hour).toString()
    + (minute < 10 ? ('0' + minute) : minute).toString() + (second < 10 ? ('0' + second) : second).toString();
    return getime;
}
function formatdate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function formattime(time) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m) + ':' + (s < 10 ? ('0' + s) : s);
}
//flag=1,显示全部.flag=0 不显示全部
var XCommon = {
    //获取当前时间 yyyy-MM-dd hh:mm:ss
    GetTimeFullToday: function () {
        var dateNow = new Date();
        var month = dateNow.getMonth() + 1;
        var date = dateNow.getDate();
        var dateNew = dateNow.getFullYear() + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date)
                + " " + dateNow.getHours() + ":" + dateNow.getMinutes()
                + ":" + dateNow.getSeconds();
        return dateNew;
    },
    //获取昨天时间 yyyy-MM-dd hh:mm:ss
    GetTimeFullYester: function () {
        var dateNow = new Date();
        dateNow.setDate(dateNow.getDate() - 1);
        var month = dateNow.getMonth() + 1;
        var date = dateNow.getDate();
        var dateNew = dateNow.getFullYear() + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date)
            + " " + dateNow.getHours() + ":" + dateNow.getMinutes()
            + ":" + dateNow.getSeconds();
        return dateNew;
    },
    //获取5年后日期 yyyy-MM-dd
    GetFiveYear: function () {
        var dateNow = new Date();
        var month = dateNow.getMonth() + 1;
        var date = dateNow.getDate();
        var dateNew = dateNow.getFullYear() + 5 + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        return dateNew;
    },
    //获取前一天时间 “yyyy-MM-dd” 
    getLastFormatDate: function () {
        var dateNow = new Date();
        dateNow.setDate(dateNow.getDate() - 1);
        var month = dateNow.getMonth() + 1;
        var date = dateNow.getDate();
        var dateNew = dateNow.getFullYear() + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        return dateNew;
    },
    //获取当天时间 “yyyy-MM-dd” 
    getNowFormatDate: function () {
        var dateNow = new Date();
        var month = dateNow.getMonth() + 1;
        var date = dateNow.getDate();
        var dateNew = dateNow.getFullYear() + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
        return dateNew;
    },
    //设置cbo部门数据,传入cboid及flag.if(flag)为真时,加入'全部'数据
    SetDepartCbo: function (cboId, flag) {
        Ajax(true, sys["GetDepartList"], { LoginID: LocalID }, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            };
            if (flag) {
                if (data.Data.length) {
                    var temp = { 'id': '', 'department': '全部' };
                    data.Data.push(temp);
                }
            }
            $('#' + cboId).combobox({
                data: data.Data,
                valueField: 'id',
                textField: 'department'
            });
        });
    },
    //设置cbo门数据,传入cboid及flag.if(flag)为真时,加入'全部'数据
    SetDoorCbo: function (cboId, flag) {
        Ajax(true, global.mj["GetMJControlDoorSimList"], { LoginID: LocalID }, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            };
            if (flag) {
                if (data.Data.length) {
                    var temp = { 'id': '', 'door_name': '全部' };
                    data.Data.push(temp);
                }
            }
            $('#' + cboId).combobox({
                data: data.Data,
                valueField: 'id',
                textField: 'door_name'
            });
        });
    },
    //设置cbo门数据,传入cboid及flag.if(flag)为真时,加入'全部'数据
    SetDoorCboAll: function (cboId, flag) {
        Ajax(true, global.mj["GetMJControlDoorList"], { LoginID: LocalID }, function (data) {
            if (!data.Success) {
                $.messager.alert('提示', data.Message, 'error');
                return;
            };
            if (flag) {
                if (data.Data.length) {
                    var temp = { 'id': '', 'door_name': '全部' };
                    data.Data.push(temp);
                }
            }
            $('#' + cboId).combobox({
                data: data.Data,
                valueField: 'id',
                textField: 'door_name'
            });
        });
    },
    //设置网络状态. netFlags取自ch文件
    SetColNetFlag: function (value, row) {
        if (netFlags[value] !== undefined) {
            return netFlags[value];
        } else {
            return '未定义';
        };
    },
    //设置进出原因. eventReasons取自ch文件
    SetColInOutReason: function (val, row) {
        if (eventReasons[val] !== undefined) {
            return eventReasons[val];
        } else {
            return '未定义';
        };
    },
    //设置memu位置
    IniMM: function () {
        $(document).bind('contextmenu', function (e) {
            e.preventDefault();
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        });
    },
    //设置memu事件.需要将所需功能该为下面id
    IniMenuHandler: function (item) {
        switch (item.text) {
            case '增加': $('#barAdd').click(); break;
            case '删除': $('#barRemove').click(); break;
            case '关闭': $('#mm').menu('hide'); break;
            case '查看': $('#barView').click(); break;
            case '修改': $('#barUpdate').click(); break;
            case '查询': $('#search').click(); break;
            case '生成': $('#create').click(); break;
            case '重置': $('#clear').click(); break;
            default: $('#mm').menu('hide'); break;
        }
    },
    addLoadEvent: function (func) {
        var oldOnload = onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            oldOnload();
            func();
        }
    },
    //设置cbo权限数据,传入cboid及flag.if(flag)为真时,加入'全部'数据
    SetRightCbo: function (cboId, flag) {
        Ajax(true, tk["GetTkRightList"], { LoginID: LocalID }, function (data) {
            if (!data.Success) {
                alert(data.Message);
                return;
            }
            if (flag) {
                if (data.Data.length) {
                    var temp = { 'id': '', 'door_name': '全部' };
                    data.Data.push(temp);
                }
            }
            $('#' + cboId).combobox({
                data: data.Data,
                valueField: 'id',
                textField: 'group_name'
            });
        });
    },
    //添加验证扩展
    initializeVerify: function () {
        $.extend($.fn.validatebox.defaults.rules, {
            idcard: {// 验证身份证
                validator: function (value) {
                    return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
                },
                message: '身份证号码格式不正确'
            },
            minLength: {
                validator: function (value, param) {
                    return value.length >= param[0];
                },
                message: '请输入至少（2）个字符.'
            },
            length: {
                validator: function (value, param) {
                    var len = $.trim(value).length;
                    return len >= param[0] && len <= param[1];
                },
                message: "输入内容长度必须介于{0}和{1}之间."
            },
            phone: {// 验证电话号码
                validator: function (value) {
                    return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
                },
                message: '格式不正确,请使用下面格式:020-88888888'
            },
            mobile: {// 验证手机号码
                validator: function (value) {
                    return /^(13|15|18)\d{9}$/i.test(value);
                },
                message: '手机号码格式不正确'
            },
            intOrFloat: {// 验证整数或小数
                validator: function (value) {
                    return /^\d+(\.\d+)?$/i.test(value);
                },
                message: '请输入数字，并确保格式正确'
            },
            currency: {// 验证货币
                validator: function (value) {
                    return /^\d+(\.\d+)?$/i.test(value);
                },
                message: '货币格式不正确'
            },
            qq: {// 验证QQ,从10000开始
                validator: function (value) {
                    return /^[1-9]\d{4,9}$/i.test(value);
                },
                message: 'QQ号码格式不正确'
            },
            integer: {// 验证整数
                validator: function (value) {
                    return /^[+]?[1-9]+\d*$/i.test(value);
                },
                message: '请输入整数'
            },
            age: {// 验证年龄
                validator: function (value) {
                    return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
                },
                message: '年龄必须是0到120之间的整数'
            },

            chinese: {// 验证中文
                validator: function (value) {
                    return /^[\Α-\￥]+$/i.test(value);
                },
                message: '请输入中文'
            },
            english: {// 验证英语
                validator: function (value) {
                    return /^[A-Za-z]+$/i.test(value);
                },
                message: '请输入英文'
            },
            unnormal: {// 验证是否包含空格和非法字符
                validator: function (value) {
                    return /.+/i.test(value);
                },
                message: '输入值不能为空和包含其他非法字符'
            },
            username: {// 验证用户名
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
                },
                message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
            },
            faxno: {// 验证传真
                validator: function (value) {
                    //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
                    return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
                },
                message: '传真号码不正确'
            },
            zip: {// 验证邮政编码
                validator: function (value) {
                    return /^[1-9]\d{5}$/i.test(value);
                },
                message: '邮政编码格式不正确'
            },
            ip: {// 验证IP地址
                validator: function (value) {
                    return /d+.d+.d+.d+/i.test(value);
                },
                message: 'IP地址格式不正确'
            },
            name: {// 验证姓名，可以是中文或英文
                validator: function (value) {
                    return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
                },
                message: '请输入姓名'
            },
            date: {// 验证姓名，可以是中文或英文
                validator: function (value) {

                    //格式yyyy-MM-dd或yyyy-M-d
                    return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
                },
                message: '清输入合适的日期格式'
            },
            msn: {
                validator: function (value) {
                    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
                },
                message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
            },
            same: {
                validator: function (value, param) {
                    if ($("#" + param[0]).val() != "" && value != "") {
                        return $("#" + param[0]).val() == value;
                    } else {
                        return true;
                    }
                },
                message: '两次输入的密码不一致！'
            }
        });
    },
    //匹配手机号码  是手机号码返回true 否则返回false
    CheckMobile: function (number) {
        return number.match(/^1[3|5|7|8|][0-9]{9}/) == null ? false : true;
    },
    //判断是否为数字
    checkNum: function (s) {
        if (s != null && s != "") {
            return !isNaN(s);
        }
        return false;
    },
    //settimeout模拟settimeout模拟setinterval.iswork控制开关
    intervalOpt: {
        isWork: true,
        interval: function (func, wait) {
            if (this.isWork) {
                var interv = function () {
                    func.call(null);
                    setTimeout(interv, wait);
                };
                setTimeout(interv, wait);
            }
        }
    },
    //停止界面上所有的timeout定时器
    clearAllTimeout: function () {
        var highestTimeoutId = setTimeout(";");
        for (var i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    },
    //停止界面上所有的setInterval定时器
    clearAllInterva: function () {
        var highestTimeoutId = setInterval(";");
        for (var i = 0; i < highestTimeoutId; i++) {
            clearInterval(i);
        }
    },
    isHasImg: function (pathImg) {
        var ImgObj = new Image();
        ImgObj.src = pathImg;
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return true;
        } else {
            return false;
        }
    },
    //判断是否为整数
    CheckInt: function (obj) {
        var pattern = /^[1-9]\d*|0$/; //匹配非负整数
        v = obj.replace(/[^\d]/g, "");
        if (!pattern.test(v)) {
            return false;
        } else {
            return true;
        }
    },
    ShowWaiting: function (str) {
        $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html(str).appendTo("body").css({ display: "block", zIndex: '99999', left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
    },
    ClosWating: function () {
        //    $("<div class=\"datagrid-mask\"></div>").css('display': "none");
        //    }
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    },
    loadScript: function (url, callBack, defer, async) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (defer) {
            script.defer = defer;
        }
        if (async) {
            script.async = async;
        }
        script.onload = callBack;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(script);
    },
    //复制集合至数组
    toArray: function (gather) {
        for (var i = 0, a = []; i < gather.length; i++) {
            a[i] = gather[i];
        }
        return a;
    },
    //缓存函数 //参数1 原始函数.参数2 缓存数据
    memoize: function (fundameental, cache) {
        cache = cache || {};
        var shell = function (arge) {
            if (!cache.hasOwnProperty(arge)) {
                cache[arge] = fundameental(arge);
            }
        };
        return shell;
    },
    //先克隆items数组.执行第一遍process函数.判断数组长度.如果还有,则使用arguments.callee,重新执行该方法.没有则执行callback方法. 该方法只有一个函数!!!
    processArray: function (items, process, callback) {
        var todo = items.concat();
        //执行第一个并弹出第一个参数
        setTimeout(function () {
            var start = new Date();
            do {
                process(todo.shift());
            } while (todo.length > 0 && ((+new Date() - start) < 50));
            if (todo.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                callback(items);
            }
        });
    },
    //多个方法.一个参数.
    multistep: function (steps, args, callback) {
        //复制
        var tasks = steps.concat();
        setTimeout(function () {
            var task = tasks.shift();
            task.apply(null, args || []);
            if (tasks.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                callback();
            }
        });
    },
    //计时器
    Timer: {
        _data: {},
        start: function (key) {
            Timer._data[key] = new Date();
        },
        stop: function (key) {
            var time = Timer._data[key];
            if (time) {
                Timer._data[key] = new date() - time;
            }
        },
        getTime: function (key) {
            return Timer._data[key];
        }
    }
}