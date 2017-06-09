/**
 * Created by ryanhoyda on 6/3/17.
 */

//Here's your API Key for the Article Search API: 1bbab68e0ac945508416ede152fc0436

//url view - https://api.nytimes.com/svc/search/v2/articlesearch.json?q=obama&api-key=1bbab68e0ac945508416ede152fc0436


// Structural breakdown
//  https://api.nytimes.com/svc/search/v2/articlesearch.json
//  ?
// search parameter q=XXXX
//  &
// api-key=
// begin_date=
// end_date=
// 1bbab68e0ac945508416ede152fc0436



//another url version with begin_date and end_date
//https://api.nytimes.com/svc/search/v2/articlesearch.json?q=obama&begin_date=20170101&end_date=20170601&api-key=1bbab68e0ac945508416ede152fc0436



// 1. Retrieve user inputs and convert into variables
// 2. use those variables to run an AJAX call to the NYT
// 3. Break down the NYT object into usable fields
// 4. Dynamically generate HTML content





//Variables
// ================================================

var authKey="1bbab68e0ac945508416ede152fc0436";

// Search Parameters
var queryTerm   ="";
var numResults  = 0;
var startYear   = 0;
var endYear     = 0;


//URL Base
var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey;


//track number of articles
var articleCounter = 0;



//Functions
// ================================================


$(document).ready(function(){

function runQuery(numArticles, queryURL) {

    //Ajax function
    $.ajax({url: queryURL,
        method: "GET"
    }).done(function(NYTData) {


        console.log("--------------");
        console.log(queryURL);
        console.log("--------------");
        console.log(NYTData);
        console.log(numArticles);



        //clear wells from previous run
        $('#well-section').empty();

        //loop through 10 docs and grab headlines
        for (var i = 0; i < numArticles; i++) {

            //(view api structure to grab headline)
            console.log(NYTData.response.docs[i].section_name);
            console.log(NYTData.response.docs[i].pub_date);
            console.log(NYTData.response.docs[i].web_url);
            console.log("-----------------");


            //dump info into wells section
            var wellSection = $('<div>');
            wellSection.addClass('well');
            wellSection.attr('id', 'articleWell-' + i);
            $('#well-section').append(wellSection);


            //conditionals to track headline and section name, must exist after we append html
            if (NYTData.response.docs[i].headline != "null") {
                console.log(NYTData.response.docs[i].headline.main);
                $('#articleWell-' + i).append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");

            }

            //check to see if there's a byline
            if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                console.log(NYTData.response.docs[i].byline.original);
                $('#articleWell-' + i).append("<h5>" + NYTData.response.docs[i].byline.original + "</h5>");

            }

            //Attach content to appropriate well
            //$('#articleWell-' + i).append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");
            $('#articleWell-' + i).append("<h5>" + NYTData.response.docs[i].section_name + "</h5>");
            $('#articleWell-' + i).append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
            $('#articleWell-' + i).append("<a href=" + NYTData.response.docs[i].web_url  + ">" + NYTData.response.docs[i].web_url + "</a>");
        }

    });

}


//Main Processes
// ================================================

 $('#searchBtn').on('click', function(event) {

     event.preventDefault();


     queryTerm = $('#search').val().trim();
     //console.log(queryTerm);

     //add in the search term
     var newURL = queryURLBase + "&q=" + queryTerm;
     //console.log(newURL);


     //get the number of records
     numResults = $("#num-records").val();


     //get the start year and end year
     startYear = $('#startYear').val().trim();
     endYear = $('#endYear').val().trim();

     //if these parameters are entered
     if (parseInt(startYear)) {

         //add the necessary fields
         startYear = startYear + "0101";

         //add the date information to the URL
         newURL = newURL + "&begin_date=" + startYear;
     }

     if (parseInt(endYear)) {

         //add the necessary fields
         endYear = endYear + "0101";

         //add the date information to the URL
         newURL = newURL + "&end_date=" + startYear;
     }


     console.log(newURL);

     //send ajax call the newly assembled url.
     runQuery(numResults, newURL);



 });

});