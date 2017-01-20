
/**
 * 报告审核页面显示
 * @param id
 */
function checkPage(id) {
	$("#id").val(id);
	modalShow();
}
/**
 * 报告审核提交
 * @param approveStatus
 */
function checkSubmit(approveStatus) {
	var id = $("#id").val();
	$.post(
		"staffReport/checkSubmit.do",
		{
			"staffReportLog.id" : id,
			"staffReportLog.approveStatus" : approveStatus
		},
		function(data, status) {
			if("success" == status && "checkSuccess" == data.result) {
				modalHide();
				swal({
					title : "审核成功!",
					type : "success",
					timer:1000
				});
				queryHit();
			} else {
				swal({
					title : "审核失败!",
					type : "error",
					timer:3000
				});
				modalHide();
			}
		}
	);
}
function modalShow() {
	$("#checkModal").modal("show");
}
function modalHide() {
	$("#checkModal").modal("hide");
}
function queryHit() {
	var typeOne = $("#approveStatus2 ").val()//人员 案件
	var typeTwo
	var idCard
	var phone
	if(typeOne == 1){
		if($("#type1 ").val() == 0){
			swal({
				title : "未选择人员具体类型!",
				type : "error",
				timer:3000
			});
			return
		}
		typeTwo = $("#type1 ").val()//人员分类
	}else if(typeOne == 2){
		if($("#type2 ").val() == 0){
			swal({
				title : "未选择案件具体类型!",
				type : "error",
				timer:3000
			});
			return
		}
		typeTwo = $("#type2").val()//案件分类
	}else{
		swal({
			title : "请选择人员或案件作为查询条件!",
			type : "error",
			timer:3000
		});
		return
	}

	if($("#approveStatus1 ").val() == 1){//身份证 手机号
		if($("#name").val().trim() == ""){
			swal({
				title : "请输入身份证号!",
				type : "error",
				timer:3000
			});
			return
		}
		if ($("#name").val().trim() != ""&&!isIdCardByValue18($("#name").val().trim())) {
			alert('请输入18位合法身份证号码！！！');
			return
		}
		idCard = $("#name").val()
	}else if($("#approveStatus1 ").val() == 2){
		if($("#name").val().trim() == ""){
			swal({
				title : "请输入手机号!",
				type : "error",
				timer:3000
			});
			return
		}
		if ($("#name").val().trim() != ""&&!checkTel($("#name"))) {
			alert('电话号码格式不正确！！！');
			return
		}
		phone =  $("#name").val()
	}else{
		swal({
			title : "请选择身份证或手机号作为查询条件!",
			type : "error",
			timer:3000
		});
		return
	}
	var data = {
		typeOne:typeOne,
		typeTwo:typeTwo,
		idCard :idCard,
		phone:phone
	}
	$.post(
		"blackList/redisHit.do",
		data,
		function(data, status) {
			if(data.result == "命中") {
				swal({
					title : "命中!",
					type : "success",
					timer:1000
				});
				$("#result").val(JSON.stringify(data));
			} else {
				swal({
					title : "未命中!",
					type : "error",
					timer:3000
				});
				$("#result").val(JSON.stringify(data));
			}
		}
	);
}
function formReset() {
	$("#approveStatus").val("");
	$("#name").val("");
	$("#idCard").val("");
	$("#phone").val("");
	$("#appKey").val("");
}

$(function(){
	$("#approveStatus2").change(function () {
		if($("#approveStatus2").val()== 2){
			$("#use1").hide()
			$("#use2").show()
		}else if($("#approveStatus2").val()== 1){
			$("#use1").show()
			$("#use2").hide()
			$("#use3").hide()
		}
	})

	// 初始化页面上面的按钮事件
	$("#query").click(function(){
		queryHit();
	});

	//手机号身份证切换事件
	$("#approveStatus1").change(function () {
		if($("#approveStatus1").val()== 1){//身份证
			$("#name").attr("onblur","isIdCard(this)")
		}else if($("#approveStatus1").val()== 2){//手机号
			$("#name").attr("onblur","checkTel(this)")
		}
	})
})