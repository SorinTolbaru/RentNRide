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
            totalPrice = $("#price").val()
        })
    })
    $("#price").on("change", function () {
        $("#price-range").val($("#price").val())
        totalPrice = $("#price-range").val()
    })

    //select all - setting
    $(".select-all").click(function() {
        const isChecked = $(this).prop("checked");
        $(this).parent().siblings(".setting").find("input").prop("checked", isChecked);

      });

    //reset settings
    $(".reset-button").click(function(){
        $(`input[type="checkbox"]`).prop("checked",true)
        getFiltersOptions();
        applyCarFilter();

    })

    //get database
    let database;
    if(window.location.pathname == "/rent.html"){
        $.getJSON("/database/db.json",function(data){
            database = data;
            getFiltersOptions()
            createHtmlElements(database);
        }) ;
    }
   
    //show all available cars initialy and after filter
    let cars = [];
    function createHtmlElements(db){
        db.forEach((element, index) => cars[index] = createCarElemet(element,index))
        $(".available-cars").html([...cars])
    };
    
    function createCarElemet(element,index){
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

    //filter cars
    function applyCarFilter(){
        cars = [];
        resultedCars = database.filter(element => filterCarType.includes(element.car_type) && filterRentAgency.includes(element.rental_agency))

        createHtmlElements(resultedCars)
        resultedCars = [];  
    }

    //get all initial filter options

        let filterCarType = [];
        let filterRentAgency = [];
        let totalPrice;
        let securityDeposit;
        function getFiltersOptions(){ 
            for(let i = 1; i < $("#carType").children(".setting").length;i++ ){
                filterCarType.push($($("#carType").children(".setting").find("input")[i]).attr("id"))
            }
            for(let i = 1; i < $("#rentingAgency").children(".setting").length;i++ ){
                filterRentAgency.push($($("#rentingAgency").children(".setting").find("input")[i]).attr("id"))
            }
        }


    //remove filter based on checked option
    let resultedCars = [];
    $(`input:checkbox`).click(function() {
        if($(this).prop("checked") == false){
            if($($(this).parent().parent()[0]).attr("id") == "carType"){
                filterCarType.splice(filterCarType.indexOf($(this).attr("id")),1);
            }else{
                filterRentAgency.splice(filterRentAgency.indexOf($(this).attr("id")),1);
            }
            applyCarFilter()
        }else{
            if($($(this).parent().parent()[0]).attr("id") == "carType"){
                filterCarType.push($(this).attr("id"));
            }else{
                filterRentAgency.push($(this).attr("id"));
            }
            applyCarFilter()
        }
        
    });
    


});
