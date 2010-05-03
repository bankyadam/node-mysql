var sha1 = require('./Sha1').SHA1;

exports.scramble = function(password, message)
{
	function xor(s1, s2)
	{
		var res = '';
		for (var i = 0; i < 20; i++) {
			var c1 = s1.charCodeAt(i);
			var c2 = s2.charCodeAt(i);
			res += String.fromCharCode(s1.charCodeAt(i) ^ s2.charCodeAt(i));
		}
		return res;
	}
	var stage1 = sha1(password);
	var stage2 = sha1(stage1);
	var stage3 = sha1(message + stage2);
	return xor(stage3, stage1);
};
