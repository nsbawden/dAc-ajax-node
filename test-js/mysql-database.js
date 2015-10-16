var fs = require('fs');
var BUFSIZE = 256;
var buf = new Buffer(BUFSIZE);
var bytesRead;
var ot = {
	stdin: ''
};

while (true) {
	bytesRead = 0;
	try {
		bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE);
	} catch (e) {
		if (e.code === 'EAGAIN') {
			console.error('ERROR: interactive stdin input not supported.');
			process.exit(1);
		} else if (e.code === 'EOF') {
			break;
		}
		throw e;
	}
	if (bytesRead === 0) {
		break;
	}
	ot.stdin += buf.toString(null, 0, bytesRead);
}


var cred = JSON.parse(ot.stdin);
//ot.cred = cred; // for debugging only

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: cred['user'],
	password: cred['password']
});

connection.connect();

connection.query('SHOW DATABASES', function(err, rows, fields) {
	if (err)
		ot.error = err;
	else
		ot.queryResult = rows;

	process.stdout.write(JSON.stringify(ot));
});

connection.end();