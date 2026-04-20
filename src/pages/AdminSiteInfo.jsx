import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/forms.css';

const DEFAULT_INFO = {
  contact_email: 'elyoloinfo@gmail.com',
  instagram_handle: '@myelyolo',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  youtube_url: 'https://youtube.com',
  about_mission: '',
  about_philosophy_quote: ''
};

export default function AdminSiteInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(DEFAULT_INFO);

  const canUseSupabase = useMemo(() => {
    return typeof supabase?.from === 'function';
  }, []);

  useEffect(() => {
    const load = async () => {
      setInitialLoading(true);
      setError('');
      try {
        if (!canUseSupabase) return;

        const { data, error: fetchError } = await supabase
          .from('site_info')
          .select('*')
          .eq('id', 1)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116: "Results contain 0 rows" in many setups
          throw fetchError;
        }

        setFormData({ ...DEFAULT_INFO, ...(data ?? {}) });
      } catch (err) {
        setError(err?.message || 'Failed to load site info');
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, [canUseSupabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, id: 1, updated_at: new Date().toISOString() };

      const { error: upsertError } = await supabase
        .from('site_info')
        .upsert(payload, { onConflict: 'id' });

      if (upsertError) throw upsertError;
      alert('Site info saved!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to save site info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '900px', textAlign: 'left' }}>
        <h1 style={{ textAlign: 'center' }}>Edit Site Info</h1>

        {!canUseSupabase && (
          <div className="error-message">
            Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable this.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {initialLoading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>Loading…</div>
        ) : (
          <form onSubmit={handleSave}>
            <h3 style={{ marginTop: 0 }}>Contact</h3>
            <div className="form-group">
              <label>Email</label>
              <input name="contact_email" value={formData.contact_email} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Instagram Handle</label>
                <input name="instagram_handle" value={formData.instagram_handle} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Instagram URL</label>
                <input name="instagram_url" value={formData.instagram_url} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>YouTube URL</label>
                <input name="youtube_url" value={formData.youtube_url} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Facebook URL</label>
                <input name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Other (optional)</label>
                <input name="other_url" value={formData.other_url ?? ''} onChange={handleChange} />
              </div>
            </div>

            <h3>About</h3>
            <div className="form-group">
              <label>Mission (override text)</label>
              <textarea
                name="about_mission"
                value={formData.about_mission}
                onChange={handleChange}
                rows="4"
                placeholder="Optional: paste mission text shown on About page"
              />
            </div>
            <div className="form-group">
              <label>Philosophy Quote (optional)</label>
              <input
                name="about_philosophy_quote"
                value={formData.about_philosophy_quote}
                onChange={handleChange}
                placeholder='e.g. "You attract the energy..."'
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : 'Save'}
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
        )}
      </div>
    </div>
  );
}

