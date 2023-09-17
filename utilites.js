import * as UiElements from "./ui-elements.js";

 //get database for rent or account
 let cardatabase;
 $.getJSON("/database/db.json",function(data){ 
             cardatabase = data.cars;
             if(window.location.pathname == "/rent.html"){
             getFiltersOptions()
             createHtmlElements(cardatabase);
         }else if(window.location.pathname == "/index.html"){
                 let allWanted = cardatabase.map(e=> e.wanted).sort((a,b)=>a-b);
                 let topThree = allWanted.slice(allWanted.length-3, allWanted.length).toReversed() 
                 topThree.map((e,i)=>$(".cars").append(UiElements.createWanted(cardatabase.find(e=>e.wanted == topThree[i]))));
                 
             }
         }) ;
 
  //get user info
  let database;
  let session_ID = localStorage.getItem("session_ID")
 $.getJSON("/database/accounts.json",function(data){
         database = data.accounts;
         let foundUser = database.find(e=>e.id== session_ID)
 
         //get reviews
         if(window.location.pathname == "/index.html"){
             database.map(e=> e.review.comment.length > 1 ? $(".swiper-wrapper").append(UiElements.buildReviews(e)):null)
         }
         if(foundUser && session_ID != null){
             $("#account,#account-mobile").html(`<div class="account-user">${foundUser.user}<div>`)
 
             //logout button
             $(".user-container,.user-container-mobile").append(`<button class="log-out">Log out</button>`)
             $(".log-out").click(function(){
                 localStorage.removeItem("session_ID");
                 window.location.reload()
             })
             //add current rent from account
             if(window.location.pathname == "/account.html"){
                 foundUser.curent_rent.car_name != null ? $(".current-rent").append(UiElements.currentRent(foundUser)) :
                 $(".current-rent").append(UiElements.currentRent);
                 $(".currentRentedRide").click(()=>{
                     if(foundUser.curent_rent.car_name != null){
                     $("body").append(UiElements.createPopup(foundUser,"main"))}
                     $("#askReview").click(()=>{
                         $("body").append(UiElements.createPopup(foundUser,"ask"))
                         $("#finishRent").click(function(){
                             if(foundUser.review.comment.length < 1){
                                 $(".respond-popup").remove()
                                 $("body").append(UiElements.createPopup(foundUser,"finish"))
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
                                    
                             }else{
                                 modifyRide(foundUser,1)
                             };
                         }),
                         $("#Cancel").click(function(){
                             $(this).parent().parent()[0].remove()
                         })
                         
                     })
                     $("#cancelRide").click(()=>{
                         $("body").append(UiElements.createPopup(foundUser,"cancel"))    
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
 
 //check login/register
export function accountCheck(){
    if(database.find(e=>e.id == session_ID) && session_ID != null){
        window.location.href = "account.html" 
    }else{
        $(".login-form").length < 1 ? $(".register-form").length < 1 ? $("body").append(UiElements.loginForm) : null : null
        
        //activate close button
        $(".loginFormClose").click(function(){
            $(this).parent()[0].remove();   
        })

        //register
        $(".registerButton").click(function(){
            $(".login-form").remove()
            $(".register-form").length < 1 ? $("body").append(UiElements.registerForm):null; 
        
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
                    newUser.id = Utilites.makeid(50,database),
                    Utilites.addUser(newUser)
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
             
//set form user data on start if available
const formElements = [$("#pickL"), $("#dropL"), $("#pickD"), $("#dropD"), $("#pickT"), $("#dropT"),$("#choose-currency")];
localStorage.getItem("pickL") != null ? formElements.forEach(element => element.val(localStorage.getItem(element.attr("id")))) : null
export {formElements}

//set total price
export let totalPrice = {price:Number($("#price-range").val())};
$("#price").val($("#price-range").val());

//set currency based on form data
let selectedCurrency = localStorage.getItem("choose-currency") == "EURO" ? "€" : localStorage.getItem("choose-currency") == "Lei" ? "Lei" : "$";
    
 //baseCurrency lei, euro or usd - base price is in euro
let convertedCurrency = selectedCurrency == "€" ? 1 : selectedCurrency == "Lei" ? 4.94 : 1.09;

//Calculate Distance 
export async function getDistance(){
    let response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${localStorage.getItem("dropL")}&origins=${localStorage.getItem("pickL")}&units=metric&key=AIzaSyBgG2ZFnmUnevD6YNPtwczEiJXf_8Uqtmw`);
    let distanceJSON = await response.json()
    let distance = Math.round(distanceJSON.rows[0].elements[0].distance.value / 1000)
    return distance
}  

 //get all initial filter options
export let filter = {
    filterCarType : [],
    filterRentAgency :[],
    securityDeposit :[]
}
export function getFiltersOptions(id){ 
     if(id == "carType"){
         for(let i = 1; i < $("#carType").children(".settings").children(".setting").length;i++ ){
             filter.filterCarType.push($($("#carType").children(".settings").children(".setting").find("input")[i]).attr("id"))
         }
     }else if(id == "rentingAgency"){
         for(let i = 1; i < $("#rentingAgency").children(".settings").children(".setting").length;i++ ){
             filter.filterRentAgency.push($($("#rentingAgency").children(".settings").children(".setting").find("input")[i]).attr("id"))
         }
     }else if(id == "securityDeposit"){
         for(let i = 0; i < $("#securityDeposit").children(".settings").children(".setting").length;i++ ){
             filter.securityDeposit.push($($("#securityDeposit").children(".settings").children(".setting").find("input")[i]).attr("id"))

         }
     }else{
         for(let i = 1; i < $("#carType").children(".settings").children(".setting").length;i++ ){
             filter.filterCarType.push($($("#carType").children(".settings").children(".setting").find("input")[i]).attr("id"))
         }
         for(let i = 1; i < $("#rentingAgency").children(".settings").children(".setting").length;i++ ){
             filter.filterRentAgency.push($($("#rentingAgency").children(".settings").children(".setting").find("input")[i]).attr("id"))
         }
         for(let i = 0; i < $("#securityDeposit").children(".settings").children(".setting").length;i++ ){
             filter.securityDeposit.push($($("#securityDeposit").children(".settings").children(".setting").find("input")[i]).attr("id"))
         }
     }
 }

//show all available cars initialy and after filter
let cars = [];
export function createHtmlElements(db){
        db.forEach((element, index) => cars[index] = UiElements.createCarElement(element,index,convertedCurrency,selectedCurrency))
        $(".available-cars").html([...cars])
        //bring final car form
        $(".selectCar").click(function (){
            getDistance().then(d=>{
                let carID = $($(this).parent()[0]).attr("id")
                $(".selectContainer").length < 1 ? $("body").append(UiElements.createCarFormElement(carID,db,convertedCurrency,selectedCurrency,d)) : null;
            

            
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
                        $("body").append(UiElements.createPopup(null,"rented"))
                            ,
                        $("#viewRent").click(function(){
                            window.location.href= "/account.html"
                        })
                        $("#respond-popupClose").click(function(){
                            $(this).parent().parent()[0].remove()
                        })
                    }else{
                        $(".selectContainer").remove()
                        $("body").append(UiElements.createPopup(null,"overwrite"))
                            $("#overwriteRent").click(function(){
                                modifyRide(user,0,rideData)
                                $(this).parent().parent()[0].remove()
                                $("body").append(UiElements.createPopup(null,"thank"))
                                $("#viewRent").click(function(){
                                    window.location.href= "/account.html"
                                })
                                $("#respond-popupClose").click(function(){
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
    })
    };

let resultedCars = [];
export function applyCarFilter(){
    cars = [];
    resultedCars = cardatabase.filter(element => filter.filterCarType.includes(element.car_type) && filter.filterRentAgency.includes(element.rental_agency) && element.rent_price * convertedCurrency * element.agency_commission / 100 <= totalPrice.price && filter.securityDeposit.includes(element.card_type))
    createHtmlElements(resultedCars)
    resultedCars = [];  
}

//ID generator for register
export function makeid(length,db) {
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

export function addUser(userData){
  $.ajax({
        url: "http://localhost:8080/accounts",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(userData),
        dataType: "json",
        success: function() {
            localStorage.setItem("session_ID",userData.id)
            window.location.reload()
        }
    });
}

//Add, cancel, finish ride  
export function modifyRide(user,incr,ride,review){
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


//Calculate final price for selected Ride
export function calculateRide(db, dataId,convertedCurrency){
    let finalPrice =  Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100 * (Number(localStorage.getItem("dropD").split("-")[2]) - Number(localStorage.getItem("pickD").split("-")[2]))) 
    finalPrice == 0 ? finalPrice = Math.floor(db[dataId].rent_price * convertedCurrency * db[dataId].agency_commission / 100) : null
    return finalPrice
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
}

