/**
 * Created by ryanhoyda on 6/21/17.
 */

$(document).ready(function () {

    // API Information
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDDa_TpnsyZCVAhb4Ax80lxpbLw7ekoEfw",
        authDomain: "purchaseperks-ryan.firebaseapp.com",
        databaseURL: "https://purchaseperks-ryan.firebaseio.com",
        projectId: "purchaseperks-ryan",
        storageBucket: "purchaseperks-ryan.appspot.com",
        messagingSenderId: "814610225207"
    };

    firebase.initializeApp(config);
    var database = firebase.database(); //root node
    var customersRef = database.ref('customers'); //customers variable (node)


    //define selected user and set equal to local storage
    var selected_user = localStorage.access_user;
    localStorage.setItem('purchaseCount', 0);
    console.log(selected_user);


    purchaseHistory(selected_user); //(selected_user) is customer's primary key
    profile(selected_user); //passing primary key

    //capitalize first letter
    function capitalizeName(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function profile(customerPk) { //accessing primary key per usual
        database.ref('customers/' + customerPk).once('value').then(function (snapshot) {

            //name
            var firstName = snapshot.val().first_name;
            var lastName = snapshot.val().last_name;

            //image
            var image = snapshot.val().thumbnail;

            //name and message
            var msg = "Hello, " + capitalizeName(firstName) + " " + capitalizeName(lastName) + "!";
            $('#profile_greeting').text(msg);

            //append profile image to profile
            $('#profile_image').attr("src", image);
        });
    }


    function purchaseHistory(customerPk) {
        database.ref('customers/' + customerPk + '/purchistory').once('value').then(function (snapshot) {

            //Place to save all restaurant names
            localStorage.setItem('restaurant', JSON.stringify([])); //have to call JSON.Stringify bc
            // you can't save an array directly into local storage
            //so must flatten array into a string


            snapshot.forEach(function (ch) {
                var purchase = ch.val();


                localStorage.setItem(purchase.restaurant, purchase.items.length);


                //update the purchase history dialogue within this function
                //here your inside the database
                //in order to append code to modals
                $("#purchasehistory").append('<p>Restaurant: ' + purchase.resturant + '</p>'
                    + '<p>Purchase Date: ' + purchase.date + '</p>' + '<p>Items Purchased: ' +
                    purchase.items.join(', ') + '</p>');


                //Update the restaurant name list
                var names = JSON.parse(localStorage.restaurant);

                names.push(purchase.resturant);
                //adding purchase.restaurant to names array

                localStorage.setItem('restaurant', JSON.stringify(names));//names is an array

                localStorage.setItem(purchase.resturant, purchase.items.length);
                //purchase.resturant = key
                //puchase.items.length = value;


                console.log(purchase.items);
                console.log(purchase.resturant);
                console.log(purchase.date);


            });

            /////// Call reward status function here.
            rewardStatus();

        });

    }


//reward status function  -
    function rewardStatus(){
        var resutrantNames = JSON.parse(localStorage.restaurant); //Get all names back from local storage
        //local storage can't hold arrays so we JSON.parse to turn string to array
        var emojiArray = [":baby(p):", ":grin(smiley):", ":sunrise_over_mountains:"];

        //Now loop through each name
        resutrantNames.forEach(function(name){
            var id = name.split(' ').join('');
            //removes whitespace characters (mendocino farms)

            //Write out a new div to this rewards div
            $('#milestones').append(
                "<div style='display: inline-flex' id=\'" + id + "\'>" +
                "<p style='padding: 15px' class='location'></p>" +
                "<div class='emoji'></div>" +
                "<p style='padding: 15px' class='remaining'></p>" +
                "<div class='complete'></div>" +
                "</div>");

            //name is the name of a restaurant
            var numPurchases = localStorage.getItem(name); //Returns the number of purchases for a resturant
            var text = name + ': number of purchases ' + numPurchases;
            var remaining = 'Purchases until complimentary meal: ' + (10 - numPurchases);

            $('#' + id).find('.location').text(text); //class location
            $('#' + id).find('.remaining').text(remaining); //class remaining
            $('#' + id).find('.complete').append("<div>" + emojiArray[2] + "</div>"); //used append to insert html

            if (numPurchases <= 3){
                $('#' + id ).find('.emoji').append("<div>" + emojiArray[0] + "</div>");
                console.log(name + ": " + numPurchases);
            }
            else if (numPurchases <= 9 && numPurchases > 3) {
                $('#' + id).find('.emoji').append("<div>" + emojiArray[1] + "</div>");
                console.log(name + ": " + numPurchases);
            }
            else if (numPurchases > 9 ) {
                $('#' + id).find('.emjoi').append("<div>" + emojiArray[2] + "</div>");
                console.log(name + ": " + numPurchases);
            }
        });
        $('#milestones').emojidexReplace();
        //emojidexReplace function that scans for the text in our array and replaces the text w emoji
        //and places in milestones div.
    }

});








