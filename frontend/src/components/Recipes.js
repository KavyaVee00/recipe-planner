import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

//const API_BASE_URL = '';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, categoryFilter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://movie-time-frontend-kavya.uw.r.appspot.com/api/recipes');
      setRecipes(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === categoryFilter);
    }

    setFilteredRecipes(filtered);
  };

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://movie-time-frontend-kavya.uw.r.appspot.com/api/recipes/${recipeToDelete._id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeToDelete._id));
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    } catch (error) {
      setError('Failed to delete recipe');
      console.error('Error deleting recipe:', error);
    }
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

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Recipes</h2>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
            <option value="dessert">Dessert</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Link to="/add-recipe">
            <Button variant="success" className="w-100">
              Add Recipe
            </Button>
          </Link>
        </Col>
      </Row>

      <Row>
        {filteredRecipes.length === 0 ? (
          <Col>
            <Alert variant="info">
              No recipes found. <Link to="/add-recipe">Add your first recipe!</Link>
            </Alert>
          </Col>
        ) : (
          filteredRecipes.map(recipe => (
            <Col md={4} key={recipe._id} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {recipe.category} • Prep: {recipe.prepTime} • Cook: {recipe.cookTime}
                  </Card.Text>
                  <Card.Text>
                    Serves {recipe.servings}
                  </Card.Text>
                  <div className="mt-auto">
                    <Link to={`/edit-recipe/${recipe._id}`}>
                      <Button variant="outline-primary" size="sm" className="me-2">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(recipe)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{recipeToDelete?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Recipe
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Recipes;