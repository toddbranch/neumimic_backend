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
      },
      {
        "user": "Josh2",
        "exercise": "temp2",
        "year": 2014,
        "month": 4,
        "day": 10,
        "hour": 8,
        "minutes": 9,
        "difficulty": [
              0.5,
              0.4,
              0.5
            ],
        "performance": [
              1,
              0.95,
              0.92
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
  //result = ConvertJsonToTable(sessions, 'jsonTable', null, 'Download');
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

/**********************************************************/

/**
 * JavaScript format string function
 * 
 */
String.prototype.format = function()
{
  var args = arguments;

  return this.replace(/{(\d+)}/g, function(match, number)
  {
    return typeof args[number] != 'undefined' ? args[number] :
                                                '{' + number + '}';
  });
};

function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText)
{
    //Patterns for links and NULL value
    var italic = '<i>{0}</i>';
    var link = linkText ? '<a href="{0}">' + linkText + '</a>' :
                          '<a href="{0}">{0}</a>';

    //Pattern for table                          
    var idMarkup = tableId ? ' id="' + tableId + '"' :
                             '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
                                       '';

    var tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

    //Patterns for table content
    var th = '<thead>{0}</thead>';
    var tb = '<tbody>{0}</tbody>';
    var tr = '<tr>{0}</tr>';
    var thRow = '<th>{0}</th>';
    var tdRow = '<td>{0}</td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';

    if (parsedJson)
    {
        var isStringArray = typeof(parsedJson[0]) == 'string';
        var headers;

        // Create table headers from JSON data
        // If JSON data is a simple string array we create a single table header
        if(isStringArray)
            thCon += thRow.format('value');
        else
        {
            // If JSON data is an object array, headers are automatically computed
            if(typeof(parsedJson[0]) == 'object')
            {
                headers = array_keys(parsedJson[0]);

                for (i = 0; i < headers.length; i++)
                    thCon += thRow.format(headers[i]);
            }
        }
        th = th.format(tr.format(thCon));
        
        // Create table rows from Json data
        if(isStringArray)
        {
            for (i = 0; i < parsedJson.length; i++)
            {
                tbCon += tdRow.format(parsedJson[i]);
                trCon += tr.format(tbCon);
                tbCon = '';
            }
        }
        else
        {
            if(headers)
            {
                var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);
                
                for (i = 0; i < parsedJson.length; i++)
                {
                    for (j = 0; j < headers.length; j++)
                    {
                        var value = parsedJson[i][headers[j]];
                        var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

                        if(isUrl)   // If value is URL we auto-create a link
                            tbCon += tdRow.format(link.format(value));
                        else
                        {
                            if(value){
                            	if(typeof(value) == 'object'){
									if(value instanceof Array)
									{
										tbCon += tdRow.format(value.toString());
									}
                            		//for supporting nested tables
                            		//tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                            	} else {
                            		tbCon += tdRow.format(value);
                            	}
                                
                            } else {    // If value == null we format it like PhpMyAdmin NULL values
                                tbCon += tdRow.format(italic.format(value).toUpperCase());
                            }
                        }
                    }
                    trCon += tr.format(tbCon);
                    tbCon = '';
                }
            }
        }
        tb = tb.format(trCon);
        tbl = tbl.format(th, tb);

        return tbl;
    }
    return null;
}

function array_keys(input, search_value, argStrict)
{
    var search = typeof search_value !== 'undefined', tmp_arr = [], strict = !!argStrict, include = true, key = '';

    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return input.keys(search_value, argStrict);
    }
 
    for (key in input)
    {
        if (input.hasOwnProperty(key))
        {
            include = true;
            if (search)
            {
                if (strict && input[key] !== search_value)
                    include = false;
                else if (input[key] != search_value)
                    include = false;
            } 
            if (include)
                tmp_arr[tmp_arr.length] = key;
        }
    }
    return tmp_arr;
}
