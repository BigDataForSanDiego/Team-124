/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';

const Professional: React.FC = () => {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [experienceData, setExperienceData] = useState<any>(null);

  useEffect(() => {
    const savedExperienceData = localStorage.getItem('experienceData');
    if (savedExperienceData) {
      setExperienceData(JSON.parse(savedExperienceData));
    }

    const savedProfessionalData = localStorage.getItem('professionalData');
    if (savedProfessionalData) {
      setSelectedOptions(JSON.parse(savedProfessionalData));
    }
  }, []);

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      alert('Please select at least one option.');
      return;
    }

    const allData = {
      experienceData,
      professionalData: selectedOptions,
    };
    localStorage.setItem('allData', JSON.stringify(allData));
    localStorage.setItem('professionalData', JSON.stringify(selectedOptions));

    console.log(allData);
    // Optionally navigate to the next page if needed
    // router.push('/nextPage');
  };

  const handleBack = () => {
    localStorage.setItem('professionalData', JSON.stringify(selectedOptions));
    router.push('/care'); // Update to the correct route for your Care page
  };
  
  function handleClick() {
    router.push('/video'); // Redirect to '/destination-page'
  }

  return (
    <Container className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#474747" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h2 className={styles.title}>Care Related Questions</h2>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: '80%' }} />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.header}>
          <strong>I would like a mental health professional who:</strong>
        </div>

        {[
          'Listens',
          'Explores my past',
          'Teaches new skills',
          'Challenges beliefs',
          'Makes goals',
          'Regular checkups',
          'Other',
          "I don't know"
        ].map((option) => (
          <Form.Check
            key={option}
            type="checkbox"
            label={<span className={`${styles.optionText}`} style={{ marginLeft: '8px' }}>{option}</span>}
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
            className={styles.checkbox}
            custom
          />
        ))}

        <Button onClick={handleClick} type="submit" className={styles.continueButton}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Professional;
