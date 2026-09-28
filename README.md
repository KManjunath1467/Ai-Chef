# 🍳 AI Chef — Fridge-to-Recipe

AI Chef is a **Fridge-to-Recipe** web application that uses AI to transform ingredients available in your fridge into a structured, interactive recipe.

Instead of behaving like a traditional chatbot, AI Chef converts the AI response into **structured JSON** and renders it through interactive React components.

Users can enter ingredients in natural language, and the application generates:

- 🍽️ Recipe title and description
- 🥕 Ingredient list
- 👨‍🍳 Step-by-step cooking instructions
- 🔄 Ingredient substitution suggestions
- 👥 Serving information
- ✅ Interactive cooking steps

### 🚀 Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express

**AI**
- Groq API
- `openai/gpt-oss-20b`

**Deployment**
- Render

---

## 🌐 Live Demo

### 👉 https://ai-chef-79mk.onrender.com

The deployed application allows users to enter ingredients and generate an interactive recipe using the AI backend.

---

# ✨ Features

- 🥕 Natural-language ingredient input
- 🤖 AI-powered recipe generation
- ⚡ Groq-powered AI integration
- 📋 Structured JSON AI responses
- 🔍 AI response parsing and validation
- 👨‍🍳 Interactive recipe presentation
- ✅ Cooking step checklist
- 👥 Serving-size adjustment
- 🔄 Ingredient substitution suggestions
- ⏳ Loading state while AI is generating
- ⚠️ Error handling and retry
- 🛡️ Malformed response handling
- 🚫 Stale-request protection
- 📱 Responsive mobile and desktop UI
- 🔐 API key kept on the server

---

# 🏗️ Architecture

The application uses a **React + Express + Groq** architecture.

The Groq API is called from the backend rather than directly from the browser. This keeps the API key out of the frontend.

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ Ingredient Input    │
                    │ Recipe UI            │
                    └──────────┬──────────┘
                               │
                               │ POST /api/recipe
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Request Handling    │
                    │ Validation          │
                    │ Error Handling      │
                    └──────────┬──────────┘
                               │
                               │ Groq API Request
                               ▼
                    ┌─────────────────────┐
                    │      Groq API      │
                    │                     │
                    │ openai/gpt-oss-20b  │
                    └──────────┬──────────┘
                               │
                               │ Structured JSON
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Parse + Validate    │
                    └──────────┬──────────┘
                               │
                               │ Validated Recipe
                               ▼
                    ┌─────────────────────┐
                    │    React Recipe UI  │
                    │                     │
                    │ Ingredients         │
                    │ Steps               │
                    │ Swaps               │
                    │ Servings            │
                    └─────────────────────┘
```

---

# 🔄 Request Flow

```text
User enters ingredients
          ↓
React frontend
          ↓
POST /api/recipe
          ↓
Express backend
          ↓
Groq API
          ↓
openai/gpt-oss-20b
          ↓
Structured JSON response
          ↓
Backend parses response
          ↓
Backend validates recipe
          ↓
Validated recipe sent to React
          ↓
Interactive recipe displayed
```

---

# 🧠 Structured AI Responses

One of the main design decisions in this project is that the application does **not** display raw AI text.

Instead, the AI is instructed to return a predefined JSON structure.

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
    },
    {
      "name": "Rice",
      "amount": 150,
      "unit": "g",
      "optional": false
    }
  ],
  "steps": [
    {
      "id": 1,
      "instruction": "Cook the chicken until fully cooked."
    },
    {
      "id": 2,
      "instruction": "Add the vegetables and cook until tender."
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

The backend validates this structure before returning it to the frontend.

This allows React to render the response as actual application data rather than displaying a block of AI-generated text.

---

# 🛡️ AI Response Validation

AI output cannot always be assumed to be valid.

The backend performs validation before returning the recipe to the frontend.

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

The backend also handles accidental Markdown code fences before attempting to parse the response.

Only a successfully parsed and validated recipe is returned to the React application.

---

# 🔄 Stale Request Protection

The application prevents an older AI request from replacing the result of a newer request.

For example:

```text
Request A starts
      ↓
Request B starts
      ↓
Request B finishes
      ↓
Request B result displayed
      ↓
Request A finishes later
      ↓
Check whether A is still the latest request
      ↓
      NO
      ↓
Ignore Request A
```

This prevents race conditions when users generate multiple recipes in a short period of time.

The frontend uses request tracking and `AbortController` to prevent outdated requests from overwriting newer results.

---

# ⏳ Loading and Error States

The application provides clear UI states throughout the recipe-generation process.

### Empty State

Displayed when the user has not generated a recipe yet.

### Loading State

Displayed while the AI is generating the recipe.

```text
Chef is thinking...

Creating your recipe with Groq.
```

### Error State

If recipe generation fails, the application displays an error message and provides a retry option.

### Timeout Handling

Long-running requests are handled explicitly so the interface does not remain stuck indefinitely.

---

# 🔐 API Key Security

The Groq API key is **not stored in the React frontend**.

The request flow is:

```text
React
  ↓
Express Backend
  ↓
Groq API
```

The Groq API key is stored as a server-side environment variable:

```text
GROQ_API_KEY=your_groq_api_key_here
```

The actual API key should never be committed to GitHub.

The `.env` file is excluded using `.gitignore`.

A `.env.example` file is provided for local setup.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- A Groq API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/KManjunath1467/Ai-Chef.git
```

Navigate into the project:

```bash
cd Ai-Chef
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure the Groq API Key

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Replace the placeholder with your own Groq API key.

> ⚠️ Never commit your `.env` file or expose your API key in frontend code.

---

## 4. Start the Application

Run:

```bash
npm run dev
```

This starts the Express backend and Vite development server.

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:3001
```

Open the frontend URL in your browser.

---

# 🧑‍🍳 How to Use

## Step 1 — Enter Ingredients

Enter the ingredients available in your fridge.

Example:

```text
chicken, rice, onions, tomatoes, garlic and spinach
```

---

## Step 2 — Generate the Recipe

Click:

**Generate Recipe**

You can also use:

```text
Ctrl + Enter
```

---

## Step 3 — AI Processing

The request follows this flow:

```text
React
  ↓
Express
  ↓
Groq API
  ↓
openai/gpt-oss-20b
  ↓
Structured JSON
  ↓
Express validation
  ↓
React
```

---

## Step 4 — View the Recipe

The generated recipe contains:

- 🍽️ Recipe title
- 📝 Description
- 🥕 Ingredients
- 👥 Serving information
- 👨‍🍳 Cooking steps
- 🔄 Ingredient substitutions

---

## Step 5 — Interact With the Recipe

Users can interact with the generated recipe through the recipe interface.

### Serving Adjustment

Increase or decrease the number of servings and ingredient quantities are scaled accordingly.

### Cooking Checklist

Cooking steps can be checked off while preparing the recipe.

### Ingredient Substitutions

The application displays alternative ingredients suggested by the AI.

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

# 🤖 AI Integration

The application uses the **Groq API** with the:

```text
openai/gpt-oss-20b
```

model.

The AI model is responsible for generating recipe information in the required structured JSON format.

The application itself is responsible for:

- Defining the expected response structure
- Sending the structured prompt
- Calling the AI through the backend
- Parsing the AI response
- Validating the returned data
- Handling malformed AI responses
- Handling AI failures
- Handling timeouts
- Rendering validated data as interactive UI

This separation keeps the AI integration independent from the presentation layer.

---

# 🧩 React Architecture

The frontend is organized into reusable React components.

```text
src/
│
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Main.jsx
│   ├── RecipeView.jsx
│   ├── IngredientList.jsx
│   ├── RecipeSteps.jsx
│   └── IngredientSwaps.jsx
│
├── utils/
│   └── validateRecipe.js
│
├── ai.js
├── App.jsx
├── index.jsx
└── index.css
```

### `index.jsx`

The React entry point that mounts the application into the DOM.

### `App.jsx`

The root React component that combines the main application components.

### `Main.jsx`

Handles ingredient input, recipe generation, loading state, errors and request management.

### `RecipeView.jsx`

Displays the generated recipe and manages serving-size changes.

### `IngredientList.jsx`

Displays ingredients and scales quantities according to the selected servings.

### `RecipeSteps.jsx`

Displays cooking instructions as an interactive checklist.

### `IngredientSwaps.jsx`

Displays AI-generated ingredient substitutions.

### `ai.js`

Handles communication between the React frontend and the backend API.

---

# 📱 Responsive Design

The application was tested on desktop and mobile-sized layouts.

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
- Groq API connectivity
- Mobile/responsive layouts

---

# ⚠️ Known Limitations

### Groq API Dependency

Recipe generation depends on the availability of the Groq API and the configured API key.

API limits, service interruptions or invalid credentials can prevent recipe generation.

### Render Free-Tier Cold Starts

The application is deployed on Render's free tier. After a period of inactivity, the backend may sleep and the first request can take longer while the service starts again.

### AI-Generated Content

Recipes are generated by an AI model and may occasionally contain inaccurate quantities, substitutions or cooking instructions.

Users should use appropriate judgment when preparing food, particularly regarding allergens and food safety.

---

# 🔮 Future Improvements

Possible future improvements include:

- 💾 Recipe history
- ❤️ Save favorite recipes
- 🥗 Dietary preference support
- ⚠️ Allergen filtering
- 🌎 Cuisine selection
- 📊 Nutritional information
- 🖼️ Recipe image generation
- ⚡ Streaming AI responses
- 🧪 Automated frontend and backend tests
- 📚 Saved recipe collections

---

# 🎥 Demo Video

A short screen recording demonstrates:

1. Entering ingredients
2. Generating a recipe
3. AI loading state
4. Generated recipe
5. Serving adjustment
6. Cooking step interaction
7. Ingredient substitutions
8. Error handling and retry
9. Mobile responsive layout

**Demo video:**  
_Add your screen recording link here._

---

# ⏱️ Development Time

The project was developed within the assignment's intended time limit.

### Time Breakdown

| Date | Time Spent |
|---|---:|
| September 25, 2026 | 2 hours |
| September 26, 2026 | 4 hours |
| **Total** | **6 hours** |

---

# 📋 Assignment Requirements Coverage

| Requirement | Implementation |
|---|---|
| React functional components | ✅ |
| React hooks | ✅ |
| Free-form ingredient input | ✅ |
| Real LLM integration | ✅ Groq |
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
| Server-side API key handling | ✅ |
| Groq API integration | ✅ |
| Deployment | ✅ Render |

---

# 🤖 Development AI Tool

**Antigravity** was used during development to assist with implementing parts of the application.

AI assistance was used as a development aid, while the application was integrated, tested and configured as part of the project development process.

---

# 👨‍💻 Author

**Manjunath K**

Built as part of a Frontend Internship Assignment.

---

⭐ Thanks for checking out **AI Chef**!
