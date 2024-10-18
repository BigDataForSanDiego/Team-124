import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';

const Experience: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    typeOfCare: '',
    genderIdentity: '',
    sexualOrientation: '',
    relationshipStatus: '',
  });

  useEffect(() => {
    // Load form data from local storage if available
    const savedData = localStorage.getItem('experienceData');
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
    // Save current form data to local storage
    localStorage.setItem('experienceData', JSON.stringify(formData));
    router.push('/care');
  };

  const handleBack = () => {
    // Save current form data to local storage
    localStorage.setItem('experienceData', JSON.stringify(formData));
    router.push('/questionnaire');
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

      <h2 className={styles.title}>Personalized Experience</h2>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: '50%' }} />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.header}>
          Type of Care <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          as="select"
          name="typeOfCare"
          value={formData.typeOfCare}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Type of Care</option>
          <option value="Individual">Individual</option>
          <option value="Couples">Couples</option>
          <option value="Child">Child</option>
        </Form.Control>

        <div className={styles.header}>
          Gender Identity <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          as="select"
          name="genderIdentity"
          value={formData.genderIdentity}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Gender Identity</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
        </Form.Control>

        <div className={styles.header}>
          Sexual Orientation <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          as="select"
          name="sexualOrientation"
          value={formData.sexualOrientation}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Sexual Orientation</option>
          <option value="Heterosexual">Heterosexual</option>
          <option value="Homosexual">Homosexual</option>
          <option value="Bisexual">Bisexual</option>
        </Form.Control>

        <div className={styles.header}>
          Relationship Status <span className={styles.asterisk}>*</span>
        </div>
        <Form.Control
          as="select"
          name="relationshipStatus"
          value={formData.relationshipStatus}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Select Relationship Status</option>
          <option value="Single">Single</option>
          <option value="In a Relationship">In a Relationship</option>
          <option value="Married">Married</option>
        </Form.Control>

        <Button type="button" className={styles.continueButton} onClick={handleSubmit}>
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default Experience;
