# Recipe & Meal Planner

A full-stack web application designed to help users store, organize, and plan their meals digitally. This app serves as a central place for managing recipe collections and creating weekly meal plans with an intuitive drag-and-drop interface.

## 🌟 Features

- **Recipe Management**: Full CRUD operations for creating, reading, updating, and deleting recipes
- **Smart Search & Filtering**: Search recipes by name or ingredients, filter by category and cooking time
- **Drag-and-Drop Meal Planning**: Interactive weekly calendar for planning meals with React DnD
- **Auto-Generated Shopping Lists**: Create shopping lists from planned meals, organized by grocery categories
- **Responsive Design**: Bootstrap-powered UI that works across all devices
- **Real-time Updates**: Dynamic content updates without page refreshes

## 🚀 Live Demo

**Deployed Application**: [https://movie-time-frontend-kavya.uw.r.appspot.com](https://movie-time-frontend-kavya.uw.r.appspot.com)

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single-page application
- **React Bootstrap** - UI component library for responsive design
- **React DnD** - Drag-and-drop functionality for meal planning
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database service
- **Mongoose** - MongoDB object modeling for Node.js
- **CORS** - Cross-origin resource sharing middleware

### Deployment
- **Google Cloud Platform** - App Engine for hosting
- **GitHub** - Version control and repository hosting

## 📊 Database Schema

### Recipes Collection
```javascript
{
  name: String (required),
  category: String (required), // breakfast, lunch, dinner, snack, dessert
  prepTime: String (required),
  cookTime: String (required), 
  servings: Number (required),
  ingredients: [String] (required),
  instructions: String (required),
  imageUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Meal Plans Collection
```javascript
{
  date: Date (required),
  mealType: String (required), // breakfast, lunch, dinner
  recipeId: ObjectId (required), // References Recipe collection
  createdAt: Date
}
```

## 🗺 Application Routes

- `/` - Home dashboard with feature overview
- `/recipes` - Browse and manage recipe collection (READ operations)
- `/add-recipe` - Add new recipes (CREATE operations)
- `/edit-recipe/:id` - Edit existing recipes (UPDATE operations)
- `/meal-planner` - Drag-and-drop weekly meal planning interface
- `/shopping-list` - Auto-generated shopping lists from meal plans

## 🔧 API Endpoints

### Recipe Management
- `GET /api/recipes` - Retrieve all recipes with optional filtering
- `GET /api/recipes/:id` - Get single recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update existing recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Meal Planning
- `GET /api/meal-plans` - Get meal plans with date range filtering
- `POST /api/meal-plans` - Create new meal plan entry
- `DELETE /api/meal-plans/:id` - Remove meal from plan

### Health Check
- `GET /api/health` - API status and environment information

## 🎯 Iteration 1 Requirements Fulfilled

### Technical Requirements ✅
- **✅ CRUD Operations**: Full Create, Read, Update, Delete functionality for recipes
- **✅ 3+ UI Routes**: 6 distinct routes implemented with React Router
- **✅ Bootstrap Components**: Navbar, Cards, Forms, Modals, Alerts, Buttons, Grid system
- **✅ 3rd Party Library**: React DnD for intuitive drag-and-drop meal planning
- **✅ Database Integration**: MongoDB with Mongoose ODM for data persistence
- **✅ Unique Design**: Custom layout distinct from demo applications

### Functional Features ✅
- **✅ Recipe CRUD**: Add, view, edit, and delete recipes with form validation
- **✅ Search & Filter**: Dynamic recipe filtering by category, ingredients, and cooking time
- **✅ Meal Planning**: Drag recipes onto calendar days for weekly planning
- **✅ Shopping Lists**: Automatically generate organized shopping lists from meal plans
- **✅ Error Handling**: Comprehensive error handling and user feedback
- **✅ Loading States**: User-friendly loading indicators and status messages

## 👥 Team Member Contributions

### Kavya Veeramony
- Did everything

## 📷 Screenshots 

### Home Dashboard
*Clean, intuitive dashboard with feature navigation*

### Recipe Management
*Comprehensive recipe CRUD with search and filtering capabilities*

### Meal Planning Interface
*Drag-and-drop weekly meal planning calendar*

### Shopping List Generator
*Automatically organized shopping lists from meal plans*

## 🔄 Current Progress

### Completed Features
- ✅ Full backend API with MongoDB integration
- ✅ Complete frontend with React Router
- ✅ Recipe CRUD operations with validation
- ✅ Advanced search and filtering
- ✅ Drag-and-drop meal planning
- ✅ Shopping list generation
- ✅ Bootstrap responsive design
- ✅ Google Cloud deployment
- ✅ Error handling and loading states

## 🐛 Known Issues
- None currently identified

## 🔗 Links

- **GitHub Repository**: [https://github.com/KavyaVee00/recipe-planner](https://github.com/KavyaVee00/recipe-planner)
- **Deployed Application**: [https://movie-time-frontend-kavya.uw.r.appspot.com](https://movie-time-frontend-kavya.uw.r.appspot.com)
- **Release Tag**: [iter1](https://github.com/KavyaVee00/recipe-planner/releases/tag/iter1)

