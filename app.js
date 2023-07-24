const container = document.getElementById('container');
const randomMealContainer = document.getElementById('randomMealContainer');
const randomMealCard = document.querySelector(".randomMealCard");
const url = 'https://www.themealdb.com/api/json/v1/1/random.php';


// get random meals 
async function getRandomMeals() {
    try {
        const meals = [];
        for (let i = 0; i < 6; i++) {
            const response = await fetch(url);
            const data = await response.json();
            meals.push(data.meals[0]);
        }
        return meals;
    } catch (err) {
        console.log(`Error in fetching Random meals ${err}`);
        return [];
    }
}
// display limited meal details 
function limitedMealDetails(mealDetails, limit = 100) {
    const words = mealDetails.split(' ');
    const limitedDetails = words.slice(0, limit).join(' ');
    return `${limitedDetails}${words.length > limit ? '...' : ''}`;
}
// display random meals 
async function displayRandomMeals() {
    const randomMeals = await getRandomMeals();

    randomMeals.forEach((randomMeal) => {
        const mealImg = randomMeal.strMealThumb;
        const mealName = randomMeal.strMeal;
        const mealDetails = limitedMealDetails(randomMeal.strInstructions, 50);


        const randomMealCard = document.createElement('div');
        randomMealCard.classList.add('randomMealCard');
        randomMealCard.innerHTML = `
      <div class="meal-img">
        <img src="${mealImg}" alt="${mealName}">
      </div>
      <div class="meal-details">
        <p>${mealName}</p>
        <p>${mealDetails} <a href="" target="_blank">Read more</a></p>
      </div>
    `;
        randomMealContainer.appendChild(randomMealCard);
    });
}

displayRandomMeals();