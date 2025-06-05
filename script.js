// Weather Matrix Visualization - Enhanced Motion per Weather

// Global state
let scene, camera, renderer, matrixParticles = [], weatherData = null;

const matrixChars = {
  rain: [...defaultChars(), '💧', '╱', '╲', '|', '/', '\\', '_'],
  sun: [...defaultChars(), '☀', '★', '✦', '✧', '◉', '◎', '⊙', '◯', '○', '●', '◊', '◈'],
  cloud: [...defaultChars(), '▓', '▒', '░', '≡', '≈', '~', '-', '='],
  snow: [...defaultChars(), '◦', '○', '°', '·', '⋅', '*', '+'],
  wind: [...defaultChars(), '~', '≈', '∼', '→', '↗', '↘', '⇢'],
  storm: [...defaultChars(), '⚡', '☁', '💥', '⛈', '❗', '╳', '✖'],
  fog: [...defaultChars(), '▒', '░', '≡', '…', '.', ',', '`'],
  default: [...defaultChars()]
};

function defaultChars() {
  return [
    '0','1','2','3','4','5','6','7','8','9',
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ',
    'サ','シ','ス','セ','ソ','タ','チ','ツ','ナ','ニ',
    'ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ',
    '|','/','\\','-','_','=','+','*','.',',','░','▒','▓'
  ];
}

function getWeatherColor(type) {
  return {
    rain: '#4488ff', snow: '#ffffff', sun: '#ffdd00',
    wind: '#88ffaa', cloud: '#aaaaaa', storm: '#ff4444',
    fog: '#888888', default: '#00ff00'
  }[type] || '#00ff00';
}

function getWeatherVisualSettings(type) {
  const sets = {
    sun: { speedFactor: 0.5, symbolScale: 1, countMultiplier: 2 },
    cloud: { speedFactor: 0.8, symbolScale: 1, countMultiplier: 2.5 },
    wind: { speedFactor: 1.4, symbolScale: 1, countMultiplier: 2.5 },
    rain: { speedFactor: 1.3, symbolScale: 0.8, countMultiplier: 3 },
    snow: { speedFactor: 1.2, symbolScale: 0.9, countMultiplier: 2.5 },
    fog: { speedFactor: 0.6, symbolScale: 1, countMultiplier: 2.2 },
    storm: { speedFactor: 2, symbolScale: 1, countMultiplier: 3.5 },
    default: { speedFactor: 1.0, symbolScale: 1, countMultiplier: 2 }
  };
  return sets[type] || sets.default;
}

function updateMatrixEffect(data) {
  const main = data.weather[0].main.toLowerCase();
  let effect = 'default';
  if (main.includes('thunderstorm') || main.includes('tornado')) effect = 'storm';
  else if (main.includes('drizzle') || main.includes('rain')) effect = 'rain';
  else if (main.includes('snow')) effect = 'snow';
  else if (main.includes('clear')) effect = 'sun';
  else if (main.includes('cloud')) effect = 'cloud';
  else if (["mist","fog","haze","smoke","dust","sand","ash"].some(t => main.includes(t))) effect = 'fog';
  else if (main.includes('squall')) effect = 'wind';

  createMatrixEffect(effect);
}

function createMatrixEffect(type) {
  matrixParticles.forEach(p => scene.remove(p));
  matrixParticles = [];
  const chars = matrixChars[type] || matrixChars.default;
  const { countMultiplier } = getWeatherVisualSettings(type);

  for (let i = 0; i < 100 * countMultiplier; i++) {
    const ch = chars[Math.floor(Math.random() * chars.length)];
    createAsciiCharacter(
      ch,
      (Math.random() - 0.5) * 40,
      Math.random() * 30 - 10,
      (Math.random() - 0.5) * 20,
      type
    );
  }
}

function createAsciiCharacter(char, x, y, z, type) {
  const { symbolScale } = getWeatherVisualSettings(type);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 256;
  ctx.scale(2, 2);
  ctx.font = 'bold 64px Courier New';
  ctx.fillStyle = getWeatherColor(type);
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.7, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, y, z);
  sprite.scale.set(symbolScale, symbolScale, symbolScale);
  sprite.userData = {
    originalX: x, originalY: y, originalZ: z,
    floatPhase: Math.random() * Math.PI * 2,
    floatSpeed: 0.3,
    weatherType: type
  };
  scene.add(sprite);
  matrixParticles.push(sprite);
}

function initMatrix() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 20;
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('matrix-container').appendChild(renderer.domElement);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const t = Date.now() * 0.001;
  matrixParticles.forEach(p => {
    const d = p.userData;
    if (!d) return;
    const speed = getWeatherVisualSettings(d.weatherType).speedFactor;

    if (d.weatherType === 'sun') {
      // волнообразное движение по окружности
      p.position.x = d.originalX + Math.sin(t * 0.5 + d.floatPhase) * 2;
      p.position.y = d.originalY + Math.cos(t * 0.7 + d.floatPhase) * 1.5;
    } else if (d.weatherType === 'rain') {
      p.position.y -= 0.3 * speed;
      if (p.position.y < -15) p.position.y = 15;
    } else if (d.weatherType === 'snow') {
      p.position.y -= 0.1 * speed;
      p.position.x += Math.sin(t + d.floatPhase) * 0.02;
      if (p.position.y < -15) p.position.y = 15;
    } else {
      // стандартное покачивание
      p.position.x = d.originalX + Math.sin(t * d.floatSpeed + d.floatPhase) * 1.5;
      p.position.y = d.originalY + Math.cos(t * d.floatSpeed * 0.7 + d.floatPhase) * 1.0;
      p.position.z = d.originalZ + Math.sin(t * d.floatSpeed * 0.5 + d.floatPhase) * 0.8;
    }
  });
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

function fetchWeather() {
  const apiKey = document.getElementById('apiKey').value.trim();
  if (!apiKey) return alert('API Key missing');
  const lat = parseFloat(document.getElementById('latitude').value) || 41.9297;
  const lon = parseFloat(document.getElementById('longitude').value) || 19.2117;
  const city = document.getElementById('cityName').value.trim();

  const url = city
    ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      weatherData = data;
      updateWeatherDisplay(data);
      updateMatrixEffect(data);
    })
    .catch(err => alert('Weather fetch error: ' + err.message));
}

function updateWeatherDisplay(data) {
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('description').textContent = data.weather[0].description.toUpperCase();
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
}

function getCurrentLocation() {
  document.getElementById('locationInputs').style.display = 'none';
}

function setManualLocation() {
  document.getElementById('locationInputs').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});