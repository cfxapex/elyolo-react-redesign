import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">ELYOLO ®</div>

        <div className="footer-links">
          <a href="mailto:elyoloinfo@gmail.com">📧 elyoloinfo@gmail.com</a>
        </div>

        <div className="social-links">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
            ▶️
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
            📷
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
            📘
          </a>
        </div>

        <p className="copyright">
          © {currentYear} ELYOLO. All rights reserved.<br />
          Inspire yourself. Inspire others. Enjoy Life.
        </p>
      </div>
    </footer>
  );
}
