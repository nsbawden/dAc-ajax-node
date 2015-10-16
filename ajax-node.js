/*global Encoder */


var AjaxNode = function() {}; // google closure compile magic

(function() {

	AjaxNode = function() {};
	
	AjaxNode.DoCmd = function(opt, afterFn) {
		
		var data = {
			"script": opt.script
		};
		var content64 = opt.content && window.btoa && btoa(opt.content) || '';
		content64 ? data["content64"] = content64 : data["content"] = opt.content || '';
		
		$.ajax({
			"url": 'ajax-node.php',
			"type": 'POST',
			"dataType": 'json',
			"data": data,
			"success": function(ret) {
				if (afterFn) {
					if (!ret || !ret.result)
						afterFn(null, ret.error);
					else {
						if (opt.dataType === 'json') {
							try {
								ret.data = JSON.parse(ret.data);
							} catch (ex) {
								debugger;
							}
						}
						afterFn(ret.data);
					}
				}
			},
			"error": function(a, b, c) {
				if (afterFn)
					afterFn(null, a, b, c);
			}
		});
	};
	
})();