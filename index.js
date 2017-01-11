var config = require('./watch-upload-config.json');
var watcher = require('./watcher/watcher.js');

watcher.start(config.local_path, config.remote_path, config.server);
