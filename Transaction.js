var Transaction = function(connection)
{
	this.connection = connection;
};

Transaction.prototype.commit = function()
{
};
Transaction.prototype.rollback = function()
{
};

exports = Transaction;
