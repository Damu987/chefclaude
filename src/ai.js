export async function getRecipeFromMistral(ingredientsArr) {
  if (!ingredientsArr || ingredientsArr.length === 0) return "";

  try {
    const res = await fetch("/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    const data = await res.json();
    if (data.error) return `${data.error}`;

    return data.recipe || "Recipe not found.";
  } catch (err) {
    console.error("Fetch Error:", err);
    return "Failed to fetch recipe.";
  }
}
