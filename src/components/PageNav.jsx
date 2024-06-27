import { useAuthContext } from "../hooks/useAuthContext";

import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import styles from "./PageNav.module.css";

function PageNav() {
  const { isAuthenticated, logout } = useAuthContext();
  return (
    <nav className={styles.nav}>
      <Logo />

      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
