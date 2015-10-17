/*global global exports */


var AjaxNode = function() {}; // google closure compile magic

(function() {

	AjaxNode = function() {};

	AjaxNode.DoCmd = function(opt, afterFn) {
		var appBase = opt.appBase || (typeof exports === 'undefined' ? window['appBase'] : global['appBase']) || '',
			myBase = AjaxNode.ReversePath(appBase);

		var data = {
			"script": myBase + opt.script,
			"myBase": myBase,
			"appBase": appBase
		};
		var content64 = opt.content && window.btoa && btoa(opt.content) || '';
		content64 ? data["content64"] = content64 : data["content"] = opt.content || '';

		$.ajax({
			"url": appBase + 'ajax-node.php',
			"type": 'POST',
			"dataType": 'json',
			"data": data,
			"success": function(ret) {
				if (afterFn) {
					if (!ret || !ret.result)
						afterFn(null, ret.error);
					else {
						if (opt.dataType === 'json' || /^{.*}$/.test(ret.data || '')) {
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

	AjaxNode.ReversePath = function(path) {
		// When path is under me
		if (path.indexOf('../') !== 0)
			return path + (!path || path.charAt(path.length - 1) === '/' ? '' : '/');

		var p1 = window['location'].pathname.split('/'),
			p2 = path.split('/'),
			p3 = [],
			i = 0,
			len = p1.length;

		p1.pop(); // Remove the file name

		while (p2[i++] === '..' && i < len) p3.unshift(p1.pop());
		if (i < p2.length)
			for (var j = i, l = p2.length + 1; j < l; j++) p3.unshift('..');
		return p3.join('/') + (p3.length ? '/' : '');
	};

})();