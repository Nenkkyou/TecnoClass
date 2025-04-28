/**
 * TecnoClass-PWA - Gerador de Ícones
 * 
 * Este script gera ícones básicos para o TecnoClass-PWA.
 * Em um ambiente de produção, estes seriam substituídos por ícones profissionais.
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Tamanhos de ícones a serem gerados
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Cores do tema
const primaryColor = '#1abc9c';
const secondaryColor = '#1e272e';
const accentColor = '#e74c3c';

/**
 * Gera um ícone básico para o TecnoClass-PWA
 * @param {number} size - Tamanho do ícone em pixels
 * @returns {string} URL de dados do ícone
 */
function generateIcon(size) {
  // Configura o tamanho do canvas
  canvas.width = size;
  canvas.height = size;
  
  // Limpa o canvas
  ctx.clearRect(0, 0, size, size);
  
  // Define o fundo
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, 0, size, size);
  
  // Desenha o círculo principal
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Desenha o "T" de TecnoClass
  ctx.fillStyle = '#ffffff';
  const letterWidth = size * 0.5;
  const letterHeight = size * 0.5;
  const letterX = centerX - letterWidth / 2;
  const letterY = centerY - letterHeight / 2;
  
  // Barra horizontal do T
  ctx.fillRect(letterX, letterY, letterWidth, letterHeight * 0.2);
  
  // Barra vertical do T
  ctx.fillRect(
    letterX + letterWidth * 0.4,
    letterY,
    letterWidth * 0.2,
    letterHeight
  );
  
  // Adiciona um pequeno detalhe
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(
    centerX + radius * 0.7,
    centerY - radius * 0.7,
    size * 0.08,
    0,
    2 * Math.PI
  );
  ctx.fill();
  
  // Retorna a URL de dados do ícone
  return canvas.toDataURL('image/png');
}

/**
 * Gera um ícone mascarável para o TecnoClass-PWA
 * @param {number} size - Tamanho do ícone em pixels
 * @returns {string} URL de dados do ícone
 */
function generateMaskableIcon(size) {
  // Configura o tamanho do canvas
  canvas.width = size;
  canvas.height = size;
  
  // Limpa o canvas
  ctx.clearRect(0, 0, size, size);
  
  // Define o fundo (área segura para ícones mascaráveis)
  // A área segura é 40% do centro do ícone
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, size, size);
  
  // Desenha um círculo no centro
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.3; // Menor para ficar na área segura
  
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Desenha o "T" de TecnoClass
  ctx.fillStyle = '#ffffff';
  const letterWidth = size * 0.4;
  const letterHeight = size * 0.4;
  const letterX = centerX - letterWidth / 2;
  const letterY = centerY - letterHeight / 2;
  
  // Barra horizontal do T
  ctx.fillRect(letterX, letterY, letterWidth, letterHeight * 0.2);
  
  // Barra vertical do T
  ctx.fillRect(
    letterX + letterWidth * 0.4,
    letterY,
    letterWidth * 0.2,
    letterHeight
  );
  
  // Adiciona um pequeno detalhe
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(
    centerX + radius * 0.5,
    centerY - radius * 0.5,
    size * 0.06,
    0,
    2 * Math.PI
  );
  ctx.fill();
  
  // Retorna a URL de dados do ícone
  return canvas.toDataURL('image/png');
}

// Gera e salva os ícones
sizes.forEach(size => {
  const iconUrl = generateIcon(size);
  const link = document.createElement('a');
  link.download = `icon-${size}x${size}.png`;
  link.href = iconUrl;
  link.click();
});

// Gera e salva o ícone mascarável
const maskableIconUrl = generateMaskableIcon(512);
const link = document.createElement('a');
link.download = 'maskable-icon.png';
link.href = maskableIconUrl;
link.click();

console.log('Ícones gerados com sucesso!');
