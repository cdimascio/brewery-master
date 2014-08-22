var favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    hogan = require('hogan-express'),
    twitter = require('./service/twitter'),
    brewerydb = require('./service/brewerydb'),
    qaapi = require('./service/watson/qaapi'),
    um = require('./service/watson/user_modeling');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
// JK added html engine
app.set('view engine', 'html');
app.engine('html', hogan);
app.set('views',__dirname + '/public');
// end JK
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/breweries', brewerydb.breweries);
app.post('/question', qaapi.question);
app.post('/analyzeText', um.analyzeText);
app.get('/tweet', twitter.tweet);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
