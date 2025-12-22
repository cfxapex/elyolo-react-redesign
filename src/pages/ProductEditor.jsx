
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const ProductEditor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'apparel',
        image: '👕', // Default placeholder
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate inputs
            if (!formData.name || !formData.price) throw new Error("Name and Price are required");

            const { error: insertError } = await supabase
                .from('products')
                .insert([{
                    ...formData,
                    price: parseFloat(formData.price)
                }]);

            if (insertError) throw insertError;

            alert('Product created successfully!');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Error adding product:', err);
            // For now, since table likely doesn't exist, we might get an error.
            // We will show a friendly message or mock success if in dev mode without keys.
            setError(err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <h1 style={{ textAlign: 'center' }}>Add New Product</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="apparel">Apparel</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Saving...' : 'Create Product'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard')}
                        style={{
                            width: '100%', marginTop: '0.5rem', padding: '0.75rem',
                            background: 'transparent', border: 'none', color: '#666', cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditor;
