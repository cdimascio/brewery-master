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

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/breweries', brewerydb.breweries);
app.get('/brewery/:id/beers', brewerydb.breweryBeers);
app.post('/question', qaapi.question);
app.post('/um/profile', um.analyze);
app.post('/um/visualize', um.visualize);
app.get('/tweet', twitter.tweet);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
