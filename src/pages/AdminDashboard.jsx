
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <div className="dashboard-container">
            <div className="login-card" style={{ maxWidth: '600px' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user?.email}</p>

                <div style={{ display: 'grid', gap: '1rem', margin: '2rem 0' }}>
                    <Link to="/admin/products/new" className="btn-primary" style={{ textDecoration: 'none', display: 'block' }}>
                        Add New Product
                    </Link>

                    <Link to="/admin/blog/new" className="btn-primary" style={{ textDecoration: 'none', display: 'block', backgroundColor: '#333' }}>
                        Add New Blog Post
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn-primary"
                    style={{ backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc' }}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
