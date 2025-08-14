import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import axios from 'axios';

//const API_BASE_URL = '';

const DragTypes = {
  RECIPE: 'recipe'
};

const RecipeCard = ({ recipe }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DragTypes.RECIPE,
    item: { recipe },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className={`mb-2 ${isDragging ? 'opacity-50' : ''}`}
      style={{ cursor: 'move', fontSize: '0.8rem' }}
    >
      <Card.Body className="p-2">
        <Card.Title className="h6 mb-1">{recipe.name}</Card.Title>
        <Card.Text className="mb-0 text-muted">
          {recipe.category} • {recipe.cookTime}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const MealSlot = ({ date, mealType, meal, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DragTypes.RECIPE,
    drop: (item) => onDrop(item.recipe, date, mealType),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`meal-slot p-2 mb-1 ${isOver ? 'bg-light border-primary' : 'bg-light'}`}
      style={{ 
        minHeight: '60px', 
        border: '1px dashed #ccc',
        borderRadius: '4px'
      }}
    >
      {meal ? (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold" style={{ fontSize: '0.8rem' }}>
              {meal.recipeId.name}
            </div>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
              {meal.recipeId.cookTime}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => onRemove(meal._id)}
            style={{ fontSize: '0.7rem' }}
          >
            ×
          </Button>
        </div>
      ) : (
        <div className="text-center text-muted" style={{ fontSize: '0.8rem' }}>
          Drop recipe here
        </div>
      )}
    </div>
  );
};

const MealPlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
    fetchMealPlans();
  }, [currentWeek]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('https://movie-time-frontend-kavya.uw.r.appspot.com/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const startOfWeek = getStartOfWeek(currentWeek);
      const endOfWeek = getEndOfWeek(currentWeek);
      
     const response = await axios.get('https://movie-time-frontend-kavya.uw.r.appspot.com/api/meal-plans', {
        params: {
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString()
        }
      });
      setMealPlans(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch meal plans');
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const end = getStartOfWeek(date);
    return new Date(end.setDate(end.getDate() + 6));
  };

  const getWeekDays = () => {
    const start = getStartOfWeek(currentWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const handleDrop = async (recipe, date, mealType) => {
    try {
      const response = await axios.post('https://movie-time-frontend-kavya.uw.r.appspot.com/api/meal-plans', {
        date: date.toISOString().split('T')[0],
        mealType,
        recipeId: recipe._id
      });
      
      setMealPlans(prev => [...prev, response.data]);
    } catch (error) {
      setError('Failed to add meal to plan');
      console.error('Error adding meal plan:', error);
    }
  };

  const handleRemove = async (mealPlanId) => {
    try {
      await axios.delete(`https://movie-time-frontend-kavya.uw.r.appspot.com/api/meal-plans/${mealPlanId}`);
      setMealPlans(prev => prev.filter(plan => plan._id !== mealPlanId));
    } catch (error) {
      setError('Failed to remove meal from plan');
      console.error('Error removing meal plan:', error);
    }
  };

  const getMealForSlot = (date, mealType) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.find(plan => 
      plan.date.split('T')[0] === dateStr && plan.mealType === mealType
    );
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  const weekDays = getWeekDays();
  const startDate = weekDays[0];
  const endDate = weekDays[6];

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Meal Planner</h2>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h5>My Recipes</h5>
              <small className="text-muted">Drag recipes to calendar</small>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {recipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>
                Week of {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </h5>
              <div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => navigateWeek(-1)}
                  className="me-2"
                >
                  ← Previous Week
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => navigateWeek(1)}
                >
                  Next Week →
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                {weekDays.map((day, index) => (
                  <Col key={index} className="mb-3">
                    <h6 className="text-center">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      <br />
                      <small>{day.getDate()}</small>
                    </h6>
                    
                    <div className="mb-2">
                      <small className="fw-bold">Breakfast</small>
                      <MealSlot
                        date={day}
                        mealType="breakfast"
                        meal={getMealForSlot(day, 'breakfast')}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                      />
                    </div>
                    
                    <div className="mb-2">
                      <small className="fw-bold">Lunch</small>
                      <MealSlot
                        date={day}
                        mealType="lunch"
                        meal={getMealForSlot(day, 'lunch')}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                      />
                    </div>
                    
                    <div className="mb-2">
                      <small className="fw-bold">Dinner</small>
                      <MealSlot
                        date={day}
                        mealType="dinner"
                        meal={getMealForSlot(day, 'dinner')}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MealPlanner;