import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Materials from './sections/Materials';
import Contact from './sections/Contact';

// Interactive Components
import BudgetSimulator from './components/BudgetSimulator';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

// Data
import contentData from './data/content.json';

export default function App() {
  const [view, setView] = useState('home');
  const [data, setData] = useState(contentData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load content dynamically from backend API on mount
  useEffect(() => {
    const loadContentData = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const freshData = await response.json();
          setData(freshData);
        }
      } catch (err) {
        console.warn('Backend server not reachable, using bundled contentData fallback:', err);
      }
    };
    loadContentData();
  }, []);

  // Check login state and dark mode preference on load
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAdmin(true);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAdmin(false);
    setView('home');
  };

  const handleDataUpdate = (newData) => {
    setData(newData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Universal Floating Header */}
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        view={view} 
        setView={setView} 
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {view === 'home' ? (
          <>
            <Hero whatsappNumber={data.whatsappNumber} />
            <About about={data.about} />
            <Projects projects={data.projects} whatsappNumber={data.whatsappNumber} />
            
            {/* Interactive Simulator Section */}
            <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
              <div className="container">
                <BudgetSimulator whatsappNumber={data.whatsappNumber} />
              </div>
            </section>

            <Materials materials={data.materials} />
            <Contact whatsappNumber={data.whatsappNumber} />
          </>
        ) : (
          /* Admin View */
          isAdmin ? (
            <AdminDashboard 
              initialData={data} 
              onDataUpdate={handleDataUpdate}
            />
          ) : (
            <AdminLogin 
              onLoginSuccess={handleLoginSuccess}
            />
          )
        )}
      </main>

      {/* Universal Footer */}
      {view === 'home' && (
        <Footer setView={setView} isAdmin={isAdmin} />
      )}
    </div>
  );
}
