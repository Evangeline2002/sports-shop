import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import AdminLayout from './layouts/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AdminLayout>
          <Navbar />
          <Sidebar />
          <AppRoutes />
        </AdminLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;