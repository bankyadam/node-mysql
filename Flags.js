exports = {
	/** @var int   New more secure password */
	CLIENT_LONG_PASSWORD: 1,
	/** @var int   Found instead of affected rows */
	CLIENT_FOUND_ROWS: 2,
	/** @var int   Get all column flags */
	CLIENT_LONG_FLAG: 4,
	/** @var int   One can specify db on connect */
	CLIENT_CONNECT_WITH_DB: 8,
	/** @var int   Don't allow database.table.column */
	CLIENT_NO_SCHEMA: 16,
	/** @var int   Can use compression protocol */
	CLIENT_COMPRESS: 32,
	/** @var int   Odbc client */
	CLIENT_ODBC: 64,
	/** @var int   Can use LOAD DATA LOCAL */
	CLIENT_LOCAL_FILES: 128,
	/** @var int   Ignore spaces before '(' */
	CLIENT_IGNORE_SPACE: 256,
	/** @var int   New 4.1 protocol */
	CLIENT_PROTOCOL_41: 512,
	/** @var int   This is an interactive client */
	CLIENT_INTERACTIVE: 1024,
	/** @var int   Switch to SSL after handshake */
	CLIENT_SSL: 2048,
	/** @var int   IGNORE sigpipes */
	CLIENT_IGNORE_SIGPIPE: 4096,
	/** @var int   Client knows about transactions */
	CLIENT_TRANSACTIONS: 8192,
	/** @var int   Old flag for 4.1 protocol */
	CLIENT_RESERVED: 16384,
	/** @var int   New 4.1 authentication */
	CLIENT_SECURE_CONNECTION: 32768,
	/** @var int   Enable/disable multi-stmt support */
	CLIENT_MULTI_STATEMENTS: 65536,
	/** @var int   Enable/disable multi-results */
	CLIENT_MULTI_RESULTS: 131072,
	
	/** @var int   (none, this is an internal thread state) */
	COM_SLEEP: 0x00,
	/** @var int   mysql_close */
	COM_QUIT: 0x01,
	/** @var int   mysql_select_db */
	COM_INIT_DB: 0x02,
	/** @var int   mysql_real_query */
	COM_QUERY: 0x03,
	/** @var int   mysql_list_fields */
	COM_FIELD_LIST: 0x04,
	/** @var int   mysql_create_db (deprecated) */
	COM_CREATE_DB: 0x05,
	/** @var int   mysql_drop_db (deprecated) */
	COM_DROP_DB: 0x06,
	/** @var int   mysql_refresh */
	COM_REFRESH: 0x07,
	/** @var int   mysql_shutdown */
	COM_SHUTDOWN: 0x08,
	/** @var int   mysql_stat */
	COM_STATISTICS: 0x09,
	/** @var int   mysql_list_processes */
	COM_PROCESS_INFO: 0x0a,
	/** @var int   (none, this is an internal thread state) */
	COM_CONNECT: 0x0b,
	/** @var int   mysql_kill */
	COM_PROCESS_KILL: 0x0c,
	/** @var int   mysql_dump_debug_info */
	COM_DEBUG: 0x0d,
	/** @var int   mysql_ping */
	COM_PING: 0x0e,
	/** @var int   (none, this is an internal thread state) */
	COM_TIME: 0x0f,
	/** @var int   (none, this is an internal thread state) */
	COM_DELAYED_INSERT: 0x10,
	/** @var int   mysql_change_user */
	COM_CHANGE_USER: 0x11,
	/** @var int   sent by the slave IO thread to request a binlog */
	COM_BINLOG_DUMP: 0x12,
	/** @var int   LOAD TABLE ... FROM MASTER (deprecated) */
	COM_TABLE_DUMP: 0x13,
	/** @var int   (none, this is an internal thread state) */
	COM_CONNECT_OUT: 0x14,
	/** @var int   sent by the slave to register with the master (optional) */
	COM_REGISTER_SLAVE: 0x15,
	/** @var int   mysql_stmt_prepare */
	COM_STMT_PREPARE: 0x16,
	/** @var int   mysql_stmt_execute */
	COM_STMT_EXECUTE: 0x17,
	/** @var int   mysql_stmt_send_long_data */
	COM_STMT_SEND_LONG_DATA: 0x18,
	/** @var int   mysql_stmt_close */
	COM_STMT_CLOSE: 0x19,
	/** @var int   mysql_stmt_reset */
	COM_STMT_RESET: 0x1a,
	/** @var int   mysql_set_server_option */
	COM_SET_OPTION: 0x1b,
	/** @var int   mysql_stmt_fetch */
	COM_STMT_FETCH: 0x1c
};
