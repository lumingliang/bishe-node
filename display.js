// this class is for visualization
//
//

module.exports = function(option) {
	var that;

	that = {
		adress:'',
		instance: {} ,
		total:option.total?option.total:0, // item total the lcd need to display
		isStart:0,
		displayItem:0, //the item now disply
		displayBackgroundColor:option.displayBackgroundColor?option.displayBackgroundColor:[[0,0,255],[0,255,0],[255,45,36]],
		displayDelay:[3000,4000,5000], //corresponding to low,middle,high
		display: function() {
			console.log('total'+option.total);
			if(that.displayItem < that.total ) {
				that.displayItem++;
				console.log('displayItem is'+that.displayItem);
			} else {
				that.displayItem =0;
			}
			that.writeValue();
			//console.log('jfjdkfk');
		},
		//write value to the lcd
		writeValue: function() {
			var i =eval('sensor'+that.displayItem).statu;  
			that.instance.setColor(that.displayBackgroundColor[i][0],that.displayBackgroundColor[i][1],that.displayBackgroundColor[i][2]);
			that.instance.setCursor(0,1);
			var value= eval('sensor'+that.displayItem).rawValue;
			//value = value.toString(10);
			if(value==1) {
				value = 1+'               ';
			}
			//or can set new cursor to cover the string before
			//console.log('string ttttttt'+string);
			////that.instance.write(string.substr(0,10));
			//that.instance.write('                    ');
			//that.instance.write(value.toFixed(10));
			that.instance.write('rawVal:'+value);
			that.instance.setCursor(1,1);
			that.instance.write( 'statuNow:S'+i+' p'+that.displayItem );
			setTimeout(that.display, that.displayDelay[i]);

			},

		start: function() {
			var lcd = require('./lcd');
			that.instance = new lcd.LCD(0);	
			that.writeValue();
			that.isStart = 1;
		}
		
	};

	return that;
}
