import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Sliders, Lock, LogOut } from 'lucide-react';
import Logo from './Logo';
import './Header.css';

export default function Header({ 
  darkMode, 
  toggleDarkMode, 
  view, 
  setView, 
  isAdmin, 
  onLogout 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    setView('home');
    
    // Allow state change to render home page first, then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // height of header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <header className={`header glass-nav ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => handleNavClick('inicio')}>
          <Logo height={scrolled ? 38 : 45} />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('inicio')}>
                Início
              </span>
            </li>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('historia')}>
                História
              </span>
            </li>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('projetos')}>
                Projetos
              </span>
            </li>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('simulador')}>
                Simulador
              </span>
            </li>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('materiais')}>
                Materiais
              </span>
            </li>
            <li>
              <span className="nav-link" onClick={() => handleNavClick('contato')}>
                Contato
              </span>
            </li>
            
            {/* Direct Admin Access Link for Mobile if Logged In */}
            {isAdmin && mobileMenuOpen && (
              <li>
                <span className="nav-link" onClick={() => { setView('admin'); setMobileMenuOpen(false); }} style={{ color: 'var(--accent-dark)' }}>
                  Painel Administrativo
                </span>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Admin Badges */}
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setView(view === 'admin' ? 'home' : 'admin')} 
                className="admin-badge"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <Sliders size={14} />
                {view === 'admin' ? 'Ver Site' : 'Painel Adm'}
              </button>
              <button 
                onClick={onLogout} 
                className="theme-toggle" 
                title="Sair do Painel"
                style={{ color: '#ef4444' }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            view === 'admin' && (
              <button 
                onClick={() => setView('home')} 
                className="btn btn-outline"
                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
              >
                Voltar ao Site
              </button>
            )
          )}

          {/* Theme Switcher */}
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Burger Menu Button */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
