$(document).ready(function () {
    
    //test distance calculation
    function getDistance(destination,origin){
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=metric&key=AIzaSyBgG2ZFnmUnevD6YNPtwczEiJXf_8Uqtmw`).then((resp)=>{
            console.log(resp.json().then((l)=>console.log(l.rows[0].elements[0].distance.text)));
         })
    }

    getDistance(localStorage.getItem("dropL"),localStorage.getItem("pickL"))

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
        window.location.pathname != "/rent.html" ? window.location.href = "rent.html" : location.reload();
    })

    //set form user data on start if available
    const formElements = [$("#pickL"), $("#dropL"), $("#pickD"), $("#dropD"), $("#pickT"), $("#dropT"),$("#choose-currency")];
    localStorage.getItem("pickL") != null ? formElements.forEach(element => element.val(localStorage.getItem(element.attr("id")))) : null



    //set currency based on form data
    let selectedCurrency = localStorage.getItem("choose-currency") == "EURO" ? "€" : localStorage.getItem("choose-currency") == "Lei" ? "Lei" : "$";
    
    //baseCurrency lei, euro or usd - base price is in euro
    let convertedCurrency = selectedCurrency == "€" ? 1 : selectedCurrency == "Lei" ? 4.94 : 1.09;


    //set price range - setting
    let totalPrice = Number($("#price-range").val());
    $("#price").val($("#price-range").val());
    $("#price-range").on("mousedown", function () {
        $("#price-range").on("mousemove", function () {
            $("#price").val($("#price-range").val());
            totalPrice = $("#price").val()
            applyCarFilter()
        })
    })
    $("#price").on("change", function () {
        $("#price-range").val($("#price").val())
        totalPrice = $("#price").val()
        applyCarFilter()
    })

    //reset settings
    $(".reset-button").click(function(){
        $(`input[type="checkbox"]`).prop("checked",true)
        filterCarType = [];
        filterRentAgency = [];
        securityDeposit = [];
        getFiltersOptions();
        applyCarFilter();

    })

    //get database
    let database;
    if(window.location.pathname == "/rent.html"){
        $.getJSON("/database/db.json",function(data){
            database = data.cars;
            getFiltersOptions()
            createHtmlElements(database);
        }) ;
    }
   
    //show all available cars initialy and after filter
    let cars = [];
    function createHtmlElements(db){
        db.forEach((element, index) => cars[index] = createCarElemet(element,index))
        $(".available-cars").html([...cars])
        //initialise select button
        $(".selectCar").click(()=>console.log("click"))
 
    };

    function createCarElemet(element,index){
        return(
            `
            <div class="rentableCar" id=${index} style="background-image:url('https://cdn.imagin.studio/getImage?&customer=img&make=peugeot&modelFamily=308&zoomlevel=100')">
                <div>Car Name: <br>${element.carname}</div>
                <div>Car Type: <br>${element.car_type}</div>
                <div>Rental Agency: <br>${element.rental_agency}</div>
                <div>Card Type: <br>${element.card_type}</div>
                <div>Price: <br><span style="color:red">${Math.floor(element.rent_price * convertedCurrency * element.agency_commission / 100) }</span> ${selectedCurrency}</div>
                <button class="selectCar">Select this car</button>
            </div>
            `
        )
    };

    //filter cars
    function applyCarFilter(){
        cars = [];
        resultedCars = database.filter(element => filterCarType.includes(element.car_type) && filterRentAgency.includes(element.rental_agency) && element.rent_price * convertedCurrency * element.agency_commission / 100 <= totalPrice && securityDeposit.includes(element.card_type))
        createHtmlElements(resultedCars)
        resultedCars = [];  
    }

    //get all initial filter options

        let filterCarType = [];
        let filterRentAgency = [];
        let securityDeposit = [];
        function getFiltersOptions(id){ 
            if(id == "carType"){
                for(let i = 1; i < $("#carType").children(".settings").children(".setting").length;i++ ){
                    filterCarType.push($($("#carType").children(".settings").children(".setting").find("input")[i]).attr("id"))
                }
            }else if(id == "rentingAgency"){
                for(let i = 1; i < $("#rentingAgency").children(".settings").children(".setting").length;i++ ){
                    filterRentAgency.push($($("#rentingAgency").children(".settings").children(".setting").find("input")[i]).attr("id"))
                }
            }else if(id == "securityDeposit"){
                for(let i = 0; i < $("#securityDeposit").children(".settings").children(".setting").length;i++ ){
                    securityDeposit.push($($("#securityDeposit").children(".settings").children(".setting").find("input")[i]).attr("id"))

                }
            }else{
                for(let i = 1; i < $("#carType").children(".settings").children(".setting").length;i++ ){
                    filterCarType.push($($("#carType").children(".settings").children(".setting").find("input")[i]).attr("id"))
                }
                for(let i = 1; i < $("#rentingAgency").children(".settings").children(".setting").length;i++ ){
                    filterRentAgency.push($($("#rentingAgency").children(".settings").children(".setting").find("input")[i]).attr("id"))
                }
                for(let i = 0; i < $("#securityDeposit").children(".settings").children(".setting").length;i++ ){
                    securityDeposit.push($($("#securityDeposit").children(".settings").children(".setting").find("input")[i]).attr("id"))
                }
            }

  
        }


    //remove filter based on checked option
    let resultedCars = [];
    //remove or add all options from select all setting
    $(`input:checkbox`).click(function() {
        if($(this).attr("class") == "select-all"){

            //check if checked or not
            const isChecked = $(this).prop("checked");

            //set checked or unchecked to all settings in parent
            $(this).parent().siblings(".setting").find("input").prop("checked", isChecked);

            //get ID setting  
            let currentID = $($(this).parent().parent().parent()[0]).attr("id") 
            

            if(!isChecked){
                
                currentID == "carType" ? filterCarType = [] : filterRentAgency = [];
            }else{
                getFiltersOptions(currentID)
            }
            applyCarFilter()
            
        }else if($(this).prop("checked") == false){
            
            //if checked if false remove selected filter option
            if($($(this).parent().parent().parent()[0]).attr("id") == "carType"){  
                filterCarType.splice(filterCarType.indexOf($(this).attr("id")),1);
            }else if($($(this).parent().parent().parent()[0]).attr("id") == "rentingAgency"){
                filterRentAgency.splice(filterRentAgency.indexOf($(this).attr("id")),1);
            }else{
                securityDeposit.splice(securityDeposit.indexOf($(this).attr("id")),1);
            }
            applyCarFilter()
        }else{
            
            //if checked is false add selected filter option
            if($($(this).parent().parent().parent()[0]).attr("id") == "carType"){
                filterCarType.push($(this).attr("id"));
            }else if($($(this).parent().parent().parent()[0]).attr("id") == "rentingAgency"){
                filterRentAgency.push($(this).attr("id"));
            }
            else{
                securityDeposit.push($(this).attr("id"));
            }
            applyCarFilter()
        }
        
    });
    
 
});
