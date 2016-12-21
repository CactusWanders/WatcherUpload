var Client = require('ssh2').Client;
var Log = require('log4js');
var logger = Log.getLogger('normal');
const server = {
	host: "10.59.72.21",
    username: "www",
    password: "vfoK<9Jb2",
    port: "22",
}
function ConnectSFTP(server,then){
    var conn = new Client();
    conn.on('ready', function() {
        logger.info("connect ready!");
        conn.sftp(function(err, sftp) {
if (err) throw err;
console.log(sftp);
sftp.fastPut('./ssh.js','/data1/www/dev_cloud/jxl/test.js', function(err, list) {
if (err) throw err;
conn.end();
});
       });
    }).on('error', function(err){
        logger.info("connect error!");
    }).on('end', function() {
        logger.info("connect end!");
    }).on('close', function(had_error){
        logger.info("connect close");
    }).connect(server);
}
ConnectSFTP(server,(err, stream)=>{
	// logger.info(err);
	// logger.info(stream);
})
