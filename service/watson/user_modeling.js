// Define global variable for user modeling endpoint
var um_endpoint = {
    url : '',
    username : '',
    password : ''
};

// Obtain user modeling credentials from Bluemix Service
function getcredentials() {
  var um_url = "";
  var um_username = "";
  var um_password = "";
  var um_creds = "";
  if (process.env.VCAP_SERVICES != "") {
   var services = JSON.parse(process.env.VCAP_SERVICES);
   for (var svcName in services) {
      if (svcName.match('systemu')) {
      var tmp1 = services[svcName];
      var tmp2 = tmp1[0];
      um_creds = tmp2.credentials;
      um_endpoint.url = um_creds.api_url;
      um_endpoint.username = um_creds.username;
      um_endpoint.password = um_creds.password;
     } 
   }
  }
  return um_creds;
}


var flatten = function(tree) {
       var arr = [], f = function(t, level) {
         if (!t) return;
	 if (level>0 && (!t.children || level!=2)) {
	     var obj = {};

	     obj.id = t.id;
	     console.log('object id: ' + obj.id);
	     if (t.children) {
	       obj.title = true;
	       console.log('object title: ' + obj.title);
	     }
	     if (t.percentage) {
	       obj.value = Math.floor(t.percentage*100)+"%";
	       console.log('object value: ' + obj.value);
	     } 
	     arr.push(obj);
	 }
	 if (t.children && t.id!='sbh') {
	     console.log('tree children length: ' + t.children.length);
	     for (var i=0; i<t.children.length; i++) {
	          f(t.children[i], level+1);
	     }
	 }
       };
       f(tree, 0);
       for(var j=0; j<arr.length; j++) {
         console.log('index: ' + j + ' array: ' + arr[j].id + ' array title: ' + arr[j].title + ' value ' + arr[j].value);
       }	 
       return arr;
}

exports.analyzeText = function(req,resp) {
        getcredentials();
	if (!um_endpoint.url) {
	  resp.send(404, 'usermodeling url is not supplied');
	}
	var content = {};
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
	        if(err) {
		  console.error(err.message);
		  return;
		}
		content = fields.content;
	        console.log('content for analysis: ' + content);
	        // Form a user modeling request
	        var usermodelEntity = {
                    "contentItems": [ 
                         { "contenttype":"text\/plain",
                           "sourceid":"ibmdwblogs",
                           "userid":"dummy",
                           "created":1393264847000,
                           "language":"en",
                           "content":"Simple cool AQL trick - boolean column for whether a concept exists. I thought I'd share a nice little AQL output example that might be of  help in your Big Insights text analytics programming. Consider that you've created a very complex AQL view, one which extracts a very detailed concept from text.  This might take into account many different text constructs and match a large variety of different  text in documents.  If you want to take that view and use it to simply identify which documents have an occurance of this advanced concept, you can do it like this.  In this case, I've assumed the complex view name is called Division'.  create view DivisionCount as select Count(*) as dc from Division D;  create view DivisionBoolean as select case  when Equals(DC.dc,0) then 'no' else 'yes' as HasDivision from Document R,DivisionCount DC; To test this using the Text Analytics tutorial example, I created a new document called text.txt which doesn't have any matches for Division in it.  When I run it and select to see DivisionBoolean in the output, I get this as a result: image?",
                          // "content": content,
			   "id":"12ceb145-8602-49f4-8457-de14e1a38711"
                         }
                   ]
                };
	        console.log('content for analysis: ' + usermodelEntity.content);
  	        var um_content = JSON.stringify(usermodelEntity);
		console.log('um content: ' + um_content);
		var um_uri = um_endpoint.url;
  	        console.log('um_uri: ' + um_uri);
	        var um_post_uri = um_uri + '/api/v2/profile';
                console.log('um post url: ' + um_post_uri);
                var um_post_url = require('url').parse(um_post_uri);
	        var um_host = um_post_url.host.split(":")[0];
                console.log('um host: ' + um_host);
                var um_port = um_post_url.port;
                console.log('um port: ' + um_port);
	        var um_path = um_post_url.path;
                console.log('um path: ' + um_path);
                var um_protocol = um_post_url.protocol;
                console.log('um protocol: ' + um_protocol);
	        var um_auth = um_endpoint.username + ":" + um_endpoint.password;
                console.log('um auth ' + um_auth);

                var request_um_auth = {
	           'user': um_endpoint.username,
	           'pass': um_endpoint.password,
	           'sendImmediately': false
	        };

                var request_post_options = {
	           'uri' : um_post_uri,
	           'method' : "POST",
	           'port' : um_port,
	           'path' : um_path,
	           'host' : um_host,
	           'auth' : request_um_auth,
	           'headers' : {
	              'Content-Type' : 'application/json',
	              'Content-Length' : um_content.length
	           },
	           'json' : usermodelEntity
	        };  

	       var request = require('request');
	       request(request_post_options, function(error, response, body) {
	          if(error) {
	           console.log("There was an error:", error);
	          } else {
	           console.log('response status: ' + response.statusCode);
  	           console.log('response: ' + JSON.stringify(body));
	           // var data = JSON.parse(body);
	           var data = body;
// Commenting out the next two lines and
// adding visualization code from systemU documentation
	         //  var list = flatten(data.tree);
	         //  resp.render('app/partials/usermodel.html', {traits:list});
// Visualization code
// comment out visualization for now
//		   console.log("Requesting viz...");
	//um_viz_url = require('url').parse(systemu_url+"/api/v2/visualize");
		   var um_viz_uri = um_uri + '/api/v2/visualize';
                   console.log('um viz url: ' + um_viz_uri);
	           var um_post_uri = um_uri + '/api/v2/profile';
                   var um_viz_url = require('url').parse(um_viz_uri);
	           var um_viz_host = um_viz_url.host.split(":")[0];
                   var um_viz_port = um_viz_url.port;
	           var um_viz_path = um_viz_url.path;
                   var um_viz_protocol = um_viz_url.protocol;

		   var profile_data = JSON.stringify(data);
		   var viz_data = "";
		   var viz_request_post_options = {
	             'uri' : um_viz_uri,
	             'method' : "POST",
	             'port' : um_viz_port,
	             'path' : um_viz_path,
	             'host' : um_viz_host,
	             'auth' : request_um_auth,
	             'headers' : {
	                'Content-Type' : 'application/json',
	                'Content-Length' : profile_data.length
	             },
	             'body' : profile_data
		   };  

		   request(viz_request_post_options, function(err,res,bdy) {
			var viz_data = bdy;
			var list = flatten(data.tree);
	                resp.render('app/partials/usermodel.html', {msg: "Visalization complete", viz: viz_data, traits:list});
		//	resp.render('usermodelresp', { msg: "Content analyzed, visualization ready!", viz: viz_data, list: list });	
	  	   });
	          }
              });
	});

}
