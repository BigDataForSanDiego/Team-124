// src/Questionnaire.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    pronouns: '',
    preferredName: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomId = "420"; // Placeholder room ID
    navigate(`/icebreaker/${roomId}`);
  };

  return (
    <Container>
      <h2>Questionnaire</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDOB">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formGender">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formPronouns">
          <Form.Label>Pronouns</Form.Label>
          <Form.Control
            type="text"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formPreferredName">
          <Form.Label>Preferred Name</Form.Label>
          <Form.Control
            type="text"
            name="preferredName"
            value={formData.preferredName}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Start Session
        </Button>
      </Form>
    </Container>
  );
};

export default Questionnaire;
