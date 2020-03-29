//

//1px = (100vw / [document.documentElement.clientWidth] px)


// $(window).scroll(function(){
//     var height = $('header').height();




//    if((pageYOffset > height) ){
//     $('nav').addClass('fixed');

//   }
//   else{
//     $('nav').removeClass('fixed');

//   }
// });
// function stick(){
// if(pageYOffset > height)
// {
//     $('nav').addClass('fixed');
// }
// else{
//     $('nav').removeClass('fixed');
// }
// };
// stick();








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


$.getJSON("/api/users/posts")
    .then(showposts)
    .catch(function(err){
    })

    function showposts(user) {
    user.forEach(element => {
      var data= $('<div class="ui card"><div class="content"> <div class="right floated meta">' + 'online' +'</div> <img class="ui avatar image" src="https://semantic-ui.com/images/avatar2/large/elyse.png"> Elliot</div> <div class="image"><img src="/images/'  + element.image + '"></div><div class="content"> <span class="right floated"> <i class="heart outline like icon"></i>  17 likes </span> <i class="comment icon"></i>' + ' 3 comments ' + '</div><div class="extra content"><div class="ui large transparent left icon input">   <i class="heart outline icon"></i>  <input type="text" placeholder="Add Comment..."> </div></div></div>' );
      $('#segment').append(data);
      console.log(element.image);
    });
  }    




  // (function(data){
//       console.log(data);
//       todo.remove();
//   })
//   .catch(function(err){
//       console.log(err)
//   })
// }
//   $('.list').on('click', 'li', function () {
//     console.log("clicked")
//     updatetodo($(this));
//   })


//   $('.list').on('click', 'span', function (e) {
//     e.stopPropagation();
//     removetodo($(this).parent());
//   })

});
