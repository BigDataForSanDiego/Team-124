/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
}

const Questionnaire: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dob: '',
    country: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    // Load data from local storage if available
    const savedData = localStorage.getItem('questionnaireData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dob = new Date(formData.dob);
    const today = new Date();

    if (dob > today) {
      alert('Date of Birth cannot be in the future.');
      return;
    }

    // Save form data to local storage
    localStorage.setItem('questionnaireData', JSON.stringify(formData));

    router.push('/experience');
  };

  const handleBack = () => {
    // Clear form data in local storage
    localStorage.removeItem('questionnaireData');
    localStorage.removeItem('experienceData');
    localStorage.removeItem('careData');



    // Navigate to the home page
    router.push('/');
  };

  return (
    <Container className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#474747"
          viewBox="0 0 24 24"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h2 className={styles.title}>General Information</h2>
      
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: '20%' }} />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.header}>
          First Name <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <div className={styles.header}>
          Last Name <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <div className={styles.header}>
          Date of Birth <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={styles.input}
          style={{ color: '#474747' }}
          max={`${currentYear}-12-31`}
          required
        />

        <div className={styles.header}>
          Country <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          as="select"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select your country</option>
          <option value="United States">United States</option>
          {/* Add more countries as needed */}
        </Form.Control>

        <Button type="submit" className={styles.continueButton}>
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default Questionnaire;
