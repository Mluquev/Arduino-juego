Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';

(function () {
  const statusEl = document.getElementById('conn');
  const statusBadge = document.querySelector('.status-badge');
  const lightValue = document.getElementById('lightValue');
  const micValue = document.getElementById('micValue');
  const tempValue = document.getElementById('tempValue');
  const accXEl = document.getElementById('accX');
  const accYEl = document.getElementById('accY');
  const accZEl = document.getElementById('accZ');
  const lightProgress = document.getElementById('lightProgress');
  const micProgress = document.getElementById('micProgress');

  // Charts con tema oscuro
  const lightCtx = document.getElementById('lightChart').getContext('2d');
  const accCtx = document.getElementById('accChart').getContext('2d');

  const lightChart = new Chart(lightCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Luz', data: [], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.4 }] },
    options: { 
      animation: false, 
      scales: { 
        x: { display: false },
        y: { 
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  const accChart = new Chart(accCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'X', data: [], borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', tension: 0.4, fill: false },
        { label: 'Y', data: [], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.05)', tension: 0.4, fill: false },
        { label: 'Z', data: [], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.05)', tension: 0.4, fill: false }
      ]
    },
    options: { 
      animation: false, 
      scales: { 
        x: { display: false },
        y: { 
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: { 
        legend: { 
          display: true,
          labels: { color: '#e2e8f0', boxWidth: 12, padding: 12 }
        } 
      }
    }
  });

  function pushPoint(chart, values, max = 60) {
    const ts = new Date().toLocaleTimeString();
    chart.data.labels.push(ts);
    for (let i = 0; i < values.length; i++) {
      chart.data.datasets[i].data.push(values[i]);
      if (chart.data.datasets[i].data.length > max) chart.data.datasets[i].data.shift();
    }
    if (chart.data.labels.length > max) chart.data.labels.shift();
    chart.update('none');
  }

  function updateStatusColor(connected) {
    if (connected) {
      statusBadge.style.borderColor = 'var(--accent-green)';
      statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
    } else {
      statusBadge.style.borderColor = '#ef4444';
      statusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
    }
  }

  function extractSensorData(message) {
    if (!message) {
      return null;
    }

    if (message.data && typeof message.data === 'object') {
      return message.data;
    }

    if (message.sample && message.sample.data && typeof message.sample.data === 'object') {
      return message.sample.data;
    }

    if (message.ok && message.data && typeof message.data === 'object') {
      return message.data;
    }

    if (message.joystick || message.luz !== undefined || message.acelerometro || message.microfono !== undefined) {
      return message;
    }

    return null;
  }

  function renderSensorData(s) {
    if (!s) {
      return false;
    }

    if (s.luz !== undefined) {
      lightValue.textContent = s.luz;
      lightProgress.style.width = `${Math.max(0, Math.min(100, (Number(s.luz) / 1023) * 100))}%`;
      pushPoint(lightChart, [Number(s.luz) || 0]);
    }

    if (s.temperatura !== undefined) {
      tempValue.textContent = `${Math.round(Number(s.temperatura))}°C`;
    }

    if (s.acelerometro) {
      accXEl.textContent = s.acelerometro.x;
      accYEl.textContent = s.acelerometro.y;
      accZEl.textContent = s.acelerometro.z;
      pushPoint(accChart, [Number(s.acelerometro.x) || 0, Number(s.acelerometro.y) || 0, Number(s.acelerometro.z) || 0]);
    }

    if (s.microfono !== undefined) {
      micValue.textContent = s.microfono;
      micProgress.style.width = `${Math.max(0, Math.min(100, (Number(s.microfono) / 1023) * 100))}%`;
    }

    return true;
  }

  // Conectar WebSocket a API remota
  const wsUrl = 'wss://arduino.arroyocreativa.com';
  let ws;

  function connectWS() {
    ws = new WebSocket(wsUrl);
    ws.onopen = () => { statusEl.textContent = 'conectado (WebSocket)'; updateStatusColor(true); };
    ws.onclose = () => { statusEl.textContent = 'desconectado — reintentando...'; updateStatusColor(false); setTimeout(connectWS, 3000); };
    ws.onerror = () => { statusEl.textContent = 'error de conexión'; updateStatusColor(false); ws.close(); };
    ws.onmessage = (ev) => {
      try {
        const msg = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
        const s = extractSensorData(msg);
        if (s && renderSensorData(s)) {
          statusEl.textContent = 'conectado (WebSocket)';
          updateStatusColor(true);
        }
      } catch (e) { console.warn('msg parse error', e); }
    };
  }

  // Fallback: poll REST endpoint if WS fails to connect after timeout
  let polled = false;
  setTimeout(async () => {
    if (!ws || ws.readyState !== 1) {
      statusEl.textContent = 'usando REST (polling)';
      updateStatusColor(true);
      polled = true;
      setInterval(async () => {
        try {
          const res = await fetch('https://arduino.arroyocreativa.com/api/sensors');
          const json = await res.json();
          const s = extractSensorData(json);
          if (s && renderSensorData(s)) {
            statusEl.textContent = 'conectado (REST)';
            updateStatusColor(true);
          }
        } catch (e) { 
          statusEl.textContent = 'error de conexión'; 
          updateStatusColor(false); 
        }
      }, 1000);
    }
  }, 1200);

  updateStatusColor(false);
  connectWS();
})();
