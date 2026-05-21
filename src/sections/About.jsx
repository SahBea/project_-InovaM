import React from 'react';
import './About.css';

export default function About({ about }) {
  if (!about) return null;

  return (
    <section className="about section-padding" id="historia">
      <div className="container">
        <div className="about-grid">
          
          {/* Left Image Column */}
          <div className="about-image-wrapper">
            <div className="about-image-bg"></div>
            <img 
              src="/uploads/bedroom_wardrobe.png" 
              alt="Marcenaria Inova Closet" 
              className="about-image"
            />
          </div>

          {/* Right Text Content Column */}
          <div className="about-content">
            <h2 className="about-title">{about.title}</h2>
            <p className="about-subtitle">{about.subtitle}</p>
            
            <div className="about-paragraphs">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Stats list */}
            <div className="about-stats">
              {about.stats.map((stat, idx) => (
                <div key={idx} className="about-stat-item">
                  <div className="about-stat-value">{stat.value}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
