import React, { useState } from 'react';
import { 
  Home, Bed, Bath, Tv, CheckCircle2, MessageSquare 
} from 'lucide-react';
import './BudgetSimulator.css';

export default function BudgetSimulator({ whatsappNumber }) {
  // Simulator state variables
  const [room, setRoom] = useState('cozinha');
  const [layout, setLayout] = useState('medio');
  const [finish, setFinish] = useState('wood');
  const [hardware, setHardware] = useState('premium');

  // Base Prices for Rooms
  const basePrices = {
    cozinha: 8000,
    quarto: 6500,
    banheiro: 3200,
    sala: 5000
  };

  // Multipliers
  const layoutMultipliers = {
    pequeno: 1.0,  // Linear / Compacto
    medio: 1.5,    // Formato em L / Médio
    grande: 2.2    // Formato em U ou Ilha / Grande
  };

  const finishMultipliers = {
    matte: 1.0,    // MDF Matte Standard
    wood: 1.25,    // MDF Amadeirado Texturizado
    lacquer: 1.6   // Laca Premium Brilhante/Fosca
  };

  const hardwareMultipliers = {
    standard: 1.0,  // Dobradiças com amortecimento padrão
    premium: 1.18,  // Corrediças ocultas com toque (Click)
    highend: 1.35   // Ferragens importadas de alta performance
  };

  // Calculation details
  const basePrice = basePrices[room];
  const layoutFactor = layoutMultipliers[layout];
  const finishFactor = finishMultipliers[finish];
  const hardwareFactor = hardwareMultipliers[hardware];

  const calculatedMin = Math.round(basePrice * layoutFactor * finishFactor * hardwareFactor);
  const calculatedMax = Math.round(calculatedMin * 1.2); // 20% margin for range

  // Formatting currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Details listed on preview card
  const getFeatures = () => {
    const list = [];
    
    if (finish === 'matte') list.push('Acabamento em MDF Ultra Matte com proteção');
    if (finish === 'wood') list.push('Acabamento em MDF Amadeirado com textura natural');
    if (finish === 'lacquer') list.push('Acabamento em Laca premium com selador de alto padrão');

    if (hardware === 'standard') list.push('Dobradiças e corrediças telescópicas com amortecimento');
    if (hardware === 'premium') list.push('Corrediças ocultas invisíveis e abertura por toque');
    if (hardware === 'highend') list.push('Gavetas metálicas slim e sistemas de amortecimento alemães');

    list.push('Estrutura interna 100% MDF com tratamento anti-mofo');
    list.push('Garantia de 5 anos Inova e montagem especializada inclusa');
    
    return list;
  };

  // WhatsApp Link generation
  const handleWhatsAppQuote = () => {
    const roomNames = { cozinha: 'Cozinha', quarto: 'Dormitório', banheiro: 'Banheiro/Lavabo', sala: 'Sala de Estar/Painel' };
    const layoutNames = { pequeno: 'Compacto/Linear', medio: 'Formato em L', grande: 'Grande/U com Ilha' };
    const finishNames = { matte: 'MDF Ultra Matte', wood: 'MDF Amadeirado Texturizado', lacquer: 'Laca Premium' };
    const hardwareNames = { standard: 'Amortecimento Padrão', premium: 'Corrediças Ocultas Touch', highend: 'Sistemas Importados Premium' };

    const text = `Olá Inova! Realizei uma simulação de projeto sob medida no site:\n\n` + 
      `• *Ambiente:* ${roomNames[room]}\n` +
      `• *Layout:* ${layoutNames[layout]}\n` +
      `• *Acabamento:* ${finishNames[finish]}\n` +
      `• *Ferragens:* ${hardwareNames[hardware]}\n` +
      `• *Estimativa:* ${formatCurrency(calculatedMin)} a ${formatCurrency(calculatedMax)}\n\n` +
      `Gostaria de agendar uma conversa com o projetista para detalhar o projeto.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="simulator-card" id="simulador">
      <div className="simulator-layout">
        
        {/* Selection Columns */}
        <div>
          <h3 className="simulator-title">Simulador de Ambientes Planejados</h3>
          
          {/* Section 1: Room Selection */}
          <div className="sim-section-title">1. Selecione o Ambiente</div>
          <div className="sim-options-grid">
            <div className={`sim-opt-card ${room === 'cozinha' ? 'active' : ''}`} onClick={() => setRoom('cozinha')}>
              <Home className="sim-opt-icon" size={28} />
              <span className="sim-opt-label">Cozinha</span>
            </div>
            <div className={`sim-opt-card ${room === 'quarto' ? 'active' : ''}`} onClick={() => setRoom('quarto')}>
              <Bed className="sim-opt-icon" size={28} />
              <span className="sim-opt-label">Dormitório</span>
            </div>
            <div className={`sim-opt-card ${room === 'banheiro' ? 'active' : ''}`} onClick={() => setRoom('banheiro')}>
              <Bath className="sim-opt-icon" size={28} />
              <span className="sim-opt-label">Banheiro</span>
            </div>
            <div className={`sim-opt-card ${room === 'sala' ? 'active' : ''}`} onClick={() => setRoom('sala')}>
              <Tv className="sim-opt-icon" size={28} />
              <span className="sim-opt-label">Sala/Rack</span>
            </div>
          </div>

          {/* Section 2: Layout / Size Selection */}
          <div className="sim-section-title">2. Tamanho / Layout do Espaço</div>
          <div className="sim-options-grid">
            <div className={`sim-opt-card ${layout === 'pequeno' ? 'active' : ''}`} onClick={() => setLayout('pequeno')}>
              <span className="sim-opt-label">Compacto / Linear</span>
            </div>
            <div className={`sim-opt-card ${layout === 'medio' ? 'active' : ''}`} onClick={() => setLayout('medio')}>
              <span className="sim-opt-label">Médio / Em L</span>
            </div>
            <div className={`sim-opt-card ${layout === 'grande' ? 'active' : ''}`} onClick={() => setLayout('grande')}>
              <span className="sim-opt-label">Grande / Ilha ou U</span>
            </div>
          </div>

          {/* Section 3: Finishing Selection */}
          <div className="sim-section-title">3. Padrão de Acabamento</div>
          <div className="sim-options-grid">
            <div className={`sim-opt-card ${finish === 'matte' ? 'active' : ''}`} onClick={() => setFinish('matte')}>
              <span className="sim-opt-label">MDF Matte</span>
            </div>
            <div className={`sim-opt-card ${finish === 'wood' ? 'active' : ''}`} onClick={() => setFinish('wood')}>
              <span className="sim-opt-label">MDF Amadeirado</span>
            </div>
            <div className={`sim-opt-card ${finish === 'lacquer' ? 'active' : ''}`} onClick={() => setFinish('lacquer')}>
              <span className="sim-opt-label">Laca Premium</span>
            </div>
          </div>

          {/* Section 4: Hardware Level */}
          <div className="sim-section-title">4. Tecnologia de Ferragens</div>
          <div className="sim-options-grid">
            <div className={`sim-opt-card ${hardware === 'standard' ? 'active' : ''}`} onClick={() => setHardware('standard')}>
              <span className="sim-opt-label">Amortecimento</span>
            </div>
            <div className={`sim-opt-card ${hardware === 'premium' ? 'active' : ''}`} onClick={() => setHardware('premium')}>
              <span className="sim-opt-label">Oculta Click</span>
            </div>
            <div className={`sim-opt-card ${hardware === 'highend' ? 'active' : ''}`} onClick={() => setHardware('highend')}>
              <span className="sim-opt-label">Sistemas Slim</span>
            </div>
          </div>

        </div>

        {/* Results Panel */}
        <div className="sim-result-panel">
          <div className="sim-result-header">
            <span className="sim-result-price-label">Estimativa de Investimento</span>
            <div className="sim-result-price-range">
              {formatCurrency(calculatedMin)} - {formatCurrency(calculatedMax)}
            </div>
            <p className="sim-result-price-desc">
              *Valor estimado com base nos materiais selecionados. O orçamento oficial pode variar dependendo do projeto 3D detalhado.
            </p>
          </div>

          <div className="sim-features-list">
            <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px', color: 'var(--accent)' }}>
              Incluso no Projeto:
            </div>
            {getFeatures().map((feature, idx) => (
              <div key={idx} className="sim-feature-item">
                <CheckCircle2 size={16} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-whatsapp" 
            onClick={handleWhatsAppQuote}
            style={{ width: '100%', padding: '14px 20px' }}
          >
            <MessageSquare size={18} />
            Enviar Projeto para WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}
