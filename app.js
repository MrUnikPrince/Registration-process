const container = document.getElementById('container');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('submit');
const randomMealContainer = document.getElementById('randomMealContainer');
const favoriteMealsContainer = document.getElementById('favoriteMeals');
const randomMealCard = document.querySelector(".randomMealCard");
const searchedMeal = document.getElementById('searchedMeal');

const url = 'https://www.themealdb.com/api/json/v1/1/random.php';


// Function to get meal details by Search
async function getMeal(mealName) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (err) {
        console.log(`Error in fetching meal details for ${mealName} : ${err}`);
        return null;
    }
}

// function to add meal to favorites and local storage
function addToFavorites(meal) {
    // check if the meal is alreadey in favorites (based on ita ID)
    var favorites = getFavoritesFromLocalStorage();
    if (!favorites.some((fav) => fav.idMeal === meal.idMeal )) {
        favorites.push(meal);
        updateLocalStorage(favorites);
        displayFavoriteMeal();
    }
}

// function to remove meal from favorites and local storage

function removeFromfavorites(mealId) {
    var favorites = getFavoritesFromLocalStorage().filter((fav) => fav.idMeal !== mealId);
    updateLocalStorage(favorites);
    displayFavoriteMeal();
}

// function to get favorites from local storage 
function getFavoritesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// function to update favorites in local storage
function updateLocalStorage(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// function to display favorite meal 
function displayFavoriteMeal() {
    const favorites = getFavoritesFromLocalStorage();

    // clear previous favorite meals
    favoriteMealsContainer.innerHTML = '';
    favorites.forEach((meal) => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('favoriteMealCard');
        mealCard.innerHTML = `
      <div class="meal-details">
        <p>${meal.strMeal}</p>
        <button class="deleteBtn" data-meal-id="${meal.idMeal}">Delete</button>
      </div>
    `;

        // Add Event Listener To Delete Button 
        const deleteBtn = mealCard.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', (event) => {
            const mealID = event.target.getAttribute('data-meal-id');
            removeFromfavorites(mealID);
        });

        favoriteMealsContainer.appendChild(mealCard);
    });
}


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
        <button class="addBtn" data-meal-id="${randomMeal.idMeal}">Add to Favorites</button>
      </div>
    `;
        // Add event listener to "Add to Favorites" button
        const addBtn = randomMealCard.querySelector('.addBtn');
        addBtn.addEventListener('click', (event) => {
            const mealId = event.target.getAttribute('data-meal-id');
            const mealToAdd = randomMeals.find((meal) => meal.idMeal === mealId);
            addToFavorites(mealToAdd);
        });

        randomMealContainer.appendChild(randomMealCard);
    });
}

// Load all meals when the page is first loaded
document.addEventListener('DOMContentLoaded', () => {
    displayRandomMeals();
    displayFavoriteMeal();
});

// add Event Listener to Search Button
searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const mealName = searchInput.value.trim();
    if (mealName !== '') {
        const meal = await getMeal(mealName);
        if (meal) {
            const mealCard = document.createElement('div');
            mealCard.classList.add('searchedMealCard');
            mealCard.innerHTML = `
        <div class="meal-img">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="meal-details">
          <p>${meal.strMeal}</p>
          <p>${meal.strInstructions}</p>
          <button class="addBtn" data-meal-id="${meal.idMeal}">Add to Favorites</button>
        </div>
      `;
            // Add event listener to "Add to Favorites" button
            const addBtn = mealCard.querySelector('.addBtn');
            addBtn.addEventListener('click', async (event) => {
                addToFavorites(meal);
                // const mealId = event.target.getAttribute('data-meal-id');
                // var mealToAdd = await getMeal(mealId);
                // if (mealToAdd) {
                //     addToFavorites(mealToAdd);
                // }
            });
            searchedMeal.innerHTML = '';
            searchedMeal.appendChild(mealCard);
        } else {
            searchedMeal.innerHTML = '<p>No results found.</p>';
        }
    }
});

