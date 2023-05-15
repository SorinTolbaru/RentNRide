$(document).ready(function () {

    //faq menu
    $(".question").click(function () {
        $(this).children(".q-answer").toggle()
        $(this).children("h4").children(".arrow-show").toggleClass("rotate-arrow")
    })

    //get today/tomorrow
    const currentDay = new Date();
    const today = [currentDay.getFullYear(), "0" + (currentDay.getMonth() + 1), currentDay.getDate()]
    const tomorrow = [currentDay.getFullYear(), "0" + (currentDay.getMonth() + 1), currentDay.getDate() + 1]
    $("#pickD").attr("value", today.join("-"))
    $("#dropD").attr("value", tomorrow.join("-"))


    //get form data from user
    $(".rent-form,.rent-page").on("submit", (e) => {
        e.preventDefault();
        formElements.forEach(element => localStorage.setItem(element.attr("id"), element.val()))
        window.location.pathname != "/rent.html" ? window.location.href = "rent.html" : null;
    })

    //set form user data on start if available
    const formElements = [$("#pickL"), $("#dropL"), $("#pickD"), $("#dropD"), $("#pickT"), $("#dropT")];
    localStorage.getItem("pickL") != null ? formElements.forEach(element => element.val(localStorage.getItem(element.attr("id")))) : null


    //set price range - setting
    $("#price").val($("#price-range").val());
    $("#price-range").on("mousedown", function () {
        $("#price-range").on("mousemove", function () {
            $("#price").val($("#price-range").val());
        })
    })
    $("#price").on("change", function () {
        $("#price-range").val($("#price").val())
    })

    //select all - setting
    $(".select-all").click(function() {
        const isChecked = $(this).prop("checked");
        $(this).parent().siblings(".setting").find("input").prop("checked", isChecked);
      });

    //reset settings
    $(".reset-button").click(function(){
        $(`input[type="checkbox"]`).prop("checked",true)
    })

    //get database
    let database;
    window.location.pathname == "/rent.html" ? $.getJSON("/database/db.json",function(data){setDatabase(data)}) : null;
    
    //show all available cars
    let cars = [];

    function setDatabase(value){
        database = value;
        database.forEach((element, index) => cars[index] = createCar(element,index))
        $(".available-cars").html([...cars])
    };
    
    function createCar(element,index){
        return(
            `
            <div class="rentableCar" id="car='${index}'">
                <div>Car Name: ${element.carname}</div>
                <div>Car Type: ${element.car_type}</div>
                <div>Rental Agency: ${element.rental_agency}</div>
                <button>Select this car</button>
            </div>
            `
        )

    };



});
