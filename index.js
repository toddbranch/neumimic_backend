var express = require('express'),
    app = express(),
    connect = require('connect'),
    sessions = [];

app.use(express.json());
app.use(express.urlencoded());

function addHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  return res;
}

// sessions
app.get('/sessions', function(req, res) {
  res = addHeaders(res);
  res.json(sessions);
  res.end();
});

app.options('/sessions', function(req, res) {
  res = addHeaders(res);
  res.end();
});

app.post('/sessions', function(req, res) {
  console.log(req.body);
  sessions.push(req.body);
  res = addHeaders(res);
  res.end();
});

app.post('/test', function(req, res) {
    var name = req.body.name,
        color = req.body.color;
});

// to be implemented
app.delete('/sessions', function(req, res) {
  res.end();
});

app.get('*', function(req, res) {
  console.log(req.url);
  res.end('404 - route not implemented.  Only GET/POST on /sessions defined.');
});

app.post('*', function(req, res) {
  console.log(req.url);
  res.end('404 - route not implemented.  Only GET/POST on /sessions defined.');
});

app.listen(8000)

console.log("listening on 8000")
