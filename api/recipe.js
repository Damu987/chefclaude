// api/recipe.js
const SYSTEM_PROMPT = `
You are Chef Claude, an expert cooking assistant.
The user will provide a list of ingredients.
You must respond with a **complete recipe** they can make, including:
- Recipe title
- Ingredients list
- Step-by-step instructions
- Optional tips

Format your response **entirely in Markdown**.
Be detailed and descriptive.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide at least one ingredient." });
    }

    const ingredientsString = ingredients.join(", ");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `I have these ingredients: ${ingredientsString}. Please provide a complete recipe in Markdown!`,
            },
          ],
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res
        .status(500)
        .json({ error: "Failed to generate recipe. Try again." });
    }

    let recipe = data.choices[0].message.content;

    // Clean tokens before sending to frontend
    recipe = recipe.replace(/<s>/g, "");
    recipe = recipe.replace(/\[B_INST\]/g, "");
    recipe = recipe.replace(/\[\/B_INST\]/g, "");
    recipe = recipe.trim();

    res.status(200).json({ recipe });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate recipe." });
  }
}
