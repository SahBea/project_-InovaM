import React from 'react';
import './Materials.css';

export default function Materials({ materials }) {
  if (!materials) return null;

  return (
    <section className="materials section-padding" id="materiais">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span>Qualidade & Tecnologia</span>
          <h2>Materiais & Acabamentos</h2>
          <p>
            Trabalhamos exclusivamente com fornecedores parceiros que entregam o melhor em tecnologia de painéis de MDF e sistemas inteligentes de ferragens.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="materials-grid">
          {materials.map(material => (
            <div key={material.id} className="card material-card">
              <div className="material-meta">
                <span className="material-category">{material.category}</span>
                {material.tag && (
                  <span className="material-tag">{material.tag}</span>
                )}
              </div>
              <h3 className="material-name">{material.name}</h3>
              <p className="material-desc">{material.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
