$(document).ready(function() {
    
    
    $(".question").click(function(){
        $(this).children(".q-answer").toggle()
        $(this).children("h4").children(".arrow-show").toggleClass("rotate-arrow")
    })

  });
  