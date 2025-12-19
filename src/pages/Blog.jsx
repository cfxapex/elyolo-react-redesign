import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './Blog.css';

export default function Blog() {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="container">
          <h1 className="section-title">WARRIOR STORIES</h1>
          <p className="blog-intro">
            <strong>REAL PEOPLE. REAL STRUGGLES. REAL VICTORIES.</strong><br/>
            These are stories from fighters who've been through hell and came out stronger.
            No filters. No BS. Just raw truth.
          </p>
          <Link to="/submit-story" className="btn cta-btn">
            🔥 SHARE YOUR STORY
          </Link>
        </div>
      </div>

      <div className="blog-feed">
        <div className="container-narrow">
          {blogPosts.map((post, index) => (
            <article key={post.id} className="blog-post-item">
              <div className="post-meta-bar">
                <span className="post-category">{post.category}</span>
                <span className="post-date">{formatDate(post.date)}</span>
              </div>

              <Link to={`/blog/${post.id}`} className="post-link">
                <h2 className="post-title">{post.title}</h2>
              </Link>

              <div className="post-author">
                <span className="author-icon">✍️</span>
                <span>by {post.author}</span>
              </div>

              <p className="post-excerpt">{post.excerpt}</p>

              <div className="post-actions">
                <Link to={`/blog/${post.id}`} className="read-more-link">
                  READ FULL STORY →
                </Link>
                <div className="post-engagement">
                  <span>💬 Share</span>
                  <span>🔥 Inspire</span>
                </div>
              </div>

              {index < blogPosts.length - 1 && <div className="post-divider"></div>}
            </article>
          ))}
        </div>
      </div>

      <div className="blog-footer-cta">
        <div className="container">
          <h2>GOT A STORY TO TELL?</h2>
          <p>Your experience could be the push someone else needs to keep fighting.<br/>
          Don't hold back. Share your truth.</p>
          <Link to="/submit-story" className="btn btn-outline">
            SUBMIT YOUR STORY
          </Link>
        </div>
      </div>
    </div>
  );
}
