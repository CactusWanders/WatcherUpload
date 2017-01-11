WatcherUpload
==
## 实现功能:
* 监控本地文件的改变更新至远程目录

## 使用方法
* **npm安装**
```bash
$ npm install -g watcherupload
```
* **配置文件**
```BASH
{
    "server":{
    	"host": "127.0.0.1",
	    "user": "www",
	    "password": "password",
	    "port": "8888"
    },
    "remote_path": "/data1/www/paf_release/watcherupload/",
    "local_path": "./"
}
```
server为远程主机连接信息。同步本地local_path与remote_path文件。同步更新有近3s的时间差。
