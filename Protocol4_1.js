var Sys = require('sys');
var Writer = require('./Writer').Writer;
var Utils = require('./Utils');
var Flags = require('./Flags');

/**
 * Bytes                        Name
 * -----                        ----
 * 1                            protocol_version
 * n (Null-Terminated String)   server_version
 * 4                            thread_id
 * 8                            scramble_buff
 * 1                            (filler) always 0x00
 * 2                            server_capabilities
 * 1                            server_language
 * 2                            server_status
 * 13                           (filler) always 0x00
 * 13                           rest of scramble_buff (4.1)
 *
 * protocol_version:    The server takes this from PROTOCOL_VERSION
 *                      in /include/mysql_version.h. Example value = 10.
 *
 * server_version:      The server takes this from MYSQL_SERVER_VERSION
 *                      in /include/mysql_version.h. Example value = "4.1.1-alpha".
 *
 * thread_number:       ID of the server thread for this connection.
 *
 * scramble_buff:       The password mechanism uses this. The second part are the
 *                      last 13 bytes.
 *                      (See "Password functions" section elsewhere in this document.)
 *
 * server_capabilities: CLIENT_XXX options. The possible flag values at time of
 * writing (taken from  include/mysql_com.h):
 *  CLIENT_LONG_PASSWORD	1
 *  CLIENT_FOUND_ROWS	2
 *  CLIENT_LONG_FLAG	4
 *  CLIENT_CONNECT_WITH_DB	8
 *  CLIENT_NO_SCHEMA	16
 *  CLIENT_COMPRESS		32
 *  CLIENT_ODBC		64
 *  CLIENT_LOCAL_FILES	128
 *  CLIENT_IGNORE_SPACE	256
 *  CLIENT_PROTOCOL_41	512
 *  CLIENT_INTERACTIVE	1024
 *  CLIENT_SSL              2048
 *  CLIENT_IGNORE_SIGPIPE   4096
 *  CLIENT_TRANSACTIONS	8192
 *  CLIENT_RESERVED         16384
 *  CLIENT_SECURE_CONNECTION 32768
 *  CLIENT_MULTI_STATEMENTS 65536
 *  CLIENT_MULTI_RESULTS    131072
 *
 * server_language:     current server character set number
 *
 * server_status:       SERVER_STATUS_xxx flags: e.g. SERVER_STATUS_AUTOCOMMIT
 */
exports.handshake = function(packet)
{
	var protocol_version = packet.byte();
	var server_version = packet.zString();
	var thread_id = packet.bytes(4);
	var scramble_buff = packet.bytes(8);
	packet.byte();
	var server_capabilities = packet.bytes(2);

	var server_language = packet.byte();
	var server_status = packet.bytes(2);
	packet.bytes(13);
	scramble_buff += packet.bytes(13);

	return {
		protocol_version:    protocol_version,
		server_version:      server_version,
		thread_id:           thread_id,
		scramble_buff:       scramble_buff,
		server_capabilities: server_capabilities,
		server_language:     server_language,
		server_status:       server_status
	};
};

/**
 * Bytes                        Name
 * -----                        ----
 * 4                            client_flags
 * 4                            max_packet_size
 * 1                            charset_number
 * 23                           (filler) always 0x00...
 * n (Null-Terminated String)   user
 * n (Length Coded Binary)      scramble_buff (1 + x bytes)
 * n (Null-Terminated String)   databasename (optional)
 *
 * client_flags:            CLIENT_xxx options. The list of possible flag
 *                          values is in the description of the Handshake
 *                          Initialisation Packet, for server_capabilities.
 *                          For some of the bits, the server passed "what
 *                          it's capable of". The client leaves some of the
 *                          bits on, adds others, and passes back to the server.
 *                          One important flag is: whether compression is desired.
 *                          Another interesting one is CLIENT_CONNECT_WITH_DB,
 *                          which shows the presence of the optional databasename.
 *
 * max_packet_size:         the maximum number of bytes in a packet for the client
 *
 * charset_number:          in the same domain as the server_language field that
 *                          the server passes in the Handshake Initialization packet.
 *
 * user:                    identification
 *
 * scramble_buff:           the password, after encrypting using the scramble_buff
 *                          contents passed by the server (see "Password functions"
 *                          section elsewhere in this document)
 *                          if length is zero, no password was given
 *
 * databasename:            name of schema to use initially
 */
exports.authenticate = function(username, password, salt, dbname, charset, serverCapabilities)
{
	var packet = new Writer();
	// Client flags
	packet.bytes(serverCapabilities | Flags.CLIENT_PROTOCOL_41 | Flags.CLIENT_TRANSACTIONS | Flags.CLIENT_FOUND_ROWS
		| Flags.CLIENT_CONNECT_WITH_DB, 4);
	// Max packet size
	packet.bytes(0x01000000, 4);
	// Charset number (always UTF8)
	packet.bytes(charset, 1);
	// Filler (23)
	packet.bytes(0, 23);
	// User
	packet.zString(username);
	// Scramble buff
	if (password != '') {
		packet.lCBin(Utils.scramble(password, salt));
	}
	else {
		packet.lCBin(0);
	}
	packet.zString(dbname);
	packet.addPacketHeader(1);
	return packet.getData();
};

/**
 * Bytes                       Name
 * -----                       ----
 * 1   (Length Coded Binary)   field_count, always = 0
 * 1-9 (Length Coded Binary)   affected_rows
 * 1-9 (Length Coded Binary)   insert_id
 * 2                           server_status
 * 2                           warning_count
 * n   (until end of packet)   message
 *
 * field_count:     always = 0
 *
 * affected_rows:   = number of rows affected by INSERT/UPDATE/DELETE
 *
 * insert_id:       If the statement generated any AUTO_INCREMENT number,
 *                  it is returned here. Otherwise this field contains 0.
 *                  Note: when using for example a multiple row INSERT the
 *                  insert_id will be from the first row inserted, not from
 *                  last.
 *
 * server_status:   = The client can use this to check if the
 *                  command was inside a transaction.
 *
 * warning_count:   number of warnings
 *
 * message:         For example, after a multi-line INSERT, message might be
 *                  "Records: 3 Duplicates: 0 Warnings: 0"
 */
exports.ok = function(packet)
{
	var ret = {
		field_count: packet.lCBin()
	};
	
	// Error packet
	if (ret.field_count === 0xff) {
		Sys.puts('I\'ts ERROR');
		ret.type     = 'error';
		ret.errno    = packet.bytes(2);
		ret.sqlstate = packet.bytes(5);
		ret.message  = packet.rest();
	}
	// OK packet
	else {
		Sys.puts('I\'ts OK');
		ret.type          = 'ok';
		ret.affected_rows = packet.lCBin();
		Sys.puts(0);
		ret.insert_id     = packet.lCBin();
		Sys.puts(1);
		ret.server_status = packet.bytes(2);
		Sys.puts(2);
		ret.warning_count = packet.bytes(2);
		Sys.puts(3);
		ret.message       = packet.rest();
		Sys.puts(4);
		Sys.puts('I\'ts OK...');
	};

	Sys.inspect(ret);
	
	return ret;
};
