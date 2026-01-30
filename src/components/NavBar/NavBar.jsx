import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import styles from "./NavBar.module.css";

const NavBar = () => {
    // Pass the UserContext object to the useContext hook to access:
    // - The user state
    // - The setUser function to update the user state
    //
    // Destructure the object returned by the useContext hook for easy access
    // to the data we added to the context with familiar names.

    // Get the setUser function from the UserContext
    const { user, setUser } = useContext(UserContext);

    // Add the handleSignOut function
    const handleSignOut = () => {
        // Clear the token from localStorage
        localStorage.removeItem("token");
        // Clear the user state
        setUser(null);
    };

    return (
        <nav className={styles.container}>
          <div className={styles.inner}>
            {/* Logo  */}
            <div className={styles.brand}>
              <span className={styles.logoDot} />
              <span className={styles.brandText}>MindMetrics</span>
            </div>
    
            {user ? (
              <ul className={styles.menu}>
                <li>
                  <Link className={styles.link} to="/">
                    Home
                  </Link>
                </li>
    
                <li>
                  <Link className={styles.link} to="/dailylogs">
                    Daily Logs
                  </Link>
                </li>
    
                {/* Si tu dashboard es la home cuando estás logueada, usa "/" */}
                <li>
                  <Link className={styles.link} to="/">
                    Dashboard
                  </Link>
                </li>
    
                <li>
                  <Link className={styles.link} to="/goals">
                    Goals
                  </Link>
                </li>
    
                <li className={styles.pushRight}>
                  <Link
                    className={`${styles.btn} ${styles.btnSmall}`}
                    to="/"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className={`${styles.menu} ${styles.menuRight}`}>
                <li>
                  <Link className={styles.btn} to="/sign-in">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className={styles.btn} to="/sign-up">
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      );
    };
    
export default NavBar;
