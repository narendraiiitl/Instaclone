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
      console.log(err)
    })
    function showposts(user) {
    user.forEach(element =>{
      var data= $('<div class="ui card"><div class="content" id="card" > <div class="right floated meta">' + element.created +'</div> <img class="ui avatar image" src="https://semantic-ui.com/images/avatar2/large/elyse.png">'+element.user +'</div> <div class="image"><img src="/images/'  + element.image + '"></div><div class="content" id="card"> <span class="right floated"> <i class="heart outline like icon" id="like"></i>' + element.likes.length +' likes </span> <i class="comment icon"></i>' +  element.comments.length + ' comments ' + '</div><div class="extra content"><div class="ui large transparent left icon input">   <i class="heart outline icon"></i>  <input type="text" placeholder="Add Comment..."> </div></div></div>' );
       data.data('liked',element._id);
      $('#segment').append(data);
             })  
            }
});





//  function addtodo(todo){
//   var newtodo = $('<li class="task ">' + todo.name +  '<span>X</span></li>')
//   newtodo.data('id',todo._id);
//   newtodo.data('completed',todo.completed);
//   $('.list').append(newtodo);
//   if(todo.completed)
//   newtodo.addClass("done");
// }

// $('.list').on('click','span',function(e){
//   e.stopPropagation();
//   removetodo($(this).parent());  
// })
// function updatetodo(todo){
//   var clickedid = todo.data('id');
//   var updateURL = "/api/todos/" + clickedid;
//   var isdone= !(todo.data('completed'));
//   var updatedata = {completed: isdone}
//   $.ajax({
//       method:'PUT',
//       url:updateURL,
//       data:updatedata
//   })
//   .then(function(data){
//       console.log(data)
//       todo.toggleClass("done");
//       todo.data('completed', isdone)
//   })
//   .catch(function(err){
//       console.log(err)
//   })
// } 

//   // (function(data){
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

// });
