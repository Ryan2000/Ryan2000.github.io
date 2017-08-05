/**
 * Created by ryanhoyda on 7/30/17.
 */
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var surveyData = require("../data/friends");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------

    app.get("/api/friends", function (req, res) {
        res.json(surveyData);
    });


    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a reservation request... this data is then sent to the server...
    // Then the server saves the data to the tableData array)
    // ---------------------------------------------------------------------------

    app.post("/api/friends", function (req, res) {
        // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
        // It will do this by sending out the value "true" have a table
        console.log(req.body);

        //remember you need to check and see if there's data to run the comparison.
        //otherwise, you're your best friend.
        if (surveyData.length > 0) {

            //call findVariances and pass in req.body.scores
            var nameScoresArray = findVariances(req.body.scores);

            //Go through nameScores and find the score with the lowest number
            var valueInt = nameScoresArray[0].scoreDifference;
            var index = 0;
            for (var i = 1; i < nameScoresArray.length; i++) {
                //loop through nameScoresArray
                if (nameScoresArray[i].scoreDifference < valueInt) {
                    //grab scoreDifference property and see if it's less than valueInt which is represented by current value
                    valueInt = nameScoresArray[i].scoreDifference;
                    //update the variable bc now we have new lowest value
                    index = i;
                    //store current index so we can access later
                }
            }

            console.log(index);

            var friendNameString = nameScoresArray[index].name;
            //grab friendName
            var photoString = nameScoresArray[index].photo;
            //grab photo
            res.json({name: friendNameString, photo: photoString});
            //send back to browser in json format
        }

        surveyData.push(req.body); //Adds the response, new friend data to survey for next time

    });

};


//------------------------------------matching sequence functions -------------------------------------//


//declare function variance
function variance(scoresArray1, scoresArray2) {
    //pass through the scores from user1 and user2
    var varianceCounter = 0;
    //variable varianceCounter = to zero at this point
    for (var i = 0; i < scoresArray1.length; i++) {
        //loop through our info from user 1
        var variance = scoresArray1[i] - scoresArray2[i];
        //create variable variance and set equal to the index of user1 minus index of user2
        variance = Math.abs(variance);
        //variance = the absolute value of variance - can't have negatives
        varianceCounter += variance;
        //set varianceCounter = to varianceCounter plus variance
    }
    return varianceCounter;
    //returns total variance count between 2 arrays
}

//declare function findVariances and pass through scores
//scores is from line 229 from survey.html
function findVariances(scores) {
    var results = [];
    //create empty array results

    for (var i = 0; i < surveyData.length; i++) {
        //loop through all of surveyData which holds all of our user data
        var diff = variance(scores, surveyData[i].scores);
        //create diff variable set it equal to variance function
        //that contains total variance count between two arrays
        var name = surveyData[i].name;
        //name variable set equal to index name
        var photo = surveyData[i].photo;
        // ''

        results.push({name: name, scoreDifference: diff, photo: photo});
        //push these parameters into results array
    }
    return results;
    //returns those results.
}
