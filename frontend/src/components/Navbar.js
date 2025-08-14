import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand>
            🍳 Recipe & Meal Planner
          </BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/recipes">
              <Nav.Link>My Recipes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/add-recipe">
              <Nav.Link>Add Recipe</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/meal-planner">
              <Nav.Link>Meal Planner</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/shopping-list">
              <Nav.Link>Shopping List</Nav.Link>
            </LinkContainer>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;