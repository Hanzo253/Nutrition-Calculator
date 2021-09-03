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
var totalCalories = 0;
var totalCarbs = 0;
var totalCholesterol = 0;
var totalSatFat = 0;
var totalFat = 0;
var totalSodium = 0;
var totalSugars = 0;
var totalProtein = 0;
var totalPotassium = 0;

function findFood(e) {
  e.preventDefault();

  const searchTerm = search.value;

  console.log(searchTerm);

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
        $.map(result.branded, function (food, i) {
          // console.log(food.nf_calories);
          $("#results").append(`
            <ul>
              <li class="food" onclick="showCaloriesModal()" data-foodID="${food.nix_item_id}">${food.food_name} (${food.brand_name})</li>
            </ul>`);
        });
      },
      error: function ajaxError(jqXHR) {
        console.error("Error: ", jqXHR.responseText);
      },
    });
    search.value = "";
  } else {
    alert("No inputs detected");
  }

  // var query = "3lb carrots and a chicken sandwich";
  // $.ajax({
  //   method: "GET",
  //   url: "https://api.calorieninjas.com/v1/nutrition?query=" + searchTerm,
  //   headers: { "X-Api-Key": "2PyueR1IQUQ7RVv3GbA5iQ==2MpJfXId6iEa6XTt" },
  //   contentType: "application/json",
  //   success: function (result) {
  //     console.log(result.items);
  //     $.map(result.items, function (food, i) {
  //       console.log(food.calories);
  //       $("#results").append(`
  //         <h2>${food.name}</h2>
  //         <p>Calories: ${food.calories}</p>
  //         <p>Carbonhydrates: ${food.carbohydrates_total_g} g</p>
  //         <p>Cholesterol: ${food.cholesterol_mg} mg</p>
  //         <p>Saturated Fat: ${food.fat_saturated_g} g</p>
  //         <p>Total Fat: ${food.fat_total_g} g</p>
  //         <p>Fiber: ${food.fiber_g} g</p>
  //         <p>Potassium: ${food.potassium_mg} mg</p>
  //         <p>Protein: ${food.protein_g} g</p>
  //         <p>Serving Size: ${food.serving_size_g} g</p>
  //         <p>Sodium: ${food.sodium_mg} mg</p>
  //         <p>Sugar: ${food.sugar_g} g</p>`);
  //     });
  //     if (result.items.length === 0) {
  //       alert("Unknown food");
  //     }
  //   },
  //   error: function ajaxError(jqXHR) {
  //     console.error("Error: ", jqXHR.responseText);
  //   },
  // });

  resultsHeading.innerHTML = `<h1>Search results for: ${searchTerm}</h1>`;
  results.innerHTML = "";
}

function showCaloriesModal() {
  // const foodTerm = search.value;
  infoModal.style.display = "block";
  // fetch(
  //   `https://api.nutritionix.com/v1_1/search/${foodTerm}?fields=item_name,brand_name,item_id,nf_calories&appId=dc339553&appKey=70e3231d6bea3b462d32cb81d3dbdb7d`
  // )
  //   .then((res) => res.json())
  //   .then((data) => {
  //     infoModalContent.innerHTML = data.hits.map(
  //       (hit) =>
  //         `<span class="close">
  //             <i class="bi bi-x-circle-fill"></i>
  //         </span>
  //         <h2>Food: ${hit.fields.item_name}</h2>`
  //     );
  //   });
}

function closeModal() {
  infoModal.style.display = "none";
  calculateModal.style.display = "none";
}

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
              type="text"
              id="servings-bar"
            />
            <h3>
              How many servings did you eat?
            </h3>
            <input type="submit" value="Calculate" id="calculate-btn">
          </form>`);
        servingsBar = document.getElementById("servings-bar");
        totalCalories = foodItem.nf_calories;
        totalCarbs = foodItem.nf_total_carbohydrate;
        totalCholesterol = foodItem.nf_cholesterol;
        totalSatFat = foodItem.nf_saturated_fat;
        totalFat = foodItem.nf_total_fat;
        totalSodium = foodItem.nf_sodium;
        totalSugars = foodItem.nf_sugars;
        totalProtein = foodItem.nf_protein;
        totalPotassium = foodItem.nf_potassium;
      });
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}

function calculateNutrients(event) {
  event.preventDefault();
  const numOfServings = servingsBar.value;
  if (numOfServings.trim()) {
    // console.log("total calories:", numOfServings * totalCalories);
    calculateModal.style.display = "block";
    calculateModalContent.innerHTML = `<span class="close" onclick="closeModal()">
                                        <i class="bi bi-x-circle-fill"></i>
                                       </span>
                                       <h3>Total Nutrients</h3>
                                       <ul>
                                        <li>Total Calories: ${
                                          numOfServings * totalCalories
                                        }</li>
                                        <li>Total Carbs: ${
                                          numOfServings * totalCarbs
                                        }g</li>
                                        <li>Total Cholesterol: ${
                                          numOfServings * totalCholesterol
                                        }mg</li>
                                        <li>Total Saturated Fat: ${
                                          numOfServings * totalSatFat
                                        }g</li>
                                        <li>Total Fat: ${
                                          numOfServings * totalFat
                                        }g</li>
                                        <li>Total Sodium: ${
                                          numOfServings * totalSodium
                                        }mg</li>
                                        <li>Total Sugars: ${
                                          numOfServings * totalSugars
                                        }g</li>
                                        <li>Total Protein: ${
                                          numOfServings * totalProtein
                                        }g</li>
                                        <li>Total Potassium: ${
                                          numOfServings * totalPotassium
                                        }mg</li>
                                       </ul>`;
    infoModal.style.display = "none";
  } else {
    alert("No input detected");
    infoModal.style.display = "block";
  }
}

form.addEventListener("submit", findFood);
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
