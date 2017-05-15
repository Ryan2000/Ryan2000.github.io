// make Array of Word Options (all lowercase)
var wordsList = ["gargoyle", "demon", "ghost", "godzilla", "imp", "giant", "gorgon",
    "pegasus", "ghoul", "horror", "ogre", "vampire", "werewolf", "yeti"];
var guesses;
var chosenWordArray = [];
var numBlanks;
var blanksAndSuccessesArray = [];
var failArray = [];
var guessArray = [];
var numberOfGuesses = 0;
var numWins = 0;
var numLosses = 0;
var chosenWord = "";

// startGame()
// Its how we we will start and restart the game.
// (Note: It's not being run here. It's just being made for future use.)
function startGame() {

    firstMove = true;
    // Reset the guesses back to 0.
    guesses = 0;

    // Solution is chosen randomly from wordList. (Like RPS)
    var index = Math.floor((Math.random() * wordsList.length));
    chosenWord = wordsList[index];

    // The word is broken into individual letters. (convert string to array of letters)
    for (var i = 0; i < chosenWord.length; i++) {
        chosenWordArray.push(chosenWord[i]);
    }

    // We count the number of letters in the word. (tells us the number of `numBlanks`)
    numBlanks = chosenWord.length;

    // Fill up the blanksAndSuccesses list with appropriate number of blanks.
    // This is based on number of letters in solution.
    for (var i = 0; i < numBlanks; i++) {
        // make a list of `_`
        // ex dog = ['d', 'o','g'] and generate a new array like ['_', '_', '_']
        blanksAndSuccessesArray.push("_");
    }

    // We print the solution in console (for testing).
    console.log(chosenWord);
    numberOfGuesses = chosenWord.length * 2;
}

function reset(){
    chosenWord = "";
    chosenWordArray = [];

    // reset the guess and success array at each round. Array of letters (first array, for succesful guesses)
    blanksAndSuccessesArray = [];
    guessArray = [];
    // reset the wrong guesses from the previous round. Array of letters (second arrays, one for fails)
    failArray = [];


// update html on the page
    // set #guesses-left to numberOfGuesses
    var guessesLeft = document.getElementById("guesses-left");
    guessesLeft.innerHTML = "";

    // set #word-blanks to the blanks at the beginning of each round in the HTML
    var wordBlanks = document.getElementById("word-blanks");
    wordBlanks.innerHTML = blanksAndSuccessesArray.join("");

    // set #wrong-guesses to empty / clears the wrong guesses from the previous round by
    var wrongGuesses = document.getElementById("wrong-guesses");
    wrongGuesses.innerHTML = "";



}

// checkLetters() function
// It's where we will do all of the comparisons for matches.
// Again, it's not being called here. It's just being made for future use.
function checkLetters(letter) {

    //If the letter is in failArray, indexOf will return something
    //other than -1
    if (failArray.indexOf(letter) != -1){
        return;  //Exit the function
    }


    var letterInWord = false;
    // Check if a letter exists inside the array at all. (by looping thru the word as an array)
    for (var i = 0; i < numBlanks; i++) {
        if (letter === chosenWordArray[i]) {
            // If the letter exists then toggle this boolean to true. This will be used in the next step.
            letterInWord = true;
        }
    }

    // If `letterInWord`, then figure out exactly where (which indices).
    if (letterInWord === true) {
        // Loop through the word, one letter at a time
        // Populate the blanksAndSuccesses with every instance of the letter.
        for (var i = 0; i < chosenWordArray.length; i++){
            // if chosenWord letter is the same as letter
            if (chosenWordArray[i] === letter) {
                // Here we set the specific space in blanks and letter equal to the letter when there is a match.
                blanksAndSuccessesArray[i] = letter;

            }
        }

    } else {// If the letter doesn't exist at all...
        // ..then we add the letter to the list of wrong letters, and we subtract one of the guesses.
        failArray.push(letter);
        guesses++;
    }
}

// roundComplete() function

// Here we will have all of the code that needs to be run after each guess is made
function roundComplete() {

    // First, log an initial status update in the console telling us how many wins, losses, and guesses are left.
    console.log(numWins);
    console.log(numLosses);
    console.log(numberOfGuesses);

    // Update the HTML to reflect the new number of guesses. Also update the correct guesses.
    var guessesLeft = document.getElementById("guesses-left");
    guessesLeft.innerHTML = "<p>Number of Guesses = " + guesses + "</p><p>Guesses remaining = " + (numberOfGuesses - guesses) + "</p>";
    // Update #word-blanks to show any correct guesses
    var wordBlanks = document.getElementById("word-blanks");
    wordBlanks.innerHTML = blanksAndSuccessesArray.join(" ");

    // Update #wrong-guesses to show the wrong guesses
    var wrongGuesses = document.getElementById("wrong-guesses");
    wrongGuesses.innerHTML = failArray.join(", ");

    // If we have gotten all the letters to match the solution...
    var word = blanksAndSuccessesArray.join("");
    var secretWord = chosenWord;
    if (word === secretWord){
        // ..add to the win counter & give the user an alert.
        numWins++
        alert("You're the best around...  Nothing's ever gonna keep you down!")

        // Update the win counter in the HTML & restart the game.
        reset();
        startGame();

        var wins = document.getElementById("wins");
        wins.innerHTML = numWins;
    } else if (numberOfGuesses - guesses === 0){ // If we've run out of guesses..
        numLosses++; // Add to the loss counter.
        alert("You lose. You're better off being a Merman :("); // Give the user an alert.
        reset(); // Update the loss counter in the HTML.
        startGame(); // Restart the game.

        var losses = document.getElementById("losses");
        losses.innerHTML = numLosses;

    }
}

// on initial page load Starts the Game by running the startGame() function
startGame();
var firstMove = true;

// Then initiate the function for capturing key clicks.
document.onkeyup = function(event) {
    if (firstMove){
        firstMove = false;
        roundComplete();
    } else {
        // Converts all key clicks to lowercase letters.
        var letterGuessed = String.fromCharCode(event.keyCode).toLowerCase();
        // Runs the code to check for correctness.
        checkLetters(letterGuessed);
        // Runs the code after each round is done.
        roundComplete();
    }
};


