import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import './Projects.css';

export default function Projects({ projects, whatsappNumber }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'cozinha', label: 'Cozinhas' },
    { id: 'quarto', label: 'Dormitórios' },
    { id: 'banheiro', label: 'Banheiros' },
    { id: 'sala', label: 'Salas' },
    { id: 'corporativo', label: 'Corporativo' }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const getCategoryLabel = (cat) => {
    const found = filters.find(f => f.id === cat);
    return found ? found.label : cat;
  };

  const handleConsultClick = (project) => {
    const text = encodeURIComponent(`Olá Inova! Gostaria de tirar dúvidas e consultar sobre o projeto do portfólio: "${project.title}".`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section className="projects section-padding" id="projetos">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span>Nosso Portfólio</span>
          <h2>Projetos Executados</h2>
          <p>
            Inspire-se com alguns de nossos trabalhos entregues. Cada móvel é planejado de forma personalizada, aliando design premium com excelência na montagem.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-image-wrapper">
                <span className="project-category-tag">
                  {getCategoryLabel(project.category)}
                </span>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'; }}
                />
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-short-desc">
                  {project.description.length > 90 
                    ? `${project.description.substring(0, 90)}...` 
                    : project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedProject && (
          <div className="lightbox-overlay" onClick={() => setSelectedProject(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="lightbox-close-btn" 
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>
              
              {/* Left Column (Image) */}
              <div className="lightbox-image-side">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'; }}
                />
              </div>

              {/* Right Column (Info) */}
              <div className="lightbox-info-side">
                <span className="lightbox-category">
                  {getCategoryLabel(selectedProject.category)}
                </span>
                <h3 className="lightbox-title">{selectedProject.title}</h3>
                <p className="lightbox-desc">{selectedProject.description}</p>
                
                <button 
                  className="btn btn-whatsapp" 
                  onClick={() => handleConsultClick(selectedProject)}
                >
                  <MessageSquare size={18} />
                  Gostei! Perguntar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
