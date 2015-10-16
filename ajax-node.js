/*global Encoder */


var AjaxNode = function() {}; // google closure compile magic

(function() {

	AjaxNode = function() {};
	
	AjaxNode.DoCmd = function(opt, afterFn) {
		
		//var content = opt.content && Encoder.Encode64(opt.content);
		
		$.ajax({
			"url": 'ajax-node.php',
			"type": 'POST',
			"dataType": 'json',
			"data": {
				"script": opt.script,
				"content": opt.content || ''
			},
			"success": function(ret) {
				if (afterFn) {
					if (!ret || !ret.result)
						afterFn(null, ret.error);
					else
						afterFn(ret.data);
				}
			},
			"error": function(a, b, c) {
				if (afterFn)
					afterFn(null, a, b, c);
			}
		});
	};
	
})();