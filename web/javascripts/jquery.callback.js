/**
 * @fileOverview This plugin is for adding callbacks to jQuery method. You can add callbacks to class method or instance method of jQuery
 * @dependency jQuery1.7+
 * @author huhai
 * @since 2013-01-21
 */
(function($){
  $._callbacks = {};
	$._callbacks_ = {};
	$._alias = {};
	$._alias_ = {};

	$.extend({

		/**
		 * @decription add callback function to jQuery method
		 * @param funcName : string, jQuery method name(the method name which you want to add callback)
		 * @param callback : function, callback function（if you will remove this function, please use un named function）
		 * @param static : boolean, to indicate funcName is an class method or an instance method, default is false
		 */
		addCallback : function(funcName, callback, static){
			if("string" === typeof(funcName) && $.isFunction(callback)){
				if(static === true){
					if($[funcName] && $.isFunction($[funcName])){
						if(!this._callbacks[funcName]){
							this._callbacks[funcName] = $.Callbacks();		
						}
						this._callbacks[funcName].add(callback);
						if(!$._alias[funcName]){
							$._alias[funcName] = $[funcName];//save original class method
							
							$[funcName] = function(){//proxy class method
							var result = $._alias[funcName].apply(this, arguments);
							$._callbacks[funcName].fireWith(this, arguments);
							return result;
							};
						}						
					}
				}else{
					if($.fn[funcName] && $.isFunction($.fn[funcName])){
						if(!this._callbacks_[funcName]){
							this._callbacks_[funcName] = $.Callbacks();		
						}
						this._callbacks_[funcName].add(callback);
						if(!$._alias_[funcName]){
							$._alias_[funcName] = $.fn[funcName];//save original instance method 
							$.fn[funcName] = function(){//proxy instance method
								var result = $._alias_[funcName].apply(this, arguments);
								$._callbacks_[funcName].fireWith(this, arguments);
								return result;
							};
						}
					}
				}
			}
		},

		/**
		 * @decription remove callback for jQuery method
		 * @param funcName : string, the jQuery method name which you added callback
		 * @param callback : function, callback function
		 * @param static : boolean ,to indicate funcName is an class method or an instance method, default is false
		 */
		removeCallback: function(funcName, callback, static){
			if("string" === typeof(funcName) && $.isFunction(callback)){
				if(static === true){
					if($[funcName] && $.isFunction($[funcName])){
						if(this._callbacks[funcName]){
							this._callbacks.remove(callback);
						}
					}
				}else{
					if($.fn[funcName] && $.isFunction($.fn[funcName])){
						if(this._callbacks_[funcName]){
							this._callbacks_.remove(callback);
						}
					}
				}
			}
		}
	});
})(jQuery);