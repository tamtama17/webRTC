// Muaz Khan      - www.MuazKhan.com
// MIT License    - www.WebRTC-Experiment.com/licence
// Documentation  - github.com/muaz-khan/getScreenId

var port = process.env.PORT || 9001;

var server = require('http'),
    url = require('url'),
    path = require('path'),
    app = require('express')(),
    express = require('express'),
    fs = require('fs');
app.use(express.static('img'));

function serverHandler(request, response) {
    try {
        var uri = url.parse(request.url).pathname,
            filename = path.join(process.cwd(), uri);
            console.log(filename);

        if (filename && filename.search(/server.js/g) !== -1) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        var stats;

        try {
            stats = fs.lstatSync(filename);
        } catch (e) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });

            filename += '/index.html';
        }

        if(filename.search("intro-bg.jpg") != -1) {
            fs.readFile(filename, function (err, content) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                    response.end();
                    return;
                } else {
                    //specify the content type in the response will be an image
                    response.writeHead(200,{'Content-type':'image/jpg'});
                    response.end(content);
                }
            });
        } else {
            fs.readFile(filename, 'utf8', function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, 'utf8');
                response.end();
            });
        }

    } catch (e) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('<h1>Unexpected error:</h1><br><br>' + e.stack || e.message || JSON.stringify(e));
        response.end();
    }
}

var app = server.createServer(serverHandler);

function runServer() {
    app = app.listen(port, process.env.IP || '0.0.0.0', function() {
        var addr = app.address();

        if (addr.address === '0.0.0.0') {
            addr.address = 'localhost';
        }

        console.log('Server listening at http://' + addr.address + ':' + addr.port);
    });
}

runServer();
