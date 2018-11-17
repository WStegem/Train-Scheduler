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
var dt = new Date().getTime()/60000
dt = Math.floor(dt)
var now = new Date()
var dy = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0)
dy = Math.floor(dy.getTime()/60000)

database.ref().on('value', function(snapshot) {
    schedule = snapshot.val().FBschedule;
    $('#table').empty()
    dt = new Date().getTime()/60000
    dt = Math.floor(dt)
    console.log('dt = '+dt)
    now = new Date()
    dy = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0)
    dy = Math.floor(dy.getTime()/60000)
    console.log('dy = '+dy)

    for(i=0;i<schedule.length;i++){
        var days = 0
        var timeArrival = schedule[i][3] + schedule[i][2]
        console.log('timeArrival = '+timeArrival)
        while(dt > timeArrival){
            timeArrival = timeArrival + schedule[i][2]
        }

        var dayArrival = (timeArrival - dy)/60
        console.log('dayArrival: '+dayArrival)
        while(dayArrival>24){
            dayArrival = dayArrival - 24
            days++
            console.log(dayArrival)
        }
        dayArrival = Math.floor(dayArrival)

        if(days==0){
            $('#table').append("<tr><th scope='row'>"+schedule[i][0]+"</th><td>"+schedule[i][1]+"</td><td>"+schedule[i][2]+" min</td><td>"+Math.floor((timeArrival-dy)/60)+":"+("0" + (timeArrival-dy)%60).slice(-2)+"</td><td>"+(timeArrival-dt)+" min</td></tr>")
        }else{
            dd = dy + (days*1440)
            $('#table').append("<tr><th scope='row'>"+schedule[i][0]+"</th><td>"+schedule[i][1]+"</td><td>"+schedule[i][2]+" min</td><td>"+days+" days from now, at "+dayArrival+":"+("0" + (timeArrival-dd)%60).slice(-2)+"</td><td>"+(timeArrival-dt)+" min</td></tr>")
        }
    }
})

$("#add-train").on("click", function(event){
    event.preventDefault();
    if($('#form-name').val().trim()!=''&&$('#form-destination').val().trim()!=''&&$('#form-time').val().trim()!=''&&$('#form-freq').val().trim()!=''&&$('#form-freq').val().trim()!='0'){
        console.log($('#form-freq').val().trim())
        var newTrain = []
            newTrain.push($('#form-name').val().trim())
            newTrain.push($('#form-destination').val().trim())
            newTrain.push(+$('#form-freq').val().trim())
            now = new Date()
            dy = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0)
            dy = Math.floor(dy.getTime()/60000)
            newTrain.push(dy + +$('#form-time').val().trim().split(':')[0]*60 + +$('#form-time').val().trim().split(':')[1])
        
        schedule.push(newTrain)
        database.ref().set({
            FBschedule: schedule
        })
    }else{
        window.alert('Invalid train entry')
    }
})