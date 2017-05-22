/**
 * Created by ryanhoyda on 5/15/17.
 */


// //Add click event listeners for our characters:
// $(document).ready(function() {
//
//     $("#pick_Luke").click(function () {
//         //alert('Picked Luke SkyWalker');
//         var html = $(this).html();
//
//         $("#your_character")
//             .empty() //Blow out the existing html in that div
//             .append(html); //Add the html in this div to the your character div
//
//         //We will update this later
//         $(this).empty();
//     });
//
//     $("#pick_Obi").click(function () {
//         //alert('Picked Obi-wan-kenobi');
//         var html = $(this).html();
//
//         $("#your_character")
//             .empty() //Blow out the existing html in that div
//             .append(html); //Add the html in this div to the your character div
//
//         //We will update this later
//         $(this).empty();
//     });
//
//     $("#pick_Maul").click(function () {
//         //alert('Picked Darth Maul');
//         var html = $(this).html();
//
//         $("#your_character")
//             .empty() //Blow out the existing html in that div
//             .append(html); //Add the html in this div to the your character div
//
//         //We will update this later
//         $(this).empty();
//     });
//
//     $("#pick_Sidious").click(function () {
//         //alert('Picked Darth Sidious');
//         var html = $(this).html();
//
//         $("#your_character")
//             .empty() //Blow out the existing html in that div
//             .append(html); //Add the html in this div to the your character div
//
//         //We will update this later
//         $(this).empty();
//     });
// });


// function pick_character(selector){
//     var html = $(selector).html();
//     $(selector).empty();
//     $("#your_character").empty().append(html);
//
// }
//
// $(document).ready(function(){
//     $("#pick_Luke").click(function(){
//         pick_character($(this));
//
//         //Select obi-wan
//
//         //get his html and store in a variable - Store all of the html in lines 30-32 in index.html into this variable
//         var obi_html = $("#pick_Obi").html();
//         //empty obi-won - Delete all html on lines 30-32 in index.html
//         $("#pick_Obi").empty();
//         //append obi won to bad_guy_one
//         //Delete all html on line 69 in index.html. Then
//         //paste all of the html stored in obi_html onto that line in index.html
//         $("#bad_guy_one").empty().append(obi_html);
//         //select maul
//
//
//         //get his html and store in a variable
//         var maul_html = $("#pick_Maul").html();
//         //empty Maul
//         $("#pick_Maul").empty();
//         //append Maul won to bad_guy_two
//         $("#bad_guy_two").empty().append(maul_html);
//         //select sidious
//
//
//         //get his html and store in a variable
//         var sidious_html = $("#pick_Sidious").html();
//         //empty Sidious
//         $("#pick_Sidious").empty();
//         //append Sidious to bad guy three
//         $("#bad_guy_three").empty().append(sidious_html);
//     });
//
//
//     //would need to repeat same process for each character as for Luke
//     $("#pick_Obi").click(function(){
//         pick_character($(this));
//     });
//
//     $("#pick_Maul").click(function(){
//         pick_character($(this));
//     });
//
//     $("#pick_Sidious").click(function(){
//         pick_character($(this));
//     });
// });




//character objects:

var luke = {
    hp: 120,
    base: 6,
    attackPower: 6,
    selector: "#pick_Luke",
    name: "Luke SkyWalker"
};

var obi = {
    hp: 140,
    base: 4,
    attackPower: 6,
    selector: "#pick_Obi",
    name: "Obi-wan-kenobi"
};

var maul = {
    hp: 90,
    base: 8,
    attackPower: 3,
    selector: "#pick_Maul",
    name: "Darth Maul"
};

var sidious = {
    hp: 115,
    base: 4,
    attackPower: 7,
    selector: "#pick_Sidious",
    name: "Darth Sidious"
};


var myCharacter;
var defendingCharacter;
var badGuyOne;
var badGuyTwo;
var badGuyThree;


function attack(){
    //Store attackPower in variable
    var attackP = myCharacter.attackPower;

    //Decrease defenders hp by attackPower
    defendingCharacter.hp -= attackP;

    //Increase myCharacters's attackPower by base
    myCharacter.attackPower += myCharacter.base;

    //Create a string You attacked [Defender Name] for [damage amount] damage and store in variable
    var damage = "<p>You attacked " + defendingCharacter.name + "for " + attackP + " damage</p>";

    $('#top_message').empty().append(damage);

    //reduces health power when attacked.
    $("#defender").find('.hp').empty().text(defendingCharacter.hp);
}

function counter_attack(){

    //decrease myCharacter.hp by defender.attackPower
    myCharacter.hp -= defendingCharacter.attackPower;

    //Create a String
    //[name] attacked you back for [amount] damge. Store in variable
    var counterDamage = "<p>" + defendingCharacter.name + "attacked you back for " + defendingCharacter.attackPower  + " damage</p>";
    //empty #bottom_message and append the string you saved in the last step

    $('#bottom_message').empty().append(counterDamage);
    //select #your_character and find .hp. Empty it, and then append myCharacter.hp
    $('#your_character').find('.hp').empty().text(myCharacter.hp);
}


function restart_button(){
    var html = '<div class="btn-group"><button id="restart" type="button" class="btn btn-default">Restart</button></div>';
    $('#bottom_message').empty().append(html);

    $('#restart').click(function(){
        location.reload();
    });
}

//check to see if character has been defeated
function check_lost() {
    var result = false;
    if (myCharacter.hp <= 0) {
        $('#top_message').empty().append("You have been defeated");
        result = true;

        var html = '<div class="btn-group"><button id="restart" type="button" class="btn btn-default">Restart</button></div>';
        $('#bottom_message').empty().append(html);
        $('#restart').click(function(){
            location.reload();
        });
    }
    return result;
}

function check_win(){
    //check if hp on badGuyOne, badGuyTwo, and badGuyThree is less than 0
    if (badGuyOne.hp <= 0 && badGuyTwo.hp <= 0 && badGuyThree.hp <= 0) {
        $('#top_message').empty().append("You Won! You are the true Jedi!");
        restart_button();
    }
    //if all three are less than 0...
    //print You Won...GAME OVER!!! to top_messages
    //call restart_button()
}


//check to see if defender has been defeated
function check_defender_defeat() {
    //check if defendingCharacter.hp < 0
    if (defendingCharacter.hp <= 0) {
        //select defender and empty it
        $('#defender').empty();
        //print You have defeated [name], you can choose to fight another enemy
        //on top_messages
        $('#top_message').append("You have defeated " + defendingCharacter.name + " You can choose to fight another enemy");
        //empty bottom_messages
        $('#bottom_message').empty();
        defendingCharacter = '';
    }

}



function pick_character(selector){
    var html = $(selector).html();
    $(selector).empty();
    $('#your_character').empty().append(html);
}

function defend_character(charOne, charTwo, charThree){
    var charOneHtml = $(charOne).html();
    $(charOne).empty();

    $('#bad_guy_one').empty().append(charOneHtml);

    var charTwoHtml = $(charTwo).html();
    $(charTwo).empty();

    $('#bad_guy_two').empty().append(charTwoHtml);

    var charThreeHtml = $(charThree).html();
    $(charThree).empty();

    $('#bad_guy_three').empty().append(charThreeHtml);
}


//funcion that moves bad to defender position
function move_to_defend(bad_guy){

    var bad_guy_html = $(bad_guy).html(); //select bad_guy and get's its html
    $(bad_guy).empty();//Now select bad_guy and empty it's html
    $('#defender').empty().append(bad_guy_html);//Now select defender
                                                //delete it's html
                                                //insert bad_guy_html
}


//so user can select bad_guy to fight
function bad_guy_listeners(){
    //Select each bad_guy div and add a click listener to it
    //inside of the listener, do alert('Bad Guy X');
    $('#bad_guy_one').click(function() {
        //(this) creates a JQuery object of bad_guy_one in this click event function
        //passing this through move_to_defend function
        move_to_defend($(this));
        defendingCharacter = badGuyOne;
    });

    $('#bad_guy_two').click(function() {
        //alert("Bad Guy two");
        move_to_defend($(this));
        defendingCharacter = badGuyTwo;
    });

    $('#bad_guy_three').click(function() {
        //alert("Bad Guy three");
        move_to_defend($(this));
        defendingCharacter = badGuyThree;
    });

}

$(document).ready(function(){
    $("#pick_Luke").click(function(){
        pick_character($(this));
        defend_character($('#pick_Obi'), $('#pick_Maul'), $('#pick_Sidious'));
        //no longer need characters to pick from section
        $(this).parent().empty();
        bad_guy_listeners();

        badGuyOne=obi; badGuyTwo=maul; badGuyThree=sidious;
        myCharacter = luke;
    });

    $("#pick_Obi").click(function(){
        pick_character($(this));
        //Add code to move other characters to Enemies section
        defend_character($('#pick_Luke'), $('#pick_Maul'), $('#pick_Sidious'));
        $(this).parent().empty();
        bad_guy_listeners();

        badGuyOne=luke; badGuyTwo=maul; badGuyThree=sidious;
        myCharacter = obi;
    });

    $("#pick_Maul").click(function(){
        pick_character($(this));
        //Add code to move other characters to Enemies section
        defend_character($('#pick_Luke'), $('#pick_Obi'), $('#pick_Sidious'));
        $(this).parent().empty();
        bad_guy_listeners();

        badGuyOne=luke; badGuyTwo=obi; badGuyThree=sidious;
        myCharacter = maul;
    });

    $("#pick_Sidious").click(function(){
        pick_character($(this));
        //Add code to move other characters to Enemies section
        defend_character($('#pick_Luke'), $('#pick_Maul'), $('#pick_Obi'));
        $(this).parent().empty();
        bad_guy_listeners();

        badGuyOne=luke; badGuyTwo=maul; badGuyThree=obi;
        myCharacter = sidious;
    });

    $("#attack").click(function() {
        if (defendingCharacter !== ''){
            attack();
            counter_attack();
            if(!check_lost()) {
                check_defender_defeat();
                check_win();
            }
        }
    });
});


