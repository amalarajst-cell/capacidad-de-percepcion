/**
 * RACING STAND STORAGE & REALTIME SYNC ENGINE
 * Maneja persistencia local y sincronización en tiempo real entre pestañas/pantallas
 */

const STORAGE_KEY = 'cfl_reaction_participants_v1';
const CHANNEL_NAME = 'cfl_racing_stand_sync';

class RacingStorageManager {
  constructor() {
    this.channel = null;
    this.listeners = [];

    // Iniciar BroadcastChannel si está disponible
    if ('BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel error, usando storage listener fallback', e);
      }
    }

    // Fallback con evento storage de window
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.notifyListeners({ type: 'STORAGE_UPDATED', data: this.getAll() });
      }
    });
  }

  /* Suscripción a cambios en tiempo real */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(payload) {
    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error('Error en listener de storage', err);
      }
    });
  }

  /* Obtener todos los registros guardados */
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer de localStorage', e);
      return [];
    }
  }

  /* Guardar un nuevo participante con su tiempo */
  saveParticipant(record) {
    const records = this.getAll();
    const newEntry = {
      id: 'REC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: record.name.trim(),
      email: record.email.trim().toLowerCase(),
      timeMs: Math.round(record.timeMs),
      rating: record.rating || this.calculateRating(record.timeMs),
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    records.unshift(newEntry);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      
      // Notificar al canal en tiempo real
      const message = { type: 'NEW_RECORD', record: newEntry, allRecords: records };
      if (this.channel) {
        this.channel.postMessage(message);
      }
      this.notifyListeners(message);
      return newEntry;
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
      return null;
    }
  }

  /* Limpiar todos los registros con confirmación */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const message = { type: 'CLEARED_ALL', allRecords: [] };
      if (this.channel) {
        this.channel.postMessage(message);
      }
      this.notifyListeners(message);
      return true;
    } catch (e) {
      console.error('Error al limpiar registros', e);
      return false;
    }
  }

  /* Eliminar un registro puntual por ID */
  deleteById(id) {
    let records = this.getAll();
    records = records.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      const message = { type: 'DELETED_ONE', deletedId: id, allRecords: records };
      if (this.channel) {
        this.channel.postMessage(message);
      }
      this.notifyListeners(message);
      return true;
    } catch (e) {
      console.error('Error al eliminar registro', e);
      return false;
    }
  }

  /* Clasificación según tiempo de reacción */
  calculateRating(ms) {
    if (ms < 200) {
      return { tier: 'Piloto F1 Élite', classBadge: 'rank-f1', icon: '🏆' };
    } else if (ms < 255) {
      return { tier: 'Reflejos Sobrenaturales', classBadge: 'rank-f1', icon: '⚡' };
    } else if (ms < 320) {
      return { tier: 'Conductor Deportivo Pro', classBadge: 'rank-pro', icon: '🚀' };
    } else if (ms < 420) {
      return { tier: 'Tiempo Óptimo Urbano', classBadge: 'rank-normal', icon: '👍' };
    } else {
      return { tier: 'Atención Requerida', classBadge: 'rank-normal', icon: '⚠️' };
    }
  }

  /* Exportar a formato CSV para Excel con codificación UTF-8 BOM */
  exportToCsv(filename = 'participantes_stand_cfl.csv') {
    const records = this.getAll();
    if (!records || records.length === 0) {
      alert('No hay participantes registrados para exportar.');
      return;
    }

    const headers = ['Posición Ranking', 'Nombre y Apellido', 'Email', 'Tiempo de Reacción (ms)', 'Categoría', 'Fecha', 'Hora'];
    
    // Ordenados por mejor tiempo
    const sorted = [...records].sort((a, b) => a.timeMs - b.timeMs);

    const rows = sorted.map((item, index) => {
      const dateObj = new Date(item.createdAt);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString();
      const safeName = `"${(item.name || '').replace(/"/g, '""')}"`;
      const safeEmail = `"${(item.email || '').replace(/"/g, '""')}"`;
      const safeRating = `"${(item.rating && item.rating.tier ? item.rating.tier : '').replace(/"/g, '""')}"`;

      return [
        index + 1,
        safeName,
        safeEmail,
        item.timeMs,
        safeRating,
        `"${dateStr}"`,
        `"${timeStr}"`
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Instancia global
window.racingStorage = new RacingStorageManager();
