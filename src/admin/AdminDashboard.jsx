import React, { useState } from 'react';
import { 
  Save, Plus, Trash2, Edit, Upload, X, Globe, PhoneCall, Info, LayoutList, Layers 
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard({ initialData, onDataUpdate }) {
  const [activeTab, setActiveTab] = useState('general');
  const [content, setContent] = useState(initialData);
  
  // Status hooks
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Project Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: 'cozinha',
    image: '',
    description: ''
  });

  const getAuthToken = () => {
    return sessionStorage.getItem('admin_token') || '';
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAboutChange = (e, index, field) => {
    const value = e.target.value;
    setContent(prev => {
      const updatedAbout = { ...prev.about };
      if (field === 'paragraphs') {
        const updatedParas = [...updatedAbout.paragraphs];
        updatedParas[index] = value;
        updatedAbout.paragraphs = updatedParas;
      } else if (field === 'stats') {
        const updatedStats = [...updatedAbout.stats];
        updatedStats[index] = { ...updatedStats[index], [e.target.name]: value };
        updatedAbout.stats = updatedStats;
      } else {
        updatedAbout[field] = value;
      }
      return { ...prev, about: updatedAbout };
    });
  };

  const handleMaterialChange = (e, index, field) => {
    const value = e.target.value;
    setContent(prev => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
      return { ...prev, materials: updatedMaterials };
    });
  };

  // Open modal to add or edit project
  const openProjectModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setProjectForm(project);
    } else {
      setEditingProject(null);
      setProjectForm({
        id: `proj-${Date.now()}`,
        title: '',
        category: 'cozinha',
        image: '',
        description: ''
      });
    }
    setProjectModalOpen(true);
  };

  // Handle project form text changes
  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  // Image upload handling for projects via backend API
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = getAuthToken();
    if (!token) {
      alert('Sessão expirada ou inválida. Por favor, faça login novamente.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        setUploadingImage(true);
        const base64Content = reader.result.split(',')[1];
        
        const response = await fetch('/api/content/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: file.name,
            base64Content: base64Content
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro no upload da imagem.');
        }

        setProjectForm(prev => ({ ...prev, image: data.url }));
        if (data.warning) {
          alert(`Imagem salva localmente mas não enviada ao GitHub: ${data.warning}`);
        } else {
          alert('Imagem enviada com sucesso!');
        }
      } catch (err) {
        console.error(err);
        alert(`Falha no upload da imagem: ${err.message}`);
      } finally {
        setUploadingImage(false);
      }
    };
  };

  // Save project in local state list
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      alert('Preencha o título e a descrição do projeto.');
      return;
    }

    setContent(prev => {
      const updatedProjects = [...prev.projects];
      if (editingProject) {
        // Edit existing
        const idx = updatedProjects.findIndex(p => p.id === projectForm.id);
        if (idx !== -1) updatedProjects[idx] = projectForm;
      } else {
        // Add new
        updatedProjects.push(projectForm);
      }
      return { ...prev, projects: updatedProjects };
    });

    setProjectModalOpen(false);
  };

  // Delete project from list
  const handleDeleteProject = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este projeto?')) {
      setContent(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      }));
    }
  };

  // Save the entire state back via the Express server API
  const handleCommitAll = async () => {
    const token = getAuthToken();
    if (!token) {
      setSaveStatus({ success: false, message: 'Erro: Sessão de administrador não encontrada. Faça o login novamente.' });
      return;
    }

    try {
      setSaving(true);
      setSaveStatus({ success: null, message: '' });

      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar conteúdo.');
      }
      
      // Update the state of parent App
      onDataUpdate(data.content);
      
      if (data.warning) {
        setSaveStatus({ 
          success: true, 
          message: `Alterações salvas localmente com aviso: ${data.warning}` 
        });
      } else {
        setSaveStatus({ 
          success: true, 
          message: 'Alterações salvas e sincronizadas com sucesso!' 
        });
      }
    } catch (error) {
      console.error(error);
      setSaveStatus({ 
        success: false, 
        message: `Falha ao salvar: ${error.message}` 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-dashboard container">
      <div className="admin-header-row">
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Painel de Controle</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie os textos, galeria e informações da marcenaria.</p>
        </div>
        <button 
          onClick={handleCommitAll} 
          className="btn btn-primary"
          disabled={saving}
          style={{ padding: '14px 28px' }}
        >
          {saving ? <div className="spinner"></div> : <Save size={18} />}
          {saving ? 'Salvando...' : 'Salvar Alterações no Site'}
        </button>
      </div>

      {/* Save Status Notification */}
      {saveStatus.message && (
        <div className={`submit-success-box`} style={{ 
          borderColor: saveStatus.success ? '#25D366' : '#EF4444', 
          backgroundColor: saveStatus.success ? 'rgba(37,211,102,0.1)' : 'rgba(239,68,68,0.1)',
          color: saveStatus.success ? '#128C7E' : '#DC2626'
        }}>
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="admin-nav-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <PhoneCall size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'text-bottom' }} />
          Geral & Contato
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'text-bottom' }} />
          Nossa História
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <LayoutList size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'text-bottom' }} />
          Projetos (Galeria)
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <Layers size={16} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'text-bottom' }} />
          Materiais
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* 1. GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="card admin-section-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--primary-dark)' }}>Configurações Gerais</h3>
          <div className="form-group">
            <label htmlFor="companyName">Nome da Marcenaria</label>
            <input 
              type="text" 
              id="companyName" 
              name="companyName" 
              className="form-control"
              value={content.companyName}
              onChange={handleGeneralChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="whatsappNumber">Número do WhatsApp (com código do país/DDD - Apenas números)</label>
            <input 
              type="text" 
              id="whatsappNumber" 
              name="whatsappNumber" 
              className="form-control"
              value={content.whatsappNumber}
              onChange={handleGeneralChange}
              placeholder="Ex: 5511999999999"
            />
          </div>
        </div>
      )}

      {/* 2. ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="card admin-section-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--primary-dark)' }}>Sessão: Nossa História</h3>
          <div className="form-group">
            <label>Título Principal</label>
            <input 
              type="text" 
              className="form-control"
              value={content.about.title}
              onChange={(e) => handleAboutChange(e, null, 'title')}
            />
          </div>
          <div className="form-group">
            <label>Subtítulo</label>
            <input 
              type="text" 
              className="form-control"
              value={content.about.subtitle}
              onChange={(e) => handleAboutChange(e, null, 'subtitle')}
            />
          </div>

          <div style={{ margin: '30px 0 20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ marginBottom: '16px' }}>Parágrafos de Texto</h4>
            {content.about.paragraphs.map((paragraph, idx) => (
              <div className="form-group" key={idx}>
                <label>Parágrafo {idx + 1}</label>
                <textarea 
                  className="form-control"
                  value={paragraph}
                  onChange={(e) => handleAboutChange(e, idx, 'paragraphs')}
                ></textarea>
              </div>
            ))}
          </div>

          <div style={{ margin: '30px 0 10px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ marginBottom: '16px' }}>Números / Estatísticas</h4>
            <div className="stats-edit-grid">
              {content.about.stats.map((stat, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '8px' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label>Valor (ex: 500+)</label>
                    <input 
                      type="text" 
                      name="value"
                      className="form-control" 
                      value={stat.value}
                      onChange={(e) => handleAboutChange(e, idx, 'stats')}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0px' }}>
                    <label>Legenda</label>
                    <input 
                      type="text" 
                      name="label"
                      className="form-control" 
                      value={stat.label}
                      onChange={(e) => handleAboutChange(e, idx, 'stats')}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="card admin-section-card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--primary-dark)', margin: 0 }}>Gerenciar Projetos</h3>
            <button 
              onClick={() => openProjectModal(null)} 
              className="btn btn-outline"
              style={{ padding: '8px 18px', fontSize: '0.85rem', marginLeft: 'auto' }}
            >
              <Plus size={16} />
              Novo Projeto
            </button>
          </div>

          {/* Projects Listing */}
          <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {content.projects.map(project => (
              <div key={project.id} className="admin-project-list-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={project.image} alt={project.title} className="admin-project-thumb" />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text)' }}>{project.title}</h4>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: '600' }}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => openProjectModal(project)} 
                    className="admin-btn-icon-edit"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)} 
                    className="admin-btn-icon-danger"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="card admin-section-card">
          <h3 style={{ marginBottom: '20px', color: 'var(--primary-dark)' }}>Gerenciar Materiais & Acabamentos</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {content.materials.map((material, idx) => (
              <div key={material.id} style={{ padding: '24px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div className="grid-2" style={{ gap: '20px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Nome do Material</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={material.name}
                      onChange={(e) => handleMaterialChange(e, idx, 'name')}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Etiqueta / Destaque (ex: Premium)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={material.tag}
                      onChange={(e) => handleMaterialChange(e, idx, 'tag')}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Descrição Detalhada</label>
                  <textarea 
                    className="form-control"
                    value={material.description}
                    onChange={(e) => handleMaterialChange(e, idx, 'description')}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Modal Form */}
      {projectModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-dark)', margin: 0 }}>
                {editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
              </h3>
              <button 
                onClick={() => setProjectModalOpen(false)} 
                className="admin-btn-icon-danger"
                style={{ float: 'right' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label htmlFor="title">Título do Projeto *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title"
                  className="form-control" 
                  value={projectForm.title}
                  onChange={handleProjectFormChange}
                  placeholder="Ex: Cozinha Planejada Provence"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoria *</label>
                <select 
                  id="category" 
                  name="category"
                  className="form-control" 
                  value={projectForm.category}
                  onChange={handleProjectFormChange}
                  required
                >
                  <option value="cozinha">Cozinhas</option>
                  <option value="quarto">Dormitórios</option>
                  <option value="banheiro">Banheiros</option>
                  <option value="sala">Salas</option>
                  <option value="corporativo">Corporativo</option>
                </select>
              </div>

              {/* Image Upload/Field */}
              <div className="form-group">
                <label htmlFor="image">Imagem do Projeto *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    id="image" 
                    name="image"
                    className="form-control" 
                    value={projectForm.image}
                    onChange={handleProjectFormChange}
                    placeholder="URL ou Caminho da Imagem (/uploads/...)"
                    required
                  />
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      id="upload-file-picker" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor="upload-file-picker" 
                      className="btn btn-outline" 
                      style={{ padding: '12px 20px', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer' }}
                    >
                      {uploadingImage ? <div className="spinner" style={{ borderColor: 'rgba(78,88,74,0.3)', borderTopColor: 'var(--primary)' }}></div> : <Upload size={16} />}
                      {uploadingImage ? 'Enviando...' : 'Enviar Foto'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Preview if exists */}
              {projectForm.image && (
                <div style={{ marginBottom: '20px' }}>
                  <label>Pré-visualização da Imagem:</label>
                  <img 
                    src={projectForm.image} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="description">Descrição do Projeto *</label>
                <textarea 
                  id="description" 
                  name="description"
                  className="form-control" 
                  value={projectForm.description}
                  onChange={handleProjectFormChange}
                  placeholder="Descreva os materiais usados, ferragens e particularidades..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px 20px' }}
              >
                Salvar Projeto na Lista
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Save Reminder */}
      <div className="save-floating-bar">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          *Lembre-se de clicar em salvar para publicar as alterações no Vercel.
        </span>
        <button 
          onClick={handleCommitAll} 
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? <div className="spinner"></div> : <Save size={18} />}
          {saving ? 'Salvando...' : 'Salvar Alterações no Site'}
        </button>
      </div>

    </div>
  );
}
