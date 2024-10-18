import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';

const Care: React.FC = () => {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [experienceData, setExperienceData] = useState<any>(null);

  useEffect(() => {
    const savedExperienceData = localStorage.getItem('experienceData');
    if (savedExperienceData) {
      setExperienceData(JSON.parse(savedExperienceData));
    }

    const savedCareData = localStorage.getItem('careData');
    if (savedCareData) {
      setSelectedOptions(JSON.parse(savedCareData));
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

    // Save current selections to local storage
    const allData = {
      experienceData,
      careData: selectedOptions,
    };
    localStorage.setItem('allData', JSON.stringify(allData));
    localStorage.setItem('careData', JSON.stringify(selectedOptions));

    console.log(allData);
    
    // Navigate to the Professional page
    router.push('/professional');
  };

  const handleBack = () => {
    // Save current selections to local storage
    localStorage.setItem('careData', JSON.stringify(selectedOptions));
    router.push('/experience');
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

      <h2 className={styles.title}>Care Related Question</h2>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: '60%' }} />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.header}>
          <strong>What is wrong?</strong> 
        </div>

        {[
          'Depression',
          'Anxious',
          'Grieving',
          'Trauma',
          'Relationships',
          'Confidence',
          'Just Exploring',
          'Other'
        ].map((option) => (
          <Form.Check
            key={option}
            type="checkbox"
            label={
              <span className={`${styles.optionText}`} style={{ marginLeft: '8px' }}>{option}</span>
            }
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
            className={styles.checkbox} // Add custom style class here
            custom // Use custom prop for Bootstrap styling
          />
        ))}

        <Button type="submit" className={styles.continueButton}>
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default Care;
