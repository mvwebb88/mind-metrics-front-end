import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signIn } from '../../services/authService';

import { UserContext } from '../../contexts/UserContext';
import styles from "./SignInForm.module.css";

const SignInForm = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (evt) => {
        setMessage('');
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        // Stops whatever default behavior that it's attached to
        // In this case, it prevents refreshing the page
        evt.preventDefault();
        try {
            // This function doesn't exist yet, but we'll create it soon.
            // It will cause an error right now
            const signedInUser = await signIn(formData);

            setUser(signedInUser);
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
       <main className={styles.page}>
      <h1 className={styles.title}>Sign In</h1>

      {!!message && (
        <p className={styles.error}>{message}</p>
      )}

      <section className={styles.card}>
        <form className={styles.form} autoComplete="off" onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              className={styles.control}
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.control}
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.buttonPrimary} type="submit">
              Sign In
            </button>

            <button
              className={styles.buttonSecondary}
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignInForm;

