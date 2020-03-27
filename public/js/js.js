//

//1px = (100vw / [document.documentElement.clientWidth] px)


$(window).scroll(function(){
    var height = $('header').height();

    
    
    
   if((pageYOffset > height) ){
    $('nav').addClass('fixed');
 
  }
  else{
    $('nav').removeClass('fixed');
    
  }
});
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

