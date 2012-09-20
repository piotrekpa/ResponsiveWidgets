var ResponsiveWidgets = function(){
	this.callbacks = [];
	this.RegFirstTest = /^[<|>|=]{1}[=]?\d+$/;
};
ResponsiveWidgets.prototype = {
	_init : function(){
		
	},
	_refresh : function(){

	},
	_parseCondition : function(condition){
		var chunks = condition.split(" "),
			length = chunks.length,
			i, chunk, value, direction, // inside loop
			stat = {from : null, to : null};

		for(i = 0; i < length; i++){
			chunk = chunks[i];
			if(this.RegFirstTest.test(chunk)){
				value = chunk.match(/\d+/)[0];
				if(chunk[0] === "="){
					stat.from = +value;
					stat.to = +value;
					break;
				}
				direction = chunk[0] === '<' ? -1 : 1;
				if(chunk[1] !== "="){
					value = +value + direction;
				}
				stat[(direction === -1 ? 'to' : 'from')] = +value;
			}
		}
		return stat;
	},
	add : function(){
		var args = Array.prototype.slice.call(arguments),
			condition = this._parseCondition(args.shift()),
			attach = function(){},
			detach = function(){},
			obj = args[0];
		
		if(typeof obj === 'object' && obj.__proto__.attach && obj.__proto__.detach){

		}else{
			attach = args.shift();
			detach = args.shift();
			obj = undefined		
		}

		this.callbacks.push({
			from : condition.from,
			to : condition.to,
			attach : attach,
			detach : detach,
			obj : obj,
			attached : false
		});
	},
	check : function(res){
		var res = +res,
			length = this.callbacks.length,
			i, callback;

		for(i = 0; i < length; i++){
			var callback = this.callbacks[i],
				from = callback.from <= res || callback.from === null,
				to = callback.to >= res || callback.to === null;

			if(from && to){
				if(!callback.attached){
					if(callback.obj){
						callback.obj.attach.call(callback.obj, res);
					}else{
						callback.attach(res);
					}
					callback.attached = true;
				}
			}else{
				if(callback.attached){
					if(callback.obj){
						callback.obj.detach.call(callback.obj, res);
					}else{
						callback.detach(res);
					}
					callback.attached = false;
				}

			}
		}
	}
};
