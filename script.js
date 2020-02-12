const submit = document.getElementById("submit"),
  search = document.getElementById("search"),
  randomBtn = document.getElementById("random"),
  resultHeadingElm = document.getElementById("result-heading"),
  mealsElm = document.getElementById("meals"),
  singleMealElm = document.getElementById("single-meal");

// fetch a single meal
function searchMeal(e) {
  e.preventDefault();

  //clear single meal search
  singleMealElm.innerHTML = "";

  // get search
  const term = search.value;
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeadingElm.innerHTML = `<h2>Search results for '${term}':</h2>`;
        if (data.meals === null) {
          resultHeadingElm.innerHTML =
            "<p>There are no search results. Try again!</p>";
        } else {
          mealsElm.innerHTML = data.meals
            .map(
              meal => `
          <div class='meal'>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
            <div class='meal-info' data-mealID='${meal.idMeal}'>
            <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `
            )
            .join("");
        }
      });

    //clear seach box
    search.value = "";
  } else {
    console.log("Please fill in a meal name");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealElm.innerHTML = `
  <div class='single-meal'>
    <h1>${meal.strMeal}</h1>
    <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
    <div class='single-meal-info'>
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class='main'>
      <p> ${meal.strInstructions}</p>
      <h2> Ingredients</h2>
      <ul>
      ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
    `;
}

function getRandomMeal() {
  //clear meals and heading
  mealsElm.innerHTML = "";
  resultHeadingElm.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// event listeners

submit.addEventListener("submit", searchMeal);

// get meal info
mealsElm.addEventListener("click", e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});

randomBtn.addEventListener("click", getRandomMeal);
