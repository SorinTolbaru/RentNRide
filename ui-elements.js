import * as Utilites from "./utilites.js"

//#Index Page
export function createWanted(element){
    return(
        `
        <div class="car">
        <img  src="https://cdn.imagin.studio/getImage?&customer=img&make=${element.carname.split(" ")[0]}&modelFamily=${element.carname.split(" ")[1]}&zoomlevel=100" alt="Car Image">
        <div><strong>${element.carname}</strong></div>
        </div>
        `
    )
}

export function buildReviews(data){
    return(`
    <div class="swiper-slide">
    <div class="rev-name">${data.user}</div>
    <div class="rating">
        ${getStars(data.review.stars).join(" ")}
    </div>
    <div class="rev-comment">"${data.review.comment}"</div>
</div>
    `)
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
}

//*Rent Page
//create Rent Page car elements list that will be shown before filter
export function createCarElement(element,index,convertedCurrency,selectedCurrency){
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
}

//create Rent Page element that shows selected car with info
export function createCarFormElement(dataId,db,convertedCurrency,selectedCurrency,distance){
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
            <div><strong>Distance</strong>: ${distance} km</div>
            <div><strong>Total Price: </strong></strong><span style="color:red">${Utilites.calculateRide(db,dataId,convertedCurrency)} ${selectedCurrency}</span></div>
            </div>
            </div>
            <div class="rent-options">
            <input type="submit" value="Rent this car" id="addRent">
            </div>
        </form>
        `
    )
}

//*Account Page
//Create current ride element
export function currentRent(foundUser){
    if(foundUser){
        return(
            `<div class="currentRentedRide">
            <div class="img-car">
            <img src="https://cdn.imagin.studio/getImage?&customer=img&make=${foundUser.curent_rent.car_name.split(" ")[0]}&modelFamily=${foundUser.curent_rent.car_name.split(" ")[1]}&zoomlevel=100" alt="Car Image" height="80%">
           <div style="height:20%"> ${foundUser.curent_rent.car_name}</div>
            </div>
            <div><strong>Pick Location</strong>: ${foundUser.curent_rent.pick_location}</div>
            <div><strong>Drop Location</strong>: ${foundUser.curent_rent.drop_location}</div>
        </div>`
        )
    }else{
        return(
            `<div class="currentRentedRideNone" style="justify-content: center;">No rented car<div>`
        )
    }

}

//*Common
export function loginForm(){
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

export function registerForm(){
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

export function setMobileSVG(state){
    if(state){
        return(
            `
            <svg fill="#000000" height="90%" width="80%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 460.775 460.775" xml:space="preserve">
            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/> 
            </svg>
            `
        )
    }else{
        return(
            `
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 18" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
            <path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
            <path d="M4 6L20 6" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
            </svg>
            `
        )
    }
}

//Create popup elements
export function createPopup(foundUser,type){
    if(type == "main"){
        return(
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
        )
    }else if(type == "ask"){
        return(
            `<div class='respond-popup'>
            <h1>Are you sure you want to finish this ride?</h1>
            <div>
            <button id="finishRent">Yes</button>
            <button id="Cancel">No</button>
            </div>
           </div>`
        )
    }else if(type == "finish"){
        return(
            `<div class='respond-popup'>
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
    }else if(type == "cancel"){
        return(
            `<div class='respond-popup'>
            <h1>Are you sure you want to cancel this ride?</h1>
            <div>
            <button id="cancelRent">Yes</button>
            <button id="overwriteCancel">No</button>
            </div>
           </div>`
        )
    }else if(type == "rented"){
        return(
            `<div class='respond-popup'>
            <h1>Thank you for using our service!</h1>
            <div>
            <button id="viewRent">View my rent</button>
            <button id="respond-popupClose">Close</button>
            </div>
           </div>`  
        )
    }else if(type == "overwrite"){
        return(
            `<div class='respond-popup'>
            <h1>You already have a car rented!</h1>
            <div>
            <button id="overwriteRent">Overwrite</button>
            <button id="overwriteCancel">Cancel</button>
            </div>
           </div>`  
        )
    }else if(type == "thank"){
        return(
            `<div class='respond-popup'>
            <h1>Thank you for using our services!</h1>
            <div>
            <button id="viewRent">View my rent</button>
            <button id="respond-popupClose">Close</button>
            </div>
           </div>`
        )
    }

}
