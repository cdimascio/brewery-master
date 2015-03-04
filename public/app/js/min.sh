cd public/app/js
cat app.js controller/answers.js controller/brewery_beers.js controller/brewery_details.js controller/brewery_list.js controller/brewery_map.js controller/main.js controller/pi.js controller/question.js controller/tweets.js controller/usermodeling_builder.js controller/usermodeling_result.js directive/angular_slick.js directive/ladda.js service/brewerydb.js service/location.js service/location_search.js service/qaapi.js service/twitter.js service/usermodeling.js util/maps.js util/um.js > concat.js
minify --output beer.min.js concat.js
cd ../../../
cf push brewerymaster