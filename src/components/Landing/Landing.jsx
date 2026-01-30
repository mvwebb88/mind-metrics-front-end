import { Link } from "react-router";
import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>MindMetrics</h1>

        <div className={styles.stack}>
          <p className={styles.text}>
            Track your mood, stress, and focus, monitor daily habits, and set
            personal goals in one place!
          </p>
          <p className={styles.text}>
            Gain insights into your patterns and progress to make smarter choices
            for your well-being.
          </p>
          <p className={styles.text}>Sign up or log in to start your journey.</p>
        </div>
      </section>
    </main>
  );
};

export default Landing;
