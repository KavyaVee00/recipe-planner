// components/EditRecipe.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

//const API_BASE_URL = '';

const EditRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [''],
    instructions: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`https://movie-time-frontend-kavya.uw.r.appspot.com/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      setError('Failed to fetch recipe');
      console.error('Error fetching recipe:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const filteredIngredients = recipe.ingredients.filter(ingredient => ingredient.trim() !== '');
      
      const recipeData = {
        ...recipe,
        ingredients: filteredIngredients,
        servings: parseInt(recipe.servings)
      };

     await axios.put(`https://movie-time-frontend-kavya.uw.r.appspot.com/api/recipes/${id}`, recipeData);
      setSuccess('Recipe updated successfully!');
      
      setTimeout(() => {
        navigate('/recipes');
      }, 1500);
    } catch (error) {
      setError('Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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

  return (
    <Container>
      <Row>
        <Col md={8} className="mx-auto">
          <h2 className="mb-4">Edit Recipe</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipe Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={recipe.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={recipe.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prep Time *</Form.Label>
                  <Form.Control
                    type="text"
                    name="prepTime"
                    value={recipe.prepTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 15 minutes"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cook Time *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cookTime"
                    value={recipe.cookTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 minutes"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Servings *</Form.Label>
                  <Form.Control
                    type="number"
                    name="servings"
                    value={recipe.servings}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={recipe.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients *</Form.Label>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="Enter ingredient"
                    className="me-2"
                  />
                  {recipe.ingredients.length > 1 && (
                    <Button
                      variant="outline-danger"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline-secondary" onClick={addIngredient}>
                Add Ingredient
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="instructions"
                value={recipe.instructions}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="success"
                disabled={loading}
              >
                {loading ? 'Updating Recipe...' : 'Update Recipe'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/recipes')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRecipe;