var time;
//实例树
        var initializeTree = function () {
            tree = $("#tt").tree({
                animate: true,
                onSelect: function (node) {
                    loadSonDepartment();
                }
            });
        }

        //实例表格
        var initializeGrid = function () {
            datatable = $("#tb").datagrid({
                idField: "right_id",
                fitColumns: true,
                singleSelect: true,
                striped: true,
                iconCls: "icon-search",
                title: "直属部门",
                rownumbers: true,
                columns: [[{
                    field: 'id',
                    title: '编号',
                    width: 100,
                    align: 'center'
                }, {
                    field: 'department',
                    title: '名称',
                    width: 100,
                    align: 'center'
                },
            {
                field: 'farther_name',
                title: '父部门',
                width: 100,
                align: 'center',
            },
             {
                 field: 'loader',
                 title: '领导',
                 width: 100,
                 align: 'center'
             },
             {
                 field: 'teleph',
                 title: '电话',
                 width: 100,
                 align: 'center'
             },
            {
                field: 'address',
                title: '地址',
                width: 100,
                align: 'center'
            },
             {
                 field: 'used',
                 title: '是否使用',
                 width: 100,
                 align: 'center',
                 formatter: function (value, row, index) {
                     if (row.used == 1) {
                         return '使用中';
                     } else {
                         return '未使用';
                     }
                 }
             },
             {
                 field: 'end_date',
                 title: '卡有效期',
                 width: 100,
                 align: 'center'
             }]],
                toolbar: [
             {
                 text: "修改", id: 'barUpdate', iconCls: "icon-edit", handler: function () {
                     var rowData = datatable.datagrid('getSelected');
                     var node = tree.tree('getSelected');
                     if (rowData == null) {
                         $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                         return;
                     }
                     $('#win').window({
                         title: '修改部门',
                         iconCls: 'icon-edit',
                         maximizable: false,
                         minimizable: false
                     });
                     $('#win').window('open');
                     //添加数据
                     id = rowData.id;;
                     clearForm();
                     $('#depart').val(rowData.department);

                     $('#father_depart').combotree('setValue', node);
                     $('#loader').val(rowData.loader);
                     $('#tel').val(rowData.teleph);
                     $('#address').val(rowData.address);
                     $('#isUse').combobox('setValue', rowData.used);
                     $('#cardDate').datebox('setValue', rowData.end_date);
                     time =rowData.end_date;
                     $('#depart').select();
                 }
             },
             {
                 text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
                     var rowData = datatable.datagrid('getSelected');
                     var node = tree.tree('getSelected');
                     var errorFlag;
                     if (!rowData) {
                         $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                         return;
                     }
                     $.messager.confirm("提示", "确定删除选中项数据", function (data) {
                         if (data) {
                             var departid = rowData.id;
                             Ajax(true, sys["RemoveDepart"], { LoginID: LocalID, id: departid }, function (data) {
                                 if (!data.Success) {
                                     $.messager.alert('提示', data.Message, 'error');
                                     return;
                                 }
                                 $.messager.alert("提示", "<p class='infoReport'>删除成功</p>", "info");
                                 loadSonDepartment();
                                 loaddata();
                             });
                         }
                     });
                 }
             },
             {
                 text: "增加", id: 'barAdd', iconCls: "icon-add", handler: function () {
                     $('#win').window({
                         title: '新增部门',
                         iconCls: 'icon-add',
                         maximizable: false,
                         minimizable: false
                     });
                     clearForm();                 
                     $('#win').window('open');
                     //父部门
                     id = null;
                     $('#depart').select();
                 }
             }],
                onDblClickCell: function (rowIndex, field, value) {
                    var rowData = datatable.datagrid('getSelected');
                    if (rowData == null) {
                        $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
                        return;
                    }
                    $('#win').window({
                        title: '修改部门',
                        iconCls: 'icon-edit',
                        maximizable: false,
                        minimizable: false
                    });
                    $('#win').window('open');
                    id = rowData.id;;
                    //添加数据
                    clearForm();
                    $('#depart').val(rowData.department);
                    $('#father_depart').combotree('setValue', { id: rowData.farther_depart, text: rowData.department });
                    $('#loader').val(rowData.loader);
                    $('#tel').val(rowData.teleph);
                    $('#address').val(rowData.address);
                    $('#isUse').combobox('setValue', rowData.used);
                    $('#cardDate').datebox('setValue', rowData.end_date);
                     time =rowData.end_date;
                    $('#depart').select();
                }
            });


        };

        //初始化事件
        var initializeEvent = function () {

            $("#close").click(function () {
                $('#win').window('close');
            });
            $("#save").click(function () {
                if ($("#depart").val() == "") {
                    $.messager.alert("提示", "<p class='infoReport'>部门名不能为空</p>", "error");
                    return;
                }
                if ($("#user_kind").val() == "") {
                    $.messager.alert("提示", "<p class='infoReport'>用户种类不能为空</p>", "error");
                    return;
                }
                if ($("#role_id").val() == "") {
                    $.messager.alert("提示", "<p class='infoReport'>角色不能为空</p>", "error");
                    return;
                }
                if ($("#father_depart").combotree("getText").trim() == $("#depart").val()) {
                    $.messager.alert("提示", "<p class='infoReport'>父部门和子部门不能相同</p>", "error");
                    return;
                }
                //取值
                var node = tree.tree('getSelected');
                var departid = node == null ? 0 : node.id;
                var depart = $("#depart").val();
                var fatherDepart = $("#father_depart").combotree("getValue");
                var loader = $("#loader").val();
                var tel = $("#tel").val();
                var address = $("#address").val();
                var isUse = $("#isUse").combobox("getValue");
                if (isUse == "") {
                    isUse = 0;
                }
                var cardDate = $("#cardDate").datebox("getValue");
                if (cardDate == "") {
                    cardDate = "2099-12-12";
                }
                var dataTemp = {
                    id: id,
                    LoginID:LocalID,
                    department: depart,
                    address: address,
                    end_date: cardDate,
                    farther_depart: fatherDepart,
                    loader: loader,
                    teleph: tel,
                    used: isUse,
                    flag: "1"
                };
                var dataTemps = {
                    id: id,
                    LoginID:LocalID,
                    department: depart,
                    address: address,
                    end_date: cardDate,
                    farther_depart: fatherDepart,
                    loader: loader,
                    teleph: tel,
                    used: isUse,
                    flag: ""
                };
                //新增
                if (id == null) {
                    delete dataTemp.id;
                    Ajax(true, sys["NewDepart"], dataTemp, function (data) {
                        if (!data.Success) {
                            $.messager.alert('提示',data.Message,'error');
                            return;
                        }
                        $.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加</p>", function (r) {
                            if (r) {
                                clearForm();
                            } else {
                                $('#win').window('close');
                            }
                            loadSonDepartment();
                            loaddata();
                        });
                    });
                    //修改
                } 
                else {
                    if(time!=cardDate){
                        $.messager.confirm('提示', "<p class='infoReport'>修改部门下所有人员门禁卡有效期?</p>", function (r) {
					        if (r) {
                                Ajax(true, sys["UpdateDepart"], dataTemp, function (data) {
                                    if (!data.Success) {
                                        alert(data.Message);
                                        return;
                                    }
                                    $.messager.alert("提示", "<p class='infoReport'>修改成功</p>", "info");
                                    $('#win').window('close');
                                    loadSonDepartment();
                                    loaddata();                
                                });
					        }
                            else{
                            Ajax(true, sys["UpdateDepart"], dataTemps, function (data) {
                                    if (!data.Success) {
                                        alert(data.Message);
                                        return;
                                    }
                                    $.messager.alert("提示", "<p class='infoReport'>修改成功</p>", "info");
                                    $('#win').window('close');
                                    loadSonDepartment();
                                    loaddata();                
                                });
                            }
                        });
                    }
                    else{
                        Ajax(true, sys["UpdateDepart"], dataTemps, function (data) {
                            if (!data.Success) {
                                alert(data.Message);
                                return;
                            }
                            $.messager.alert("提示", "<p class='infoReport'>修改成功</p>", "info");
                            $('#win').window('close');
                            loadSonDepartment();
                            loaddata();                
                        });
                    }
                }
            });
        };
        //获取所有树数据
        function loaddata() {
            Ajax(true, sys["GetAllDepartTree"], { LoginID: LocalID, company: 0 }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    return;
                }
                jsondata.total = data.Data.length;
                jsondata.rows = JSON2.parse(data.Data)
                tree.tree('loadData', jsondata.rows);
                var tempData = JSON.parse(JSON.stringify(jsondata.rows));
                $('#father_depart').combotree('loadData', tempData);            
            });
        };

        //获取子部门
        function loadSonDepartment() {
            var idTemp;
            var node = $('#tt').tree('getSelected');
            var idTemp = node == null ? 0 : node.id;
            datatable.datagrid('unselectAll');
            Ajax(true, sys["GetDepartList"], { LoginID: LocalID, farther_depart: idTemp }, function (data) {
                if (!data.Success) {
                    alert(data.Message);
                    $('#text').select();
                    return;
                }
                jsonright.total = data.Data.length;
                jsonright.rows = data.Data;
                datatable.datagrid('loadData', jsonright);
                var pager = $("#tb").datagrid("getPager");
                pager.pagination({
                    total: jsonright.total,
                    onSelectPage: function (pageNo, pageSize) {
                        var start = (pageNo - 1) * pageSize;
                        var end = start + pageSize;
                        $("#tb").datagrid("loadData", jsonright.rows.slice(start, end));
                        pager.pagination('refresh', {
                            total: jsonright.total,
                            pageNumber: pageNo
                        });
                    }
                });
                pager.pagination('select');
            });
        };

        //清空旧数据
        function clearForm() {
            var node = tree.tree('getSelected');          
            if (node != null) {        
                $('#father_depart').combotree('setValue', node);
                xData.nodeSelectTree=node;
            } else {
                $('#father_depart').combotree('setValue', xData.nodeSelectTree);
            }
            $('#loader').val('');
            $('#depart').val('');
            $('#tel').val('');
            $('#address').val('');
            $('#isUse').combobox('setValue', '1');
            var fiveTime = XCommon.GetFiveYear();
            $('#cardDate').datebox('setValue', fiveTime);
        };