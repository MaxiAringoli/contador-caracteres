const platforms = {
  instagram: { name: 'Instagram', mark: 'ig', markClass: 'instagram', limit: 2200, caption: 'Límite recomendado para un caption' },
  x: { name: 'X', mark: '𝕏', markClass: 'x-mark', limit: 280, caption: 'Límite de caracteres por publicación' },
  tiktok: { name: 'TikTok', mark: '♪', markClass: 'tiktok', limit: 2200, caption: 'Límite de caracteres para una descripción' },
  linkedin: { name: 'LinkedIn', mark: 'in', markClass: 'linkedin', limit: 3000, caption: 'Límite de caracteres para una publicación' },
  youtube: { name: 'YouTube', mark: '▶', markClass: 'youtube', limit: 5000, caption: 'Límite de caracteres para una descripción' },
  meta: { name: 'Meta description', mark: '⌕', markClass: 'meta', limit: 160, caption: 'Largo recomendado para resultados de búsqueda' }
};

const textArea = document.querySelector('#post-text');
const characterCount = document.querySelector('#character-count');
const whitespaceCount = document.querySelector('#whitespace-count');
const totalCount = document.querySelector('#total-count');
const wordCount = document.querySelector('#word-count');
const readingTime = document.querySelector('#reading-time');
const activeName = document.querySelector('#active-name');
const activeMark = document.querySelector('#active-mark');
const limitCaption = document.querySelector('#limit-caption');
const remainingCount = document.querySelector('#remaining-count');
const resultStatus = document.querySelector('#result-status');
const progressTrack = document.querySelector('#progress-track');
const progressFill = document.querySelector('#progress-fill');
const usageLabel = document.querySelector('#usage-label');
const percentLabel = document.querySelector('#percent-label');
const copyButton = document.querySelector('#copy-button');
const toast = document.querySelector('#toast');
let activePlatform = 'instagram';
let toastTimer;

const formatNumber = (number) => new Intl.NumberFormat('es-AR').format(number);

function updateCounts() {
  const text = textArea.value;
  const totalChars = Array.from(text).length;
  const whitespaces = (text.match(/\s/gu) || []).length;
  const chars = totalChars - whitespaces;
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

  characterCount.textContent = formatNumber(chars);
  whitespaceCount.textContent = formatNumber(whitespaces);
  totalCount.textContent = formatNumber(chars + whitespaces);
  wordCount.textContent = formatNumber(words);
  readingTime.textContent = formatNumber(minutes);
  copyButton.disabled = text.length === 0;

  const { limit } = platforms[activePlatform];
  const remaining = limit - totalChars;
  const percent = Math.round((totalChars / limit) * 100);
  const isOver = remaining < 0;
  const fillPercent = Math.min(100, percent);

  remainingCount.textContent = formatNumber(Math.abs(remaining));
  resultStatus.classList.toggle('is-over', isOver);
  resultStatus.querySelector('span:last-child').innerHTML = isOver
    ? `Te pasaste por <strong>${formatNumber(Math.abs(remaining))}</strong> caracteres`
    : `Te quedan <strong>${formatNumber(remaining)}</strong> caracteres`;
  progressFill.style.width = `${fillPercent}%`;
  progressTrack.classList.toggle('is-over', isOver);
  progressTrack.setAttribute('aria-valuemax', String(limit));
  progressTrack.setAttribute('aria-valuenow', String(Math.min(totalChars, limit)));
  progressTrack.setAttribute('aria-valuetext', `${formatNumber(totalChars)} de ${formatNumber(limit)} caracteres${isOver ? ', límite superado' : ''}`);
  usageLabel.textContent = `${formatNumber(totalChars)} de ${formatNumber(limit)} caracteres`;
  percentLabel.textContent = `${formatNumber(percent)}%`;
}

function selectPlatform(key) {
  activePlatform = key;
  const platform = platforms[key];
  document.querySelectorAll('.platform-chip').forEach((button) => {
    const isSelected = button.dataset.platform === key;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  activeMark.textContent = platform.mark;
  activeMark.className = `platform-mark ${platform.markClass}`;
  activeName.textContent = platform.name;
  limitCaption.textContent = platform.caption;
  updateCounts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

textArea.addEventListener('input', updateCounts);
document.querySelectorAll('.platform-chip').forEach((button) => {
  button.addEventListener('click', () => selectPlatform(button.dataset.platform));
});
document.querySelector('#clear-button').addEventListener('click', () => {
  textArea.value = '';
  updateCounts();
  textArea.focus();
});
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(textArea.value);
    showToast('Texto copiado al portapapeles');
  } catch {
    textArea.select();
    document.execCommand('copy');
    showToast('Texto copiado al portapapeles');
    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
  }
});

updateCounts();
