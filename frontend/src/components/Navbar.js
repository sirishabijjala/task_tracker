import { Link, useNavigate } from 'react-router-dom';
import './Style.css'
function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>

      {!token && <Link to="/signup" style={{ marginRight: 10 }}>Signup</Link>}
      {!token && <Link to="/login" style={{ marginRight: 10 }}>Login</Link>}
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
}

export default Navbar;
