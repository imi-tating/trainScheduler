// Initialize Firebase
  var config = {
    apiKey: "AIzaSyD_Fo6n2WEg5Jg9iQz2tIpx4_RqcXgeXho",
    authDomain: "trainscheduler-35e68.firebaseapp.com",
    databaseURL: "https://trainscheduler-35e68.firebaseio.com",
    projectId: "trainscheduler-35e68",
    storageBucket: "",
    messagingSenderId: "799718422017"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  function generateTrainSchedule(name, destination, time, frequency) {
    var convertedTime = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var timeDifference = moment().diff(moment(convertedTime), "minutes");
    var timeRemainder = timeDifference % frequency;

    var minAway = frequency - timeRemainder;
    var nextArrival = moment().add(minAway, "minutes");
    nextArrival = moment(nextArrival).format("h:mm");

    //pushes retrieved data to firebase database
    database.ref().push({
      name: name,
      destination: destination,
      frequency: frequency,
      next: nextArrival,
      min: minAway
    });
  }

  function addPrevStoredTrainSchedule() {
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      var prevTrainName = childSnapshot.val().name;
      var prevTrainDestination = childSnapshot.val().destination;
      var prevTrainFrequency = childSnapshot.val().frequency;
      var prevTrainNextArrival = childSnapshot.val().next;
      var prevTrainMinAway = childSnapshot.val().min;

      prevTrainName = $("<td>").text(prevTrainName);
      prevTrainDestination = $("<td>").text(prevTrainDestination);
      prevTrainFrequency = $("<td>").text(prevTrainFrequency);
      prevTrainNextArrival = $("<td>").text(prevTrainNextArrival);
      prevTrainMinAway = $("<td>").text(prevTrainMinAway);

      var newTRwo = $("<tr>");
      newTRwo.append(prevTrainName, prevTrainDestination, prevTrainFrequency, prevTrainNextArrival, prevTrainMinAway);

      $("#table-body").append(newTRwo);
    })
  }


$(document).ready(function(){

  addPrevStoredTrainSchedule()

  $("#submit-button").click(function(event){
    //prevents page from being auto-reloaded
    event.preventDefault();

    //Grabs content being added:
    var trainNameBeingAdded = $("#add-train-name").val().trim()
    var trainDestinationBeingAdded = $("#add-train-destination").val().trim()
    var trainTimeBeingAdded = $("#add-train-time").val().trim()
    var trainFrequencyBeingAdded = $("#add-train-frequency").val().trim()

    generateTrainSchedule(trainNameBeingAdded, trainDestinationBeingAdded, trainTimeBeingAdded, trainFrequencyBeingAdded)

    //clear form inputs
    $("#add-train-name").val("")
    $("#add-train-destination").val("")
    $("#add-train-time").val("")
    $("#add-train-frequency").val("")
  });

});
