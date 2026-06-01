const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://api.github.com"],
      connectSrc: ["'self'", "ws://localhost:*", "http://localhost:*", "https://api.github.com"],
      frameSrc: ["'self'", "https://maps.google.com"],
      objectSrc: ["'none'"]
    }
  }
}));

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
  credentials: true
}));

// JSON Parser with payload size limits (protects against DOS)
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Muitas requisições deste endereço de IP. Tente novamente mais tarde.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed login attempts per window
  message: { error: 'Muitas tentativas de login malsucedidas. Acesso bloqueado por 15 minutos.' }
});

// Paths
const CONTENT_FILE_PATH = path.join(__dirname, '../src/data/content.json');
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Ensure uploads directory exists locally
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
    }
    req.user = user;
    next();
  });
};

// Simple HTML Sanitizer for XSS Prevention
function sanitizeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}

// Recursive object sanitizer
function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = sanitizeObject(obj[key]);
    }
    return newObj;
  }
  return sanitizeHtml(obj);
}

// GitHub API Integration Helpers
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getFileSha(filePath) {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch file SHA from GitHub: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error getting file SHA from GitHub:', error);
    return null;
  }
}

async function commitToGithub(filePath, contentStr, commitMessage) {
  const sha = await getFileSha(filePath);
  const base64Content = Buffer.from(contentStr).toString('base64');

  const body = {
    message: commitMessage,
    content: base64Content,
  };

  if (sha) {
    body.sha = sha;
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || 'Error committing file to GitHub');
  }

  return await response.json();
}

// Audit logger helper
function logAdminAction(action, details) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ACTION: ${action} | DETAILS: ${details}\n`;
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  fs.appendFileSync(path.join(logsDir, 'admin_audit.log'), logMessage);
  console.log(logMessage.trim());
}

// Apply general API limiter to API routes
app.use('/api/', apiLimiter);

// Endpoints

// 1. Authenticate admin
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Por favor, preencha usuário e senha.' });
  }

  if (username !== process.env.ADMIN_USERNAME) {
    logAdminAction('LOGIN_FAILED', `Tentativa frustrada com usuário incorreto: ${username}`);
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const isMatch = bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    logAdminAction('LOGIN_FAILED', `Tentativa frustrada para o usuário: ${username}`);
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { username: username, role: 'administrator' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  logAdminAction('LOGIN_SUCCESS', `Usuário ${username} logado com sucesso.`);
  res.json({ token, username });
});

// 2. Fetch site content
app.get('/api/content', (req, res) => {
  try {
    if (fs.existsSync(CONTENT_FILE_PATH)) {
      const data = fs.readFileSync(CONTENT_FILE_PATH, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'Arquivo de conteúdo não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler arquivo de conteúdo.' });
  }
});

// 3. Save site content (JWT protected)
app.post('/api/content/save', authenticateToken, async (req, res) => {
  try {
    const rawContent = req.body;
    if (!rawContent) {
      return res.status(400).json({ error: 'Payload vazio.' });
    }

    // Sanitize entries to prevent XSS
    const sanitizedContent = sanitizeObject(rawContent);

    // Save locally
    const contentStr = JSON.stringify(sanitizedContent, null, 2);
    fs.writeFileSync(CONTENT_FILE_PATH, contentStr, 'utf-8');
    logAdminAction('CONTENT_SAVE_LOCAL', `Salvo conteúdo localmente por ${req.user.username}`);

    // Commit to GitHub if GITHUB_TOKEN is available
    if (GITHUB_TOKEN) {
      try {
        await commitToGithub(
          'src/data/content.json',
          contentStr,
          `CMS: Atualização de textos e projetos por ${req.user.username}`
        );
        logAdminAction('CONTENT_SAVE_GITHUB', `Salvo conteúdo no GitHub por ${req.user.username}`);
      } catch (githubErr) {
        console.error('Failed to commit to GitHub:', githubErr);
        // We still succeeded locally, return success with warning
        return res.json({ 
          success: true, 
          warning: 'Salvo localmente, mas falhou ao sincronizar com GitHub: ' + githubErr.message,
          content: sanitizedContent 
        });
      }
    }

    res.json({ success: true, content: sanitizedContent });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Falha ao salvar as alterações.' });
  }
});

// 4. Upload project image (JWT protected)
app.post('/api/content/upload', authenticateToken, async (req, res) => {
  try {
    const { fileName, base64Content } = req.body;
    if (!fileName || !base64Content) {
      return res.status(400).json({ error: 'Dados de imagem inválidos.' });
    }

    // Clean and timestamp filename
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFileName = `${Date.now()}_${cleanName}`;
    
    // Save image locally in public/uploads/
    const imageBuffer = Buffer.from(base64Content, 'base64');
    const localFilePath = path.join(UPLOADS_DIR, uniqueFileName);
    fs.writeFileSync(localFilePath, imageBuffer);
    logAdminAction('IMAGE_UPLOAD_LOCAL', `Imagem ${uniqueFileName} salva localmente por ${req.user.username}`);

    // Upload to GitHub if token exists
    if (GITHUB_TOKEN) {
      try {
        await commitToGithub(
          `public/uploads/${uniqueFileName}`,
          imageBuffer, // buffer can be encoded to base64 within commitToGithub
          `CMS: Upload de imagem ${uniqueFileName} por ${req.user.username}`
        );
        logAdminAction('IMAGE_UPLOAD_GITHUB', `Imagem ${uniqueFileName} enviada ao GitHub por ${req.user.username}`);
      } catch (githubErr) {
        console.error('Failed to upload image to GitHub:', githubErr);
        // Return local url but warn about GitHub sync failure
        return res.json({
          url: `/uploads/${uniqueFileName}`,
          warning: 'Imagem salva localmente, mas falhou ao sincronizar com o GitHub: ' + githubErr.message
        });
      }
    }

    res.json({ url: `/uploads/${uniqueFileName}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Falha ao realizar upload da imagem.' });
  }
});

// Servir frontend compilado em produção
if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, '../dist'))) {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
