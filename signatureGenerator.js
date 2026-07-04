const { createCanvas } = require('canvas');

// Signature style definitions
const STYLES = {
  classic:  { label: '🖋️ Classic',  desc: 'Elegant italic with curved flourish' },
  bold:     { label: '💪 Bold',     desc: 'Strong and striking with double underline' },
  minimal:  { label: '✨ Minimal',  desc: 'Clean and simple' },
  elegant:  { label: '💎 Elegant', desc: 'Decorative with ornamental accents' },
  modern:   { label: '🚀 Modern',  desc: 'Contemporary slanted look' }
};

// Color definitions — ink color + background
const COLORS = {
  black:    { label: '⬛ Black',      ink: '#1a1a1a', bg: '#ffffff' },
  navy:     { label: '🔵 Navy Blue',  ink: '#1a237e', bg: '#f5f7ff' },
  green:    { label: '🟢 Dark Green', ink: '#1b5e20', bg: '#f5fff7' },
  burgundy: { label: '🔴 Burgundy',   ink: '#7b1f2e', bg: '#fff5f6' },
  purple:   { label: '🟣 Purple',     ink: '#4a148c', bg: '#fdf5ff' }
};

// Main function — generates PNG buffer from name, style, color
function generateSignature(name, style, colorKey) {
  const W = 720;
  const H = 280;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const color = COLORS[colorKey] || COLORS.black;

  // Fill background
  ctx.fillStyle = color.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle border
  ctx.strokeStyle = color.ink + '22';
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 12, W - 24, H - 24);

  // Draw selected style
  switch (style) {
    case 'classic': drawClassic(ctx, name, color, W, H); break;
    case 'bold':    drawBold(ctx, name, color, W, H);    break;
    case 'minimal': drawMinimal(ctx, name, color, W, H); break;
    case 'elegant': drawElegant(ctx, name, color, W, H); break;
    case 'modern':  drawModern(ctx, name, color, W, H);  break;
    default:        drawClassic(ctx, name, color, W, H);
  }

  return canvas.toBuffer('image/png');
}

// ─── Classic: italic serif + curved underline + flourish ───
function drawClassic(ctx, name, color, W, H) {
  const cy = H / 2 + 10;

  // Soft shadow
  ctx.fillStyle = color.ink + '22';
  ctx.font = 'italic bold 68px serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, W / 2 + 3, cy + 3);

  // Main name
  ctx.fillStyle = color.ink;
  ctx.fillText(name, W / 2, cy);

  const tw = ctx.measureText(name).width;
  const sx = W / 2 - tw / 2;
  const ex = W / 2 + tw / 2;
  const ly = cy + 28;

  // Curved underline
  ctx.strokeStyle = color.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - 15, ly);
  ctx.bezierCurveTo(W / 2 - 50, ly + 12, W / 2 + 50, ly - 8, ex + 15, ly + 4);
  ctx.stroke();

  // Small flourish at the end
  ctx.beginPath();
  ctx.moveTo(ex + 15, ly + 4);
  ctx.bezierCurveTo(ex + 30, ly - 4, ex + 42, ly + 8, ex + 35, ly + 18);
  ctx.stroke();
}

// ─── Bold: heavy sans-serif + double underline ──────────────
function drawBold(ctx, name, color, W, H) {
  const cy = H / 2 + 10;

  ctx.fillStyle = color.ink;
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, W / 2, cy);

  const tw = ctx.measureText(name).width;
  const sx = W / 2 - tw / 2 - 10;
  const ex = W / 2 + tw / 2 + 10;

  // Thick underline
  ctx.strokeStyle = color.ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(sx, cy + 22);
  ctx.lineTo(ex, cy + 22);
  ctx.stroke();

  // Thin second underline
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sx, cy + 33);
  ctx.lineTo(ex, cy + 33);
  ctx.stroke();
}

// ─── Minimal: light italic serif + single thin underline ────
function drawMinimal(ctx, name, color, W, H) {
  const cy = H / 2 + 10;

  ctx.fillStyle = color.ink;
  ctx.font = 'italic 62px serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, W / 2, cy);

  const tw = ctx.measureText(name).width;
  const sx = W / 2 - tw / 2;
  const ex = W / 2 + tw / 2;
  const ly = cy + 20;

  // Single thin underline
  ctx.strokeStyle = color.ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx, ly);
  ctx.lineTo(ex, ly);
  ctx.stroke();

  // Small dot at end
  ctx.beginPath();
  ctx.arc(ex + 8, ly, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = color.ink;
  ctx.fill();
}

// ─── Elegant: italic serif + swirl ornaments + diamond ──────
function drawElegant(ctx, name, color, W, H) {
  const cy = H / 2 + 10;

  // Soft shadow
  ctx.fillStyle = color.ink + '18';
  ctx.font = 'italic bold 64px serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, W / 2 + 2, cy + 2);

  // Main name
  ctx.fillStyle = color.ink;
  ctx.fillText(name, W / 2, cy);

  const tw = ctx.measureText(name).width;
  const sx = W / 2 - tw / 2;
  const ex = W / 2 + tw / 2;
  const ly = cy + 28;

  // Flowing curved underline
  ctx.strokeStyle = color.ink;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(sx - 45, ly + 6);
  ctx.bezierCurveTo(W / 2 - 60, ly - 6, W / 2 + 60, ly + 6, ex + 45, ly - 4);
  ctx.stroke();

  // Left swirl ornament
  ctx.beginPath();
  ctx.moveTo(sx - 45, ly + 6);
  ctx.bezierCurveTo(sx - 62, ly, sx - 68, ly + 14, sx - 56, ly + 22);
  ctx.stroke();

  // Right swirl ornament
  ctx.beginPath();
  ctx.moveTo(ex + 45, ly - 4);
  ctx.bezierCurveTo(ex + 62, ly - 14, ex + 70, ly - 2, ex + 60, ly + 12);
  ctx.stroke();

  // Small diamond above center
  ctx.fillStyle = color.ink + 'cc';
  ctx.save();
  ctx.translate(W / 2, cy - 52);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();
}

// ─── Modern: slanted bold italic + angular underline ────────
function drawModern(ctx, name, color, W, H) {
  // Draw everything inside a slightly rotated context
  ctx.save();
  ctx.translate(W / 2, H / 2 + 10);
  ctx.rotate(-0.06);

  ctx.fillStyle = color.ink;
  ctx.font = 'bold italic 70px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 0, 0);

  const tw = ctx.measureText(name).width;

  // Bold angular underline
  ctx.strokeStyle = color.ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-tw / 2 - 10, 26);
  ctx.lineTo(tw / 2 + 10, 26);
  ctx.stroke();

  // Thin accent line below
  ctx.lineWidth = 1;
  ctx.strokeStyle = color.ink + '88';
  ctx.beginPath();
  ctx.moveTo(-tw / 2, 36);
  ctx.lineTo(tw / 2, 36);
  ctx.stroke();

  ctx.restore();
}

module.exports = { generateSignature, STYLES, COLORS };
