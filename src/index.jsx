import React, { useState } from "react";
import IngredientList from "./components/IngredientList.jsx";
import ClaudeRecipe from "./components/ClaudeRecipe.jsx";
import { getRecipeFromMistral } from "./ai.js";

export default function Index() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    if (!newIngredient) return;
    setIngredients((prev) => [...prev, newIngredient]);
  }

  async function getRecipe() {
    if (ingredients.length === 0) return;
    setLoading(true);
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);
    setLoading(false);
  }

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addIngredient(formData);
          e.target.reset();
        }}
        className="add-ingredient-form"
      >
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientList ingredients={ingredients} getRecipe={getRecipe} />
      )}

      {loading && <p>Loading recipe...</p>}
      {!loading && recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
