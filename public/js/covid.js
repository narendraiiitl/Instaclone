// $(document).ready(function () {
   
    $(document).ready(function () {
        $.getJSON("/api/:currentuser")
          .then(showuser)
          .catch(function(err){
            var l = $( '<a class="right item" id="username" href="/login"> <div class="ui primary button">Login/signup</div></a>' );
            $('#menu').append(l);
          })
        function showuser(user) {
          // var newuser = $('<a href="/logout" class="ui animated item right fade button" tabindex="0"><div class="visible content">'  + user.username + '</div><div class="hidden content"> Logout </div></a>')
          // newuser.data('id', user._id);
          var newuser= $('<a class="item " href="/logout">' + user.username + '</a>');
          var logout= $( '<a class="right item"  href="/logout"> <div class="ui primary button">Logout</div></a>' );
          console.log(newuser);
          $('#menu').append(newuser);
          $('#menu').append(logout);
          $('#username').remove();
      }

      $('#country').keypress(function(event){
        if(event.which === 13){
           apicall();
        }
     })
    

function apicall(){
  
    $.getJSON("https://pomber.github.io/covid19/timeseries.json")
    .then(showdata)
    .catch(function(err){
    console.log(err)
    }) 

    function showdata(data) {
      var usrinput= $('#country').val();
      var p= data[usrinput];
      if(p){
        var q = p[p.length -1];
        $('#usrcountry').html('<i class="world icon"></i>' + usrinput);
        $('#Recovered').html('<i class="heartbeat icon"></i>Recovered :' + q.recovered);
        $('#Confirmed').html('<i class="heart icon"></i>Confirmed :' + q.confirmed);
        $('#Death').html('<i class="heart outline icon"></i>Deaths :' + q.deaths);
      }
      else{
        $('#usrcountry').html('<i class="world icon"></i> Country Not Found ');
        $('#Recovered').html('<i class="heartbeat icon"></i>Recovered : ---');
        $('#Confirmed').html('<i class="heart icon"></i>Confirmed : ---');
        $('#Death').html('<i class="heart outline icon"></i>Deaths :---');
      }
     
    }
}
$.getJSON("https://pomber.github.io/covid19/timeseries.json")
    .then(showdata)
    .catch(function(err){
    console.log(err)
    }) 
    function showdata(data) {
      var usrinput= 'India';
       $('#country').val('');
      var p= data[usrinput];
      var q = p[p.length -1];
      $('#usrcountry').html('<i class="world icon"></i>' + usrinput);
      $('#Recovered').html('<i class="heartbeat icon"></i>Recovered :' + q.recovered);
      $('#Confirmed').html('<i class="heart icon"></i>Confirmed :' + q.confirmed);
      $('#Death').html('<i class="heart outline icon"></i>Deaths :' + q.deaths);
    }
   
      
});