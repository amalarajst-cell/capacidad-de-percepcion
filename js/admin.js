/**
 * ADMIN & LIVE LEADERBOARD CONTROLLER
 * Monitoreo en vivo de participantes, podio F1, exportación y gestión de stand
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos de métricas
  const metricTotal = document.getElementById('metric-total-participants');
  const metricBest = document.getElementById('metric-best-time');
  const metricBestHolder = document.getElementById('metric-best-holder');
  const metricAvg = document.getElementById('metric-avg-time');

  // Elementos del Podio
  const podiumP1Name = document.getElementById('podium-p1-name');
  const podiumP1Time = document.getElementById('podium-p1-time');
  const podiumP2Name = document.getElementById('podium-p2-name');
  const podiumP2Time = document.getElementById('podium-p2-time');
  const podiumP3Name = document.getElementById('podium-p3-name');
  const podiumP3Time = document.getElementById('podium-p3-time');

  // Tabla y Búsqueda
  const leaderboardBody = document.getElementById('leaderboard-tbody');
  const inputSearch = document.getElementById('admin-search-input');
  const btnExport = document.getElementById('btn-export-csv');
  const btnClearAll = document.getElementById('btn-clear-database');
  const btnAddDemo = document.getElementById('btn-add-demo-data');
  const liveNoticeBadge = document.getElementById('live-feed-notice');

  // Audio de notificación para nuevo récord
  const adminAudio = window.racingAudio;

  let currentRecords = [];

  // 1. Cargar registros iniciales
  function loadData() {
    currentRecords = window.racingStorage.getAll();
    renderAll();
  }

  // 2. Suscribirse a cambios en tiempo real
  window.racingStorage.subscribe((payload) => {
    // Si entra un nuevo registro
    if (payload.type === 'NEW_RECORD') {
      currentRecords = payload.allRecords || window.racingStorage.getAll();
      renderAll(payload.record.id);

      // Feedback visual
      if (liveNoticeBadge) {
        liveNoticeBadge.style.display = 'inline-flex';
        liveNoticeBadge.textContent = `¡Nuevo tiempo registrado: ${payload.record.name} (${payload.record.timeMs}ms)!`;
        setTimeout(() => {
          liveNoticeBadge.style.display = 'none';
        }, 5000);
      }

      // Sonido de feedback si el audio está activo
      adminAudio.playTouchHit();
    } else {
      currentRecords = window.racingStorage.getAll();
      renderAll();
    }
  });

  // 3. Renderizar todo el tablero
  function renderAll(highlightId = null) {
    updateMetrics();
    updatePodium();
    renderTable(highlightId);
  }

  // Actualizar métricas del Stand
  function updateMetrics() {
    const total = currentRecords.length;
    metricTotal.textContent = total;

    if (total === 0) {
      metricBest.textContent = '-- ms';
      metricBestHolder.textContent = 'Sin registros aún';
      metricAvg.textContent = '-- ms';
      return;
    }

    // Mejor tiempo
    const sorted = [...currentRecords].sort((a, b) => a.timeMs - b.timeMs);
    const bestRecord = sorted[0];
    metricBest.textContent = `${bestRecord.timeMs} ms`;
    metricBestHolder.textContent = `Líder: ${bestRecord.name}`;

    // Promedio
    const sum = currentRecords.reduce((acc, curr) => acc + curr.timeMs, 0);
    const avg = Math.round(sum / total);
    metricAvg.textContent = `${avg} ms`;
  }

  // Actualizar Podio F1
  function updatePodium() {
    const sorted = [...currentRecords].sort((a, b) => a.timeMs - b.timeMs);

    // 1er Puesto
    if (sorted[0]) {
      podiumP1Name.textContent = sorted[0].name;
      podiumP1Time.textContent = `${sorted[0].timeMs} ms`;
    } else {
      podiumP1Name.textContent = '---';
      podiumP1Time.textContent = '-- ms';
    }

    // 2do Puesto
    if (sorted[1]) {
      podiumP2Name.textContent = sorted[1].name;
      podiumP2Time.textContent = `${sorted[1].timeMs} ms`;
    } else {
      podiumP2Name.textContent = '---';
      podiumP2Time.textContent = '-- ms';
    }

    // 3er Puesto
    if (sorted[2]) {
      podiumP3Name.textContent = sorted[2].name;
      podiumP3Time.textContent = `${sorted[2].timeMs} ms`;
    } else {
      podiumP3Name.textContent = '---';
      podiumP3Time.textContent = '-- ms';
    }
  }

  // Renderizar Tabla
  function renderTable(highlightId = null) {
    const searchTerm = (inputSearch ? inputSearch.value : '').toLowerCase().trim();
    
    // Ordenar de mejor tiempo a peor tiempo
    let sorted = [...currentRecords].sort((a, b) => a.timeMs - b.timeMs);

    if (searchTerm) {
      sorted = sorted.filter(r => 
        (r.name && r.name.toLowerCase().includes(searchTerm)) || 
        (r.email && r.email.toLowerCase().includes(searchTerm))
      );
    }

    if (sorted.length === 0) {
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
            ${searchTerm ? 'No se encontraron participantes que coincidan con la búsqueda.' : 'No hay participantes registrados todavía. ¡Iniciá el test desde la pantalla principal!'}
          </td>
        </tr>
      `;
      return;
    }

    leaderboardBody.innerHTML = sorted.map((item, index) => {
      const pos = index + 1;
      let badgeClass = '';
      if (pos === 1) badgeClass = 'top-1';
      else if (pos === 2) badgeClass = 'top-2';
      else if (pos === 3) badgeClass = 'top-3';

      const isNew = item.id === highlightId ? 'new-entry' : '';
      const dateObj = new Date(item.createdAt);
      const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const tierText = (item.rating && item.rating.tier) ? item.rating.tier : 'Participante';
      const tierBadge = (item.rating && item.rating.classBadge) ? item.rating.classBadge : 'rank-normal';

      return `
        <tr class="${isNew}" data-id="${item.id}">
          <td style="width: 60px;">
            <span class="rank-badge ${badgeClass}">${pos}</span>
          </td>
          <td>
            <div style="font-weight: 700; color: #FFF; font-size: 1.05rem;">${escapeHtml(item.name)}</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">${timeStr} hs</div>
          </td>
          <td style="color: var(--text-muted); font-size: 0.9rem;">
            ${item.email ? escapeHtml(item.email) : '<span style="color: #475569;">No especificado</span>'}
          </td>
          <td>
            <span class="table-time-cell">${item.timeMs} ms</span>
          </td>
          <td>
            <span class="result-badge ${tierBadge}" style="font-size: 0.75rem; padding: 4px 10px;">${tierText}</span>
          </td>
          <td style="text-align: right; width: 60px;">
            <button type="button" class="btn-delete-row" title="Eliminar este registro" data-id="${item.id}" style="background:none; border:none; color: #64748B; cursor:pointer; font-size: 1.1rem; padding: 4px;">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Listener para botones de eliminar fila
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('¿Deseás eliminar este participante del ranking?')) {
          window.racingStorage.deleteById(id);
        }
      });
    });
  }

  // Búsqueda en tiempo real
  if (inputSearch) {
    inputSearch.addEventListener('input', () => {
      renderTable();
    });
  }

  // Exportar a Excel (CSV)
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const today = new Date().toISOString().slice(0, 10);
      window.racingStorage.exportToCsv(`stand_reaccion_cfl_${today}.csv`);
    });
  }

  // Vaciar registros
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('⚠️ ATENCIÓN: ¿Estás seguro de que querés borrar TODOS los registros del stand? Esta acción no se puede deshacer.')) {
        window.racingStorage.clearAll();
      }
    });
  }

  // Cargar datos de demostración
  if (btnAddDemo) {
    btnAddDemo.addEventListener('click', () => {
      const demoUsers = [
        { name: 'Lucas Benítez', email: 'lucas.b@gmail.com', timeMs: 204 },
        { name: 'Sofía Álvarez', email: 'sofia.alvarez@hotmail.com', timeMs: 238 },
        { name: 'Martín Rossi', email: 'mrossi@outlook.com', timeMs: 265 },
        { name: 'Camila Torres', email: 'cami.torres@gmail.com', timeMs: 310 },
        { name: 'Alejandro Morales', email: 'amorales@yahoo.com.ar', timeMs: 345 }
      ];

      demoUsers.forEach(u => {
        window.racingStorage.saveParticipant(u);
      });
      alert('5 participantes de prueba agregados exitosamente para calibrar la pantalla.');
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Inicio
  loadData();
});
