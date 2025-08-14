// components/ShoppingList.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

//const API_BASE_URL = '';

const ShoppingList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    fetchMealPlans();
  }, [selectedWeek]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const startOfWeek = getStartOfWeek(selectedWeek);
      const endOfWeek = getEndOfWeek(selectedWeek);
      
     const response = await axios.get('https://movie-time-frontend-kavya.uw.r.appspot.com/api/meal-plans', {
        params: {
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString()
        }
      });
      
      setMealPlans(response.data);
      generateShoppingList(response.data);
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

  const generateShoppingList = (plans) => {
    const ingredients = [];
    
    plans.forEach(plan => {
      if (plan.recipeId && plan.recipeId.ingredients) {
        plan.recipeId.ingredients.forEach(ingredient => {
          ingredients.push({
            name: ingredient,
            recipe: plan.recipeId.name,
            category: categorizeIngredient(ingredient)
          });
        });
      }
    });

    // Group by category
    const grouped = ingredients.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient);
      return acc;
    }, {});

    setShoppingList(grouped);
  };

  const categorizeIngredient = (ingredient) => {
    const lower = ingredient.toLowerCase();
    
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('egg') || 
        lower.includes('butter') || lower.includes('yogurt')) {
      return 'Dairy & Eggs';
    }
    if (lower.includes('chicken') || lower.includes('beef') || lower.includes('pork') || 
        lower.includes('fish') || lower.includes('meat')) {
      return 'Meat & Seafood';
    }
    if (lower.includes('lettuce') || lower.includes('tomato') || lower.includes('onion') || 
        lower.includes('pepper') || lower.includes('carrot') || lower.includes('vegetable')) {
      return 'Vegetables';
    }
    if (lower.includes('apple') || lower.includes('banana') || lower.includes('orange') || 
        lower.includes('berry') || lower.includes('fruit')) {
      return 'Fruits';
    }
    if (lower.includes('bread') || lower.includes('pasta') || lower.includes('rice') || 
        lower.includes('flour') || lower.includes('cereal')) {
      return 'Grains & Bakery';
    }
    
    return 'Pantry Items';
  };

  const handleItemCheck = (ingredient) => {
    const newCheckedItems = new Set(checkedItems);
    const itemKey = `${ingredient.name}-${ingredient.recipe}`;
    
    if (newCheckedItems.has(itemKey)) {
      newCheckedItems.delete(itemKey);
    } else {
      newCheckedItems.add(itemKey);
    }
    
    setCheckedItems(newCheckedItems);
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() + (direction * 7));
    setSelectedWeek(newWeek);
  };

  const getTotalItems = () => {
    return Object.values(shoppingList).reduce((total, items) => total + items.length, 0);
  };

  const getCheckedCount = () => {
    return checkedItems.size;
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

  const startDate = getStartOfWeek(selectedWeek);
  const endDate = getEndOfWeek(selectedWeek);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Shopping List</h2>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Generate Shopping List</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Week of {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</h6>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigateWeek(-1)}
                    className="me-2"
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigateWeek(1)}
                  >
                    Next →
                  </Button>
                </div>
              </div>

              <div className="mb-3">
                <strong>Planned Meals ({mealPlans.length}):</strong>
                {mealPlans.length === 0 ? (
                  <p className="text-muted mt-2">No meals planned for this week.</p>
                ) : (
                  <ul className="mt-2">
                    {mealPlans.map(plan => (
                      <li key={plan._id}>
                        {new Date(plan.date).toLocaleDateString('en-US', { weekday: 'short' })} 
                        {' '}{plan.mealType}: {plan.recipeId.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button
                variant="success"
                onClick={fetchMealPlans}
                disabled={mealPlans.length === 0}
              >
                🛒 Refresh Shopping List
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <h5>Shopping List</h5>
              <span className="badge bg-primary">
                {getCheckedCount()}/{getTotalItems()} items
              </span>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {Object.keys(shoppingList).length === 0 ? (
                <p className="text-muted">No ingredients found. Plan some meals first!</p>
              ) : (
                Object.entries(shoppingList).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h6 className="fw-bold text-primary">{category}</h6>
                    {items.map((ingredient, index) => {
                      const itemKey = `${ingredient.name}-${ingredient.recipe}`;
                      const isChecked = checkedItems.has(itemKey);
                      
                      return (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          id={itemKey}
                          label={
                            <span className={isChecked ? 'text-decoration-line-through text-muted' : ''}>
                              {ingredient.name}
                              <small className="text-muted ms-2">({ingredient.recipe})</small>
                            </span>
                          }
                          checked={isChecked}
                          onChange={() => handleItemCheck(ingredient)}
                          className="mb-2"
                        />
                      );
                    })}
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingList;