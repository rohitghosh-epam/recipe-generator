// Configuration constants
const apiKey = "88674f35a4024141b8d14c202d367f01"; // Replace with valid API key
const azureEndpoint = "https://ai-proxy.lab.epam.com"; // Replace if endpoint has changed
const model = "gpt-35-turbo-0613"; // Deployment model

// Select DOM elements
const ingredientsInput = document.getElementById("ingredients");
const ethnicityInput = document.getElementById("ethnicity");
const caloriesInput = document.getElementById("calories");
const generateBtn = document.getElementById("generateBtn");
const recipesList = document.getElementById("recipesList");
const resultsSection = document.getElementById("results");

// Handle button click to generate recipes
generateBtn.addEventListener("click", async () => {
  const ingredients = ingredientsInput.value.trim();
  const ethnicity = ethnicityInput.value;
  const calories = caloriesInput.value;

  if (!ingredients) {
    alert("Please enter ingredients.");
    return;
  }

  const prompt = `
    Generate recipe suggestions based on:
    - Ingredients: ${ingredients}
    - Ethnicity: ${ethnicity || "No preference"}
    - Calories: ${calories || "No preference"}
    Ensure the recipes are safe for consumption.
  `;

  // Clear previous results
  recipesList.innerHTML = "";
  resultsSection.classList.add("hidden");

  try {
    const response = await fetch(`${azureEndpoint}/openai/deployments/${model}/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Error: ${response.status} (${response.statusText}) - ${errorDetails}`);
    }

    const data = await response.json();

    const recipes = data.choices[0]?.message?.content?.split("\n").filter((r) => r.trim()) || [
      "No recipes generated.",
    ];

    recipes.forEach((recipe) => {
      const li = document.createElement("li");
      li.textContent = recipe.trim();
      recipesList.appendChild(li);
    });

    resultsSection.classList.remove("hidden");
  } catch (error) {
    console.error("Failed to fetch recipes:", error.message);
    alert(`An error occurred while fetching recipes: ${error.message}`);
  }
});