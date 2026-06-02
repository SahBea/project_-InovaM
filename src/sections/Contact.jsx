import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import InstagramIcon from "../components/InstagramIcon";
import './Contact.css';

export default function Contact({ whatsappNumber }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    room: 'cozinha',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate sending to database
    console.log('Contact form submitted:', formData);
    setSubmitted(true);

    // Optional: Auto redirect to WhatsApp with form data
    const roomLabels = { cozinha: 'Cozinha', quarto: 'Dormitório', banheiro: 'Banheiro', sala: 'Sala', outro: 'Outros' };
    const text = encodeURIComponent(
      `Olá Inova! Preenchi o formulário de contato do site:\n\n` +
      `• *Nome:* ${formData.name}\n` +
      `• *Telefone:* ${formData.phone}\n` +
      `• *E-mail:* ${formData.email}\n` +
      `• *Interesse:* ${roomLabels[formData.room]}\n` +
      `• *Mensagem:* ${formData.message}`
    );
    
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
      // Reset form
      setFormData({ name: '', phone: '', email: '', room: 'cozinha', message: '' });
      setSubmitted(false);
    }, 1500);
  };

  return (
    <section className="contact section-padding" id="contato">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span>Fale Conosco</span>
          <h2>Agende uma Visita</h2>
          <p>
            Pronto para começar seu projeto de móveis planejados? Envie uma mensagem pelo formulário ou entre em contato direto pelo WhatsApp.
          </p>
        </div>

        <div className="contact-grid">
          
          {/* Left Column: Contact details & Map */}
          <div className="contact-info-panel">
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>
                Informações de Contato
              </h3>
              
              <div className="contact-detail-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px', borderRadius: '50%' }}>
                    <Phone size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ligue ou chame no WhatsApp</div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>(11) 99999-9999</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px', borderRadius: '50%' }}>
                    <Mail size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>E-mail para contatos</div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>contato@inovamoveis.com.br</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px', borderRadius: '50%' }}>
                    <InstagramIcon size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instagram</div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>
                      <a href="https://instagram.com/_moveisinova" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        @_moveisinova
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px', borderRadius: '50%' }}>
                    <MapPin size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nosso Showroom</div>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>R. Carlos de Campos, 299 - Vila Boa Vista, Barueri - SP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map representation (Standard mock map iframe or OpenStreetMap) */}
            <div className="contact-map-wrapper">
              <iframe 
                title="Localização da Marcenaria Inova"
                src="https://maps.google.com/maps?q=R.%20Carlos%20de%20Campos,%20299%20-%20Vila%20Boa%20Vista,%20Barueri%20-%20SP,%2006411-210&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card contact-form-panel">
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '24px' }}>
              Envie sua Mensagem
            </h3>

            {submitted && (
              <div className="submit-success-box">
                <CheckCircle size={20} />
                <span>Mensagem enviada com sucesso! Redirecionando para o WhatsApp...</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Seu Nome *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="form-control" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="grid-2" style={{ gap: '20px', marginBottom: '0px' }}>
                <div className="form-group">
                  <label htmlFor="phone">Seu Telefone/WhatsApp *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    className="form-control" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Seu E-mail *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="form-control" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: joao@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="room">Ambiente de Interesse</label>
                <select 
                  id="room" 
                  name="room" 
                  className="form-control" 
                  value={formData.room}
                  onChange={handleChange}
                >
                  <option value="cozinha">Cozinha</option>
                  <option value="quarto">Dormitório</option>
                  <option value="banheiro">Banheiro</option>
                  <option value="sala">Sala de Estar</option>
                  <option value="outro">Outros / Comercial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Fale um pouco sobre o seu projeto (opcional)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-control" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ex: Gostaria de planejar os armários da minha cozinha em formato L."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px 20px' }}
                disabled={submitted}
              >
                <Send size={18} />
                Enviar Mensagem
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
