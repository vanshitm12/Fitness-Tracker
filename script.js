// Initialize arrays to store workouts and meals
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {  signOut   } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB50oHXItUqhtr6og2SyA-YjNJh3vquQKM",
    authDomain: "news-38eff.firebaseapp.com",
    projectId: "news-38eff",
    storageBucket: "news-38eff.firebasestorage.app",
    messagingSenderId: "248358233838",
    appId: "1:248358233838:web:32c2deec6f37057907f5ff"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      work();
      // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "login.html"
}
});

import { GoogleGenerativeAI } from "@google/generative-ai";
        // Fetch your API_KEY
        const API_KEY2 = "AIzaSyCcHq5yiuAyDmLzfDcvI8JXVCfPh_qvSl4";
        const genAI = new GoogleGenerativeAI(API_KEY2);
let workouts = [];
let meals = [];
let activitydone;


// DOM Elements
const workoutForm = document.getElementById("workout-form");
const workoutList = document.getElementById("workout-list");
const mealList = document.getElementById("meal-list");
const caloriesElement = document.getElementById("calories");
const activeElement = document.getElementById("active");
let khana;

// Chart.js Initialization
const progressChart = new Chart(document.getElementById("progressChart"), {
    type: "bar",
    data: {
        labels: ["Calories Burned", "Active Minutes"],
        datasets: [{
            label: "Progress",
            data: [0, 0],
            backgroundColor: ["#90e0ef", "#caf0f8"],
            borderColor: ["#48cae4", "#ade8f4"],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Handle Workout Form Submission
workoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const type = document.getElementById("workout-type").value;
    const duration = parseInt(document.getElementById("workout-duration").value);
    const calories = parseInt(document.getElementById("workout-calories").value);

    // Add workout to the list
    workouts.push({ type, duration, calories });
    updateWorkoutUI();

    // Clear form
    workoutForm.reset();

    // Fetch meal recommendations based on activity type and calories burned
    fetchMealRecommendations(type, calories);
});

// Update Workout UI
function updateWorkoutUI() {
    workoutList.innerHTML = "";
    workouts.forEach((workout) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${workout.type}</span>
            <span>Duration: ${workout.duration} mins</span>
            <span>Calories Burned: ${workout.calories}</span>
        `;
        workoutList.appendChild(listItem);
    });
    
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    const totalActiveMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);

    caloriesElement.textContent = totalCalories;
    activeElement.textContent = totalActiveMinutes;

    progressChart.data.datasets[0].data = [totalCalories, totalActiveMinutes];
    progressChart.update();
}

// Fetch Meal Recommendations from Nutritionix API
async function fetchMealRecommendations(activityType, caloriesBurned) {
    const NUTRITIONIX_APP_ID = "8385b482"; 
    const NUTRITIONIX_API_KEY = "e6cba655e40f677254a2f18be6464dcb"; 
   activitydone=activityType;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Just give me name of two protein rich dishes  that i should eat after "+activitydone+" and burning "+caloriesBurned+" caloires.Do not give serial number before the dishes just given one dish,second dish";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    khana=result.response.text();


    let query = "";
    if (activityType.toLowerCase() === "running" || activityType.toLowerCase() === "cycling") {
        query = `high-protein meal with ${caloriesBurned} calories`;
    } else if (activityType.toLowerCase() === "yoga" || activityType.toLowerCase() === "pilates") {
        query = `light low-calorie meal with ${caloriesBurned} calories`;
    } else if (activityType.toLowerCase() === "weightlifting") {
        query = `high-protein high-carb meal with ${caloriesBurned} calories`;
    } else {
        query = `high-protein, high-carb meal with ${caloriesBurned} calories`;
    }


    try {
        const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-app-id": "410476d3",
                "x-app-key":"e6cba655e40f677254a2f18be6464dcb"
            },
            body: JSON.stringify({ query })
        });


        if (!response.ok) {
            throw new Error("Failed to fetch meal recommendations");
        }

        const mealData = await response.json();
        
        updateMealUI(mealData.foods);
    } catch (error) {
        console.error("Error fetching meal recommendations:", error);
        mealList.innerHTML = "<li>Failed to fetch meal recommendations. Please try again later.</li>";
    }
}

// Update Meal UI with Recommendations
function updateMealUI(meals) {
    mealList.innerHTML = "";
    if (meals.length === 0) {
        mealList.innerHTML = "<li>No meals found. Try a different search.</li>";
        return;
    }
    meals.forEach((meal) => {
        const listItem = document.createElement("li");
        const dish=document.createElement("h2");
        listItem.innerHTML = `
            <span>${meal.food_name} rich diet</span>
            <span>Calories: ${meal.nf_calories}</span>
            <span>Protein: ${meal.nf_protein}g ,Fat: ${meal.nf_total_fat}g, Carbs: ${meal.nf_total_carbohydrate}g</span>
            
        `;
        dish.innerText="You should eat "+khana;
        mealList.appendChild(dish);
        mealList.appendChild(listItem);
  
        // console.log(meal.food_name);
    });
}

// Initialize the App
document.addEventListener("DOMContentLoaded", () => {
    updateWorkoutUI();
});


ye paste karde
