$(document).ready(function() {

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
    var populateDbRef = database.ref('populate_db'); //populate_db variable (node)


    populateDb();

    function dateFunction(){
        //Create a new Date object
        var d = new Date();

        //Get the month (it's zero based so add one)
        var month = d.getMonth()+1;

        //Get today's date
        var day = d.getDate();

        //Build a formatted date string
        //build a mm/dd/yyyy string
        var dateOutput = ((''+month).length<2 ? '0' : '') + month +'/' + ((''+day).length<2 ? '0' : '') + day
            + '/' + d.getFullYear();

        //return the data string
        return dateOutput;
    }



    // -------------------------- LOG IN PATH ---------------------------------------

    //Event listener for on click of log in button homepage.
    $("#log-in-btn").click(function () {
        $('#my-modal').on('shown.bs.modal', function () {
            $('#myInput').focus()
        })
    });


    //Event listener for authenticating username and password
    $('#login-submit-btn').click(function(){
        var user = $('#InputUserName').val();
        var pw = $('#InputPassword').val();

        authenticate(user, pw, function(userKey){
            //this function assigned to oncomplete variable
            //begins oncomplete

            if (userKey === 'denied' || userKey === 'not found'){
                alert("Bad username / password");
            } else {
                //alert(userKey);
                $('#my-modal').modal('hide');
                //Retreive the data for the user that logged in
                //if data is retrieved successful, call profile build, else call error
                database.ref('customers').child(userKey).once('value', profilePage);
            }
        });
    });



    function profilePage(data) {
        //Create customer variable - on first tier
        var customer = data.val();
        console.log('First:', customer.first_name);

        //purchase is on the second tier and has multiple entries that must be referenced by key
        var purchKeys = Object.keys(customer.purchistory);

        purchKeys.forEach(function(purchase){  //iterates through each item in purchase history
            console.log('Restaurant:', customer.purchistory[purchase].resturant); //LOL this is spelt wrong
            console.log('Restaurant:', customer.purchistory[purchase].date);
            //items has multiple entries, referenced by an index
            alert(customer.purchistory[purchase].items[0]);
            alert(customer.purchistory[purchase].items[1]);
            (customer.purchistory[purchase].items).forEach(function(itemPurchased){
                console.log('item:', itemPurchased);
            });

        });
        //Reference secondary html page for profile page
        //Append items to secondary html page

    }



    //----------------------------------Sign Up Path --------------------------------------------------


    //Event listener for sign-up
    $("#sign-up-btn").click(function () {
        $('#my-modal1').on('shown.bs.modal', function () {
            $('#myInput').focus()
        })
    });


    //this function pushes info into customers database from sign up form (add user)
    $("#add-user-btn").on("click", function(event){
        event.preventDefault();
        var firstName = $("#first-name").val().trim();
        //.val = value of textbox.  .trim removes any whitespace
        var lastName = $("#last-name").val().trim();
        var email = $("#email-input").val().trim();
        var userName = $("#user-name").val().trim();
        var passwordInput = $("#password-input").val().trim();
        var dateOfBirth = $("#date-of-birth").val().trim();
        var cellPhoneNumber = $("#cell-phone-number").val().trim();
        var registrationDate = dateFunction();  //calling date function

        //passing variables to create customer function and letting it push to db
        createCustomer (firstName,
            lastName,
            email,
            userName,
            passwordInput,
            dateOfBirth,
            cellPhoneNumber,
            '',
            registrationDate);


        $("#first-name").val("");
        //setting textbox back to empty string .val("")
        $("#last-name").val("");
        $("#email-input").val("");
        $("#user-name").val("");
        $("#password-input").val("");
        $("#date-of-birth").val("");
        $("#first-name").val("");
        $("#cell-phone-number").val("");


    });

    //Populate the db with our user generated api info into customers db
    function populateDb(){
        var hitApi;
        database.ref().once('value').then(function(snapshot){
            //once function look up database
            //call .once(value) - sends you the what the db looks like at that point in time
            //then function accepts anonymous function that lets you act on the data
            //snapshot is current state of db - returned by once function
            hitApi = snapshot.val().populate_db;
            //populate_db is variable in db that has 1 of 3 values
            //true, false, undefined.
            //if undefined or false we don't want to populate the db with existing users
            if (hitApi){
                var amountOfUsers = 2;
                var urlLink = "https://randomuser.me/api/?results=" + amountOfUsers;

                $.ajax({
                    url: urlLink,
                    dataType: 'json',
                    success: function(data){
                        var customers = database.ref('customers/')

                        for(var i = 0; i < amountOfUsers; i++){
                            var newCustomer = createCustomer (data.results[i].name.first,
                                //createCustomer function
                                data.results[i].name.last,
                                data.results[i].email,
                                data.results[i].login.username,
                                data.results[i].login.password,
                                data.results[i].dob,
                                data.results[i].cell,
                                data.results[i].picture.thumbnail,
                                data.results[i].registered);
                            addPuchaseHistory(newCustomer, 'SweetGreen', '6/19/2017', ['Steak', 'Tuna']);
                            //this function pushes purchase history to db
                        }

                        var updates = {'populate_db': false};
                        //sets populate db variable to false
                        database.ref().update(updates);
                    }
                });
            }
        });
    }


    //function for authenticating a user
    function authenticate(userName, password, onComplete) {
        customersRef.orderByChild('user_name').equalTo(userName).once('value').then(function (snapshot) {

            var result; //result only defined if we hit one of our 4 conditions
            //if result is true (userName === user_name && password === pw) then result is
            //ch.key which is (ch) child element which is userKey

            var found = false;
            //debugger
            //console.log(snapshot.forEach);
            //console.log(snapshot.val());
            //

            snapshot.forEach(function (ch) {
                //ch referencing child element which is users
                var user_name = ch.val().user_name;
                var pw = ch.val().password;

                console.log(user_name);
                console.log(password);

                if (userName === user_name && password === pw) {
                    result = ch.key;
                    console.log("ch.key: " + ch.key.user_name);
                    console.log("userName: " + userName);
                    console.log("user_name: " + user_name);
                    console.log("password: " + password);
                    console.log("pw: " + pw);
                    found = true;

                    //Store the User's PK in the session
                    localStorage.setItem('access_user', result);
                    window.location.href = "access.html";
                } else if (userName === user_name && password !== pw) {
                    //alert('Incorrect user name and/or password');
                    result = 'denied';
                    console.log("ch.key: " + ch.key.user_name);
                    console.log("userName: " + userName);
                    console.log("user_name: " + user_name);
                    console.log("password: " + password);
                    console.log("pw: " + pw);
                    found = true;
                } else if (userName !== user_name && password === pw) {
                    //alert('Incorrect user name and/or password');
                    result = 'denied';
                    console.log("ch.key: " + ch.key.user_name);
                    console.log("userName: " + userName);
                    console.log("user_name: " + user_name);
                    console.log("password: " + password);
                    console.log("pw: " + pw);
                    found = true;
                } else if (userName !== user_name && password !== pw) {
                    //alert('Incorrect user name and/or password');
                    result = 'denied';
                    console.log("ch.key: " + ch.key.user_name);
                    console.log("userName: " + userName);
                    console.log("user_name: " + user_name);
                    console.log("password: " + password);
                    console.log("pw: " + pw);
                    found = true;
                }
                if(found)
                    return true;
            });
            if (!found) {
                result = 'not found';

            }
            if(onComplete){
                //calling anonymous function and passing result
                //3 possible outcomes
                //not found, denied, customer's pk
                onComplete(result);
            }
        });
    }

    //add purchase history with those parameters
    function addPuchaseHistory(customerPk, restaurantName, visitDate, itemArray){
        var purchase = {
            resturant: restaurantName,
            date: visitDate,
            items: itemArray
        };
        addOrder(customerPk, purchase);
    }


    //Add an order to the customer using the pk
    function addOrder(customerPk, order){
        var customer = database.ref('customers/' + customerPk + '/purchistory');
        customer.push(order);
    }


    // function to create a new customer.  now all properties match in db
    //_ style to avoid namespace collision
    function createCustomer (_firstName, _lastName, _email, _userName, _password, _dob, _cell, _thumbnail, _registered){
        var customer = {
            first_name : _firstName,
            last_name : _lastName,
            email: _email,
            user_name : _userName,
            password: _password,
            dob: _dob,
            cell: _cell,
            thumbnail: _thumbnail,
            registered: _registered
        };
        //add to db
        var newCustomer = customersRef.push(customer);

        //return pk
        return newCustomer.key;
    }


    // <button type="button" id="restaurant-history">Purchase History</button>
    // <div id="restaurant-insert"></div>
    // <div id="menu-insert"></div>
});