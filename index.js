var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mustache = require('mustache'),
    fs = require('fs'),
    sessions = [{
        "user": "Josh",
        "exercise": "temp",
        "year": 2014,
        "month": 4,
        "day": 10,
        "hour": 8,
        "minutes": 9,
        "difficulty": [
              0.5,
              0.5,
              0.5
            ],
        "performance": [
              1,
              1,
              1
            ]
      }];

head = fs.readFileSync('views/head.html', {encoding: 'ascii'})
foot = fs.readFileSync('views/foot.html', {encoding: 'ascii'})

app.use(bodyParser())

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

// example of page generated on server

app.get('/view', function(req, res) {
  for (index in sessions) {
    sessions[index].repetitions = []

    for (rep in sessions[index].difficulty) {
      sessions[index].repetitions.push(
        {'difficulty': sessions[index].difficulty[rep],
        'performance': sessions[index].performance[rep]}
      )
    }
  }
    
  res = addHeaders(res);
  view = fs.readFileSync('views/view.html', {encoding: 'ascii'})
  result = mustache.render(view, {sessions: sessions, head: head, foot: foot})
  res.end(result);
});

app.options('/view', function(req, res) {
  res = addHeaders(res);
  res.end();
});

// catch-all route

app.get('*', function(req, res) {
  res.end('404 - route not implemented.  Only GET/POST on /sessions defined.');
});

app.post('*', function(req, res) {
  res.end('404 - route not implemented.  Only GET/POST on /sessions defined.');
});

app.listen(8000)

console.log("listening on 8000")
