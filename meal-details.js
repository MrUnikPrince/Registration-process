const mealDetailsContainer = document.getElementById('mealDetails');

// Function to get full meal details by ID
async function getMealDetailsById(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (err) {
        console.log(`Error in fetching meal details for ID ${mealId}: ${err}`);
        return null;
    }
}

// Function to display full meal details
async function displayMealDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');
    if (mealId) {
        const meal = await getMealDetailsById(mealId);
        if (meal) {
            const mealCard = document.createElement('div');
            mealCard.classList.add('meal-details');
            mealCard.innerHTML = `
                <p class="title">${meal.strMeal}</p>
                <p>${meal.strInstructions}</p>
                <a href="./index.html">Go to Meal Page</a>
            `;
            mealDetailsContainer.appendChild(mealCard);
        } else {
            mealDetailsContainer.innerHTML = '<p>Meal details not found.</p>';
        }
    } else {
        mealDetailsContainer.innerHTML = '<p>Meal ID not provided.</p>';
    }
} // Go back to the previous page
function goBack() {
    window.history.back();
}

// Load meal details when the page is first loaded
document.addEventListener('DOMContentLoaded', () => {
    displayMealDetails();
});
