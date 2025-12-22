import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts as localPosts } from '../data/blogPosts';
import { supabase } from '../lib/supabaseClient';
import './BlogPost.css';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      // 1. Try local find first
      const local = localPosts.find(p => p.id == id);
      if (local) {
        setPost(local);
        setLoading(false);
        return;
      }

      // 2. Try Supabase
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>Loading...</div>;

  if (!post) {
    return <Navigate to="/blog" />;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-post-page">
      <div className="container">
        <Link to="/blog" className="back-link">← Back to Blog</Link>

        <article className="blog-post">
          <header className="post-header">
            <span className="post-category">{post.category}</span>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </header>

          <div className="post-image">
            <div className="placeholder-img">{post.image}</div>
          </div>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="post-footer">
            <div className="share-section">
              <p>Share this story:</p>
              <div className="share-buttons">
                <button className="share-btn">📘 Facebook</button>
                <button className="share-btn">🐦 Twitter</button>
                <button className="share-btn">📧 Email</button>
              </div>
            </div>
          </footer>
        </article>

        <div className="related-cta">
          <h2>Inspired?</h2>
          <p>Share your own story or browse more inspiring content</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn">Share Your Story</Link>
            <Link to="/blog" className="btn btn-outline">Read More Stories</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
