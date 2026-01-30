import { Link } from "react-router";
import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <main
      className={styles.page}
     
    >
      <section className={styles.hero}>
        <header className={styles.header}>
          <h1 className={styles.title}>MindMetrics</h1>
          <p className={styles.tagline}>
            Your wellness, made simple.
          </p>
        </header>

        <div className={styles.content}>
          <p className={styles.text}>
            Track your mood, stress, focus, and daily habits in one place—fast and easy.
          </p>
          <p className={styles.text}>
            Turn your daily check-ins into insights, and use goals to stay consistent over time.
          </p>
          <p className={styles.text}>
            Build a healthier routine with clarity—one day at a time.
          </p>
        </div>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Don’t have an account yet?
          </p>

          <div className={styles.footerActions}>
            <Link className={styles.primaryBtn} to="/sign-up">
              Create account
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
};

export default Landing;

