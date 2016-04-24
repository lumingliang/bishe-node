


var email = require('./sendEmail.js');
//  初始化
var to = new Date(); //当天的完整时间
var today = to.getD(2); //当天的年月日
var emailHadSendToday = {};
var trySendErr = true;
// 设定今日的excel路径(只使用media下的) 
var todayExcel = { path: '/media/' + to.getD(4) +'.xlsx', name: to.getD(4) + '.xlsx'  };
emailHadSendToday[today] = false;

function sendEmail() {
    // 先判断emailHadSendToday储存的键是不是今天，如果不是今天，就设定为今天
    if(! istoday( to )) {

        delete emailHadSendToday[today];
        to = new Date();
        today = to.getD(2);
        todayExcel = { path: '/media/' + to.getD(4) +'.xlsx', name: to.getD(4) + '.xlsx'  };
        emailHadSendToday[today] = false;
    }
 

    // 如果今天已经发了邮件就不发了
    if( emailHadSendToday[today] == true ) {
        return;
    }

    // 如果今天没发,构造今天完整时间戳
    //var date = new Date().getD(2); //2016-03-22
    var emailDateStr = today + ' ' + env.emailTime;
    var emailDate = new Date(emailDateStr); 
    if( trySendErr == true ) {
        // 如果尝试发送邮件失败，即发送存在错误，则反复调用
        email(todayExcel.path, todayExcel.name, function( err, message ) {

            if(err) {
                console.log('email send err'+err);
                trySendErr = true;
                sendEmail();
            } else {
                trySendErr = false;
            }
        });
    }

    var date = new Date(); //获取当前时间
    if( Math.abs( date.getTime() - emailDate.getTime() )%86400%3600/60 < 2  ) {
        // 如果两个时间绝对值小于两分，就发送邮件
        email(todayExcel.path, todayExcel.name, function( err, message ) {

            if(err) {
                console.log(err);
                trySendErr = true;
            } else {
                trySendErr = false;
                emailHadSendToday[today] = true;
            }

        });
    } 
}

function testEmailSend() {
    email(todayExcel.path, todayExcel.name, function( err, message ) {

            if(err) {
                console.log(err);
                trySendErr = true;
            } else {
                trySendErr = false;
                //emailHadSendToday[today] = true;
            }
    });
}
          
          

function istoday(d) {
    
    var d0 = new Date();
    if( Math.abs( d0.getTime() - d.getTime() )%86400 == 0) {
        console.log('is today');
        return true;
    }else {
        console.log('not today');
        return false;
    }
}

// 设定监测时钟，60s
var senEmailHandle = setInterval( function() {
    try{
        sendEmail();
    } catch(err) {
        console.log('trycatch send email err:'+err);
    } 
}, 6000);
    
