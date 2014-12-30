var http = require('follow-redirects').http;
var https = require('https');
var Promise = require('promise');
var url = require('url');

function getData(urlToFetch) {
	return new Promise(function (resolve, reject) {
		if (url.parse(urlToFetch).protocol === 'https:') {
			https.get(urlToFetch, function(response) {
				console.log(urlToFetch);
				response.setEncoding('utf8')
				var data = '';
				response.on('data', function (chunk) {
					data += chunk;
				});
				response.on('end', function() {
					resolve(data);
				})
			});
		} else {
			console.log(urlToFetch);
			http.get(urlToFetch, function(response) {
				response.setEncoding('utf8')
				var data = '';
				response.on('data', function (chunk) {
					data += chunk;
				});
				response.on('end', function() {
					resolve(data);
				})
			});
		}
	});
};

function requestHandler(request, response) {
	requestedUrl = url.parse(request.url, true).query.url;

	console.log(request.headers);

	response.setHeader('Access-Control-Allow-Origin', '*');

	response.setHeader('Access-Control-Request-Method', '*');
    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


	if (!requestedUrl) {
		response.writeHead(400);
		response.write("ERROR: No url supplied for proxy to get, add a url GET parameter");
		response.end();
		return;
	}

	getData(requestedUrl).done(function(res) {
		response.writeHead(200);
		response.write(res);
		response.end();
	});
};

var server = http.createServer(requestHandler);

var port = Number(process.env.PORT || 9080);
server.listen(port);