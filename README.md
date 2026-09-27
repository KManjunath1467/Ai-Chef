# 🍳 AI Chef — Fridge-to-Recipe

AI Chef is a local-first **Fridge-to-Recipe** web application that uses AI to transform the ingredients available in your fridge into a structured, interactive recipe.

Users can enter ingredients in natural language, and the application generates:

- 🍽️ Recipe title and description
- 🥕 Ingredient list
- 👨‍🍳 Step-by-step cooking instructions
- 🔄 Ingredient substitution suggestions
- 👥 Serving information
- ✅ Interactive cooking steps

The application uses **React + Express + Ollama + Llama 3.2 3B** and is designed around structured AI responses rather than a chatbot-style interface.

---
## Deployed Link in render
    https://ai-chef-79mk.onrender.com
-->click on this website to see the working of the application in web

---
## ✨ Features

- 🥕 Natural-language ingredient input
- 🤖 AI-powered recipe generation
- 🏠 Local AI using Ollama
- 📋 Structured JSON AI responses
- 🔍 AI response parsing and validation
- 👨‍🍳 Interactive recipe presentation
- ✅ Cooking step checklist
- 👥 Serving-size adjustment
- 🔄 Ingredient substitution suggestions
- ⏳ Loading state while AI is generating
- ⚠️ Error handling and retry
- 🛡️ Malformed AI response handling
- 🚫 Stale-request protection
- 📱 Responsive mobile and desktop UI

---

## 🏗️ Architecture

The application follows a simple local-first architecture:

```text
                    React Frontend
                         │
                         │ POST /api/recipe
                         ▼
                  Express Backend
                         │
                         │ HTTP Request
                         ▼
                       Ollama
                         │
                         ▼
                    llama3.2:3b
                         │
                         │ Structured JSON
                         ▼
                  Express Backend
                         │
             Parse + Validate JSON
                         │
                         ▼
                    React UI
```

### Request Flow

```text
User enters ingredients
          ↓
React frontend
          ↓
POST /api/recipe
          ↓
Express backend
          ↓
Ollama / llama3.2:3b
          ↓
AI generates structured JSON
          ↓
Backend cleans and parses response
          ↓
Backend validates recipe structure
          ↓
Validated recipe sent to React
          ↓
Interactive recipe displayed
```

---

## 🧠 Why Structured JSON?

Instead of asking the AI to return a block of Markdown or conversational text, the application asks the model to return a predefined JSON structure.

Example:

```json
{
  "title": "Chicken Vegetable Rice",
  "description": "A simple and flavorful rice dish.",
  "servings": 2,
  "ingredients": [
    {
      "name": "Chicken",
      "amount": 200,
      "unit": "g",
      "optional": false
    }
  ],
  "steps": [
    {
      "id": 1,
      "instruction": "Cook the chicken until fully cooked."
    }
  ],
  "swaps": [
    {
      "ingredient": "Chicken",
      "swap": "Tofu",
      "note": "Use firm tofu as a vegetarian alternative."
    }
  ]
}
```

This allows the frontend to treat the AI response as structured application data instead of displaying raw AI text.

---

## 🛡️ AI Response Validation

AI output cannot always be assumed to be valid.

The backend therefore performs several checks before returning the recipe to the frontend.

The application handles:

- Invalid JSON
- Empty AI responses
- Missing recipe fields
- Incorrect data types
- Invalid serving values
- Missing ingredients
- Missing cooking steps
- Invalid ingredient substitutions
- Unexpected server responses
- AI request failures
- AI timeouts

The backend also removes accidental Markdown code fences before attempting to parse the response.

Only a successfully parsed and validated recipe is returned to the frontend.

---

## 🔄 Stale Request Protection

The application prevents an older AI request from replacing the result of a newer request.

For example:

```text
Request A starts
      ↓
Request B starts
      ↓
Request A finishes
      ↓
Check whether A is still the latest request
      ↓
      NO
      ↓
Ignore Request A
```

This prevents race conditions when multiple recipe-generation requests are made.

---

## ⏳ Loading and Error States

The application provides explicit UI states for different stages of the request.

### Empty State

Displayed when the user has not generated a recipe yet.

### Loading State

Displayed while Ollama is generating the recipe.

Example:

```text
Chef is thinking...
Creating your recipe with Ollama.
```

### Error State

If recipe generation fails, the application displays an error message and provides a retry option.

### Timeout Handling

Long-running local AI requests are handled explicitly so the interface does not remain stuck indefinitely.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Ollama
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/KManjunath1467/fridge-to-recipe.git
```

Navigate into the project:

```bash
cd fridge-to-recipe
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Install the Ollama Model

The application uses:

```text
llama3.2:3b
```

Download the model using:

```bash
ollama pull llama3.2:3b
```

Verify that the model is available:

```bash
ollama list
```

---

## 4. Start Ollama

If Ollama is not already running:

```bash
ollama serve
```

The application communicates with the local Ollama server at:

```text
http://127.0.0.1:11434
```

---

## 5. Start the Express Backend

Open a terminal in the project directory and run:

```bash
node server.js
```

The Express backend runs on:

```text
http://localhost:3001
```

---

## 6. Start the React Frontend

Open another terminal in the project directory:

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🧑‍🍳 How to Use

### Step 1 — Enter Ingredients

Enter the ingredients available in your fridge.

Example:

```text
chicken, rice, onions, tomatoes, garlic and spinach
```

### Step 2 — Generate the Recipe

Click the **Generate Recipe** button.

You can also use:

```text
Ctrl + Enter
```

### Step 3 — Wait for AI Chef

The request follows this flow:

```text
React
  ↓
Express
  ↓
Ollama
  ↓
llama3.2:3b
```

### Step 4 — View the Recipe

The generated recipe contains:

- Recipe title
- Description
- Ingredients
- Serving information
- Cooking steps
- Ingredient substitutions

### Step 5 — Interact With the Recipe

Users can interact with the generated recipe through the application's recipe UI.

---

# 🔌 API

## POST `/api/recipe`

Generates a recipe from the provided ingredients.

### Request

```json
{
  "ingredients": "chicken, rice, onions, tomatoes"
}
```

### Response

```json
{
  "title": "Chicken Tomato Rice",
  "description": "A simple rice dish made with chicken and tomatoes.",
  "servings": 2,
  "ingredients": [],
  "steps": [],
  "swaps": []
}
```

---

## GET `/api/health`

Health-check endpoint used to verify that the Express backend is running.

Example response:

```json
{
  "status": "ok"
}
```

---

# 🤖 AI Usage

The application uses **Ollama** with the **llama3.2:3b** model for local recipe generation.

The AI model is responsible for generating recipe information in the required JSON structure.

The application itself is responsible for:

- Defining the expected response structure
- Sending the structured prompt
- Parsing the AI response
- Validating the returned data
- Handling malformed AI responses
- Handling AI failures and timeouts
- Rendering the validated data as interactive UI

### Development AI Tool

**Antigravity** was used during development to assist with implementing the application code.

AI assistance was used as a development aid, while the application was integrated and tested as part of the project development process.

---

# 📱 Responsive Design

The application was tested on both desktop and mobile-sized layouts.

The UI is designed to adapt to:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile devices

Responsive testing was performed using browser mobile/responsive testing tools.

---

# 🧪 Testing

The application was tested for the following scenarios:

- Empty ingredient input
- Normal recipe generation
- Long ingredient input
- Loading state
- AI response failure
- Invalid AI output
- Timeout handling
- Retry functionality
- Multiple recipe-generation requests
- Backend availability
- Ollama connectivity
- Mobile/responsive layouts

---

# ⚠️ Known Limitations

### Local AI Response Time

Because the application uses a local `llama3.2:3b` model, recipe generation may take noticeable time depending on the computer's CPU, RAM, and Ollama performance.

The application therefore provides a loading state and timeout handling.

### Local Ollama Requirement

The current application requires Ollama and the `llama3.2:3b` model to be installed locally.

The current architecture is therefore intended primarily for local execution.

### AI-Generated Content

Recipes are generated by an AI model and may occasionally contain inaccurate quantities, substitutions, or cooking instructions.

Users should use appropriate judgment when preparing food, particularly regarding allergens and food safety.

---

# 🔮 Future Improvements

Possible future improvements include:

- ☁️ Deployment using a hosted LLM/API
- 💾 Recipe history
- ❤️ Save favorite recipes
- 🥗 Dietary preference support
- ⚠️ Allergen filtering
- 🌎 Cuisine selection
- 📊 Nutritional information
- 🖼️ Recipe image generation
- ⚡ Faster local AI responses
- 🧪 Automated frontend and backend tests

---

# ⏱️ Development Time

The project was developed within the assignment's intended time limit.

### Time Breakdown

| Date | Time Spent |
|------|------------|
| September 25, 2026 | 2 hours |
| September 26, 2026 | 4 hours |
| **Total** | **6 hours** |

---

# 🎥 Demo Video

Screen recording:

**Coming soon**

The demo will demonstrate:

1. Entering ingredients
2. Generating a recipe
3. AI loading state
4. Generated recipe
5. Recipe interaction
6. Ingredient substitutions
7. Error handling and retry
8. Mobile responsive layout

---

# 📋 Assignment Requirements Coverage

| Requirement | Implementation |
|---|---|
| React functional components | ✅ |
| React hooks | ✅ |
| Free-form ingredient input | ✅ |
| Real LLM integration | ✅ Groq  |
| Structured AI output | ✅ JSON |
| AI response parsing | ✅ |
| AI response validation | ✅ |
| Interactive UI | ✅ |
| Loading state | ✅ |
| Error state | ✅ |
| Empty state | ✅ |
| Malformed response handling | ✅ |
| Slow AI handling | ✅ |
| Stale response protection | ✅ |
| Ingredient substitutions | ✅ |
| Serving adjustment | ✅ |
| Cooking step interaction | ✅ |
| Mobile responsive UI | ✅ |
| Express backend | ✅ |
| Local AI support | ✅ |

---

# 👨‍💻 Author

**Manjunath K**

Built as part of a Frontend Internship Assignment.

---

⭐ Thanks for checking out AI Chef!
