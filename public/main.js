
document.addEventListener("DOMContentLoaded", ()=>{ //once the DOM is loaded, we proceed to make a request to backend
    // we will use fetch
    const getBusinessHours = async () => {
        try{
            const response = await fetch("/get_business_hours");
            const businessHours = await response.json();
            console.log(businessHours);
            for (day of businessHours){
                const businessRow = createBusinessHourTemplate(day);
                document.querySelector('.business_hours--card').insertAdjacentHTML('beforeend', businessRow );
            }
                console.log(day);
        }catch(ex){
            console.log("error while getting business hours from backend");
        }
    }
    getBusinessHours();
})

const createBusinessHourTemplate = data =>`<div class="business-hours_day">${data.day} - ${data.hour}</div>`