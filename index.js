var Sys = require('sys');
var Events = require('events');
var Net = require('net');
var Buffer = require('./Buffer').Buffer;
var Reader = require('./Reader').Reader;
var Writer = require('./Writer').Writer;
var Flags = require('./Flags');
var Protocol = require('./Protocol4_1');
//var Transaction = require('./Transaction');
//var Statement = require('./Statement');

function dumpPacket(data)
{
	for (var i = 0; i < data.length; i++) {
		Sys.print(parseInt(data.charCodeAt(i), 10).toString(16)+' ');
	}
	Sys.print('\n');
}

var Mysql = function(host, port, dbname, username, password)
{
	this.host = host;
	this.port = port;
	this.dbname = dbname;
	this.username = username;
	this.password = password || '';
};

Sys.inherits(Mysql, Events.EventEmitter);

Mysql.prototype.host = '';
Mysql.prototype.port = 3306;
Mysql.prototype.dbname = '';
Mysql.prototype.username = '';
Mysql.prototype.password = '';
Mysql.prototype.isProtocol41 = false;
Mysql.prototype.buffer = new Buffer();

Mysql.prototype.connect = function()
{
	var self = this;
	this.connection = Net.createConnection(this.port, this.host);
	this.connection.setEncoding('binary');
	this.connection.setTimeout(0);

	this.expectedPocket = 'handshake';

	this.connection.addListener('connect', function()
	{
		self.emit('connect');
	});
	this.connection.addListener('error', function(exception)
	{
		self.emit('error', exception);
	});
	this.connection.addListener('data', function(data)
	{
		Sys.print('> ');
		
		dumpPacket(data);

		self.buffer.append(data);
		var reader = new Reader(data);
		var packetHeader = reader.packetHeader();
		reader.trimToCursor();
		reader.trimToLength(packetHeader.length);
		reader.resetCursor();
		self.processPacket(reader);
	});
};
Mysql.prototype.processPacket = function(packet)
{
	Sys.puts('Packet is '+this.expectedPocket+'.');
	switch (this.expectedPocket) {
		case 'handshake':
			var serverInfo = Protocol.handshake(packet);

			var response = Protocol.authenticate(
				this.username,
				this.password,
				serverInfo.scramble_buff,
				serverInfo.server_language,
				serverInfo.server_capabilities
			);

			Sys.print('< ');
			dumpPacket(response);

			this.connection.write(response);

			this.expectedPocket = 'ok';
			break;

		case 'ok':
			Sys.puts('Handlink OK packet.');
			var okPacket = Protocol.ok(packet);
			Sys.inspect(okPacket);
			break;

		default:
	}
};
Mysql.prototype.query = function(query)
{
	new Statement(this);
};
Mysql.prototype.transaction = function()
{
	return new Transaction(this);
};
Mysql.prototype.quote = function(string)
{
	return string;
};
Mysql.prototype.lastInsertId = function()
{
	return 0;
};

exports.Mysql = Mysql;
