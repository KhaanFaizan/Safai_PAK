import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext)!;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name} ({user?.role})</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default DashboardPage;
