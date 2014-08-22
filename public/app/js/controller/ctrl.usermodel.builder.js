'use strict';

define(function () {
    return ['$scope', 'UserModelingService', function ($scope, userModelingService) {
        $scope.profileData = null;
        $scope.build = function() {
            var sampleProfileData = {
                "contentItems": [
                    { "contenttype":"text\/plain",
                        "sourceid":"ibmdwblogs",
                        "userid":"dummy",
                        "created":1393264847000,
                        "language":"en",
                        "content": "Simple cool AQL trick - boolean column for whether a concept exists. I thought I'd share a nice little AQL output example that might be of  help in your Big Insights text analytics programming. Consider that you've created a very complex AQL view, one which extracts a very detailed concept from text.  This might take into account many different text constructs and match a large variety of different  text in documents.  If you want to take that view and use it to simply identify which documents have an occurance of this advanced concept, you can do it like this.  In this case, I've assumed the complex view name is called Division'.  create view DivisionCount as select Count(*) as dc from Division D;  create view DivisionBoolean as select case  when Equals(DC.dc,0) then 'no' else 'yes' as HasDivision from Document R,DivisionCount DC; To test this using the Text Analytics tutorial example, I created a new document called text.txt which doesn't have any matches for Division in it.  When I run it and select to see DivisionBoolean in the output, I get this as a result: image?",
                        "id":"12ceb145-8602-49f4-8457-de14e1a38711"
                    }
                ]
            };
            userModelingService.analyze(sampleProfileData).then(function (r) {
                console.log('analyze completed');
                userModelingService.visualize(r).then(function (r) {
                    console.log('visualize completed');
                });
            });
        }
    }];
});
