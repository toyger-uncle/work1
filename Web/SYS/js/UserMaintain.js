  /*
    放置全局变量
    */
    var treeNode,
     fileChange = false, //文件改变标识
     picChange = false, //图片改变标识
     LocalID = $.cookie("LocalID"),
     allRole,
     allNation,
     allPost,
     allPolitface,
     allUserKind,
     allDepart,
     id = undefined,
    //查看 id=undefined
    //修改 id= row.id
    //保存用户的部门id
     userMain = { depOld: '' },
    //是否是点击查询
     depFlag,
    //增加 id=null
    //门禁是否有flag
    mjFlagW,
    datatable,
    jsondata = { "total": 0, "rows": [] },
    jsonTreeData = { "total": 0, "rows": [] },
    sortName = "user_name",
    sortOrder = "asc",
    PageSize = 10,
    PageNum = 1,
    tree,
    selectData = [{ value: 1, text: '使用中' }, { value: 0, text: '不使用'}],
    userMainData = {
        depOld: '',
        allRole: "",
        allNation: "",
        allPost: "",
        allPolitface: "",
        allUserKind: "",
        allDepart: "",
        id: undefined,
        datatable: "",
        jsondata: { "total": 0, "rows": [] },
        jsonTreeData: { "total": 0, "rows": [] },
        sortName: "user_name",
        sortOrder: "asc",
        PageSize: 10,
        PageNum: 1,
        tree: "",
        selectData: [{ value: 1, text: '使用中' }, { value: 0, text: '不使用'}]
    },
    setDisable = function () {              
	$('#user_name').validatebox('disable', 'true');
	$('#depart_id').combobox('disable', 'true');
	$('#user_kind').combobox('disable', 'true');
	$('#userid_num').validatebox('disable', 'true');
	$('#sex').combobox('disable', 'true');
	$('#birthday').datebox('disable', 'true');
	$('#using_cardnum').validatebox('disable', 'true');
	$('#h_address').validatebox('disable', 'true');
	$('#h_telephonenumber').validatebox('disable', 'true');
	$('#marry').combobox('disable', 'true');
	$('#polit_face').combobox('disable', 'true');
	$('#tech_post').combobox('disable', 'true');
	$('#nation').combobox('disable', 'true');
	$('#degree').combobox('disable', 'true');
	$('#college').validatebox('disable', 'true');
	$('#profession').validatebox('disable', 'true');
	$('#hand_tel').validatebox('disable', 'true');
	$('#account').validatebox('disable', 'true');
	$('#email').validatebox('disable', 'true');
	$('#bank_account').validatebox('disable', 'true');
	$('#car_userkind').validatebox('disable', 'true');
	$('#password').validatebox('disable', 'true');
	$('#role_id').combobox('disable', 'true');
	 $('#class_kind').combobox('disable', 'true');
	$('#psw').validatebox('disable', 'true')
	$('#work_type').combobox('disable', 'true');
	$('#idcard').validatebox('disable', 'true');    
							  
},
    setEnable = function () {
	$('#user_name').validatebox('enable', 'true');
	$('#depart_id').combobox('enable', 'true');
	$('#user_kind').combobox('enable', 'true');
	$('#userid_num').validatebox('enable', 'true');
	$('#sex').combobox('enable', 'true');
	$('#birthday').datebox('enable', 'true');
	$('#using_cardnum').validatebox('enable', 'true');
	$('#h_address').validatebox('enable', 'true');
	$('#h_telephonenumber').validatebox('enable', 'true');
	$('#marry').combobox('enable', 'true');
	$('#polit_face').combobox('enable', 'true');
	$('#tech_post').combobox('enable', 'true');
	$('#nation').combobox('enable', 'true');
	$('#degree').combobox('enable', 'true');
	$('#college').validatebox('enable', 'true');
	$('#profession').validatebox('enable', 'true');
	$('#hand_tel').validatebox('enable', 'true');
	$('#account').validatebox('enable', 'true');
	$('#email').validatebox('enable', 'true');
	$('#bank_account').validatebox('enable', 'true');
	$('#car_userkind').validatebox('enable', 'true');
	$('#password').validatebox('enable', 'true');
	$('#role_id').combobox('enable', 'true');
	 $('#class_kind').combobox('enable', 'true');
	$('#psw').validatebox('enable', 'true')
	$('#work_type').combobox('enable', 'true');
	$('#idcard').validatebox('enable', 'true');
};
function clkdada() {
		var databox = $("#do").find("input:checkbox");
//        var readFlag=databox.attr('readonly');
//        if(readFlag=='readonly'){
//        return;
//        }
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
	//导文件界面入口
var fileConfirmClick=function(){
	var display=$('#winExport').css('display');
	//根据display判断是导出还是导入
	var basicData={
	'temp1':'user_name',
	'temp2':'department',
	'temp3':'user_kind',
	'temp4':'userid_num',
	'temp5':'sex',
	'temp6':'birthday',
	'temp7':'h_address',
	'temp8':'h_telephonenumber',
	'temp9':'marry',
	'temp10':'polit_face',
	'temp11':'tech_post',
    'temp12':'post_name',
	'temp13':'nation',
	'temp14':'degree',
	'temp15':'college',
	'temp16':'profession',
	'temp17':'hand_tel',
	'temp18':'account',
	'temp19':'email',
	'temp20':'bank_account',
	'temp21':'work_type',
	'temp22':'idcard',
	'temp23':'headship'
	}
  //导出数据
	if(display=='block'){
	 var myData="|";
	 //获取列数据
	 var d = $("#do").find("input:checkbox");
			 d.prop("checked", function(index, oldPropertyValue){
			 if(oldPropertyValue){
			 myData+=basicData["temp"+(index+1)]+"|";
			 }
			 });
			 myData=myData.slice(1,myData.length-1);
			 //获取查询条件
			 var user_name1=$("#user_name1").val();
			 var depart_id1= $("#depart_id1").combobox("getValue");
			 var userid_num1=  $("#userid_num1").val();
			 var sex1= $("#sex1").combobox("getValue");
			 var polit_face1= $("#polit_face1").combobox("getValue");
			 var tech_post1= $("#tech_post1").combobox("getValue");
			 var degree1 =$("#degree1").combobox("getValue");
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
           var columCount=myData.indexOf('|');
           if(columCount==-1){
           $.messager.alert("提示", "<p class='infoReport'>请选择两个以上目录项!</p>", "error");
				return;
           }
           //间隔符
           var di=$('#space').combobox('getValue');
			XCommon.ShowWaiting("导出中,请稍候");
			var url = RTURL + global.export["ExportUserFilePageFile"] + "?LoginID=" + LocalID + "&user_name=" + user_name1 + "&depart_id=" + depart_id1 + "&userid_num=" + userid_num1 + "&sex="+sex1+"&polit_face="+polit_face1+"&tech_post="+tech_post1+"&degree="+degree1+"&di="+di+  "&columname=" + myData + "&exporttype=" + kinds + "&sortName=" + yilai + "&sortOrder=" + (paixu == "asc" ? false : true) + "&pageSize=" + "100000" + "&pageNum=" + "1";
			  XCommon.ClosWating();
			 window.open(url);
             $('#winFile').window('close');
		 }else{
	//导入   
		   if(fileChange){         
		  XCommon.ShowWaiting("导入中,请稍候");
				ajaxFileUpload(global.sys["ImportUserFile"], { LoginID: LocalID }, "import", function (data, status) {
				XCommon.ClosWating();
				if (!data.Success) {
					alert(data.Message);
					return;
				}             
				$.messager.alert("提示", "<p class='infoReport'>文件上传成功</p>", "info");    
				 fileChange=false;
				iniFileUpload();
                  $('#winFile').window('close');
													});
			  }  else{
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

//初始化图片上传
var iniPicUpload=function(){
$("#file_upload").change(function () {
		picChange=true;
		var $file = $(this);
		var fileObj = $file[0];
		var windowURL = window.URL || window.webkitURL;
		var dataURL;
		var $img = $("#personPhoto");

		if (fileObj && fileObj.files && fileObj.files[0]) {
			dataURL = windowURL.createObjectURL(fileObj.files[0]);
			$img.attr('src', dataURL);
		} else {
			dataURL = $file.val();
			var imgObj = document.getElementById("personPhoto");
			imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
		}
	});
};

//初始化文件上传
var iniFileUpload=function(){
$("#import").change(function () {
		fileChange=true;
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
 
 var treeEvent=function(node){
  if(node.attributes&&node.attributes.kind&&node.attributes.kind=="D"){                    
				
                var target=node.children||undefined;
                if(target&&target.length&&target.length!=0){
                for (var i = 0; i < target.length; i++) {
                if(target[i].attributes.kind=="U"){
                $('#tt').tree('toggle',node.target);
                  return;
                    }}}
                XCommon.ShowWaiting('加载人员信息中');       
                Ajax(false,global.sys["GetUserTreeOfDepart"], { LoginID: LocalID, depart_id: node.id,iconUls:"icon-man" },function (data) {
                    XCommon.ClosWating();
					if (!data.Success) {
						alert(data.Message);
						return;
					}                                     
					$('#tt').tree('append', {   
                    parent:node.target,   
                    data:JSON2.parse(data.Data)   
                                   }); 
                                    $('#tt').tree('toggle',node.target);
				});
         
         }
		else if (node.attributes.kind == "U") {
				$('#win').window({
					title: '查看人员',
					iconCls: 'icon-edit',
					maximizable: false,
					minimizable: false
				});
				$('#win').window('open');
				id = undefined; ;
				clearForm();
				Ajax(false, sys["GetUserFile"], { LoginID: LocalID, id: node.id }, function (data) {
					if (!data.Success) {
						alert(data.Message);
						return;
					}
					//向弹出窗口中赋值
					loadDataToWin(data.Data);
					setDisable();
				});
			}       
 }

//初始化树数据
var iniTree = function () {
	tree = $('#tt').tree({
		animate: true,
		onClick: function (node) {
        id = node.id;
                treeNode=node;
				loaddata('', id, '', '', '', '', '');
				depFlag = true;
				setDisable();     
                treeEvent(node); 			
		},
        onBeforeExpand:function(node){
        var target=node.children||undefined;
                if(target&&target.length&&target.length!=0){
                for (var i = 0; i < target.length; i++) {
                if(target[i].attributes.kind=="U"){
                  return;
                    }}}
                XCommon.ShowWaiting('加载人员信息中');       
                Ajax(false,global.sys["GetUserTreeOfDepart"], { LoginID: LocalID, depart_id: node.id,iconUls:"icon-man" },function (data) {
                    XCommon.ClosWating();
					if (!data.Success) {
						alert(data.Message);
						return;
					}                                     
					$('#tt').tree('append', {   
                    parent:node.target,   
                    data:JSON2.parse(data.Data)   
                                   }); 
        });
        }
    });
};

//修改人员
var UpdateUser = function (dataTemp) {
	Ajax(true, sys["UpdateUserFile"], dataTemp, function (data) {
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		$.messager.alert("提示", "<p class='infoReport'>修改成功!</p>", "info");
		$('#win').window('close');
        loaddata(dataTemp.user_name,dataTemp.depart_id,dataTemp.userid_num,dataTemp.sex,dataTemp.polit_face,dataTemp.tech_post,dataTemp.degree1);
		setEnable();
	});
	 if(picChange){
				var idTemp=dataTemp.id;
				var msg;
				ajaxFileUpload(global.sys["UpUserFilePhoto"], { LoginID: LocalID, id: idTemp }, "file_upload", function (data, status) {
				if (!data.Success) {
					msg=data.Message;
				}else{
				 msg="图片上传成功";
				}
				$.messager.show({
				title:'消息',
				msg:msg,
				timeout:5000,
				showType:'slide'
							   });
											   });
			   }
};

//初始化按钮事件
var iniEvent = function () {
   $('#fileConfirm').click(fileConfirmClick);
   $('#fileImport').click(fileImport);
   $('#fileExport').click(fileExport);
   fileKindChange();
   allClick();
    iniFileUpload();
	$("#search").click(function () {
		PageNum = 1;
		var p = datatable.datagrid('getPager');
		p.pagination('select', 1);
		depFlag = false;
		loaddata($("#user_name1").val(), $("#depart_id1").combobox("getValue"), $("#userid_num1").val(), $("#sex1").combobox("getValue"), $("#polit_face1").combobox("getValue"), $("#tech_post1").combobox("getValue"), $("#degree1").combobox("getValue"));
	});

	$("#close").click(function () {
		$('#win').window('close');
	});
	$('#clear').click(function () {
		$("#user_name1").val('');
		$("#depart_id1").combobox("setValue", '');
		$("#userid_num1").val('');
		$("#sex1").combobox("setValue", '');
		$("#polit_face1").combobox("setValue", '');
		$("#tech_post1").combobox("setValue", '');
		$("#degree1").combobox("setValue", '');
	});
	iniPicUpload();	
	$("#save").click(function () {
	 var psdTemp=$("#password").val();
	 if(psdTemp!=""&&psdTemp.length!=4){
	 $.messager.alert("提示", "<p class='infoReport'>门禁密码限定4位</p>", "error");
			return;
	 }
		if ($("#user_name").val() == "") {
			$.messager.alert("提示", "<p class='infoReport'>用户名不能为空</p>", "error");
			return;
		}
		if ($("#user_kind").combobox("getValue") == "") {
			$.messager.alert("提示", "<p class='infoReport'>人员种类不能为空</p>", "error");
			return;
		}
		//取值
		if ($("#role_id").combobox("getValue") == "") {
			$.messager.alert("提示", "<p class='infoReport'>角色不能为空</p>", "error");
			return;
		}
		var depart_id = $("#depart_id").combobox("getValue");
		if (depart_id == "") {
			$.messager.alert("提示", "<p class='infoReport'>部门不能为空</p>", "error");
			return;
		}
		var result = true;
		var allData = $("#depart_id").combobox("getData");   //获取combobox所有数据
		for (var i = 0; i < allData.length; i++) {
			if (depart_id == allData[i]["id"]) {
				result = false;
				break;
			}
		}
		if (result) {
			$.messager.alert("提示", "<p class='infoReport'>部门名选择错误</p>", "error");
			return;
		}
		var user_kind = $("#user_kind").combobox("getValue");
		result = true;
		allData = $("#user_kind").combobox("getData");   //获取combobox所有数据
		for (var i = 0; i < allData.length; i++) {
			if (user_kind == allData[i]["id"]) {
				result = false;
				break;
			}
		};
		if (result) {
			$.messager.alert("提示", "<p class='infoReport'>用户种类选择错误</p>", "error");
			return;
		}
		var role_id = $("#role_id").combobox("getValue");
		result = true;
		allData = $("#role_id").combobox("getData");   //获取combobox所有数据
		for (var i = 0; i < allData.length; i++) {
			if (role_id == allData[i]["id"]) {
				result = false;
				break;
			}
		};
		if (result) {
			$.messager.alert("提示", "<p class='infoReport'>角色选择错误</p>", "error");
			return;
		}
		var user_name = $("#user_name").val();
		var userid_num = $("#userid_num").val();
		var sex = $("#sex").combobox("getValue");
		var birthday = $("#birthday").datebox("getValue"); //
		var using_cardnum = $("#using_cardnum").val();
		var h_address = $("#h_address").val();
		var h_telephonenumber = $("#h_telephonenumber").val();
		var marry = $("#marry").combobox("getValue");
		var polit_face = $("#polit_face").combobox("getValue");
		var tech_post = $("#tech_post").combobox("getValue");
		var nation = $("#nation").combobox("getValue");
		var degree = $("#degree").combobox("getValue");
			var class_kind=$('#class_kind').combobox("getValue");
		var college = $("#college").val();
		var profession = $("#profession").val();
		var hand_tel = $("#hand_tel").val();
		var account = $("#account").val();
		var email = $("#email").val();
		var bank_account = $("#bank_account").val();
		var car_userkind = $("#car_userkind").val();
		var psw = $("#psw").val();
		var password = $("#password").val();
		
		var idcard = $('#idcard').val();
		var class_kind=$('#class_kind').combobox("getValue");
		//默认值01
		var work_type = $('#work_type').combobox("getValue") || '01';
		//判断就职选择情况
		if (work_type != '01' && work_type != '02' && work_type != '03') {
			$.messager.alert("提示", "<p class='infoReport'>就职情况选择错误</p>", "error");
			return;
		}
		//如果部门发生改变,则将值赋予
		if (userMainData.depOld) {
			if (userMainData.depOld != depart_id) {
				var depChanged = true;
			}
		}
		var dataTemp = {
			LoginID: LocalID,
			id: id,
			user_name: user_name,
			depart_id: depart_id,
			user_kind: user_kind,
			userid_num: userid_num,
			sex: sex,
			birthday: birthday,
			using_cardnum: using_cardnum,
			h_address: h_address,
			h_telephonenumber: h_telephonenumber,
			marry: marry,
			polit_face: polit_face,
			tech_post: tech_post,
			nation: nation,
			degree: degree,
			college: college,
			finish_school: '2015-05-05',
			profession: profession,
			hand_tel: hand_tel,
			account: account,
			email: email,
			bank_account: bank_account,
			car_userkind: car_userkind,
			password: password,
			role_id: role_id,
			psw: psw,
			work_type: work_type,
			idcard: idcard,
			class_kind:class_kind
		};
		//如果默认不输入,则不传入两个密码
		if (password == ''||password=="FFFF") {
			delete dataTemp.password;
		}
		if (psw == '') {
			delete dataTemp.psw;
		}

		//新增
		if (id === null) {
			delete dataTemp.id;
			Ajax(true, sys["NewUserFile"], dataTemp, function (data) {
				if (!data.Success) {
					alert(data.Message);
					return;
				}
				if(picChange){
				var idTemp=data.Data;
				ajaxFileUpload(global.sys["UpUserFilePhoto"], { LoginID: LocalID, id: idTemp }, "file_upload", function (data, status) {
				if (!data.Success) {
					alert(data.Message);
					return;
				}else{
				 msg="图片上传成功";
				} 
				$.messager.show({
				title:'消息',
				msg:msg,
				timeout:5000,
				showType:'slide'
							   });
                });	    
			}
				$.messager.confirm('提示', "<p class='infoReport'>保存成功,是否继续增加人员?</p>", function (r) {
					if (r) {
						clearForm();
						setEnable();
						$('#work_type').combobox('setValue', '01');
						$('#work_type').combobox('disable', true);
					} else {
						$('#win').window('close');
					}
				});
				loaddata('', id, '', '', '', '', '');
			});    //修改
		} else if (id) {
			if (depChanged) {
				$.messager.confirm('提示', "<p class='infoReport'>是否继承新部门门禁权限?</p>", function (r) {
					if (r) {
						dataTemp.mjflag = 1;
					}
					$.messager.confirm('提示', "<p class='infoReport'>是否继承新部门T控权限?</p>", function (r) {
						if (r) {
							dataTemp.tkflag = 1;
						}
						//如果离职或辞退.则先退卡
						if (work_type == "02" || work_type == "03") {
							if (mjFlagW) {
								Ajax(true, global.mj.GetMjCardUsingPageList, { LoginID: LocalID, user_file_id: id, pageSize: 9999, pageNum: 1 }, function (datamjData) {
									if (!datamjData.Success) {
										$.messager.alert('提示', datamjData.message, 'error');
										return;
									}
									var hasMjCard = false;
									for (var i in datamjData.Data) {
										if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
											hasMjCard = true;
											break;
										}
									}
									//如果门禁有在用的卡退掉
									if (hasMjCard) {
										var strMj = "是否清退以下所有卡?<br />";
										var cardMj = "";
										for (var i = 0; i < datamjData.Data.length; i++) {
											if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
												strMj += datamjData.Data[i].card_id + "&nbsp;&nbsp;";
												cardMj += datamjData.Data[i].card_id + "|"
											}
										}
										var n = cardMj.lastIndexOf('|');
										cardMj = cardMj.substring(0, n - 1);
										$.messager.confirm("提示", strMj, function (r) {
											if (r) {
												Ajax(true, global.mj.RecycleCardMjCardUsingEx, { LoginID: LocalID, card_id: cardMj }, function (dataMjDel) {
													if (!dataMjDel.Success) {
														$.messager.alert('提示', dataMjDel.message, 'error');
														return;
													}
													$.messager.alert('提示', "<p class='infoReport'>清理门禁卡成功</p>", 'error');
													//更新人员
													UpdateUser(dataTemp);
												});
											} else {
												$.messager.alert("提示", "<p class='infoReport'>修改人员失败,请先删除门禁卡</p>", "info");
											}
										});
										//如果已经没有在用的卡
									} else {
										UpdateUser(dataTemp);
									}
								});
								//没有门禁模块
							} else {
								UpdateUser(dataTemp);
							}
							//没有改变就职情况
						} else {
							UpdateUser(dataTemp);
						}
					});
				});
			} else {
				//如果离职或辞退.则先退卡
				if (work_type == "02" || work_type == "03") {
					if (mjFlagW) {
						Ajax(true, global.mj.GetMjCardUsingPageList, { LoginID: LocalID, user_file_id: id, pageSize: 9999, pageNum: 1 }, function (datamjData) {
							if (!datamjData.Success) {
								$.messager.alert('提示', datamjData.message, 'error');
								return;
							}
							var hasMjCard = false;
							for (var i in datamjData.Data) {
								if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
									hasMjCard = true;
									break;
								}
							}
							//如果门禁有在用的卡退掉
							if (hasMjCard) {
								var strMj = "是否清退以下所有卡?<br />";
								var cardMj = "";
								for (var i = 0; i < datamjData.Data.length; i++) {
									if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
										strMj += datamjData.Data[i].card_id + "&nbsp;&nbsp;";
										cardMj += datamjData.Data[i].card_id + "|"
									}
								}
								var n = cardMj.lastIndexOf('|');
								cardMj = cardMj.substring(0, n - 1);
								$.messager.confirm("提示", strMj, function (r) {
									if (r) {
										Ajax(true, global.mj.RecycleCardMjCardUsingEx, { LoginID: LocalID, card_id: cardMj }, function (dataMjDel) {
											if (!dataMjDel.Success) {
												$.messager.alert('提示', dataMjDel.message, 'error');
												return;
											}
											$.messager.alert('提示', "<p class='infoReport'>清理门禁卡成功</p>", 'error');
											//更新人员
											UpdateUser(dataTemp);
										});
									} else {
										$.messager.alert("提示", "<p class='infoReport'>修改人员失败,请先删除门禁卡</p>", "info");
									}
								});
							} else {
								UpdateUser(dataTemp);
							}
						});
					} else {
						UpdateUser(dataTemp);
					}
				} else {
					UpdateUser(dataTemp);
				}
			}
		} else {
			$.messager.alert("提示", "<p class='infoReport'>查看状态下不保存数据</p>", "info");
			$('#win').window('close');
		}
	});
};

//获取基础数据
var initializeBaseData = function () {
	var polit_face_id =
[
{ id: "01", value: "群众" },
	{ id: "02", value: "少先队员" },
	{ id: "03", value: "共青团员" },
	{ id: "04", value: "共产党员" },
	{ id: "05", value: "国民党革命委员会" },
	{ id: "06", value: "民主同盟" },
	{ id: "07", value: "民主建国会" },
	{ id: "08", value: "民主促进会" },
	{ id: "09", value: "中农工民主党" },
	{ id: "10", value: "致公党" },
	{ id: "11", value: "九三学社" },
	{ id: "12", value: "台湾民主自治同盟" },
	{ id: "99", value: "其它" }
];
	var degree = [
{ id: "01", value: "无" },
{ id: "02", value: "小学" },
{ id: "03", value: "初中" },
{ id: "04", value: "高中" },
{ id: "05", value: "中专" },
{ id: "06", value: "高职" },
{ id: "07", value: "专科" },
{ id: "08", value: "本科" },
{ id: "09", value: "硕士" },
{ id: "10", value: "博士" },
{ id: "99", value: "其它"}];


	//获取部门
	Ajax(true, sys["GetDepartList"], { LoginID: LocalID }, function (data) {
		if (!data.Success) {
			alert(data.Message);
			// $('#text').select();
			return;
		};

		allDepart = data.Data;

		$('#depart_id').combobox({
			data: allDepart,
			valueField: 'id',
			textField: 'department'
		});
		$('#depart_id1').combobox({
			data: allDepart,
			valueField: 'id',
			textField: 'department'
		});
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});

	//人员种类
	Ajax(false, sys["GetUserKindList"], { LoginID: LocalID }, function (data) {
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		allUserKind = data.Data;
		$('#user_kind').combobox({
			data: allUserKind,
			valueField: 'id',
			textField: 'user_kind'
		});
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});

	//职称
	Ajax(false, sys["GetMngPostList"], { LoginID: LocalID }, function (data) {  //需要修改函数名称
		//先判断下数据是否正常
		//先不判断是否登入,方便调试
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		allPost = data.Data;
		$('#tech_post').combobox({
			data: allPost,
			valueField: 'id',
			textField: 'post_name'
		});
		$('#tech_post1').combobox({
			data: allPost,
			valueField: 'id',
			textField: 'post_name'
		});
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});

	//名族
	Ajax(false, sys["GetNationList"], { LoginID: LocalID }, function (data) {  //需要修改函数名称
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		allNation = data.Data;
		$('#nation').combobox({
			data: allNation,
			valueField: 'id',
			textField: 'nation'
		});
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});

	//角色
	Ajax(false, sys["GetPZUserRoleList"], { LoginID: LocalID }, function (data) {  //需要修改函数名称
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		allRole = data.Data;
		$('#role_id').combobox({
			data: allRole,
			valueField: 'id',
			textField: 'rolename'
		});
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});
	 //职务
	Ajax(false, sys["GetHeadshipList"], { LoginID: LocalID }, function (data) {  //需要修改函数名称
		if (!data.Success) {
			alert(data.Message);
			return;
		}
	  if(data.Data){
		$('#class_kind').combobox({
			data: data.Data,
			valueField: 'id',
			textField: 'headship'
		});
		}
		if (datatable) {
			datatable.datagrid('loadData', jsondata);
		}
	});

	$('#polit_face').combobox({
		data: polit_face_id,
		valueField: 'id',
		textField: 'value'
	});
	$('#polit_face1').combobox({
		data: polit_face_id,
		valueField: 'id',
		textField: 'value'
	});
	$('#marry').combobox({
		data: [{ value: '1', text: '已婚' }, { value: '0', text: '未婚'}],
		valueField: 'value',
		textField: 'text'
	});

	$('#isUse').combobox({
		data: selectData,
		valueField: 'value',
		textField: 'text'
	});

	$('#cardUsed').combobox({
		data: selectData,
		valueField: 'value',
		textField: 'text'
	});
	$('#degree').combobox({
		data: degree,
		valueField: 'id',
		textField: 'value'
	});
	$('#degree1').combobox({
		data: degree,
		valueField: 'id',
		textField: 'value'
	});
	$('#work_type').combobox({
		data: [{ value: '01', text: '在职' }, { value: '02', text: '离职' }, { value: '03', text: '辞退'}],
		valueField: 'value',
		textField: 'text'

	})
};

//获取所有数据
function loaddata(user_name1, depart_id1, userid_num1, sex1, polit_face1, tech_post1, degree1) {
	datatable.datagrid('unselectAll');
	//重新初始化.上传文件
	iniPicUpload(); 
	picChange=false;
	Ajax(true, global.sys.GetUserFilePageListEx, {
		LoginID: LocalID, user_name: user_name1, depart_id: depart_id1, userid_num: userid_num1, sex: sex1, polit_face: polit_face1, tech_post: tech_post1, degree: degree1, sortName: sortName, sortOrder: (sortOrder == "asc" ? false : true), pageSize: PageSize, pageNum: PageNum
	}, function (data) {
		if (!data.Success) {
			alert(data.Message);
			$('#user_name1').select();
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
				//如果点击查询,强制搜索输入部门的值
				//如果没有则查询树部门的值
				var dep = $("#depart_id1").combobox("getValue") || id;
				if (!depFlag) {
					dep = $("#depart_id1").combobox("getValue");
				}
				loaddata($("#user_name1").val(), dep, $("#userid_num1").val(), $("#sex1").combobox("getValue"), $("#polit_face1").combobox("getValue"), $("#tech_post1").combobox("getValue"), $("#degree1").combobox("getValue"));
			}
		});

	});
}

//加载数据
function loadDataToWin(rowData) {
	$('#user_name').val(rowData.user_name);
	$('#depart_id').combobox('setValue', rowData.depart_id);
	$('#user_kind').combobox('setValue', rowData.user_kind);
	$('#userid_num').val(rowData.userid_num);
	$('#sex').combobox('setValue', rowData.sex);
	$('#birthday').datebox('setValue', rowData.birthday);
	$('#using_cardnum').val(rowData.using_cardnum);
	$('#h_address').val(rowData.h_address);
	$('#h_telephonenumber').val(rowData.h_telephonenumber);
	$('#marry').combobox('setValue', rowData.marry);
	$('#polit_face').combobox('setValue', rowData.polit_face);
	$('#tech_post').combobox('setValue', rowData.tech_post);
	$('#nation').combobox('setValue', rowData.nation);
	$('#degree').combobox('setValue', rowData.degree);
	$('#college').val(rowData.college);
	$('#profession').val(rowData.profession);
	$('#hand_tel').val(rowData.hand_tel);
	$('#account').val(rowData.account);
	$('#email').val(rowData.email);
	$('#bank_account').val(rowData.bank_account);
	$('#car_userkind').val(rowData.car_userkind);
	$('#password').val(rowData.password);
	$('#role_id').combobox('setValue', rowData.role_id);
	$('#work_type').combobox('setValue', rowData.work_type);
	$('#idcard').val(rowData.idcard);
	$('#class_kind').combobox('setValue', rowData.class_kind);
	document.getElementById('personPhoto').src="../../Photo/"+rowData.photo;
	//$('#psw').val(rowData.psw);
}

//清空旧数据
function clearForm() {
	$('#user_name').val('');
	$('#depart_id').combobox('setValue', '');
	$('#user_kind').combobox('setValue', '');
	$('#userid_num').val('');
	$('#sex').combobox('setValue', '');
	$('#birthday').datebox('setValue', '');
	$('#using_cardnum').val('');
	$('#h_address').val('');
	$('#h_telephonenumber').val('');
	$('#marry').combobox('setValue', '');
	$('#polit_face').combobox('setValue', '');
	$('#tech_post').combobox('setValue', '');
	$('#nation').combobox('setValue', '');
	$('#degree').combobox('setValue', '');
	$('#college').val('');
	$('#profession').val('');
	$('#hand_tel').val('');
	$('#account').val('');
	$('#email').val('');
	$('#bank_account').val('');
	$('#car_userkind').val('');
	$('#password').val('');
	$('#role_id').combobox('setValue', '');
	$('#psw').val('');
	$('#work_type').combobox('setValue', '');
	 $('#class_kind').combobox('setValue', '');
	$('#idcard').val('');
	 document.getElementById('personPhoto').src="";
}

var fileExport=function(){
$('#yilai').combobox('setValue', 'user_name');
$('#paixu').combobox('setValue', 'asc');
$('#com').combobox('setValue', 'text');
$("#notAll").attr("checked", false);
$("#all").attr("checked", true);
 var d = $("#do").find("input:checkbox");
  d.prop("checked", true).attr('disabled',false);
 for (var i = 6; i < 24; i++) {
     var temp="#temp"+i;
     $(temp).attr("checked",false);
}
 
$('#winExport').css('display','block');
$('#commonPart').css('display','none'); 
$('#do').css('display','block');
$('#doImport').css('display','none');
$('#winFile').panel({title:'导出',height:'200px',width:'620px',iconCls:'exicon-20130406125519344_easyicon_net_16'}).window('open');
};

var fileImport=function(){
$('#notAll').attr("checked", false);
$('#all').attr("checked", true);
$('#winExport').css('display','none');
$('#do').css('display','none');
$('#doImport').css('display','block');
 $("#doImport").find("input:checkbox").prop("checked", true).attr('disabled',true);;

$('#commonPart').css('display','block');
$('#winFile').panel({title:'导入',height:'200px',width:'580px',iconCls:'exicon-20130406125519344_easyicon_net_16'}).window('open');
};

function getNull(data) {
	if (data == '') {
		return null;
	} else {
		return data;
	}
}
//查询是否存在项目
//i=3 tk i=4 mj
var getExistPro = function (i) {
	Ajax(true, global.sys.ExistProject, { LoginID: LocalID, project_id: i }, function (data) {
		if (!data.Success) {
			alert(data.Message);
			return false;
		}
		return true;
	});
}

var deleUser = function (dataTemp) {
	Ajax(true, global.sys.RemoveUserFile, dataTemp, function (data) {
		if (!data.Success) {
			$.messager.alert('提示', data.Message, 'error');
			return;
		}
		$.messager.alert("提示", "<p class='infoReport'>删除成功!</p>", "info");
		loaddata('', id, '', '', '', '', '');
	});
}

//初始化表格
function iniGrid() {
	datatable = $("#dg").datagrid({
		idField: "id",
		pagination: true, //显示分页
		pageSize: PageSize, //分页大小
		pageList: [10, 20, 50, 100], //每页的个数
		//fit: true, //自动补全
		rownumbers: true,
		fitColumns: true,
		striped: true,
		iconCls: "icon-search", //图标
		title: "用户信息",
		collapsible: true,
		remotesort: false,
		//rownumbers: true,
		//sortName:'depart_id',
		singleSelect: true,
		sortName: sortName,
		sortOrder: sortOrder,
		columns: [[{
			field: 'user_name',
			title: '用户名称',
			sortable: true,
			width: 100,
			align:'center',
		}, {
			field: 'depart_id',
			title: '部门',
			sortable: true,
			width: 100,
			 align:'center',
			formatter: function (value, row, index) {
				if (allDepart != null) {
					for (var i = 0; i < allDepart.length; i++) {
						if (allDepart[i]['id'] == row.depart_id)
							return allDepart[i]['department'];
					}
					return '高部门等级';
				}
			}
		},
			{
				field: 'user_kind',
				title: '人员种类',
				sortable: true,
				width: 100,
				 align:'center',
				formatter: function (value, row, index) {
					if (allUserKind != null) {
						for (var i = 0; i < allUserKind.length; i++) {
							if (allUserKind[i]['id'] == row.user_kind)
								return allUserKind[i]['user_kind'];
						}
						return row.user_kind;
					}
				}

			},
			 {
				 field: 'userid_num',
				 title: '工号',
				 sortable: true,
				 width: 100,
				  align:'center',
			 },
			{
				field: 'h_telephonenumber',
				title: '电话',
				sortable: true,
				width: 100,
				 align:'center',
			},
			 {
				 field: 'role_id',
				 title: '角色',
				 sortable: true,
				 width: 100,
				  align:'center',
				 formatter: function (value, row, index) {
					 if (allRole != null) {
						 for (var i = 0; i < allRole.length; i++) {
							 if (allRole[i]['id'] == row.role_id)
								 return allRole[i]['rolename'];
						 }
						 return '高等级'
					 }
				 }
			 },
			 {
				 field: 'work_type',
				 title: '就职情况',
				 sortable: true,
				 width: 100,
				  align:'center',
				 formatter: function (value, row, index) {
					 if (row.work_type == '01') {
						 return '在职';
					 } else if (row.work_type == '02') {
						 return '离职';
					 } else if (row.work_type == '03') {
						 return '辞退';
					 } else {
						 return '未定义';
					 }
				 }
			 }]],
		toolbar: [
			 {
				 text: "增加", id: 'barAdd', iconCls: "icon-add", handler: function () {
					 $('#win').window({
						 title: '新增人员',
						 iconCls: 'icon-add',
						 maximizable: false,
						 minimizable: false
					 });
					 var rowData = datatable.datagrid('getSelected');
					 $('#win').window('open');
					 //清空数据
					 clearForm();
					 //添加人员就职情况
					 setEnable();
					 //添加时隐藏照片项
//                     document.getElementById('trPersonPhopo').hidden=true;
					 $('#work_type').combobox('setValue', '01');
					 $('#work_type').combobox('disable', true);
					 id = null;

				 }
			 },
			 {
				 text: "删除", id: 'barRemove', iconCls: "icon-remove", handler: function () {
					 var rowData = datatable.datagrid('getSelected');
					 if (!rowData) {
						 $.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
						 return;
					 }

					 var mjFlag;
					 Ajax(true, global.sys.ExistProject, { LoginID: id, project_id: "4" }, function (datamj) {
						 if (!datamj.Success) {
							 mjFlag = false;
						 } else {
							 mjFlag = true;
						 }
					 });


					 //检测角色等级
					 var roleFlag;
					 if (allRole != null) {
						 for (var i in allRole) {
							 if (allRole[i].id == rowData.role_id) {
								 roleFlag = true;
								 break;
							 }
							 roleFlag = false;
						 };
					 } else {
						 roleFlag = false;
					 }
					 if (!roleFlag) {
						 $.messager.alert("提示", "<p class='infoReport'>无法删除高角色等级用户</p>", "error");
						 return;
					 }
					 var dataTemp = {
						 LoginID: LocalID,
						 id: rowData.id
					 };
					 $.messager.confirm('提示', "<p class='infoReport'>确定删除该人员? </p>", function (r) {
						 if (r) {
							 //删除人员前先删除mj卡
							 if (mjFlag) {
								 Ajax(true, global.mj.GetMjCardUsingPageList, { LoginID: LocalID, user_file_id: rowData.id, pageSize: 9999, pageNum: 1 }, function (datamjData) {
									 if (!datamjData.Success) {
										 $.messager.alert('提示', datamjData.message, 'error');
										 return;
									 }
									 var hasMjCard = false;
									 for (var i in datamjData.Data) {
										 if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
											 hasMjCard = true;
											 break;
										 }
									 }
									 //如果门禁有在用的卡退掉
									 if (hasMjCard) {
										 var strMj = "是否清退以下所有卡?<br />";
										 var cardMj = "";
										 for (var i = 0; i < datamjData.Data.length; i++) {
											 if (datamjData.Data[i].work_status == "lt" || datamjData.Data[i].work_status == "us") {
												 strMj += datamjData.Data[i].card_id + "&nbsp;&nbsp;";
												 cardMj += datamjData.Data[i].card_id + "|"
											 }
										 }
										 var n = cardMj.lastIndexOf('|');
										 cardMj = cardMj.substring(0, n);
										 $.messager.confirm("提示", strMj, function (r) {
											 if (r) {
												 Ajax(true, global.mj.RecycleCardMjCardUsingEx, { LoginID: LocalID, card_id: cardMj }, function (dataMjDel) {
													 if (!dataMjDel.Success) {
														 $.messager.alert('提示', dataMjDel.message, 'error');
														 return;
													 }
													 $.messager.alert('提示', "<p class='infoReport'>清理门禁卡成功</p>", 'error');
													 //删除人员
													 deleUser(dataTemp);
												 });
											 } else {
												 $.messager.alert("提示", "<p class='infoReport'>删除人员失败,请先删除门禁卡</p>", "info");
											 }
										 });
									 } else {
										 deleUser(dataTemp);
									 }
								 });
							 } else {
								 deleUser(dataTemp);
							 }
						 }
					 });
				 }
			 },
		{
			text: "修改", id: 'barUpdate', iconCls: "icon-edit", handler: function () {
				var rowData = datatable.datagrid('getSelected');
				if (rowData == null) {
					$.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
					return;
				}
				//检测角色是否有门禁模块
				Ajax(true, global.sys.ExistProject, { LoginID: rowData.id, project_id: "4" }, function (datamj) {
					if (!datamj.Success) {
						mjFlagW = false;
					} else {
						mjFlagW = true;
					}
				});
				//检测角色等级
				var roleFlag;
				if (allRole != null) {
					for (var i in allRole) {
						if (allRole[i].id == rowData.role_id) {
							roleFlag = true;
							break;
						}
						roleFlag = false;
					};
				} else {
					roleFlag = false;
				}
				if (!roleFlag) {
					$.messager.alert("提示", "<p class='infoReport'>无法修改高角色等级用户</p>", "error");
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
				setEnable();
				//修改时隐藏照片项
//                document.getElementById('trPersonPhopo').hidden=true;
				//记录原先部门
				userMainData.depOld = rowData.depart_id;
			}
		},
		{
			text: "查看", id: 'barView', iconCls: "icon-search", handler: function () {
				var rowData = datatable.datagrid('getSelected');
				if (rowData == null) {
					$.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
					return;
				}
				$('#win').window({
					title: '查看信息',
					iconCls: 'icon-edit',
					maximizable: false,
					minimizable: false
				});
				//////////
				$('#win').window('open');
				id = undefined;
				clearForm();
				loadDataToWin(rowData);
				setDisable();
			}
		}
				],
		//排列行
		onSortColumn: function (sort, order) {
			sortName = sort;
			sortOrder = order;
			loaddata($("#user_name1").val(), $("#depart_id1").combobox("getValue"), $("#userid_num1").val(), $("#sex1").combobox("getValue"), $("#polit_face1").combobox("getValue"), $("#tech_post1").combobox("getValue"), $("#degree1").combobox("getValue"));
		},

		onDblClickCell: function (rowIndex, field, value) {
			var rowData = datatable.datagrid('getSelected');
			if (rowData == null) {
				$.messager.alert("提示", "<p class='infoReport'>未选择项</p>", "error");
				return;
			}
			$('#win').window({
				title: '查看人员',
				iconCls: 'icon-edit',
				maximizable: false,
				minimizable: false
			});
			$('#win').window('open');
			id = undefined; ;
			//添加数据
			clearForm();
			loadDataToWin(rowData);
			setDisable();
		}
	});
};

//离职,辞退方法.删除方法
var liZhiMJ = function (id) {
	Ajax(true, global.sys.ExistProject, { LoginID: id, project_id: "4" }, function (data) {
		if (!data.Success) {
			$.messager.alert("提示", data.message, 'error');
			return false;
		}
		Ajax(true, global.mj.GetMjCardUsingPageList, { LoginID: LocalID, user_file_id: id, pageSize: 9999, pageNum: 1 }, function (data) {
			if (!data.Success) {
				$.messager.alert('提示', data.message, 'error');
				return false;
			}
			//如果无卡片
			if (data.Data.length == 0) {
				$.messager.alert('提示', "<p class='infoReport'>该用户无卡片</p>", 'info');
				return true;
			}
			//有卡片处理
			var str = "是否清退以下所有卡?<br />";
			for (var i = 0; i < data.Data.length; i++) {
				str += data.Data[i].card_id + "&nbsp;&nbsp;";
			}
			var recySuc = "退卡成功卡号如下: <br />";
			var recyFail = "退卡失败卡号如下: <br />";
			$.messager.confirm("提示", str, function (r) {
				if (r) {
					for (var i in data.Data) {
						Ajax(false, global.mj.RecycleCardMjCardUsingEx
, { LoginID: LocalID, card_id: data.Data[i].card_id }, function (data1) {
	if (data1.Success) {
		recySuc += data.Data[i].card_id + "&nbsp;&nbsp;";
	} else {
		recyFail += data.Data[i].card_id + "&nbsp;&nbsp;";
	}

	return true;
});
					};
				} else {
					return false;
				}

			});
		});
	});
};

//检索是否有相关项目
var selectProj = function (id, proj) {
	Ajax(true, global.sys.ExistProject, { LoginID: id, project_id: proj }, function (data) {
		if (!data.Success) {
			return false;
		} else {
			return true;
		}
	});
};

//加载树数据
function loadTreedata() {
	Ajax(true, global.sys.GetAllDepartTree, { LoginID: LocalID,  iconCls: 'exicon-house', state: 'closed' }, function (data) {
		if (!data.Success) {
			alert(data.Message);
			return;
		}
		jsonTreeData.total = data.Data.length;
		jsonTreeData.rows = JSON2.parse(data.Data);
		tree.tree('loadData', jsonTreeData.rows);
		//不选中根节点
//        if (data.Data.length > 0) {
//            if (tree.tree('getSelected') == null) {
//                var root = tree.tree("getRoot");
//                if (root != null) {
//                    tree.tree('select', root.target);
//                }
//            }
//        }
	});
};

//页面加载完点击搜索
function clickTemp() {
	document.getElementById("search").click();
}

 $(function () {
            iniGrid();
            iniTree();
            initializeBaseData();
            loadTreedata();
            iniEvent();
            XCommon.initializeVerify();
            window.onload = clickTemp;
            XCommon.IniMM();
            $('#win').window('close');
            $('#winFile').window('close');
        });
