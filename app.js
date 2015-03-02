var favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    twitter = require('./service/twitter'),
    brewerydb = require('./service/brewerydb'),
    qaapi = require('./service/watson/qaapi'),
    um = require('./service/watson/usermodeling'),
    cloudant = require('./service/cloudant');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/breweries', brewerydb.breweries);
app.get('/brewery/:id/beers', brewerydb.breweryBeers);
app.post('/question', qaapi.question);
app.post('/um/profile', um.profile);
app.post('/um/visualize', um.visualize);
app.get('/tweet', twitter.tweet);

app.get('/allquestions', cloudant.getAllQuestions);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
