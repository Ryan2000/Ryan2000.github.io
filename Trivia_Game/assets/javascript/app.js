/**
 * Created by ryanhoyda on 5/22/17.
 */

questionCsv =
    [
        "Who played Andy Dufresne in the ShawShank Redemption?, Morgan Freeman, Tim Robbins, Robert Dinero, William Sadler, Tim Robbins",
        "The Godfather was released in what year?, 1972, 1971, 1973, 1974, 1972",
        "Who was the best Batman of all time?, Michael Keaton, Val Kilmer, Christian Bale, George Clooney, Michael Keaton",
        "Johnny Utah was played by whom?, Keanu Reeves, Patrick Swayze, Eddie Murphy, Gary Busey, Keanu Reeves",
        "Lethal Weapon was released in what year?, 1987, 1988, 1985, 1986, 1987",
        "1987 buddy cop movie staring both Tom Hanks and Dan Akroyd?, Spies Like Us, Dragnet, Turner & Hooch, Big, Dragnet",
        "Axel Foley was played by which male actor?, Chevy Chase, Martin Lawrence, Eddie Murphy, Mel Gibson, Eddie Murphy",
        "Which character said the following? Back in '82 I used to be able to throw a pigskin a quarter mile, Kipp, Napolean, Uncle Rico, Jonah Hill, Uncle Rico",
        "Who played the female lead in Memoirs of an Invisible Man?, Daryl Hannah, Jane Fonda, Debra Winger, Sissy Spacek, Daryl Hannah",
        "Who played the female lead in True Lies?, Sigourney Weaver, Diane Keaton, Jamie Lee Curtis, Alicia Silverstone, Jamie Lee Curtis",

        //and so on
    ];


var questions = [];
var currentQuestion = 0;
var answeredQuestions = 0;


$(document).ready(function(){
    for(var i = 0; i < questionCsv.length; i++){
        buildQuestions(questionCsv[i]);
    }
    //Set the page to the first question
    updateQuestion(questions[currentQuestion]);
    timerHandle = timer();

    $("#submit").click(function() {
        //Check for game over by comparing
        //currentQuestion to questions.length - 1
        //currentQuestion reflects the position within the array
        if (currentQuestion < questions.length) {

            //Check answer first
            checkAnswers();
            currentQuestion++;

            if(currentQuestion < questions.length){
                //Then move to next question
                var nextQuestion = questions[currentQuestion];
                updateQuestion(nextQuestion);
                //Reset the round
                roundReset();

                //Reset remainingTime to 10
                if (currentQuestion < questions.length - 1){
                    //Reset remainingTime to 10
                    timeRemaining = 10;
                } else {
                    window.clearTimeout(timerHandle); //blows out the timer once all questions answered
                }
            } else {
                scoreCalculator();
            }
        } else {

            scoreCalculator();
        }

    });
});


function buildQuestions(question){
    //Question, Answer 1, Answer 2, Answer 3, Answer 4, Correct Answer
    parts = question.split(',');
    var question = {
        question: parts[0],
        one: parts[1],
        two: parts[2],
        three: parts[3],
        four: parts[4],
        answer: parts[5]
    };
    questions.push(question);
}


function updateQuestion(newQuestion) {
    $('#question1').text(newQuestion.question);
    $('#a1').next().text(newQuestion.one);
    $('#a2').next().text(newQuestion.two);
    $('#a3').next().text(newQuestion.three);
    $('#a4').next().text(newQuestion.four);

}


function roundReset() {
    $('input:radio').prop('checked', false);
}


var correct = 0;
var incorrect = 0;
//this function will check for the correct answer
function checkAnswers() {
    //Store the current question in a variable
    var q = questions[currentQuestion];

    //Iterate through all radio buttons and find the selected one
    $('input:radio').each(function(){ //Look for all radio buttons

        //Now examine each radio button individually
        var selected = $(this).prop('checked');
        //use an if statement if it's selected
        if (selected){
            //select the label using the next() function
            //Get the text of the selected radio buttons label
            var ans = $(this).next().text();
            //compare the text in the label to the question.answer property
            if (ans == q.answer){
                //if correct - increment the correct variable
                correct++;
            } else {
                //else - increment the incorrect variable
                incorrect++;
            }
            answeredQuestions++;
        }

    });
    //console.log('Correct Answers: ' + correct);
    //console.log('Incorrect Answers: ' + incorrect);
}


var timeRemaining = 10;
var timerHandle;
//this function will launch the timer
//a 1 second timer for 10 seconds
function timer() {

    return setTimeout(function(){

        if (currentQuestion < questions.length) {
            //console.log(timeRemaining + ' seconds remaining');

            $('#timer').text('Time Remaining: ' + timeRemaining);
            timeRemaining--;

            if (timeRemaining < 0) {
                timeRemaining = 10;
                currentQuestion++;

                if(currentQuestion < questions.length){
                    var nextQuestion = questions[currentQuestion];
                    updateQuestion(nextQuestion);
                    roundReset();
                }
            }

            //Make a recursive call to this function to reset the timer
            timerHandle = timer(); //This resets the timer for another second

        } else {
            //no recursive call to timer() so the timer no longer resets
            scoreCalculator();
        }

    }, 1000);
}

//this function will keep track of score
function scoreCalculator() {
    //select #timer using jquery
    $('#timer').text('All Done!')

    //select #question1 and add a call to .text(' ') like we did above
    $('#question1').text('Correct Answers: ' + correct);

    var html = "<p>Incorrect Answers: " + incorrect + "</p>";
    $('#answerButtons')
        .empty() //blow out old html
        .html(html); //insert new html

    $('#unanswered').text('Unanswered: ' + (questions.length - answeredQuestions));
    $('#submit').html('Reset').click(function(){
        gameReset();
    });

}

//this function will restart the game after completion.
function gameReset() {
    location.reload();

}
