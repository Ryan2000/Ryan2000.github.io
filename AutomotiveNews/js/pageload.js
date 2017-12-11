/**
 * Created by ryanhoyda on 10/26/17.
 */

/**
 * Created by ryanhoyda on 9/21/17.
 */
/* global bootbox */
$(document).ready(function() {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var articleContainer = $(".article-container");


    function createPanel(article) {
        // This function takes in a single JSON object for an article/headline
        // It constructs a jQuery element containing all of the formatted HTML for the
        // article panel
        var publication;
        if(article.publication === 'Motor_Trend'){
            publication = "Motor Trend";
        } else if (article.publication === 'Jalopnik'){
            publication = "Jalopnik";
        }


        var panel = $(
            [
                "<div class='card'>",
                "<div>",
                "<div>",
                "<div>",

                "<div>",
                '<h1>' + publication + '</h1>',
                "</div>",

                "</div>",
                "<p>",
                "<h2>",
                "<a target='_blank' href='" + article.link + "'>",
                article.title,
                "</a>",
                "</h2>",
                "</p>",

                "<div>",
                article.summary,
                "<div class='byline'>",
                article.byline,
                "</div>",
                "<div>",
                "<img class='img-fluid article_image' src='", article.image,"'></img>",
                "</div>",
                "</div>",
                "</div>",

                "</div>",
                "</div>",
                "</div>",
                "</div>"
            ].join("")
        );
        // We attach the article's id to the jQuery element
        // We will use this when trying to figure out which article the user wants to remove or open notes for
        panel.data("_id", article._id);
        // We return the constructed panel jQuery element
        return panel;
    }

    function renderArticles(articles) {
        // This function handles appending HTML containing our article data to the page
        // We are passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all of the HTML for the articles stored in our articlePanels array,
        // append them to the articlePanels container
        articleContainer.append(articlePanels);
    }


    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        //$.get("https://autoscraper.herokuapp.com/api/selected").then(function(data) {

        showPreloader();
        $.get("https://autoscraper.herokuapp.com/api/selected?truncated=true?selected=true").then(function(data) {
        //$.get("http://localhost:8080/api/selected?truncated=true?selected=true").then(function(data) {
            // If we have headlines, render them to the page
            console.log(data);
            renderArticles(data);
        }).done(function(){
            $(".loader").fadeOut(3000);

        });
    }

    function showPreloader(){
        $('.loader').show();
        $("#bar").width(0); //Add this line

        var progress = setInterval(function () {

            var $bar = $("#bar");

            if ($bar.width() >= 600) {
                clearInterval(progress);
            } else {
                $bar.width($bar.width() + 60);
            }
            $bar.text($bar.width() / 6 + "%");
            if ($bar.width() / 6 == 100){
                $bar.text("Still working ... " + $bar.width() / 6 + "%");
            }
        }, 800);
    }

    // initPage kicks everything off when the page is loaded
    initPage();

});


