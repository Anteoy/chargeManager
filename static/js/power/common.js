$(function() {
});

//退出登录
function logOut(){
    $.ajax({
        type:"POST",
        data:"",
        url:"logOut.do",
        success:function(data){
            window.location="login.do";
        }
    });
}

/**
 * 时间转换工具
 */
var Util = function (){
    var FtSeats = function (str){
        /**
         * 数字补位
         * **/
        if(str<10){
            str="0"+String(str);
        }
        return str;
    };

    return {
        DateToUnix: function(year, month, day, hour, minute, second){
            /**
             * 日期 转换为 Unix时间戳
             * @param <int> year    年
             * @param <int> month   月
             * @param <int> day     日
             * @param <int> hour    时
             * @param <int> minute  分
             * @param <int> second  秒
             * @return <int>        unix时间戳(秒)
             */
            if(arguments.length > 4) {
                var oDate =new Date(Date.UTC(parseInt(year),
                    parseInt(month), parseInt(day),
                    parseInt(hour), parseInt(minute),
                    parseInt(second)
                ));
            } else {
                var oDate = new Date(year);
            }

            return (Math.floor(oDate.getTime()/1000));
        },
        UnixToDate: function(unixTime, isFull, timeZone){
            /**
             * 时间戳转换日期
             * @param <int> unixTime    待时间戳(秒)
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
             * @param <int>  timeZone   时区
             */
            if (typeof(timeZone) == 'number'){
                unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
            }

            if(isNaN(unixTime)){
                return unixTime;
            }else if(unixTime.length<10){
                return "-";
            }else if(unixTime.length==10){
                unixTime+="000";
            }
            var time = new Date(Math.floor(unixTime/1000)*1000);
            var ymdhis = "";
            ymdhis += time.getFullYear() + "/";
            ymdhis += FtSeats(time.getMonth() +1)+ "/";
            ymdhis += FtSeats(time.getDate());
            if ( isFull === true ){
                ymdhis += " " + FtSeats(time.getHours()) + ":";
                ymdhis += FtSeats(time.getMinutes());// + ":";
                //ymdhis += FtSeats(time.getSeconds());
            }
            return ymdhis;
        },
        DatetoDate: function(date, isDull, timeZone) {
            var unix = this.DateToUnix(date).toString();
            return this.UnixToDate(unix, isDull, timeZone);
        }

    }
}();

/**
 * 身份证校验
 * @param card
 * @returns true or false
 */
function isIdCard(obj) {
    var card = obj.value;
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (card.trim() == '') {
        return false;
    }
    if (reg.test(card)) {
        return true;
    } else {
        alert('请输入18位合法身份证号码！！！');
        //window.setTimeout( function(){ document.getElementById(obj.id).focus(); }, 0);
        return false;
    }
}

function checkTel(obj){
    var regIsPhone = /^(0[0-9]{2,3}-?)[0-9]{7,8}$/;
    var reguIsMob = /^(1+\d{10})|(\d{5,20})$/;
    /* var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/*/;
    var mobile = $(obj).val();
    if(regIsPhone.test(mobile)||reguIsMob.test(mobile)){
        return true;
    }
    else{
        /*alert("电话号码不正确！！！")*/
        return false;
    }
}

/**
 * 身份证校验18位
 * @param card
 * @returns true or false
 */
function isIdCardByValue18(value) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value.trim() == '') {
        return false;
    }
    if (reg.test(value)) {
        return true;
    } else {
        return false;
    }
}