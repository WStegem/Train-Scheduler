var config = {
    apiKey: "AIzaSyAeiuvhj2xbXXEYRD5TvjQE54r7zwB1w_8",
    authDomain: "trainscheduler-72d43.firebaseapp.com",
    databaseURL: "https://trainscheduler-72d43.firebaseio.com",
    projectId: "trainscheduler-72d43",
    storageBucket: "trainscheduler-72d43.appspot.com",
    messagingSenderId: "659152986325"
}

firebase.initializeApp(config)

var database = firebase.database()
var schedule = []

function timeToMinutes(time) {
    return +time[0] * 60 + +time[1];
}

database.ref().on('value', function(snapshot) {
    schedule = snapshot.val().FBschedule;
    $('#table').empty()
    var dt = new Date();
    var currentTime = [dt.getHours(), dt.getMinutes()]
   for(i=0;i<schedule.length;i++){
    var days = 0
    var timeArrival = timeToMinutes(schedule[i][3])
    timeArrival = timeArrival + +schedule[i][2]
    while(timeArrival<timeToMinutes(currentTime)){
        timeArrival = timeArrival + +schedule[i][2]
    }
    var dayArrival = timeArrival
    while(+dayArrival>1440){
        dayArrival = +dayArrival - 1440
        days++
    }
    if(days==0)
        $('#table').append("<tr><th scope='row'>"+schedule[i][0]+"</th><td>"+schedule[i][1]+"</td><td>"+schedule[i][2]+" min</td><td>"+Math.floor(timeArrival/60)+":"+("0" + timeArrival%60).slice(-2)+"</td><td>"+(timeArrival-timeToMinutes(currentTime))+" min</td></tr>")
    else
        $('#table').append("<tr><th scope='row'>"+schedule[i][0]+"</th><td>"+schedule[i][1]+"</td><td>"+schedule[i][2]+" min</td><td>"+days+" days from now, at "+Math.floor(dayArrival/60)+":"+("0" + dayArrival%60).slice(-2)+"</td><td>"+(timeArrival-timeToMinutes(currentTime))+" min</td></tr>")
    }
})

$("#add-train").on("click", function(event){
    event.preventDefault();
    if($('#form-name').val().trim()!=''&&$('#form-destination').val().trim()!=''&&$('#form-time').val().trim()!=''&&$('#form-freq').val().trim()!=''&&$('#form-freq').val().trim()!='0'){
        console.log($('#form-freq').val().trim())
        var newTrain = []
        newTrain.push($('#form-name').val().trim())
        newTrain.push($('#form-destination').val().trim())
        newTrain.push($('#form-freq').val().trim())
        var newTime = $('#form-time').val().trim().split(':')
        newTrain.push(newTime)

        schedule.push(newTrain)
        database.ref().set({
        FBschedule: schedule
        })
    }else{
        window.alert('Invalid train entry')
    }
})
