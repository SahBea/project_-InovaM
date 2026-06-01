import React from 'react';
import { Phone, Mail, MapPin, Clock, Lock, Unlock, Link } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

export default function Footer({ setView, isAdmin }) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (sectionId) => {
    setView('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
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
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <Logo light={true} />
            <p className="footer-tagline">
              MÃ³veis planejados sob medida com acabamento de alto padrÃ£o, transformando ambientes e realizando o sonho da casa perfeita.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="footer-heading">NavegaÃ§Ã£o</h3>
            <ul className="footer-links">
              <li>
                <span className="footer-link" onClick={() => handleNavClick('inicio')}>
                  InÃ­cio
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => handleNavClick('historia')}>
                  HistÃ³ria
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => handleNavClick('projetos')}>
                  Projetos
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => handleNavClick('simulador')}>
                  Simulador
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => handleNavClick('materiais')}>
                  Materiais
                </span>
              </li>
              <li>
                <span className="footer-link" onClick={() => handleNavClick('contato')}>
                  Contato
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="footer-heading">Contato e EndereÃ§o</h3>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={18} />
                <span>Av. Principal da Marcenaria, 1000 - Centro, SÃ£o Paulo - SP</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={18} />
                <span>(11) 99999-9999</span>
              </li>
              <li className="footer-contact-item">
                <Mail size={18} />
                <span>contato@inovamoveis.com.br</span>
              </li>
              <li className="footer-contact-item">
                <Link size={18} />
                <a href="https://instagram.com/_moveisinova" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  @_moveisinova
                </a>
              </li>
              <li className="footer-contact-item">
                <Clock size={18} />
                <span>Seg - Sex: 08:00 Ã s 18:00<br />SÃ¡b: 08:00 Ã s 13:00</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Inova MÃ³veis Planejados. Todos os direitos reservados.</p>
          
          {/* Subtle Admin Entrance */}
          <button 
            className="admin-lock-btn" 
            onClick={() => setView('admin')}
            title="Acesso Administrativo"
          >
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
          </button>
        </div>
      </div>
    </footer>
  );
}
