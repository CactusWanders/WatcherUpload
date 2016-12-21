'use strict'
const fs = require('fs');
const Log = require('log4js');
var logger = Log.getLogger('normal');

class Point {
	constructor(path,option) {
		this.path = path;
		//TODO 实现deep copy
		this.option = {encoding: 'buffer'};
	}

	watch(){
		try{
			fs.watch(this.path, this.option , (event, filename) => {
				//delete=>rename   add=>change   change=>change  rename=>rename
				
			}); 
		}catch(e){
			console.log(e)
		}
	}
}
