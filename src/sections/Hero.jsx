import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import './Hero.css';

export default function Hero({ whatsappNumber }) {
  const handleContactClick = () => {
    const text = encodeURIComponent("Olá Inova! Gostaria de fazer um orçamento de móveis planejados.");
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handleNavClick = (sectionId) => {
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
  };

  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-grid">
          
          {/* Left Text Column */}
          <div className="hero-content">
            <span className="hero-badge">Alta Marcenaria & Design</span>
            <h1 className="hero-title">
              Móveis planejados que transformam <span>ambientes</span>
            </h1>
            <p className="hero-desc">
              Cozinhas, closets, banheiros e escritórios planejados sob medida, com design sofisticado, ferragens premium e durabilidade garantida.
            </p>
            <div className="hero-buttons">
              <button onClick={handleContactClick} className="btn btn-whatsapp">
                <MessageSquare size={18} />
                Solicitar Orçamento
              </button>
              <button onClick={() => handleNavClick('projetos')} className="btn btn-outline">
                Ver Projetos
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="hero-image-wrapper">
            <div className="hero-image-bg"></div>
            <img 
              src="/uploads/kitchen_modern.png" 
              alt="Cozinha Planejada Inova" 
              className="hero-image"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
