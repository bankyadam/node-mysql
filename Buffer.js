var Sys = require('sys');
var Reader = require('./Reader').Reader;

var Buffer = function()
{
	this.data = '';
};

Sys.inherits(Buffer, Reader);

Buffer.prototype.set = function(data)
{
	this.data = data;
};

Buffer.prototype.append = function(data)
{
	this.data += data;
};

Buffer.prototype.length = function()
{
	return this.data.length;
};

exports.Buffer = Buffer;
