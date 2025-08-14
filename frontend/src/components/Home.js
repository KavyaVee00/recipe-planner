import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="text-center py-5">
            <h1 className="display-4">Welcome to Recipe & Meal Planner</h1>
            <p className="lead">
              Your central place to store, organize, and plan all your meals digitally.
            </p>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>📚 My Recipes</Card.Title>
              <Card.Text>
                Browse, search, and manage your recipe collection
              </Card.Text>
              <Link to="/recipes">
                <Button variant="primary">View Recipes</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>📅 Meal Planner</Card.Title>
              <Card.Text>
                Plan your weekly meals with drag-and-drop calendar
              </Card.Text>
              <Link to="/meal-planner">
                <Button variant="success">Plan Meals</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>🛒 Shopping List</Card.Title>
              <Card.Text>
                Generate shopping lists from your meal plans
              </Card.Text>
              <Link to="/shopping-list">
                <Button variant="info">View List</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;