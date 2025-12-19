import { useState } from 'react';
import './SubmitStory.css';

export default function SubmitStory() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    category: '',
    story: '',
    anonymous: false,
    consent: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert('Please agree to the terms before submitting.');
      return;
    }

    // For now, show alert
    // When deployed, this will save to database or send email
    alert(`
🔥 STORY SUBMITTED! 🔥

Title: "${formData.title}"
Category: ${formData.category}
By: ${formData.anonymous ? 'Anonymous' : formData.name}

Your story will be reviewed and published soon.
We'll contact you at: ${formData.email}

Thank you for sharing your journey and inspiring others!
    `);

    setFormData({
      name: '',
      email: '',
      title: '',
      category: '',
      story: '',
      anonymous: false,
      consent: false
    });
  };

  return (
    <div className="submit-story-page">
      <div className="container">
        <h1 className="section-title">SHARE YOUR STORY</h1>

        <div className="page-intro">
          <p className="intro-text">
            <strong>YOUR STORY MATTERS.</strong> Have you overcome adversity? Battled through hardship?
            Found strength you didn't know you had? <strong>SHARE IT.</strong>
          </p>
          <p className="intro-text">
            Your experience could be the light someone else needs to keep going.
            This is a space for <strong>REAL STORIES</strong> from <strong>REAL PEOPLE</strong>.
            No BS. Just raw truth.
          </p>
        </div>

        <div class="submit-grid">
          {/* Why Share Section */}
          <div className="why-share">
            <h2>WHY SHARE?</h2>

            <div className="reason-card">
              <span className="reason-icon">💪</span>
              <div>
                <h3>Inspire Others</h3>
                <p>Your struggle could be someone else's motivation to keep fighting</p>
              </div>
            </div>

            <div className="reason-card">
              <span className="reason-icon">🔥</span>
              <div>
                <h3>Own Your Story</h3>
                <p>Transform your pain into power by sharing what you've overcome</p>
              </div>
            </div>

            <div className="reason-card">
              <span className="reason-icon">🤝</span>
              <div>
                <h3>Build Community</h3>
                <p>Connect with others who understand what you've been through</p>
              </div>
            </div>

            <div className="reason-card">
              <span className="reason-icon">⚡</span>
              <div>
                <h3>Break the Silence</h3>
                <p>End the stigma. Your voice matters. Your story deserves to be heard.</p>
              </div>
            </div>

            <div className="privacy-note">
              <h4>🔒 PRIVACY FIRST</h4>
              <ul>
                <li>Choose to post anonymously if you prefer</li>
                <li>We review all submissions before publishing</li>
                <li>You maintain rights to your story</li>
                <li>We'll never share your email</li>
              </ul>
            </div>
          </div>

          {/* Submission Form */}
          <form className="story-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="First name or full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address * <span className="label-note">(kept private)</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                />
                <span>Post anonymously (your name won't be shown)</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="title">Story Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Give your story a powerful title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Choose what your story is about</option>
                <option value="overcoming-disability">Overcoming Disability</option>
                <option value="mental-health">Mental Health Journey</option>
                <option value="epilepsy">Living with Epilepsy</option>
                <option value="addiction-recovery">Addiction & Recovery</option>
                <option value="chronic-illness">Chronic Illness</option>
                <option value="trauma-healing">Trauma & Healing</option>
                <option value="finding-purpose">Finding Purpose</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="story">Your Story *</label>
              <p className="field-help">
                Share your journey. What did you go through? What helped you overcome it?
                What would you tell someone facing the same challenge?
              </p>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleChange}
                required
                rows="12"
                placeholder="Tell your story here... Be honest. Be real. Be you."
              />
              <div className="char-count">
                {formData.story.length} characters
                {formData.story.length < 200 && ' (minimum 200 recommended)'}
              </div>
            </div>

            <div className="form-group checkbox-group consent-group">
              <label>
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to have my story published on ELYOLO and understand it may inspire others.
                  I maintain rights to my story and can request removal at any time.
                </span>
              </label>
            </div>

            <button type="submit" className="btn submit-btn">
              🔥 SUBMIT YOUR STORY 🔥
            </button>

            <p className="submit-note">
              After submitting, we'll review your story (usually within 48 hours) and contact you via email.
            </p>
          </form>
        </div>

        {/* Recent Stories Teaser */}
        <div className="recent-stories-cta">
          <h2>READ OTHER WARRIORS' STORIES</h2>
          <p>See how others have overcome their battles and found their strength</p>
          <a href="/blog" className="btn btn-outline">Browse Community Stories</a>
        </div>
      </div>
    </div>
  );
}
