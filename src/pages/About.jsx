import { useEffect, useState } from 'react';
import { fetchSiteInfo } from '../lib/siteInfo';
import './About.css';

export default function About() {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      const info = await fetchSiteInfo();
      setSiteInfo(info);
    };
    load();
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <h1 className="section-title">About ELYOLO</h1>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            {siteInfo?.about_mission ? (
              <p>{siteInfo.about_mission}</p>
            ) : (
              <>
                <p>
                  ELYOLO was created to help and inspire everyone to enjoy life. Life can be a struggle
                  sometimes, but that doesn't mean you can't find joy. No matter what you are dealing with,
                  you can live your best life and inspire others to do the same.
                </p>
                <p>
                  We believe that no hardship, mental or physical disability should stop you from enjoying
                  life to the fullest. Our mission is to spread love, kindness, and inspiration to all.
                </p>
              </>
            )}
          </section>

          <section className="about-section">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              <div className="value-card">
                <span className="value-icon">💪</span>
                <h3>Resilience</h3>
                <p>Overcoming challenges and never giving up</p>
              </div>

              <div className="value-card">
                <span className="value-icon">❤️</span>
                <div>
                  <h3>Compassion</h3>
                  <p>Spreading love and kindness to all</p>
                </div>
              </div>

              <div className="value-card">
                <span className="value-icon">🌟</span>
                <h3>Inspiration</h3>
                <p>Being a light for others to follow</p>
              </div>

              <div className="value-card">
                <span className="value-icon">🎯</span>
                <h3>Purpose</h3>
                <p>Living with intention and meaning</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>The ELYOLO Philosophy</h2>
            <blockquote className="philosophy-quote">
              <p>
                {siteInfo?.about_philosophy_quote
                  ? `"${siteInfo.about_philosophy_quote}"`
                  : `"You attract the energy that you give off. Spread good vibes. Think positively.
                Enjoy Life. You Only Live Once."`}
              </p>
            </blockquote>

            <p>
              There is so much beauty in this world we live in, so many things to see and do.
              Get out there, take a walk, find something you love to do and enjoy life. Don't let
              fear or doubt hold you back. Tomorrow is not guaranteed - make the most of today.
            </p>
          </section>

          <section className="about-section">
            <h2>Join Our Community</h2>
            <p>
              ELYOLO is more than just a brand - it's a community of people who support each other,
              share their stories, and inspire one another to live their best lives. Whether you're
              facing challenges with epilepsy, mental health, physical disabilities, or just life's
              everyday struggles, you're not alone.
            </p>

            <div className="community-cta">
              <p>Be part of something bigger. Share your story. Inspire others.</p>
              <div className="cta-buttons">
                <a href="/blog" className="btn">Read Stories</a>
                <a href="/contact" className="btn btn-outline">Share Yours</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
