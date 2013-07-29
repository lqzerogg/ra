var mysql = require('mysql')

var dataUtil = function() {

	var db = function() {
		// var pool = mysql.createPool({
		// 	host     : '192.168.66.211',
		// 	user     : 'fe_admin',
		// 	password : 'ek8E9f#s',
		// 	database : 'fe_platform',
		// 	timezone : '+0000'
		// })
		var pool = mysql.createPool({
			host     : 'localhost',
			user     : 'ra',
			password : 'ra',
			database : 'ra_litb',
			insecureAuth: true,
			timezone : '+0000'
		})

		this.doQuery = function(sql, options, cb) {
			pool.getConnection(function(err, connection) {
				connection.query(sql, options, function(err, results) {
					if (err) {
						console.log(err.code)
						console.log('fatal: ' + err.fatal)
						throw err
						return
					}

					cb(results)

					connection.end()
				})
			})
		}

		return this
	}()

	this.getResult = function(sql, options, cb) {
		db.doQuery(sql, options, function(results) {
			cb(results)
		})
	}

	return this
}()

exports.saveTask = function(name, codeVersion, id, cb) {
	if (id) {
		dataUtil.getResult('update ra_task set name = ?, code_version = ?, status = 0 where id = ?', [name, codeVersion, id], cb)
	} else {
		dataUtil.getResult('insert into ra_task (name, code_version, status) values(?, ?, 0)', [name, codeVersion], cb)
	}
}