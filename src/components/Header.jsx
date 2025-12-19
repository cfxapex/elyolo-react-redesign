import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        ELYOLO<span className="logo-reg">®</span>
      </Link>
    </header>
  );
}
