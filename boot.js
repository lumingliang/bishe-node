
// [>jslint node:true, vars:true, bitwise:true, unparam:true <]
// [>jshint unused:true <]
// // Leave the above lines for propper jshinting
// //Type Node.js Here :)

//require('./boot');

require('./date-patch');
mraa = require('mraa');
var sht20 = require('./sht20');
console.log(sht20);

var sensor = require('./sensor');
sensor1 = sensor({port:1,threshold:{up:0.8,down:0.3} }); 
//sensor2 = sensor({port:2,threshold:{up:0.8,down:0.3} });
//sensor3 = sensor({port:3,threshold:{up:0.8,down:0.3} });
sensor4 = sensor({port:2,threshold:{up:0.8,down:0.3} });
sensor5 = sensor({port:3,threshold:{up:0.8,down:0.3} });

sensor2 = sensor({i2c:true, threshold:{up:30,down:15}, updateTime:4000,driver:sht20({bus:0, selection:0})() }); 
sensor3 = sensor({i2c:true, threshold:{up:30,down:15}, updateTime:3000,driver:sht20({bus:0, selection:1})() }); 

sensor0 = sensor({port:0, threshold:{up:30,down:15}});


// {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }
sensor1.start();
sensor2.start();
sensor3.start();
sensor4.start();
sensor5.start();
sensor0.start();

var actuator = require('./actuator');
actuator1 = actuator({port:2,relySensor:[1],threshold:[0,1]});
actuator2 = actuator({port:3,relySensor:[2],threshold:[0,1]});
// threshold to be 1
actuator3 = actuator({port:4,relySensor:[3]});
actuator4 = actuator({port:6,relySensor:[4]});
actuator5 = actuator({port:7,relySensor:[5]});

actuator1.start();
//actuator2.start();
//actuator3.start();
// actuator4.start();
// actuator5.start();



var servo = require('./servo');
servo1 = servo({port:5,relySensor:0});
servo1.start();


 // var dis = require('./display')({total:2});
 // dis.start();

//var dis = require('./lcd');
//var die = new dis.LCD(0);
//die.setCursor(0,1);
// setInterval(function(){
	// var b = 1;
	// var t = eval('sensor'+'3').rawValue;
	// console.log('tttttt'+t);
	// console.log(sensor3.rawValue+'ppppppppp');
	// //die.write(sensor3.rawValue+'jj');
// }, 2000);

// flowing ,sending data to the clound






// var fs = require('fs')
  // , Log = require('log')
  // , log = new Log('debug', fs.createWriteStream('/media/sdcard/edisonData/data.log'));


// function localRecord() {
    // var str = JSON.stringify(data);

    // log.info(str);
    // console.log('save suceess');
// }
// //setTimeout(localRecord, 5000);

// setInterval(localRecord, 5000);







var ubidots = require('ubidots');
var client = ubidots.createClient('0559ba2a343a8980b16c5b8e8e4e6635dc73fe09');
client.auth(function () {

	//var ds = this.getDatasource('5663dec77625421b3c0ac60b');

// {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }
	var temperatrue = this.getVariable('5663df2e7625421b79f0c840');
	var light = this.getVariable('5663e9b876254231c9bed7be');
	var co2 = this.getVariable('5663ea1d762542300bcb57fa');
	var NH3 = this.getVariable('5663eaaa762542330013f997');
	var humidity = this.getVariable('5663eb677625423594bf16d1');
	var weight = this.getVariable('5663eb95762542338ec79794');

	function saveData() {
		weight.saveValue(sensor0.rawValue);
		light.saveValue(sensor1.rawValue);
		temperatrue.saveValue(sensor2.rawValue);
		humidity.saveValue(sensor3.rawValue);
		NH3.saveValue(sensor4.rawValue);
		co2.saveValue(sensor5.rawValue);
	}

	setInterval(saveData,5000);

});


// 每个sensor自带了当前值，每个执行器自带了控制状态


// 向node发送更新
var ip2 = 'http://192.168.1.106:3000';
var ip1 = 'http://192.168.0.102:3000';
var ip3 = 'http://192.168.1.113:3000';
var haitou = 'http://192.168.0.100:3000';

var sockect = require('socket.io-client')(haitou);

sockect.on('connect', function() {
	console.log('i have connect to the server');
});


// sockect.emit('addEdison', {user_id: 'user_id:27'});

// var data = {user_id: 'user_id:27' , data: {'sensor_id:4': {value: 15, date: t()}, 'sensor_id:16': {value: 343, date: t()}, 'sensor_id:14': {value: 344, date: t()} }};

// sockect.emit('updateData', data);

function addEdison() {
	sockect.emit('addEdison', {user_id: 'user_id:27'});
}

function updateData() {
	var date = new Date().getD(0);
	var data = { 
		user_id: 'user_id:27',
		data: { 
			'sensor_id:44': {value: sensor5.rawValue, date: date },
			'sensor_id:45': {value: sensor4.rawValue, date: date},
			'sensor_id:46': {value: sensor1.rawValue, date: date},
			'sensor_id:47': { value: sensor0.rawValue, date: date },
			'sensor_id:48': { value: sensor2.rawValue, date: date },
			'sensor_id:49': { value: sensor3.rawValue, date: date }

		}
	};
	
	sockect.emit('updateData', data);
}

setTimeout(addEdison, 2000);

// 6s向中转socket发送一次数据
setInterval(updateData, 6000);

// {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }



//var exec = require('child_process').exec;
function saveExcel() {

	var argData = ' ' + sensor5.rawValue + ' ' + sensor1.rawValue + ' ' + sensor4.rawValue + ' ' + sensor2.rawValue + ' ' + sensor3.rawValue + ' ' + sensor0.rawValue;
	exec('python ~/iot/createExcel.py' + argData, function(err) {
		if(err) {
			console.info('exe python err:' + err);
		} else {
            console.log('save excel success!');
        }
	});
}

    
saveDataHandle = setInterval(saveExcel, env.excelTime);

// 使用该测试文件，因为已经成功
require('./testEmailTip');

sockect.on('configEdison', function(data) {

    console.log('user try to config edison, data is:'+data);
    // 清除excel文件定时存储时钟，并重新定时
    clearInterval(saveDataHandle);
    delete saveDataHandle;
    saveDataHandle = setInterval(saveExcel, data.db);
    // 重新设定发送email时间
    env.emailTime = data.sendEmailTime;
    console.log('now edison is config success, env is'+env);

    sockect.emit('configSuccess', { userId: data.userId });
});

 //sockect.emit('configSuccess', { userId: data.userId });

// function newSave() {
	// clearInterval(saveDataHandle);
	// setInterval
// }

// setTimeout(newSave, 60*1000*60*24)




// following are the test to a weight sensor


// var m = require('mraa');

// var weightClk = new m.Gpio(4);
// var weightSDL = new m.Gpio(8);
// var cout = 0;

// var getData = function() {
	// weightClk.write(0);
    
	// while(weightSDL.read()) ;

    // //console.log('fkjdkfjsdjfkdsfjkds');
        // for(var i = 0; i<24; i++ ) {
            // weightClk.write(1);
            // cout  = cout << 1;
            // weightClk.write(0);
            // if(weightSDL.read()==1 ) {
                // console.log('read 1');
                // cout++;
            // }
            // console.log('read 0');
        // }
    // weightClk.write(1);
    // cout  = cout ^ 0x800000;
    
    // weightClk.write(0);
    // console.log(cout );
    // return cout;
// }

// setInterval(getData, 500);


