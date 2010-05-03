var Reader = function(data)
{
	this.data = data;
	this.length = this.data.length;
	this.position = 0;
};

Reader.prototype.NULL = '\u0000';

/**
 * Reads a Null-Terminated String (NTS).
 * 
 * Used for some variable-length character strings. The value '\0' (sometimes written 0x00) denotes the end of the
 * string.
 * 
 * @return string   The NTS.
 */
Reader.prototype.zString = function()
{
	var ret = '';
	var char;
	while ((char= this.char()) !== this.NULL) {
		ret += char;
	}
	return ret;
};

/**
 * Reads a Length Coded Binary (LCB).
 * 
 * A variable-length number. To compute the value of a Length Coded Binary, one must examine the value of its
 * first byte.
 * 
 * Value Of     # Of Bytes   Description
 * First Byte   Following
 * ----------   ----------   -----------
 * 0-250        0            = value of first byte
 * 251          0            = column value = NULL
 *                             only appropriate in a Row Data Packet
 * 252          2            = value of following 16-bit word
 * 253          3            = value of following 24-bit word
 * 254          8            = value of following 64-bit word
 * 
 * Thus the length of a Length Coded Binary, including the first byte, will vary from 1 to 9 bytes.
 * 
 * @return string   The LCB.
 */
Reader.prototype.lCBin = function()
{
	var ret = this.byte();
	switch (ret) {
		case 252:
			return this.bytes(2);

		case 253:
			return this.bytes(3);

		case 254:
			return this.bytes(8);

		default:
			return ret;
	}

};

/**
 * Reads a Length Coded String (LCS).
 * 
 * A variable-length string. Used instead of Null-Terminated String, especially for character strings which might
 * contain '\0' or might be very long. The first part of a Length Coded String is a Length Coded Binary number
 * (the length); the second part of a Length Coded String is the actual data. An example of a short Length Coded
 * String is these three hexadecimal bytes: 02 61 62, which means "length = 2, contents = 'ab'".
 * 
 * @return string
 */
Reader.prototype.lCString = function()
{
	return this.string(this.lCBin());
};

Reader.prototype.packetHeader = function()
{
	return {
		length: this.bytes(3),
		number: this.byte()
	};
};

/**
 * Reads the next byte's charcode from the data.
 * 
 * @return int   The next byte's charcode.
 */
Reader.prototype.byte = function()
{
	return this.data.charCodeAt(this.position++);
};

/**
 * 
 * @param int n
 * 
 * @return int
 */
Reader.prototype.bytes = function(n)
{
	var ret = 0;
	for (var i = 0; i < n; i++) {
		ret += this.byte() << (8 * i);
	}
	return ret;
};

/**
 * Reads the next char from the data.
 * 
 * @return string   The next char.
 */
Reader.prototype.char = function()
{
	return this.data.charAt(this.position++);
};

/**
 * Returns the number of chars.
 * 
 * @param int n   The number of chars to read.
 * 
 * @return string   The string.
 */
Reader.prototype.chars = function(n)
{
	var ret = '';
	while (n--) {
		ret += this.char();
	}
	return ret;
};

Reader.prototype.trimToLength = function(length)
{
	this.data = this.data.substring(0, length);
};

Reader.prototype.trimToCursor = function()
{
	this.data = this.data.substring(this.position);
	this.resetCursor();
};

Reader.prototype.resetCursor = function()
{
	this.position = 0;
};

Reader.prototype.rest = function()
{
	var ret = this.data.substring(this.position);
	this.position = this.data.length;
	return ret;
};

exports.Reader = Reader;