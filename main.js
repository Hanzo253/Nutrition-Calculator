const form = document.getElementById("food-search");
const search = document.getElementById("search-bar");
const submit = document.getElementById("submit-btn");
const resultsHeading = document.getElementById("results-heading");
const results = document.getElementById("results");
const infoModal = document.getElementById("info-modal");
const infoModalContent = document.getElementById("info-modal-content");
const closeIcon = document.getElementsByClassName("close");
const calculateModal = document.getElementById("calculate-modal");
const calculateModalContent = document.getElementById(
  "calculate-modal-content"
);
const calculateForm = document.getElementById("calculate");
const calculateBtn = document.getElementById("calculate-btn");

var servingsBar = null;

// nutrient variables
var calories = 0;
var carbs = 0;
var cholesterol = 0;
var saturatedFat = 0;
var fat = 0;
var sodium = 0;
var sugars = 0;
var protein = 0;
var potassium = 0;

// uses the search input to make the API look for food items
function findFood(e) {
  e.preventDefault();

  const searchTerm = search.value;

  console.log(searchTerm);

  // if there is no input found in the search bar after search button has been pressed
  if (searchTerm.trim()) {
    // fetch(
    //   `https://api.nutritionix.com/v1_1/search/${searchTerm}?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=dc339553&appKey=70e3231d6bea3b462d32cb81d3dbdb7d`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     results.innerHTML = data.hits
    //       .map(
    //         (hit) =>
    //           `<ul>
    //             <li class="food" onclick="showCaloriesModal()" data-foodID="${hit.fields.item_id}">
    //               ${hit.fields.item_name} (${hit.fields.brand_name})
    //             </li>
    //           </ul>`
    //       )
    //       .join("");

    //     if (data.hits.length === 0) {
    //       alert("Unknown food");
    //     }
    //   });

    // using Nutritionix API to find the food items and their nutrients' data
    $.ajax({
      method: "GET",
      url: `https://trackapi.nutritionix.com/v2/search/instant?query=${searchTerm}`,
      headers: {
        "x-app-id": "dc339553",
        "x-app-key": "70e3231d6bea3b462d32cb81d3dbdb7d",
      },
      dataType: "json",
      success: function (result) {
        console.log(result);
        // when the API can not find any food related to the search input
        if (result.branded.length === 0) {
          alert("Food does not exist or input is not valid! Try again.");
          $("#results-heading").hide();
        } else {
          // post the results if food is found
          $.map(result.branded, function (food, i) {
            // console.log(food.nf_calories);
            $("#results").append(`
              <ul>
                <li class="food" onclick="showInfoModal()" data-foodID="${food.nix_item_id}">${food.food_name} (${food.brand_name})</li>
              </ul>`);
          });
        }
        // $.map(result.branded, function (food, i) {
        //   // console.log(food.nf_calories);
        //   $("#results").append(`
        //   <ul>
        //     <li class="food" onclick="showCaloriesModal()" data-foodID="${food.nix_item_id}">${food.food_name} (${food.brand_name})</li>
        //   </ul>`);
        // });
      },
      error: function ajaxError(jqXHR) {
        console.error("Error: ", jqXHR.responseText);
      },
    });
    search.value = "";
  } else {
    alert("No inputs detected");
  }

  resultsHeading.innerHTML = `<h1>Search results for: ${searchTerm}</h1>`;
  results.innerHTML = "";
}

// show the nutrients modal of the selected food item
function showInfoModal() {
  infoModal.style.display = "block";
}

// closes the modals whenever the close button is pressed
function closeModal() {
  infoModal.style.display = "none";
  calculateModal.style.display = "none";
}

// uses the nix_item_id to grab nutrient data of the food item that was selected
function getFoodItemById(foodID) {
  $.ajax({
    method: "GET",
    url: `https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${foodID}`,
    headers: {
      "x-app-id": "dc339553",
      "x-app-key": "70e3231d6bea3b462d32cb81d3dbdb7d",
    },
    dataType: "json",
    success: function (result) {
      console.log(result.foods);
      // if the data of a nutrient is null, then their value is set to 0
      $.map(result.foods, function (foodItem, i) {
        // console.log(foodItem.nf_calories);
        if (foodItem.nf_potassium === null) {
          foodItem.nf_potassium = 0;
        }

        if (foodItem.nf_protein === null) {
          foodItem.nf_protein = 0;
        }

        if (foodItem.nf_total_carbohydrate === null) {
          foodItem.nf_total_carbohydrate = 0;
        }

        if (foodItem.nf_cholesterol === null) {
          foodItem.nf_cholesterol = 0;
        }

        if (foodItem.nf_sodium === null) {
          foodItem.nf_sodium = 0;
        }

        if (foodItem.nf_sugars === null) {
          foodItem.nf_sugars = 0;
        }

        if (foodItem.nf_total_fat === null) {
          foodItem.nf_total_fat = 0;
        }

        if (foodItem.nf_saturated_fat === null) {
          foodItem.nf_saturated_fat = 0;
        }
        // display the the amount of nutrients in the information modal
        $("#info-modal-content").html(`
          <span class="close" onclick="closeModal()">
            <i class="bi bi-x-circle-fill"></i>
          </span>
          <h2>Food: ${foodItem.food_name}</h2>
          <h2>Brand: ${foodItem.brand_name}</h2>
          <h2>Calories: ${foodItem.nf_calories}</h2>
          <h2>Carbs: ${foodItem.nf_total_carbohydrate}g</h2>
          <h2>Cholesterol: ${foodItem.nf_cholesterol}mg</h2>
          <h2>Saturated Fat: ${foodItem.nf_saturated_fat}g</h2>
          <h2>Fat: ${foodItem.nf_total_fat}g</h2>
          <h2>Sodium: ${foodItem.nf_sodium}mg</h2>
          <h2>Sugars: ${foodItem.nf_sugars}g</h2>
          <h2>Protein: ${foodItem.nf_protein}g</h2>
          <h2>Potassium: ${foodItem.nf_potassium}mg</h2>
          <h2>Serving Quantity: ${foodItem.serving_qty} ${foodItem.serving_unit}</h2>
          <form id="calculate" onsubmit="calculateNutrients(event)">
            <input
              type="number"
              id="servings-bar"
            />
            <h3>
              How many servings did you eat?
            </h3>
            <input type="submit" value="Calculate" id="calculate-btn">
          </form>`);
        servingsBar = document.getElementById("servings-bar");

        // set nutrient variable to the nutrient information received from the API
        calories = foodItem.nf_calories;
        carbs = foodItem.nf_total_carbohydrate;
        cholesterol = foodItem.nf_cholesterol;
        saturatedFat = foodItem.nf_saturated_fat;
        fat = foodItem.nf_total_fat;
        sodium = foodItem.nf_sodium;
        sugars = foodItem.nf_sugars;
        protein = foodItem.nf_protein;
        potassium = foodItem.nf_potassium;
      });
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}

// gets the number of servings inputs to calculate the total amount of nutrients
function calculateNutrients(event) {
  event.preventDefault();
  const numOfServings = servingsBar.value;
  // each nutrient is multiplied by the number of servings to get their total
  if (numOfServings.trim()) {
    // console.log("total calories:", numOfServings * totalCalories);
    calculateModal.style.display = "block";
    calculateModalContent.innerHTML = `<span class="close" onclick="closeModal()">
                                          <i class="bi bi-x-circle-fill"></i>
                                       </span>
                                       <div id="total-text">
                                        <h4>Total Nutrients</h4>
                                        <p class="total">Total Calories: ${
                                          numOfServings * calories
                                        }</p>
                                        <p class="total">Total Carbs: ${
                                          numOfServings * carbs
                                        }g</p>
                                        <p class="total">Total Cholesterol: ${
                                          numOfServings * cholesterol
                                        }mg</p>
                                        <p class="total">Total Saturated Fat: ${
                                          numOfServings * saturatedFat
                                        }g</p>
                                        <p class="total">Total Fat: ${
                                          numOfServings * fat
                                        }g</p>
                                        <p class="total">Total Sodium: ${
                                          numOfServings * sodium
                                        }mg</p>
                                        <p class="total">Total Sugars: ${
                                          numOfServings * sugars
                                        }g</p>
                                        <p class="total">Total Protein: ${
                                          numOfServings * protein
                                        }g</p>
                                        <p class="total">Total Potassium: ${
                                          numOfServings * potassium
                                        }mg</p>
                                       </div>`;
    infoModal.style.display = "none";
  } else {
    alert("No input detected");
    infoModal.style.display = "block";
  }
}

form.addEventListener("submit", findFood);
// gets the unique ID of the food that was selected in the search results list
results.addEventListener("click", (e) => {
  const foodInfo = e.path.find((foodItem) => {
    if (foodItem.classList) {
      return foodItem.classList.contains("food");
    } else {
      return false;
    }
  });

  console.log(foodInfo);
  if (foodInfo) {
    const foodID = foodInfo.getAttribute("data-foodID");
    getFoodItemById(foodID);
    // console.log(foodID);
  }
});
