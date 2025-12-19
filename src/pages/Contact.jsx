import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, show alert
    // When deployed, this will send email
    alert(`
Thank you for reaching out!

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

We'll get back to you at ${formData.email} as soon as possible!
    `);

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="section-title">Get In Touch</h1>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>
              Have questions, want to share your story, or interested in custom products?
              We'd love to hear from you!
            </p>

            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:elyoloinfo@gmail.com">elyoloinfo@gmail.com</a>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <h3>Social Media</h3>
                  <p>Follow us on Instagram: @myelyolo</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <h3>Response Time</h3>
                  <p>We typically respond within 24-48 hours</p>
                </div>
              </div>
            </div>

            <div className="social-connect">
              <h3>Connect With Us</h3>
              <div className="social-buttons">
                <a href="https://youtube.com" className="social-btn">▶️ YouTube</a>
                <a href="https://instagram.com" className="social-btn">📷 Instagram</a>
                <a href="https://facebook.com" className="social-btn">📘 Facebook</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="story">Share My Story</option>
                <option value="custom">Custom Shirt Request</option>
                <option value="order">Order Question</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="8"
                required
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
