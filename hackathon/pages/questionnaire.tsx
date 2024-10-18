import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';
import BackIcon from './icons/back/back_icon.svg'; // Adjust path if necessary

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

    router.push('/icebreaker');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <img src={BackIcon} alt="Back" width={24} height={24} />
      </button>

      <h2 className={styles.title}>General Information</h2>
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
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <Button type="button" className={styles.continueButton} onClick={handleSubmit}>
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default Questionnaire;
