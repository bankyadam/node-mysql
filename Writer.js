var Writer = function()
{
	this.data = '';
};

Writer.prototype.NULL = '\u0000';

Writer.prototype.getData = function()
{
	return this.data;
};

Writer.prototype.zString = function(data)
{
	this.data += data + this.NULL;
};

Writer.prototype.lCBin = function(num)
{
	// 1 byte
//	if (num < 251) {
	if (num < 0xfb) {
		this.data += String.fromCharCode(num);
	} 
	// 2 bytes
//	else if (num < 65535) {
	else if (num < 0xffff) {
		this.data += String.fromCharCode(252);
		this.bytes(num, 2);
	}
	// 3 bytes
//	else if (num < 16777215) {
	else if (num < 0xffffff) {
		this.data += String.fromCharCode(253);
		this.bytes(num, 3);
	}
	// 8 bytes
	else {
//	else if (num < 18446744073709551615) {
//	else if (num < 0xffffffffffffffff) {
		this.data += String.fromCharCode(254);
		this.bytes(num, 8);
	}
};

Writer.prototype.lCString = function(string)
{
	this.data += this.lCBin(string.length);
	return this.string(this.lCBin());
};

Writer.prototype.bytes = function(data, length)
{
	var bytes = '';
	for (var i = 0; i < length; i++) {
		bytes += String.fromCharCode((data >> (8 * i)) & 0xff);
	}
	this.data += bytes;
};

Writer.prototype.addPacketHeader = function(packetNum)
{
	var length = this.data.length;
	var header = '';
	header += String.fromCharCode(length & 0xff);
	header += String.fromCharCode(length >> 8 & 0xff);
	header += String.fromCharCode(length >> 16 & 0xff);
	header += String.fromCharCode(packetNum);
	
	this.data = header + this.data;
};

exports.Writer = Writer;
