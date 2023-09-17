$(document).ready(function () {
    //test distance calculation
        let distance;
        fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${localStorage.getItem("dropL")}&origins=${localStorage.getItem("pickL")}&units=metric&key=AIzaSyBgG2ZFnmUnevD6YNPtwczEiJXf_8Uqtmw`).then((resp)=>{
           resp.json().then((l)=>distance = Math.round(l.rows[0].elements[0].distance.value / 1000));
         })

    //mobile menu
    $(".hamburger-mobile").click(function(){
        $(".nav-elements-mobile").toggleClass("display-flex")
        $(".nav-elements-mobile").hasClass("display-flex") ? 
        $(this).html(`<svg fill="#000000" height="90%" width="80%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 460.775 460.775" xml:space="preserve">
   <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
       c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
       c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
       c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
       l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
       c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/> 
   </svg>`):
   $(this).html(`<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
   <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
   <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
   </svg>`)
        
        
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


    //check login/register
    function accountCheck(){

        if(database.find(e=>e.id == session_ID) && session_ID != null){
            window.location.href = "account.html" 
        }else{
            $(".login-form").length < 1 ? $(".register-form").length < 1 ? $("body").append(loginForm) : null : null
            
            //activate close button
            $(".loginFormClose").click(function(){
                $(this).parent()[0].remove();   
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
                    database.find(e => e.email == $("#registerEmail").val()) ? $("#wrongData").addClass("display"):(
                        newUser.email = $("#registerEmail").val(),
                        newUser.user = $("#registerUser").val(),
                        newUser.pass = $("#registerPassword").val(), 
                        newUser.status = "user",
                        newUser.times_rented = 0,
                        newUser.review = {
                            comment:"",
                            starts:5
                        },
                        newUser.curent_rent = {
                            car_name:null,
                            pick_location:null,
                            drop_location:null,
                            pick_date:null,
                            drop_date:null,
                            pick_time:null,
                            drop_time:null
                          },
                        newUser.id = makeid(50,database),
                        addUser(newUser)
                        );
                })
            })

            //check login info
            $(".login-form").on("submit",function(e){
                e.preventDefault();
                let index = database.indexOf(database.find(e => e.email == $("#loginEmail").val()))

                database[index].pass == $("#loginPassword").val() ? (localStorage.setItem("session_ID",database[index].id,window.location.reload())) : $("#wrongData").addClass("display");
                }
            )

        }
    }

    //account button
    $("#account,#account-mobile").click(accountCheck)
  
    //login form
    function loginForm(){
        return(
            `
            <form class="login-form">
                <div class="loginFormClose"><svg fill="#000000" height="0.8rem" width="0.8rem" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 460.775 460.775" xml:space="preserve">
           <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
               c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
               c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
               c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
               l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
               c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
           </svg></div>
                <div class="loginFormMain">
                    <h2>Login</h2>
                    <div id="wrongData">Wrong Email or Password</div>
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" required>
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" required>
                    <input type="submit" value="Login" id="loginButton">
                    <div>Need an account? <span class="registerButton">Register</span></div>
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
                <div class="registerFormClose"><svg fill="#000000" height="0.8rem" width="0.8rem" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 460.775 460.775" xml:space="preserve">
           <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
               c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
               c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
               c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
               l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
               c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
           </svg></div>
                <div class="registerFormMain">
                    <h2>Register</h2>
                    <div id="wrongData">Email already in use</div>
                    <label for="registerUser">User Name</label>
                    <input type="text" id="registerUser" required>
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" required>
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" required>
                    <input type="submit" value="Register" id="registerButton">
                    <div>Already have an account? <span class="switchLogin">Login</span></div>
                </div>
            </form>
            `
        )
    }

    //post new user
    function addUser(userData){
        $.ajax({
            url: "http://localhost:8080/accounts",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),
            dataType: "json",
            success: function() {
                localStorage.setItem("session_ID",userData.id)
                window.location.reload()
                console.log("user created succesfully");

            }
        });
    }

    //faq menu
    $(".question").click(function () {
        $(this).children(".q-answer").toggleClass("show-answer")
        $(this).children("h4").children(".arrow-show").toggleClass("rotate-arrow")
    })

    //get today/tomorrow
    const currentDay = new Date();
    const today = formatDate(currentDay);
    const tomorrow = formatDate(new Date(currentDay.getTime() + 24 * 60 * 60 * 1000));
    $("#pickD").attr("value", today);
    $("#dropD").attr("value", tomorrow);
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0'); 
      return `${year}-${month}-${day}`;
    }

    //get form data from user
    $(".rent-form,.rent-page").on("submit", (e) => {
        e.preventDefault();
        formElements.forEach(element => localStorage.setItem(element.attr("id"), element.val()))
        window.location.pathname != "/rent.html" ? window.location.href = "rent.html" : location.reload();
    })

    //set form user data on start if available
    const formElements = [$("#pickL"), $("#dropL"), $("#pickD"), $("#dropD"), $("#pickT"), $("#dropT"),$("#choose-currency")];
    localStorage.getItem("pickL") != null ? formElements.forEach(element => element.val(localStorage.getItem(element.attr("id")))) : null

    //change currency onchange
    $("#choose-currency").on("change",function(){
        localStorage.setItem("choose-currency",$(this).val())
        window.location.pathname == "/rent.html" ? window.location.reload() : null
    })

    //set currency based on form data
    let selectedCurrency = localStorage.getItem("choose-currency") == "EURO" ? "€" : localStorage.getItem("choose-currency") == "Lei" ? "Lei" : "$";
    
    //baseCurrency lei, euro or usd - base price is in euro
    let convertedCurrency = selectedCurrency == "€" ? 1 : selectedCurrency == "Lei" ? 4.94 : 1.09;

    //set price range - setting
    let totalPrice = Number($("#price-range").val());
    $("#price").val($("#price-range").val());
    $("#price-range").on("mousedown taphold", function () {
        $("#price-range").on("mousemove", function () {
            $("#price").val($("#price-range").val());
            totalPrice = $("#price").val()
            applyCarFilter()
        })
    })
    //set price range - setting mobile
    $("#price-range").on("touchstart", function () {
        $("#price-range").on("touchmove", function () {
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
    let cardatabase;
    
        $.getJSON("/database/db.json",function(data){ 
            cardatabase = data.cars;
            if(window.location.pathname == "/rent.html"){
            getFiltersOptions()
            createHtmlElements(cardatabase);
        }else if(window.location.pathname == "/index.html"){
                let allWanted = cardatabase.map(e=> e.wanted).sort((a,b)=>a-b);
                let topThree = allWanted.slice(allWanted.length-3, allWanted.length).toReversed() 
                topThree.map((e,i)=>$(".cars").append(createWanted(cardatabase.find(e=>e.wanted == topThree[i]))));
                
            }
        }) ;
    
    //get user info
    let session_ID = localStorage.getItem("session_ID")
    $.getJSON("/database/accounts.json",function(data){
        database = data.accounts;
        let foundUser = database.find(e=>e.id== session_ID)

        //get reviews
        if(window.location.pathname == "/index.html"){
            database.map(e=> e.review.comment.length > 1 ? $(".swiper-wrapper").append(buildReviews(e)):null)
            
        }
        if(foundUser && session_ID != null){
            $("#account,#account-mobile").html(`<div class="account-user">${foundUser.user}<div>`)

            //logout button
            $(".user-container,.user-container-mobile").append(`<button class="log-out">Log out</button>`)
            $(".log-out").click(function(){
                localStorage.removeItem("session_ID");
                window.location.reload()
            })
            //add history rents and curent rent from account
            if(window.location.pathname == "/account.html"){
                foundUser.curent_rent.car_name != null ? $(".current-rent").append(
                    `<div class="currentRentedRide">
                        <div class="img-car">
                        <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${foundUser.curent_rent.car_name.split(" ")[0]}&modelFamily=${foundUser.curent_rent.car_name.split(" ")[1]}&zoomlevel=100" alt="Car Image" height="80%">
                       <div style="height:20%"> ${foundUser.curent_rent.car_name}</div>
                        </div>
                        <div><strong>Pick Location</strong>: ${foundUser.curent_rent.pick_location}</div>
                        <div><strong>Drop Location</strong>: ${foundUser.curent_rent.drop_location}</div>
                    </div>`
                    ) :
                $(".current-rent").append(`<div class="currentRentedRideNone" style="justify-content: center;">No rented car<div>`);
                $(".currentRentedRide").click(()=>{
                    if(foundUser.curent_rent.car_name != null){
                    $("body").append(
                        `<div class="currentRentedRidePop">
                        <div class="selectContainerClose"><svg fill="#000000" height="0.8rem" width="0.8rem" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 460.775 460.775" xml:space="preserve">
                   <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                       c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                       c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                       c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                       l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                       c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                   </svg></div>
                    <div class="rent-details-container">
                        <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${foundUser.curent_rent.car_name.split(" ")[0]}&modelFamily=${foundUser.curent_rent.car_name.split(" ")[1]}&zoomlevel=100" alt="Car Image" width="50%" style="margin: auto;height: fit-content;">
                            <div class="rent-details">
                            <div><strong>Car</strong>: ${foundUser.curent_rent.car_name}</div>
                            <div><strong>Pick Location</strong>: ${foundUser.curent_rent.pick_location}</div>
                            <div> <strong>Drop Location</strong>: ${foundUser.curent_rent.drop_location}</div>
                            <div> <strong>Pick date</strong>: ${foundUser.curent_rent.pick_date}</div>
                            <div><strong>Drop date</strong>: ${foundUser.curent_rent.drop_date}</div>
                            <div><strong>Pick time</strong>: ${foundUser.curent_rent.pick_time}</div>
                            <div> <strong>Drop time</strong>: ${foundUser.curent_rent.drop_time}</div>
                            </div>
                    </div>
                    <div class="rent-options">
                        <button id="askReview">Finish Ride</button>
                        <button id="cancelRide">Cancel Ride</button>
                    </div>
                    </div>`
                
                    )}
                    $("#askReview").click(()=>{
                        $("body").append(                   
                        `<div class='thankYou'>
                        <h1>Are you sure you want to finish this ride?</h1>
                        <div>
                        <button id="finishRent">Yes</button>
                        <button id="Cancel">No</button>
                        </div>
                       </div>`
                        )
                        $("#finishRent").click(function(){
                            if(foundUser.review.comment.length < 1){
                                $(".thankYou").remove()
                                $("body").append(                   
                                    `<div class='thankYou'>
                                    <h1><span style="display:block;">Like our services?</span><span>Leave a review!</span></h1>
                                    <div class="reviewStarContainer">
                                    <span class="fa fa-star reviewStar"></span>
                                    <span class="fa fa-star reviewStar"></span>
                                    <span class="fa fa-star reviewStar"></span>
                                    <span class="fa fa-star reviewStar"></span>
                                    <span class="fa fa-star reviewStar"></span>
                                    </div>
                                    <textarea name="reviewComment" id="reviewComment" cols="30" rows="10"></textarea> 
                                    <div class="rev-buttons">
                                    <button id="finishRent">Submit Review</button>
                                    <button id="finishRentNoReview">Maybe another time</button>
                                    </div>
                                    </div>
                                   </div>`
                                    )
                                    $(".reviewStar").on("mouseenter",function(){
                                        [...$(".reviewStar")].forEach((e,index)=>{
                                            if(index <= $(this).index()){
                                                $(e).addClass("checked")
                                            }else{
                                                $(e).removeClass("checked")
                                            }})
                                    })
                                    $("#finishRent").click(function(){
                                        let userReview = {
                                                comment: $("#reviewComment").val(),
                                                stars: $(".checked").length
                                              }
                                        modifyRide(foundUser,1,null,userReview)
                                    })
                                    $("#finishRentNoReview").click(function(){
                                        modifyRide(foundUser,1)
                                    })
                            };
                        }),
                        $("#Cancel").click(function(){
                            $(this).parent().parent()[0].remove()
                        })
                        
                    })
                    $("#cancelRide").click(()=>{
                        $("body").append(                   
                            `<div class='thankYou'>
                            <h1>Are you sure you want to cancel this ride?</h1>
                            <div>
                            <button id="cancelRent">Yes</button>
                            <button id="overwriteCancel">No</button>
                            </div>
                           </div>`
                            )    
                            $("#cancelRent").click(function(){
                                modifyRide(foundUser,0)
                            }),
                            $("#overwriteCancel").click(function(){
                                $(this).parent().parent()[0].remove()
                            })
                    })

                    //remove elemenent on click
                    $(".selectContainerClose").click(function (){
                        $($(this).parent()[0]).remove();
            })
                })   
        //scale effect
        $(".currentRentedRide").on("mousedown",()=>{
            $(".currentRentedRide").css("scale", "0.9")
            $(".currentRentedRide").on("mouseup mouseleave mousedrag",()=>{$(".currentRentedRide").css("scale", "1")})
    
        })
            }
        }
            }) ;

    //add, cancel, finish ride  
    function modifyRide(user,incr,ride,review){
        $.ajax({
            url: `http://localhost:8080/accounts/${user.id}`,
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify({
                email: user.email,
                user: user.user,
                pass: user.pass,
                status: user.status,
                times_rented: user.times_rented + incr,
                curent_rent: {
                    car_name: ride ? ride.car_name : null,
                    pick_location: ride ? ride.pick_location : null,
                    drop_location: ride ? ride.drop_location : null,
                    pick_date: ride ? ride.pick_date : null,
                    drop_date: ride ? ride.drop_date : null,
                    pick_time: ride ? ride.pick_time : null,
                    drop_time: ride ? ride.drop_time : null
                },
                review: {
                    comment: review ? review.comment : user.review.comment,
                    stars: review ? review.stars : user.review.stars
                },
                id: user.id
                }),success: function() {
                        if(window.location.pathname != "/rent.html"){
                            window.location.reload()
                        }
          
                }
            });
    }

    //build reviews
    function buildReviews(data){
        return(`
        <div class="swiper-slide">
        <div class="rev-name">${data.user}</div>
        <div class="rating">
            ${getStars(data.review.stars).join(" ")}
        </div>
        <div class="rev-comment">"${data.review.comment}"</div>
    </div>
        `)
    }

    function getStars(stars){
        let allstars = [];
        for(let i = 0; i < stars;i++){
            allstars.push('<span class="fa fa-star checked"></span>')
        }
        for(let i = 0; i < 5 - stars;i++){
            allstars.push(`<span class="fa fa-star"></span>`)
        }
        return allstars
    }

    //most wanted cars
    function createWanted(element){
        return(
            `
            <div class="car">
            <img  src="https://cdn.imagin.studio/getImage?&customer=img&make=${element.carname.split(" ")[0]}&modelFamily=${element.carname.split(" ")[1]}&zoomlevel=100" alt="Car Image">
            <div><strong>${element.carname}</strong></div>
            </div>
            `
        )
    }

    //show all available cars initialy and after filter
    let cars = [];
    function createHtmlElements(db){
        db.forEach((element, index) => cars[index] = createCarElemet(element,index))
        $(".available-cars").html([...cars])

        //bring final car form
        $(".selectCar").click(function (){
            let carID = $($(this).parent()[0]).attr("id")
            $(".selectContainer").length < 1 ? $("body").append(createCarFormElement(carID,db)) : null;
            
        //rent selected vehicle
        $(".selectContainer").on("submit",(e)=>{
            e.preventDefault()
            let rideData = {}
            localStorage.getItem("session_ID") == null ? accountCheck() : (
                rideData = {
                    car_name:db[carID].carname,
                    pick_location: localStorage.getItem("pickL"),
                    drop_location:localStorage.getItem("dropL"),
                    pick_date: localStorage.getItem("pickD"),
                    drop_date: localStorage.getItem("dropD"),
                    pick_time: localStorage.getItem("pickT"),
                    drop_time: localStorage.getItem("dropT")
                },
                fetch(`http://localhost:8080/accounts/${localStorage.getItem("session_ID")}`).then(resp=>resp.json().then((user=>{
                    if(user.curent_rent.car_name == null){
                        modifyRide(user,0,rideData),
                        $(".selectContainer").remove()
                        $("body").append(
                            `<div class='thankYou'>
                             <h1>Thank you for using our service!</h1>
                             <div>
                             <button id="viewRent">View my rent</button>
                             <button id="thankYouClose">Close</button>
                             </div>
                            </div>`
                            )
                            ,
                        $("#viewRent").click(function(){
                            window.location.href= "/account.html"
                        })
                        $("#thankYouClose").click(function(){
                            $(this).parent().parent()[0].remove()
                        })
                    }else{
                        $(".selectContainer").remove()
                        $("body").append(
                            `<div class='thankYou'>
                             <h1>You already have a car rented!</h1>
                             <div>
                             <button id="overwriteRent">Overwrite</button>
                             <button id="overwriteCancel">Cancel</button>
                             </div>
                            </div>`
                            )
                            $("#overwriteRent").click(function(){
                                modifyRide(user,0,rideData)
                                $(this).parent().parent()[0].remove()
                                $("body").append(
                                    `<div class='thankYou'>
                                     <h1>Thank you for using our service!</h1>
                                     <div>
                                     <button id="viewRent">View my rent</button>
                                     <button id="thankYouClose">Close</button>
                                     </div>
                                    </div>`
                                    )
                                    ,
                                $("#viewRent").click(function(){
                                    window.location.href= "/account.html"
                                })
                                $("#thankYouClose").click(function(){
                                    $(this).parent().parent()[0].remove()
                                })
                            })
                            $("#overwriteCancel").click(function(){
                                $(this).parent().parent()[0].remove()
                            })
                    }

                    
                })))

                );
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
            <div class="selectContainerClose"><svg fill="#000000" height="0.8rem" width="0.8rem" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 460.775 460.775" xml:space="preserve">
       <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
           c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
           c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
           c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
           l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
           c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
       </svg></div>
       <div class="rent-details-container">
            <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${db[dataId].carname.split(" ")[0]}&modelFamily=${db[dataId].carname.split(" ")[1]}&zoomlevel=100" alt="Car Image" width="50%" style="margin: auto;height: fit-content;">
                <div class="rent-details">
                <div><strong>Car name</strong>: ${db[dataId].carname}</div>
                <div><strong>Car Type</strong>: ${db[dataId].car_type}</div>
                <div><strong>Rental Agency</strong>: ${db[dataId].rental_agency}</div>
                <div><strong>Card Type</strong>: ${db[dataId].card_type}</div>
                <div><strong>Starting Price</strong>: <span style="color:red">${Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100) }</span> ${selectedCurrency}</div>
                <div><strong>Pick up from </strong> ${localStorage.getItem("pickL")} <strong>at</strong> ${localStorage.getItem("pickT")} <strong>on</strong> ${localStorage.getItem("pickD")}</div>
                <div><strong>Drop at </strong>${localStorage.getItem("dropL")} <strong>at</strong>  ${localStorage.getItem("dropT")} <strong>on</strong> ${localStorage.getItem("dropD")}</div>
                <div><strong>Distance</strong>:${distance} km</div>
                <div><strong>Total Price: </strong></strong><span style="color:red">${calculateRide(db,dataId)} ${selectedCurrency}</span></div>
                </div>
                </div>
                <div class="rent-options">
                <input type="submit" value="Rent this car" id="addRent">
                </div>
            </form>
            `
        )
    }

    function calculateRide(db, dataId){
        let finalPrice =  Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100 * (Number(localStorage.getItem("dropD").split("-")[2]) - Number(localStorage.getItem("pickD").split("-")[2]))) 
        finalPrice == 0 ? finalPrice = Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100) : null
        return finalPrice
    }

    function createCarElemet(element,index){
        return(
            `
            <div class="rentableCar" id=${index}>
            <div class="carImage-carModel-carType" style="height:100%;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
                <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${element.carname.split(" ")[0]}&modelFamily=${element.carname.split(" ")[1]}&zoomlevel=100" alt="Car Image" loading="lazy" style="height:70%;">
                <div style="height:10%;"><strong>${element.carname}</strong></div>
            </div>
            <div style="
            display: flex;
            gap: 5px;
            flex-wrap: wrap;justify-content: center;">
              <div style="display:flex;flex-direction:column;gap:5px;">
                <div><strong>👨🏼‍💼 Agency</strong>: ${element.rental_agency}</div>
                <div>  <strong>💳 Card Type</strong>: ${element.card_type}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;">
                <div><strong>🚗 Car Type: </strong>${element.car_type}</div>
                <div><strong>💸 Starting Price</strong>:<span style="color:red"> ${Math.floor(element.rent_price * convertedCurrency * element.agency_commission / 100) } ${selectedCurrency}</span>
                </div>
            </div>
            </div>
            <button class="selectCar">Rent this car</button>
          </div>
            `
        )
    };

    //filter cars
    function applyCarFilter(){
        cars = [];
        resultedCars = cardatabase.filter(element => filterCarType.includes(element.car_type) && filterRentAgency.includes(element.rental_agency) && element.rent_price * convertedCurrency * element.agency_commission / 100 <= totalPrice && securityDeposit.includes(element.card_type))
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
