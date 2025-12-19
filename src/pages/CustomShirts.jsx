import { useState } from 'react';
import './CustomShirts.css';

export default function CustomShirts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    customText: '',
    shirtColor: '',
    size: '',
    quantity: 1,
    instructions: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just show alert
    // When you deploy, this will send to your email or database
    alert(`
Custom Shirt Request Received!

Name: ${formData.name}
Email: ${formData.email}
Custom Text: "${formData.customText}"
Shirt Color: ${formData.shirtColor}
Size: ${formData.size}
Quantity: ${formData.quantity}
Special Instructions: ${formData.instructions || 'None'}

We'll contact you at ${formData.email} with a quote!
    `);

    // Reset form
    setFormData({
      name: '',
      email: '',
      customText: '',
      shirtColor: '',
      size: '',
      quantity: 1,
      instructions: ''
    });
  };

  return (
    <div className="custom-shirts-page">
      <div className="container">
        <h1 className="section-title">Request Custom Shirt</h1>

        <div className="custom-content">
          <div className="custom-info">
            <h2>Create Your Unique Design</h2>
            <p>
              Want a shirt with your own custom text or message? We can help bring your vision to life!
              Fill out the form with your specifications and we'll get back to you with a quote.
            </p>

            <div className="info-features">
              <div className="feature">
                <span className="feature-icon">✍️</span>
                <div>
                  <h3>Custom Text</h3>
                  <p>Any message, quote, or design you want</p>
                </div>
              </div>

              <div className="feature">
                <span className="feature-icon">🎨</span>
                <div>
                  <h3>Multiple Colors</h3>
                  <p>Choose from various shirt colors</p>
                </div>
              </div>

              <div className="feature">
                <span className="feature-icon">📏</span>
                <div>
                  <h3>All Sizes</h3>
                  <p>XS through XXL available</p>
                </div>
              </div>

              <div className="feature">
                <span className="feature-icon">💯</span>
                <div>
                  <h3>Quality Guarantee</h3>
                  <p>Premium materials and printing</p>
                </div>
              </div>
            </div>
          </div>

          <form className="custom-form" onSubmit={handleSubmit}>
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
              <label htmlFor="customText">Custom Text *</label>
              <input
                type="text"
                id="customText"
                name="customText"
                placeholder="What text do you want on your shirt?"
                value={formData.customText}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shirtColor">Shirt Color *</label>
              <select
                id="shirtColor"
                name="shirtColor"
                value={formData.shirtColor}
                onChange={handleChange}
                required
              >
                <option value="">Select a color</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="navy">Navy Blue</option>
                <option value="gray">Gray</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="size">Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Select a size</option>
                <option value="xs">XS</option>
                <option value="s">S</option>
                <option value="m">M</option>
                <option value="l">L</option>
                <option value="xl">XL</option>
                <option value="xxl">XXL</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Special Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                placeholder="Any special requests, font preferences, placement details, etc."
                value={formData.instructions}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
