import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/forms.css';

export default function AdminBlogManager() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canUseSupabase = useMemo(() => {
    return typeof supabase?.from === 'function';
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (!canUseSupabase) {
        setPosts([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data ?? []);
    } catch (err) {
      setError(err?.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this blog post? This cannot be undone.');
    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      alert(err?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="login-card" style={{ maxWidth: '900px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Blog Manager</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/admin/blog/new" className="btn-primary" style={{ textDecoration: 'none' }}>
              New Post
            </Link>
            <button
              className="btn-primary"
              style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc' }}
              onClick={() => navigate('/admin/dashboard')}
            >
              Back
            </button>
          </div>
        </div>

        {!canUseSupabase && (
          <div className="error-message" style={{ marginTop: '1rem' }}>
            Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable blog management.
          </div>
        )}

        {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}

        {loading ? (
          <div style={{ marginTop: '1rem' }}>Loading…</div>
        ) : posts.length === 0 ? (
          <div style={{ marginTop: '1rem', color: '#666' }}>
            No posts yet. Create one with “New Post”.
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
            {posts.map((p) => (
              <div
                key={p.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {p.category} • {p.date} • {p.author}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/admin/blog/${p.id}/edit`}
                    className="btn-primary"
                    style={{ textDecoration: 'none', backgroundColor: '#333' }}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn-primary"
                    style={{ backgroundColor: 'transparent', color: '#a00', border: '1px solid #a00' }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

