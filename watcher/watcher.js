'use strict'
const fs = require('fs');
var watch = require('watch') 
var Client = require('ssh2').Client;
var server = {};
var local_path = './';
var remote_path = '/';
var conn = null;
var sftp = null;
function ConnectSFTP(then){
    var conn = new Client();
    console.log("connect server "+server.host);
    conn.on('ready', function() {
        console.log("connect ready!");
        then(conn);
    }).on('error', function(err){
        console.log("connect error!");
    }).on('end', function() {
        console.log("connect end!");
    }).on('close', function(had_error){
        console.log("connect close");
    }).connect(server);
}
function getRemotePath(path) {
	return (remote_path+path).replace(/\.\//g, "").replace(/\\/ig, "/");
}
function isExist(path){
	try{
		fs.statSync(path);
		return true;
	}catch(e){
		console.log(e);
		return false;
	}
}
function mkdir(remote_path){
	sftp.mkdir(remote_path,function(err) {
		if (err) {
			console.log("Error: mkdir " +remote_path + " errcode " + err.code);
		}else{
			console.log("mkdir " +remote_path);
		}
	});
}
function putFile(filename){
	var  remote_file = getRemotePath(filename);
	sftp.fastPut(filename, remote_file, {}, function(err) {
		if (err) {
			console.log("Error: fastPut " +filename+" to "+remote_file + " errcode " + err);
		}else{
			console.log("fastPut " +filename+" to "+remote_file);
		}
    });
}
function delFile(filename){
	let remote_file = getRemotePath(filename);
	conn.exec('rm -rf ' + remote_file,(err, stream)=>{
		console.log('rm -rf ' + remote_file);
        if(err){
        	console.log(err);
        }
    })
}
function startMonitor(){
	watch.createMonitor(local_path,function(monitor){
		monitor.on("created",function(filename,stat){
			console.log("created: "+filename);
			if(fs.statSync(filename).isDirectory()){
				putAllFile(filename,getRemotePath(filename))
			}else{
				putFile(filename);
			}
		});
		monitor.on("removed",function(filename,stat){
			console.log("removed: "+filename);
			delFile(filename);
		});
		monitor.on("changed",function(filename,currentStat,previousStat){
			console.log("changed: "+filename);
			if(fs.statSync(filename).isDirectory()){
				putAllFile(filename,getRemotePath(filename))
			}else{
				putFile(filename);
			}
		});
	});
}

function getLocalAllFiles(path,fileThen,pathThen) {
	path = ('/'==path.charAt(path.length-1))?path:path+'/';
	var fileArr = fs.readdirSync(path);
	for (let i in fileArr){
		var currentPath = path+fileArr[i];
		if(fs.statSync(currentPath).isDirectory()){
			getLocalAllFiles(currentPath,fileThen,pathThen);
			pathThen(currentPath.replace(/\\/ig, "/"));
		}else{
			fileThen(currentPath.replace(/\\/ig, "/"));
		}
	}
}
function putAllFile(localPath,remotePath){
	if(fs.statSync(localPath).isDirectory()){
		mkdir(remotePath);
		getLocalAllFiles(localPath,(path)=>{
			putFile(path);
		},(path)=>{
			mkdir(getRemotePath(path));
		});
	}else{
		putFile(local_path);
	}
}
exports.start = function(localpath,remotepath,serverConfig){
	local_path = localpath;
	remote_path = remotepath;
	if (isExist(local_path)){
		server = serverConfig;
		ConnectSFTP((connect) => {
			conn = connect;
			conn.sftp((err, stream) => {
				sftp = stream;
				putAllFile(localpath,remotepath);
				startMonitor();
			});
		});
	}else{
		console.log(local_path+"文件不存在!");
	}
}
