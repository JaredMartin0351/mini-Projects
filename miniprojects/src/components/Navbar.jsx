import { Link } from 'react-router-dom';

// hooks
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

// styles & images
import './Navbar.css';
import Banner from '../assets/banner.png';

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      <ul>
        <Link to="/" className="logo">
          <img src={Banner} alt="dojo logo" />
          <span>Mini Projects</span>
        </Link>

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}

        {user && (
          <li>

            {isPending ? (
              <button className="btn" disabled>
                Logging out...
              </button>
            ) : (
              <button className="btn" onClick={logout}>
              Logout
            </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
