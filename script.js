$(document).ready(function () {
    //test distance calculation
        let distance;
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${localStorage.getItem("dropL")}&origins=${localStorage.getItem("pickL")}&units=metric&key=AIzaSyBgG2ZFnmUnevD6YNPtwczEiJXf_8Uqtmw`).then((resp)=>{
           resp.json().then((l)=>distance = Math.round(l.rows[0].elements[0].distance.value / 1000));
         })
    

    //check login/register
    function accountCheck(){
        if(database.find(e=>e.id == session_ID) && session_ID != null){
            window.location.href = "account.html" 
        }else{
            $(".login-form").length < 1 ? $("body").append(loginForm):null; 
            
            //activate close button
            $(".loginFormClose").click(function(){
                $(this).parent()[0].remove()
            })

            //register
            $(".registerButton").click(function(){
                $(".login-form").remove()
                $(".register-form").length < 1 ? $("body").append(registerForm):null; 
            
                //switch back to login
            $(".switchLogin").click(function(){ 
                $(".register-form").remove()
                accountCheck()

            })
            //activate close button
            $(".registerFormClose").click(function(){
                $(this).parent()[0].remove()
            })

                //check register info
                $(".register-form").on("submit",function(e){
                    e.preventDefault();
                    const newUser = {}
                    database.find(e => e.email == $("#registerEmail").val()) ? console.log("user already exist"):(
                        newUser.email = $("#registerEmail").val(),
                        newUser.user = $("#registerUser").val(),
                        newUser.pass = $("#registerPassword").val(), 
                        newUser.status = "user",
                        newUser.review = "",
                        newUser.curent_rent = "",
                        newUser.id = makeid(50,database),
                        addUser(newUser)
                        );
                })
            })

            //check login info
            $(".login-form").on("submit",function(e){
                e.preventDefault();
                let index = database.indexOf(database.find(e => e.email == $("#loginEmail").val()))

                database[index].pass == $("#loginPassword").val() ? (localStorage.setItem("session_ID",database[index].id,window.location.reload())) : console.log("wrong pass or email");
                }
            )

        }
    }
    //account button
    $("#account").click(accountCheck)
  
    //login form
    function loginForm(){
        return(
            `
            <form class="login-form">
                <div class="loginFormClose">X</div>
                <div class="loginFormMain">
                    <h2>Login</h2>
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword">
                    <input type="submit" value="Login" id="loginButton">
                    <div>Need an account?<span class="registerButton">Register</span></div>
                </div>
            </form>
            `
        )
    }
    //register form
    function registerForm(){
        return(
            `
            <form class="register-form">
                <div class="registerFormClose">X</div>
                <div class="registerFormMain">
                    <h2>Register</h2>
                    <label for="registerUser">User Name</label>
                    <input type="text" id="registerUser">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail">
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword">
                    <input type="submit" value="Register" id="registerButton">
                    <div>Already have an account?<span class="switchLogin">Login</span></div>
                </div>
            </form>
            `
        )
    }

    //post new user
    function addUser(userData){
        console.log(userData);
        $.post("http://localhost:8080/accounts",userData).then(()=>{
            localStorage.setItem("session_ID",userData.id);
            window.location.reload();
        })
    }

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

    //get database for rent or account
    let database;
    if(window.location.pathname == "/rent.html"){
        $.getJSON("/database/db.json",function(data){
            database = data.cars;
            getFiltersOptions()
            createHtmlElements(database);
        }) ;
    }
    //get user info
    let session_ID = localStorage.getItem("session_ID")
    $.getJSON("/database/accounts.json",function(data){
        database = data.accounts;
        let foundUser = database.find(e=>e.id== session_ID)
        if(foundUser && session_ID != null){
            $("#account").html(`<div class="account-user">${foundUser.user}<div>`)

            //logout button
            $(".nav-elements").append(`<button class="log-out">Log out</button>`)
            $(".log-out").click(function(){
                localStorage.removeItem("session_ID");
                window.location.reload()
            })
            //add history rents and curent rent from account
            if(window.location.pathname == "/account.html"){
                foundUser.curent_rent.length > 1 ? $(".current-rent").append(`<div>${foundUser.curent_rent}<div>`) :
                $(".current-rent").append(`<div>No rented car<div>`);
            }else if(window.location.pathname == "/index.html"){
                database.map(e=> e.review.length > 1 ? $(".swiper-wrapper").append(buildReviews(e)):null)
                
            }
        }
            }) ;

    //build reviews
    function buildReviews(data){
        return(`
        <div class="swiper-slide">
        <div class="rev-name">${data.user}</div>
        <div class="rating">
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
        </div>
        <div class="rev-comment">"${data.review}"</div>
    </div>
        `)
    }

    //show all available cars initialy and after filter
    let cars = [];
    function createHtmlElements(db){
        db.forEach((element, index) => cars[index] = createCarElemet(element,index))
        $(".available-cars").html([...cars])

        //bring final car form
        $(".selectCar").click(function (){
            $(".selectContainer").length < 1 ? $("body").append(createCarFormElement($($(this).parent()[0]).attr("id"),db)) : null;
            
        //rent selected vehicle
        $(".selectContainer").on("submit",(e)=>{
            e.preventDefault()
            localStorage.getItem("session_ID") == null ? accountCheck() : console.log("car added");
        })
            //remove elemenent on click
            $(".selectContainerClose").click(function (){
                $($(this).parent()[0]).remove();
            })
        })

        $(".selectCar").hover(function(){
            $($(this).parent()).toggleClass("selectCarHover")
        })
 
    };

    function createCarFormElement(dataId,db){
        return(
            `
            <form class="selectContainer">
            <div class="selectContainerClose">X</div>
            <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${db[dataId].carname.split(" ")[0]}&modelFamily=${db[dataId].carname.split(" ")[1]}&zoomlevel=100" alt="Car Image" width="30%">
                <div><strong>Car name</strong>:${db[dataId].carname}</div>
                <div><strong>Car Type</strong>:${db[dataId].car_type}</div>
                <div><strong>Rental Agency</strong>:${db[dataId].rental_agency}</div>
                <div><strong>Card Type</strong>:${db[dataId].card_type}</div>
                <div><strong>Starting Price</strong>:<span style="color:red">${Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100) }</span> ${selectedCurrency}</div>
                <div><strong>Pick up from</strong> ${localStorage.getItem("pickL")} <strong>at</strong> ${localStorage.getItem("pickT")}</div>
                <div><strong>Drop at</strong>${localStorage.getItem("dropL")} <strong>at</strong>  ${localStorage.getItem("dropT")}</div>
                <div><strong>Distance</strong>:${distance} km</div>
                <input type="submit" value="Rent this car" id="addRent">
            </form>
            `
        )
    }

    function createCarElemet(element,index){
        return(
            `
            <div class="rentableCar" id=${index}>
                <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${element.carname.split(" ")[0]}&modelFamily=${element.carname.split(" ")[1]}&zoomlevel=100" alt="Car Image" width="30%">
                <div>Car Name: <br>${element.carname}</div>
                <div>Car Type: <br>${element.car_type}</div>
                <div>Rental Agency: <br>${element.rental_agency}</div>
                <div>Card Type: <br>${element.card_type}</div>
                <div>Starting Price: <br><span style="color:red">${Math.floor(element.rent_price * convertedCurrency * element.agency_commission / 100) }</span> ${selectedCurrency}</div>
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

    //ID generator
    function makeid(length,db) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        if(db.find(e=>e.id == result)){
            makeid(50,db) 
        }else{
            return result;
        }
        
    }

    
 
});
