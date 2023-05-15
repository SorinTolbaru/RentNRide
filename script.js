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
    $(".rent-form,.rent-page").on("submit",(e)=>{
        e.preventDefault();
        formElements.forEach(element =>localStorage.setItem(element.attr("id"),element.val()))
        window.location.pathname != "/rent.html" ? window.location.href = "rent.html": null;
    })
    
    //set form data on start if available
    const formElements = [$("#pickL"),$("#dropL"),$("#pickD"),$("#dropD"),$("#pickT"),$("#dropT")];
    localStorage.getItem("pickL") != null ? formElements.forEach(element =>element.val(localStorage.getItem(element.attr("id")))) : null
    

    //set price range
    $("#price").val($("#price-range").val());
    
    $("#price-range").on("mousedown",function(){
        $("#price-range").on("mousemove",function(){
            $("#price").val($("#price-range").val());
        })  
    })

    $("#price").on("change",function(){
        $("#price-range").val($("#price").val())
    })

    
  });
  