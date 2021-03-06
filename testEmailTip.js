
// require('./date-patch');
// env = {excelTime: 50000, emailTime: '16:39:00'}; // 50s 保存一次excel文件
var email = require('./sendEmail.js');
//  初始化
var to = new Date(); //当天的完整时间
var today = to.getD(2); //当天的年月日
var emailHadSendToday = {};
var trySendErr = false; //一开始不存在发送错误
// 设定今日的excel路径(只使用media下的) 
var todayExcel = { path: '/media/' + to.getD(4) +'.xlsx', name: to.getD(4) + '.xlsx'  };
emailHadSendToday[today] = false;



function sendEmail() {
    // 先判断emailHadSendToday储存的键是不是今天，如果不是今天，就设定为今天
    if(! istoday( to )) {
        console.log('the day come to next day');
        delete emailHadSendToday[today];
        to = new Date();
        today = to.getD(2);
        todayExcel = { path: '/media/' + to.getD(4) +'.xlsx', name: to.getD(4) + '.xlsx'  };
        emailHadSendToday[today] = false;
        console.log(emailHadSendToday);
    }
 

    // 如果今天已经发了邮件就不发了
    if( emailHadSendToday[today] == true ) {
        console.log('today have send:'+emailHadSendToday[today]);
        return 1;
    } 
        
    console.log('today not send');

    // 如果今天没发,构造今天完整时间戳
    //var date = new Date().getD(2); //2016-03-22
    var emailDateStr = today + ' ' + env.emailTime;
    console.log(emailDateStr);
    var emailDate = new Date(emailDateStr); 
    if( trySendErr == true ) {
        // 如果尝试发送邮件失败，即发送存在错误，则反复调用
        email(todayExcel.path, todayExcel.name, function( err, message ) {

            if(err) {
                console.log('try try email send err'+err);
                trySendErr = true;
                sendEmail();
            } else {
                console.log('try try send ok');
                trySendErr = false;
                emailHadSendToday[today] = true;
            }
        });
    }

    var date = new Date(); //获取当前时间
    if( Math.abs( date.getTime() - emailDate.getTime() )/1000 < 60*3  ) { // 相差秒数小于120
        // 如果两个时间绝对值小于两分，就发送邮件
        email(todayExcel.path, todayExcel.name, function( err, message ) {

            if(err) {
                console.log(err);
                trySendErr = true;
            } else {
                console.log('email send only once');
                trySendErr = false;
                emailHadSendToday[today] = true;
            }

        });
    } else {
        console.log('now is not the time');
    }
        
    
}

       
          

function istoday(d) {
    
    var d0 = new Date();
    //console.log(d0.getD(2).getTime(),d.getTime());
    t1 = new Date(d0.getD(2));
    t2 = new Date(today);
    //console.log(Math.abs( d0.getTime() - d.getTime() )/86400000);
   // return 1;
    if( Math.abs( t1 - t2 )%86400000 ==0 ) {
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
        console.log('try catch send email err:'+err);
    } 
}, 6000);
