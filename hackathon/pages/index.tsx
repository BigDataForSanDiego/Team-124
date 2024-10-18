import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import styles from './styles/Home.module.css'; // Adjust the path as needed

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Our Application</h1>
      <p className={styles.description}>Get started by filling out the questionnaire.</p>
      <Link href="/questionnaire" className={styles.button}>
        Start Questionnaire
      </Link>
    </div>
  );
};

export default Home;
