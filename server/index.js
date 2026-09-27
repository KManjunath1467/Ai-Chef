import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));

/* ---------------------------------------
   RECIPE VALIDATION
--------------------------------------- */

function validateRecipe(recipe) {
  if (!recipe || typeof recipe !== "object") {
    return false;
  }

  if (
    typeof recipe.title !== "string" ||
    recipe.title.trim() === ""
  ) {
    return false;
  }

  if (
    typeof recipe.description !== "string" ||
    recipe.description.trim() === ""
  ) {
    return false;
  }

  if (
    !Number.isInteger(recipe.servings) ||
    recipe.servings <= 0
  ) {
    return false;
  }

  if (
    !Array.isArray(recipe.ingredients) ||
    recipe.ingredients.length === 0
  ) {
    return false;
  }

  if (
    !Array.isArray(recipe.steps) ||
    recipe.steps.length === 0
  ) {
    return false;
  }

  if (!Array.isArray(recipe.swaps)) {
    return false;
  }

  for (const ingredient of recipe.ingredients) {
    if (
      !ingredient ||
      typeof ingredient.name !== "string" ||
      ingredient.name.trim() === "" ||
      typeof ingredient.unit !== "string" ||
      typeof ingredient.optional !== "boolean"
    ) {
      return false;
    }

    if (
      ingredient.amount !== null &&
      (
        typeof ingredient.amount !== "number" ||
        !Number.isFinite(ingredient.amount)
      )
    ) {
      return false;
    }
  }

  for (const step of recipe.steps) {
    if (
      !step ||
      !Number.isInteger(step.id) ||
      typeof step.instruction !== "string" ||
      step.instruction.trim() === ""
    ) {
      return false;
    }
  }

  for (const swap of recipe.swaps) {
    if (
      !swap ||
      typeof swap.ingredient !== "string" ||
      typeof swap.swap !== "string" ||
      typeof swap.note !== "string"
    ) {
      return false;
    }
  }

  return true;
}


/* ---------------------------------------
   GROQ JSON SCHEMA
--------------------------------------- */

const recipeSchema = {
  type: "object",

  properties: {
    title: {
      type: "string"
    },

    description: {
      type: "string"
    },

    servings: {
      type: "integer",
      minimum: 1
    },

    ingredients: {
      type: "array",

      items: {
        type: "object",

        properties: {
          name: {
            type: "string"
          },

          amount: {
            type: ["number", "null"]
          },

          unit: {
            type: "string"
          },

          optional: {
            type: "boolean"
          }
        },

        required: [
          "name",
          "amount",
          "unit",
          "optional"
        ],

        additionalProperties: false
      }
    },

    steps: {
      type: "array",

      items: {
        type: "object",

        properties: {
          id: {
            type: "integer"
          },

          instruction: {
            type: "string"
          }
        },

        required: [
          "id",
          "instruction"
        ],

        additionalProperties: false
      }
    },

    swaps: {
      type: "array",

      items: {
        type: "object",

        properties: {
          ingredient: {
            type: "string"
          },

          swap: {
            type: "string"
          },

          note: {
            type: "string"
          }
        },

        required: [
          "ingredient",
          "swap",
          "note"
        ],

        additionalProperties: false
      }
    }
  },

  required: [
    "title",
    "description",
    "servings",
    "ingredients",
    "steps",
    "swaps"
  ],

  additionalProperties: false
};


/* ---------------------------------------
   RECIPE API
--------------------------------------- */

app.post("/api/recipe", async (req, res) => {
  try {
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing.");

      return res.status(500).json({
        error: "AI service is not configured."
      });
    }

    const ingredients = req.body?.ingredients;

    if (
      typeof ingredients !== "string" ||
      ingredients.trim() === ""
    ) {
      return res.status(400).json({
        error: "Please provide at least one ingredient."
      });
    }

    if (ingredients.length > 2000) {
      return res.status(400).json({
        error: "Ingredient input is too long."
      });
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`
          },

          signal: controller.signal,

          body: JSON.stringify({
            model: "openai/gpt-oss-20b",

            messages: [
              {
                role: "system",

                content: `
You are AI Chef.

Create a practical recipe using the ingredients supplied by the user.

Rules:

- Use the user's available ingredients where practical.
- Keep the recipe realistic and easy to cook.
- Use 2 to 6 servings.
- Provide 5 to 8 cooking steps.
- Provide 0 to 3 useful ingredient substitutions.
- Keep the description short.
- Keep cooking instructions concise.
- Ingredient amount must be a number or null.
- Ingredient unit must be a short unit such as g, ml, tbsp, tsp, cup, piece, clove, or to taste.
- optional must be true or false.

Return only the structured recipe.
`
              },

              {
                role: "user",

                content:
                  `Available ingredients:\n${ingredients.trim()}`
              }
            ],

            response_format: {
              type: "json_schema",

              json_schema: {
                name: "recipe",

                strict: true,

                schema: recipeSchema
              }
            },

            temperature: 0.2,

            max_completion_tokens: 1500
          })
        }
      );

      clearTimeout(timeout);

      let data;

      try {
        data = await response.json();
      } catch {
        return res.status(502).json({
          error: "The AI service returned an invalid response."
        });
      }

      if (!response.ok) {
        console.error("Groq API error:", data);

        return res.status(502).json({
          error:
            data?.error?.message ||
            "The AI service could not generate a recipe."
        });
      }

      const content =
        data?.choices?.[0]?.message?.content;

      if (!content) {
        return res.status(502).json({
          error: "The AI returned an empty recipe."
        });
      }

      let recipe;

      try {
        recipe = JSON.parse(content);
      } catch {
        return res.status(502).json({
          error:
            "The AI returned malformed recipe data."
        });
      }

      if (!validateRecipe(recipe)) {
        console.error(
          "Invalid recipe returned by AI:",
          recipe
        );

        return res.status(502).json({
          error:
            "The AI returned an unexpected recipe format."
        });
      }

      return res.json(recipe);

    } catch (error) {
      clearTimeout(timeout);

      if (error.name === "AbortError") {
        return res.status(504).json({
          error:
            "The AI request took too long. Please try again."
        });
      }

      console.error(
        "Recipe generation error:",
        error
      );

      return res.status(500).json({
        error:
          "Unable to generate the recipe. Please try again."
      });
    }

  } catch (error) {
    console.error(
      "Unexpected server error:",
      error
    );

    return res.status(500).json({
      error: "Something went wrong on the server."
    });
  }
});


/* ---------------------------------------
   SERVE REACT FRONTEND
--------------------------------------- */

const frontendPath = path.join(
  __dirname,
  "../dist"
);

app.use(express.static(frontendPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});


/* ---------------------------------------
   START SERVER
--------------------------------------- */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `AI Chef server running on port ${PORT}`
    );
  }
);