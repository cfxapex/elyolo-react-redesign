import { NavLink } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li><NavLink to="/">HOME</NavLink></li>
        <li><NavLink to="/shop">SHOP</NavLink></li>

        <li><NavLink to="/blog">STORIES</NavLink></li>
        <li><NavLink to="/submit-story" className="highlight">SHARE YOUR STORY</NavLink></li>
        <li><NavLink to="/contact">CONTACT</NavLink></li>
      </ul>
    </nav>
  );
}
