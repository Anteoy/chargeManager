$(function () {
    // 1.初始化Table
    // var oTable = new TableInit(1);
    // oTable.Init();
    // 2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

    $("#approveStatus").change(function () {
    	toggleBankCard();
    });
    $('#resetBtn').click(function(){
    	$("#approveStatus").val(1);
    	toggleBankCard();
    	var bootstrapValidator = $("#dataForm007").data('bootstrapValidator');
    	bootstrapValidator.resetForm();
    });
    $('#dataForm007').bootstrapValidator({
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '*姓名为空'
                    },
                    stringLength: {
                        max: 20,
                        message: '*请输入有效20位以下姓名'
                    }
                }
            },
            idCard: {
                validators: {
                   /* notEmpty: {
                        message: null
                    },*/
                    regexp: {
                        regexp: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|x|X){1})$/,
                        message: '*请输入18位有效身份证号'
                    }
                }
            },
            phone: {
                validators: {
                    /*notEmpty: {
                        message: null
                    },*/
                    regexp: {
                        regexp: /^(\d{3,4}-\d{7,8})|(\d{10,12}|1\d{10})$/,
                        message: '*请输入有效手机号或固定电话,固定电话请以-隔开'
                    }
                }
            },
            bankCardNo: {
                validators: {
                    regexp: {
                        regexp: /^(\d{16}|\d{19})$/,
                        message: '*请输入16位或19位有效银行卡号'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
        tableRefresh();
    })/*.on('error.form.bv', function(e) {
        var dataNeedDeal = $("#dataForm007").attr("data-need-deal");
        if(dataNeedDeal) {
            // dataDeal();
        }
    });*/;
});
function oo() {
    $.ajax({
        url:"/info",
        type:"get",
        dataType:"json",
        success: function (data) {
            console.info(data)
        },
        error: function () {

        }
    })
}
var TableInit = function (type) {
    switch (type) {
        case 1://自有黑名单
            $("#bankCardH").show()
            var param_in = [{
                field: 'name',
                title: '姓名',
                // sortable: true,
            }, {
                field: 'userIdCard',
                title: '身份证号'
            }, {
                field: 'userPhoneNumber',
                title: '电话号码'
            }, {
                field: 'bankCardNo',
                title: '银行卡号'
            }]
            var oTableInit = new Object();
            // 初始化Table
            oTableInit.Init = function () {
                $('#tb_case').bootstrapTable({
                    url: 'queryAllUser', // 请求后台的URL（*）
                    method: 'get', // 请求方式（*）
                    toolbar: '#toolbar', // 工具按钮用哪个容器
                    toolbarAlign: 'right', // 工具按钮用哪个容器
                    buttonsAlign: "right",//按钮对齐方式
                    striped: true, // 是否显示行间隔色
                    cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, // 是否显示分页（*）
                    sortable: false, // 是否启用排序
                    sortName: "createTime",
                    sortOrder: "DESC", // 排序方式
                    queryParams: oTableInit.queryParams,// 传递参数（*）
                    queryParamsType: "limit",
                    sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber: 1, // 初始化加载第一页，默认第一页
                    pageSize: 10, // 每页的记录行数（*）
                    pageList: [10, 25, 50, 100], // 可供选择的每页的行数（*）
                    search: false, // 是否显示表格搜索
                    strictSearch: false,
                    searchOnEnterKey: false,//回车搜索
                    showColumns: false, // 是否显示所有的列
                    minimumCountColumns: 2, // 最少允许的列数
                    clickToSelect: true, // 是否启用点击选中行
                    //height : 540, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId: "id", //每一行的唯一标识，一般为主键列
                    showToggle: false, // 是否显示详细视图和列表视图的切换按钮
                    cardView: false, // 是否显示详细视图
                    detailView: false, // 是否显示父子表
                    columns: param_in,
                });
            };
            // 得到查询的参数
            oTableInit.queryParams = function (params) {
                var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    limit: params.limit, // 页面大小
                    offset: params.offset, // 页码
                    classify: $("#approveStatus").val(),//分类
                    "blackListData.userPhoneNumber": $("#phone").val().trim().replace("-",""),
                    "blackListData.userIdCard": $("#idCard").val().trim().replace("-",""),
                    "blackListData.bankCardNo" : $("#bankCardNo").val().trim().replace("-","")
                };
                return temp;
            };
            break;
        case 2://人员
            $("#bankCardH").hide()
            var param_in = [{
                field: 'name',
                title: '姓名',
                // sortable: true,
            }, {
                field: 'idCard',
                title: '身份证号'
            }, {
                field: 'mobilePhone',
                title: '电话号码'
            }, {
                field: 'staffType',
                title: '人员类型',
                formatter: function (value, row, index) {
                    switch(value){
                        case "1":
                            return "销售人员"
                        case "2":
                            return "商户人员"
                        case "4":
                            return "中介人员"
                        case "3":
                            return "催收人员"
                        default:
                            return ""
                    }
                }
            },{
                field: 'createTime',
                title: '创建时间'
            }]
            var oTableInit = new Object();
            // 初始化Table
            oTableInit.Init = function () {
                $('#tb_case').bootstrapTable({
                    url: 'blackList/esInfoQuery.do', // 请求后台的URL（*）
                    method: 'get', // 请求方式（*）
                    toolbar: '#toolbar', // 工具按钮用哪个容器
                    toolbarAlign: 'right', // 工具按钮用哪个容器
                    buttonsAlign: "right",//按钮对齐方式
                    striped: true, // 是否显示行间隔色
                    cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, // 是否显示分页（*）
                    sortable: false, // 是否启用排序
                    sortName: "createTime",
                    sortOrder: "DESC", // 排序方式
                    queryParams: oTableInit.queryParams,// 传递参数（*）
                    queryParamsType: "limit",
                    sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber: 1, // 初始化加载第一页，默认第一页
                    pageSize: 10, // 每页的记录行数（*）
                    pageList: [10, 25, 50, 100], // 可供选择的每页的行数（*）
                    search: false, // 是否显示表格搜索
                    strictSearch: false,
                    searchOnEnterKey: false,//回车搜索
                    showColumns: false, // 是否显示所有的列
                    minimumCountColumns: 2, // 最少允许的列数
                    clickToSelect: true, // 是否启用点击选中行
                    //height : 540, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId: "id", //每一行的唯一标识，一般为主键列
                    showToggle: false, // 是否显示详细视图和列表视图的切换按钮
                    cardView: false, // 是否显示详细视图
                    detailView: false, // 是否显示父子表
                    columns: param_in,
                });
            };
            // 得到查询的参数
            oTableInit.queryParams = function (params) {
                var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    limit: params.limit, // 页面大小
                    offset: params.offset, // 页码
                    classify: $("#approveStatus").val().trim().replace("-",""),//分类
                    "blackListData.userPhoneNumber": $("#phone").val().trim().replace("-",""),
                    "blackListData.userIdCard": $("#idCard").val().trim().replace("-","")
                };
                return temp;
            };
            break;
        case 3://案件
            $("#bankCardH").hide()
            var params = [{
                field: 'name',
                title: '姓名',
                // sortable: true,
            }, {
                field: 'idCard',
                title: '身份证号'
            }, {
                field: 'mobilePhone',
                title: '电话号码'
            }, {
                field: 'createTime',
                title: '创建时间'
            },{
                field: 'caseType',
                title: '案件类型',
                formatter: function (value, row, index) {
                    switch(value){
                        case 1:
                            return "代办包装"
                        case 2:
                            return "组团诈骗"
                        case 4:
                            return "职业信息虚假"
                        case 3:
                            return "消费套现"
                        case 5:
                            return "离职后申请"
                        case 6:
                            return "销售人员违反职业操守"
                        case 7:
                            return "销售套现"
                        case 8:
                            return "贷款拆分"
                        case 9:
                            return "非法获利"
                        case 10:
                            return "商户挂单"
                        case 11:
                            return "商户恶意倒闭"
                        case 12:
                            return "商户套现"
                        case 13:
                            return "违规操作"
                        case 14:
                            return "其他"
                        default:
                            return ""
                    }
                }
            }]
            var oTableInit = new Object();
            // 初始化Table
            oTableInit.Init = function () {
                $('#tb_case').bootstrapTable({
                    url: 'blackList/esInfoQuery.do', // 请求后台的URL（*）
                    method: 'get', // 请求方式（*）
                    toolbar: '#toolbar', // 工具按钮用哪个容器
                    toolbarAlign: 'right', // 工具按钮用哪个容器
                    buttonsAlign: "right",//按钮对齐方式
                    striped: true, // 是否显示行间隔色
                    cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, // 是否显示分页（*）
                    sortable: false, // 是否启用排序
                    sortName: "createTime",
                    sortOrder: "DESC", // 排序方式
                    queryParams: oTableInit.queryParams,// 传递参数（*）
                    queryParamsType: "limit",
                    sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber: 1, // 初始化加载第一页，默认第一页
                    pageSize: 10, // 每页的记录行数（*）
                    pageList: [10, 25, 50, 100], // 可供选择的每页的行数（*）
                    search: false, // 是否显示表格搜索
                    strictSearch: false,
                    searchOnEnterKey: false,//回车搜索
                    showColumns: false, // 是否显示所有的列
                    minimumCountColumns: 2, // 最少允许的列数
                    clickToSelect: true, // 是否启用点击选中行
                    //height : 540, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId: "id", //每一行的唯一标识，一般为主键列
                    showToggle: false, // 是否显示详细视图和列表视图的切换按钮
                    cardView: false, // 是否显示详细视图
                    detailView: true, // 是否显示父子表
                    columns: params,
                    //注册加载子表的事件
                    onExpandRow: function (index, row, $detail) {
                        oTableInit.InitSubTable(index, row, $detail);
                    }
                });
            };
            // 得到查询的参数
            oTableInit.queryParams = function (params) {
                var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    limit: params.limit, // 页面大小
                    offset: params.offset, // 页码
                    classify: $("#approveStatus").val(),//分类
                    "blackListData.userPhoneNumber": $("#phone").val().trim().replace("-",""),
                    "blackListData.userIdCard": $("#idCard").val().trim().replace("-","")
                };
                return temp;
            };
            //初始化子表格(无限)
            oTableInit.InitSubTable = function (index, row, $detail) {
                var cur_table = $detail.html('<table style="width:60%; margin:0 auto;"></table>').find('table');
                $(cur_table).bootstrapTable({
                    url: 'blackList/queryRelationPersonInfo.do', // 请求后台的URL（*）
                    method: 'get', // 请求方式（*）
                    queryParams: {"masterIdCard": row.idCard,"masterPhone":row.mobilePhone,"createTime":row.createTime},
                    queryParamsType: "limit",
                    sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
                    pageNumber: 1, // 初始化加载第一页，默认第一页
                    pageSize: 5, // 每页的记录行数（*）
                    pageList: [5, 10, 50], // 可供选择的每页的行数（*）
                    clickToSelect: true, // 是否启用点击选中行
                    uniqueId: "id", //每一行的唯一标识，一般为主键列
                    detailView: false, // 是否显示父子表
                    columns: [{
                        field: 'relationName',
                        title: '姓名',
                        width: '50%',
                    }, {
                        field: 'relationMobilePhone',
                        title: '电话号码',
                        width: '50%',
                    }]
                });
            };
            break;
    }

    return oTableInit;
};
var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};
    oInit.Init = function () {
        // 初始化页面上面的按钮事件
        /*$("#query").click(function () {
            tableRefresh();
        });*/
        /*$("#reset").click(function () {
            formReset();
        });*/
       /* $("#approveStatus").change(function () {
            tableInit();
        });*/
    };
    return oInit;
};
function tableRefresh() {
    if ($("#idCard").val().trim() != ""&&!isIdCardByValue18($("#idCard").val().trim())) {
        alert('请输入18位合法身份证号码！！！');
        return
    }
    if ($("#phone").val().trim() != ""&&!checkTel($("#phone"))) {
        alert('电话号码格式不正确！！！');
        return
    }
    if($("#bankCardNo").val().trim() != ""&& !checkBankCardValid($("#bankCardNo").val().trim())){
        alert("请输入16位或19位有效银行卡号!!!")
        return
    }
    if($("#idCard").val().trim()=="" && $("#phone").val().trim() == ""&&$("#bankCardNo").val().trim() == ""){
        alert("请至少输入一个查询条件!!!")
        return
    }
    tableInit();//valid
    $("#tb_case").bootstrapTable('refresh', {url: "blackList/esInfoQuery.do"});
    $("#queryBtn").removeAttr("disabled");
}

function tableInit() {
    if ($("#approveStatus").val() == '1') {
        $("#tb_case").bootstrapTable("destroy");
        // 1.初始化Table
        var oTable = new TableInit(1);
        oTable.Init();
    } else if ($("#approveStatus").val() == '2') {
        $("#tb_case").bootstrapTable("destroy");
        // 1.初始化Table
        var oTable = new TableInit(2);
        oTable.Init();
    } else if ($("#approveStatus").val() == '3') {
        $("#tb_case").bootstrapTable("destroy");
        // 1.初始化Table
        var oTable = new TableInit(3);
        oTable.Init();
    }
}

function toggleBankCard(){
	var approveStatus = $("#approveStatus").val();
    // tableInit(); old
    if(approveStatus == 1){
        $("#bankCardH").css("display", "block");
    } else {
    	$("#bankCardH").css("display", "none");
    	$("#bankCardNo").val("");
    	var bootstrapValidator = $("#dataForm007").data('bootstrapValidator');
    	bootstrapValidator.resetForm();
    }
}

/**
 * 检查银行卡号是否合法
 */
function checkBankCardValid(bankCard) {
    if(bankCard==undefined||bankCard == "")
        return false;
    bankCard = bankCard.trim();
    if(bankCard.length != 16 && bankCard.length != 19) {
        return false;
    }
    var reg = /^(\d{16}|\d{19})$/;
    if(!reg.test(bankCard)) {
        return false;
    }
    return true;
}