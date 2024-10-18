import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Container, Button } from 'react-bootstrap';
import styles from './styles/Questionnaire.module.css'; // Adjust the path as needed
import Image from 'next/image'; // Import Next.js Image component

const Home: NextPage = () => {
  return (
    <Container className={`${styles.container} ${styles.wideContainer}`} style={{ minHeight: '100vh' }}>
      <h1 className={styles.title}>Talk to a Therapist</h1>
      
      {/* Circular frame for the main image */}
      <div className={styles.imageContainer}>
        <Image 
          src="/imgs/stock.png" 
          alt="Therapist Illustration" 
          layout="fill" 
          objectFit="cover" 
          className={styles.circularImage}
        />
      </div>

      <p className={styles.description} style={{ fontSize: '20px', textAlign: 'center', margin: '20px 0' }}>
        Welcome! Here’s how it works:
      </p>
      
      <div className={styles.stepsContainer} style={{ margin: '0 auto', maxWidth: '600px' }}>
        <div className={styles.step}>
          <div className={styles.photoPlaceholder}>
            {/* TODO: Replace with actual image */}
            Photo 1
          </div>
          <div className={styles.stepDescription}>
            <strong className={styles.stepTitle}>Fill Out a Questionnaire:</strong>
            <p className={styles.stepText}>Start by providing us with some information about yourself.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.photoPlaceholder}>
            {/* TODO: Replace with actual image */}
            Photo 2
          </div>
          <div className={styles.stepDescription}>
            <strong className={styles.stepTitle}>Answer an Icebreaker Question:</strong>
            <p className={styles.stepText}>This helps you get comfortable with the process.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.photoPlaceholder}>
            {/* TODO: Replace with actual image */}
            Photo 3
          </div>
          <div className={styles.stepDescription}>
            <strong className={styles.stepTitle}>Therapist Matching:</strong>
            <p className={styles.stepText}>We’ll pair you with therapists who fit your needs.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.photoPlaceholder}>
            {/* TODO: Replace with actual image */}
            Photo 4
          </div>
          <div className={styles.stepDescription}>
            <strong className={styles.stepTitle}>Initial Video Call:</strong>
            <p className={styles.stepText}>Have a quick 5-minute chat with your matched therapist.</p>
          </div>
        </div>
      </div>

      <Link href="/questionnaire">
        <Button className={styles.continueButton} style={{ marginTop: '20px' }}>
          Start Questionnaire
        </Button>
      </Link>
    </Container>
  );
};

export default Home;
