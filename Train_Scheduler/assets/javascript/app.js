/**
 * Created by ryanhoyda on 8/6/17.
 */

    var config = {
        apiKey: "AIzaSyBr-EmaJEyMH-eAea5zpuhHOV5Zc-jGFWs",
        authDomain: "train-scheduler-a8fe8.firebaseapp.com",
        databaseURL: "https://train-scheduler-a8fe8.firebaseio.com",
        projectId: "train-scheduler-a8fe8",
        storageBucket: "train-scheduler-a8fe8.appspot.com",
        messagingSenderId: "326328207051"
    };

    firebase.initializeApp(config);

    var trainData = firebase.database();

    $("#addTrainBtn").on("click", function(){

        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var firstTrain = moment($("#firstTrainInput").val().trim(),"HH:mm").subtract(10, "years").format("X");
        var frequency = $("#frequencyInput").val().trim();


        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };

        trainData.ref().push(newTrain);

        alert("Train Added!");

        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrainInput").val("");
        $("#frequencyInput").val("");

        console.log(firstTrain);
        return false;

    });

    //collect data from Firebase

    trainData.ref().on("child_added",function(snapshot){

        var name = snapshot.val().name;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;
        var firstTrain = snapshot.val().firstTrain;


        //how many minutes left until train arrives using moment.js
        var remainder = moment().diff(moment.unix(firstTrain),"minutes")%frequency;
        var minutes = frequency - remainder;
        var arrival = moment().add(minutes, "m").format("hh:mm A");


        console.log(remainder);
        console.log(minutes);
        console.log(arrival);

        $("#trainTable > tBody").append("<tr><td>"+name+"</td><td>"+destination+"</td><td>"+frequency+
            "</td><td>"+arrival+"</td><td>"+minutes+"</td></tr>");

    });