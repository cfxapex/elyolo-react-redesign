import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-placeholder">///</div>
        <div className="hero-content">
          <h1>Inspire yourself. Inspire others.</h1>
          <p>
            Life is a struggle. Find the joy in the chaos.
            Spread love. Defy the ordinary.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn">Shop Collection</Link>
            <Link to="/blog" className="btn btn-outline">Read The Stories</Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mission">
        <div className="container">
          <p>
            ELYOLO was created to help and inspire. The world is dark, but you are the light. 
            No matter the hardship, mental or physical, you can live your best life. 
            Spread kindness like fire. Find beauty in the cracks. 
            Get out there. Scream. Create. Enjoy life.
          </p>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="featured-quote">
            "You attract the energy you give off. Spread good vibes. Think positively. Enjoy Life."
            <footer>— Unknown</footer>
          </blockquote>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card">
              <div className="cta-icon">[SHOP]</div>
              <h3>Apparel</h3>
              <p>Wear the message. Black & White Only.</p>
              <Link to="/shop" className="btn">Browse</Link>
            </div>

            <div className="cta-card">
              <div className="cta-icon">[CREATE]</div>
              <h3>Custom</h3>
              <p>Your words. Your design. Your story.</p>
              <Link to="/custom" className="btn">Design</Link>
            </div>

            <div className="cta-card">
              <div className="cta-icon">[READ]</div>
              <h3>Journal</h3>
              <p>Raw stories from real people.</p>
              <Link to="/blog" className="btn">Read</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
