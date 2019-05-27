# Alpbrothers

This project contains the source code for www.alpbrothers.at.
Your **mountainbike guiding provider** at the **Faaker See, Austria**.

Execute the following steps to run the project:
1.) open shell in the project dir
2.) npm install -> loads all dependencies from npm
3.) call gulp prep
4.) call gulp build (debug) or gulp release -> builds the project
5.) node server.js -> starts a local webserver at port 8080
6.) open browser at http://localhost:8080


Visit us on:
[https://www.alpbrothers.at](https://www.alpbrothers.at)
or
[https://www.alpbrothers.com](https://www.alpbrothers.com)


## Debug
**Set log level**
log=error|warn|info|verbose|debug|silly gulp build

**Write log to file**
NODE_ENV=production gulp build > output.log

**Write lot to file and console**
NODE_ENV=production gulp build 2>&1 | tee output.log

**mysql / IP change problem**
* Connect via SSH
* cd /opt/bitnami
* sudo ./ctlscript.sh stop
* sudo rm ./mysql/data/tc.log
* sudo ./ctlscript.sh start
* change IP on cloudflare