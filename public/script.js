import * as UiElements from "./ui-elements.js";
import * as Utilites from "./utilites.js"

$(document).ready(function () {

    //set minimium pickD, dropL to today
    const currentDateD = new Date().toISOString().split('T')[0];
    $("#pickD").attr("min",currentDateD)
    $("#dropD").attr("min",currentDateD)
    $("#pickD").on("change",()=>{
        $("#dropD").attr("min",$("#pickD").val())
    })

    //mobile menu
    $(".hamburger-mobile").click(function(){
        let state;
        $(".nav-elements-mobile").toggleClass("display-flex")
        $(".nav-elements-mobile").hasClass("display-flex") ? 
        (state = true,$(this).html(UiElements.setMobileSVG(state))):
        (state = false,$(this).html(UiElements.setMobileSVG(state))) 
    })

    //show filters date on mobile
    $(".show-filters").click(function(){
        $(".settings-container").toggleClass("display-flex")
        $(".show-filters,.show-date").toggleClass("--move-filter-button")
        $(".settings-container").hasClass("display-flex") ? $(this).text("Close filters") : $(this).text("Show filters")
    })

    $(".show-date").click(function(){
        $(".rent-page").toggleClass("display-flex")
        $(".rent-page").hasClass("display-flex") ? $(this).text("Close Date") : $(this).text("Change Date")
    })

    //account button
    $("#account,#account-mobile").click(Utilites.accountCheck)

    //faq menu
    $(".question").click(function () {
        $(this).children(".q-answer").toggleClass("show-answer")
        $(this).children("h4").children(".arrow-show").toggleClass("rotate-arrow")
    })

    //get form data from user
    $(".rent-form,.rent-page").on("submit", (e) => {
        e.preventDefault();
        Utilites.formElements.forEach(element => localStorage.setItem(element.attr("id"), element.val()))
        window.location.pathname != "/rent.html" ? window.location.href = "rent.html" : location.reload();
    })

    //change currency onchange
    $("#choose-currency").on("change",function(){
        localStorage.setItem("choose-currency",$(this).val())
        window.location.pathname == "/rent.html" ? window.location.reload() : null
    })

    //set price range - setting
    $("#price-range").on("mousedown taphold", function () {
        $("#price-range").on("mousemove", function () {
            $("#price").val($("#price-range").val());
            Utilites.totalPrice.price = $("#price").val()
            Utilites.applyCarFilter()
        })
    })

    //set price range - setting mobile
    $("#price-range").on("touchstart", function () {
        $("#price-range").on("touchmove", function () {
            $("#price").val($("#price-range").val());
            totalPrice = $("#price").val()
            Utilites.applyCarFilter()
        })
    })

    //change price from numberbox
    $("#price").on("change", function () {
        $("#price-range").val($("#price").val())
        Utilites.totalPrice.price = $("#price").val()
        Utilites.applyCarFilter()
    })

    //reset settings
    $(".reset-button").click(function(){
        $(`input[type="checkbox"]`).prop("checked",true)
        Utilites.filter.filterCarType = [];
        Utilites.filter.filterRentAgency = [];
        Utilites.filter.securityDeposit = [];
        Utilites.getFiltersOptions()
        Utilites.applyCarFilter();
    })

    //remove filter based on checked option
    $(`input:checkbox`).click(function() {
        if($(this).attr("class") == "select-all"){

            //check if checked or not
            const isChecked = $(this).prop("checked");

            //set checked or unchecked to all settings in parent
            $(this).parent().siblings(".setting").find("input").prop("checked", isChecked);

            //get ID setting  
            let currentID = $($(this).parent().parent().parent()[0]).attr("id") 

            if(!isChecked){
                
                currentID == "carType" ? Utilites.filter.filterCarType= [] : Utilites.filter.filterRentAgency = [];
            }else{
                Utilites.getFiltersOptions(currentID)
            }
            Utilites.applyCarFilter()
            
        }else if($(this).prop("checked") == false){
            
            //if checked if false remove selected filter option
            if($($(this).parent().parent().parent()[0]).attr("id") == "carType"){  
                Utilites.filter.filterCarType.splice(Utilites.filter.filterCarType.indexOf($(this).attr("id")),1);
            }else if($($(this).parent().parent().parent()[0]).attr("id") == "rentingAgency"){
                Utilites.filter.filterRentAgency.splice(Utilites.filter.filterRentAgency.indexOf($(this).attr("id")),1);
            }else{
                Utilites.filter.securityDeposit.splice(Utilites.filter.securityDeposit.indexOf($(this).attr("id")),1);
            }
            Utilites.applyCarFilter()
        }else{
            
            //if checked is false add selected filter option
            if($($(this).parent().parent().parent()[0]).attr("id") == "carType"){
                Utilites.filter.filterCarType.push($(this).attr("id"));
            }else if($($(this).parent().parent().parent()[0]).attr("id") == "rentingAgency"){
                Utilites.filter.filterRentAgency.push($(this).attr("id"));
            }
            else{
                Utilites.filter.securityDeposit.push($(this).attr("id"));
            }
            Utilites.applyCarFilter()
        }
        
    });
    
});