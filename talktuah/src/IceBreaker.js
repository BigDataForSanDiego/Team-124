// src/Icebreaker.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const Icebreaker = () => {
  const { roomId } = useParams();
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally save the icebreaker response
    navigate(`/webrtc/${roomId}`);
  };

  return (
    <Container>
      <h2>Icebreaker Question</h2>
      <p>What's your favorite way to unwind after a long day?</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formResponse">
          <Form.Control
            as="textarea"
            rows={3}
            value={response}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Response
        </Button>
      </Form>
    </Container>
  );
};

export default Icebreaker;
