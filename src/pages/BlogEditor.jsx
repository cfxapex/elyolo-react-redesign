
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/forms.css';

const BlogEditor = () => {
    const navigate = useNavigate();
  const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(Boolean(id));

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Inspiration',
        image: '✍️',
        author: 'ELYOLO Team'
    });

  const isEdit = useMemo(() => Boolean(id), [id]);

  useEffect(() => {
    const loadExisting = async () => {
      if (!id) return;
      setInitialLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setFormData({
            title: data.title ?? '',
            excerpt: data.excerpt ?? '',
            content: data.content ?? '',
            category: data.category ?? 'Inspiration',
            image: data.image ?? '✍️',
            author: data.author ?? 'ELYOLO Team'
          });
        }
      } catch (err) {
        setError(err?.message || 'Failed to load post');
      } finally {
        setInitialLoading(false);
      }
    };

    loadExisting();
  }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.title || !formData.content) throw new Error("Title and Content are required");

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            ...formData
          })
          .eq('id', id);

        if (updateError) throw updateError;
        alert('Blog Post updated successfully!');
        navigate('/admin/blog');
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([{
            ...formData,
            date: new Date().toISOString().split('T')[0]
          }]);

        if (insertError) throw insertError;

        alert('Blog Post published successfully!');
        navigate('/admin/blog');
      }
        } catch (err) {
            console.error('Error adding post:', err);
            setError(err.message || 'Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 style={{ textAlign: 'center' }}>{isEdit ? 'Edit Blog Post' : 'Write Blog Post'}</h1>

                {error && <div className="error-message">{error}</div>}

        {initialLoading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>Loading…</div>
        ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Excerpt (Short summary)</label>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" />
                    </div>

                    <div className="form-group">
                        <label>Content (HTML/Text)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            placeholder="<p>Write your amazing story here...</p>"
                            style={{ fontFamily: 'monospace' }}
                        />
                        <small style={{ color: '#666' }}>Tip: You can use HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;.</small>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (isEdit ? 'Saving...' : 'Publishing...') : (isEdit ? 'Save Changes' : 'Publish Post')}
                    </button>
                    <button
                        type="button"
            onClick={() => navigate(isEdit ? '/admin/blog' : '/admin/blog')}
                        style={{
                            width: '100%', marginTop: '0.5rem', padding: '0.75rem',
                            background: 'transparent', border: 'none', color: '#666', cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </form>
        )}
            </div>
        </div>
    );
};

export default BlogEditor;
