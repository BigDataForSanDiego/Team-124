import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './styles/Questionnaire.module.css';

const Icebreaker: React.FC = () => {
  const router = useRouter();
  const [experienceData, setExperienceData] = useState<any>(null);

  useEffect(() => {
    const savedExperienceData = localStorage.getItem('experienceData');
    if (savedExperienceData) {
      setExperienceData(JSON.parse(savedExperienceData));
    }
  }, []);

  const handleBack = () => {
    router.push('/professional'); // Redirect to professional.tsx
  };

  return (
    <Container 
      style={{ 
        maxWidth: '380px', 
        margin: '0 auto', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        height: '100vh', // Set the container to fill the viewport height
      }}
    >
      <button className={styles.backButton} onClick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#474747" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h2 className={styles.title}>Question to Discuss (Optional)</h2>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: '80%' }} />
      </div>

      <div className={styles.header} style={{ textAlign: 'center' }}>
        <strong style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>
          What's been on your mind recently? 
          <br />
          
        </strong>
      </div>

      {/* Image above the Continue button */}
      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <img 
          src="/imgs/happy.png" 
          alt="Happy" 
          style={{ 
            width: '100%', 
            borderRadius: '10px', // Rounding the corners
            marginBottom: '20px' // Space between the image and the button
          }} 
        />
        
        <Button onClick={() => router.push('/nextPage')} className={styles.continueButton}>
          Continue
        </Button>
      </div>
    </Container>
  );
};

export default Icebreaker;
