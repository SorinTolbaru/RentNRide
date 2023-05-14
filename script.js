$(document).ready(function() {
    
    //faq menu
    $(".question").click(function(){
        $(this).children(".q-answer").toggle()
        $(this).children("h4").children(".arrow-show").toggleClass("rotate-arrow")
    })

    //get today/tomorrow
    const currentDay = new Date();
    const today = [currentDay.getFullYear(),"0" + (currentDay.getMonth() + 1),currentDay.getDate()]
    const tomorrow = [currentDay.getFullYear(),"0" + (currentDay.getMonth() + 1),currentDay.getDate() + 1]
    $("#pickD").attr("value",today.join("-"))
    $("#dropD").attr("value",tomorrow.join("-"))

    //get form data
    $(".rent-form").on("submit",(e)=>{
        e.preventDefault();
        
        const [pickL,dropL,pickD,dropD,pickT,dropT] = [
            $("#pickL").val(),$("#dropL").val(),$("#pickD").val(),$("#dropD").val(),$("#pickT").val(),$("#dropT").val()
        ];

        
    })
    
    
  });
  