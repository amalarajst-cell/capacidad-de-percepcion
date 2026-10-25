/**
 * RACING STAND STORAGE & REALTIME SYNC ENGINE
 * Maneja persistencia local y sincronización en tiempo real entre pestañas/pantallas
 */

const STORAGE_KEY = 'cfl_reaction_participants_v1';
const PENDING_KEY = 'cfl_pending_sync_v1';
const CHANNEL_NAME = 'cfl_racing_stand_sync';
// Firebase Realtime Database (REST). Las reglas de seguridad se definen en la consola de Firebase.
const FIREBASE_DB_URL = 'https://stand-cfp412-default-rtdb.firebaseio.com';
const REMOTE_RECORDS_URL = FIREBASE_DB_URL + '/records.json';
const REMOTE_REFRESH_DEBOUNCE_MS = 150;
const REMOTE_POLL_FALLBACK_MS = 15000;

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

    // Sincronización entre dispositivos vía Firebase
    this.serverOnline = false;
    this.eventSource = null;
    this.refreshTimer = null;
    this.initialSyncDone = false;
    this.initServerSync();
  }

  /* ---------------- Sincronización con Firebase ---------------- */
  async initServerSync() {
    await this.fullSync();

    // Streaming en tiempo real (SSE nativo de Firebase); cada cambio dispara un refresco
    if (typeof EventSource !== 'undefined') {
      try {
        this.eventSource = new EventSource(REMOTE_RECORDS_URL);
        const onChange = () => this.scheduleRefresh();
        this.eventSource.addEventListener('put', onChange);
        this.eventSource.addEventListener('patch', onChange);
        this.eventSource.onerror = () => { this.serverOnline = false; };
      } catch (err) {
        console.warn('No se pudo abrir el stream de Firebase', err);
      }
    }

    // Respaldo por si el stream se corta (redes móviles inestables)
    setInterval(() => this.fullSync(), REMOTE_POLL_FALLBACK_MS);
    window.addEventListener('online', () => this.fullSync());
  }

  scheduleRefresh() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.fullSync(), REMOTE_REFRESH_DEBOUNCE_MS);
  }

  /* Descarga los registros remotos, envía los pendientes y notifica cambios */
  async fullSync() {
    try {
      const res = await fetch(REMOTE_RECORDS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const remoteRecords = data && typeof data === 'object' ? Object.values(data) : [];

      this.serverOnline = true;
      const remoteIds = new Set(remoteRecords.map(r => r.id));
      const pending = this.getPending().filter(r => !remoteIds.has(r.id));
      this.setPending([]);
      pending.forEach(r => this.pushToServer(r));

      const merged = [...pending, ...remoteRecords]
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      const previousIds = new Set(this.getAll().map(r => r.id));
      const newOnes = this.initialSyncDone
        ? merged.filter(r => !previousIds.has(r.id))
        : [];
      const changed = merged.length !== previousIds.size
        || merged.some(r => !previousIds.has(r.id));

      const isFirstSync = !this.initialSyncDone;
      this.writeLocal(merged);
      this.initialSyncDone = true;

      if (newOnes.length > 0) {
        newOnes.reverse().forEach(record => {
          this.notifyListeners({ type: 'NEW_RECORD', record, allRecords: merged });
        });
      } else if (changed || isFirstSync) {
        this.notifyListeners({ type: 'SYNCED', allRecords: merged });
      }
      return true;
    } catch (err) {
      this.serverOnline = false;
      console.warn('Sin conexión con Firebase, se reintentará', err.message);
      return false;
    }
  }

  async pushToServer(record) {
    try {
      const url = `${FIREBASE_DB_URL}/records/${encodeURIComponent(record.id)}.json`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.serverOnline = true;
      this.setPending(this.getPending().filter(r => r.id !== record.id));
    } catch (err) {
      // Se reintentará en la próxima sincronización
      const pending = this.getPending();
      if (!pending.some(r => r.id === record.id)) {
        this.setPending([record, ...pending]);
      }
    }
  }

  /* Borra un registro remoto por id, o todos si no se indica id */
  async deleteOnServer(id) {
    try {
      const url = id
        ? `${FIREBASE_DB_URL}/records/${encodeURIComponent(id)}.json`
        : REMOTE_RECORDS_URL;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
    } catch (err) {
      console.warn('No se pudo borrar en Firebase', err);
    }
  }

  getPending() {
    try {
      const data = localStorage.getItem(PENDING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  setPending(list) {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error al guardar cola pendiente', e);
    }
  }

  writeLocal(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
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
      level: record.level || 'Reacción a Colores',
      timeMs: Math.round(record.timeMs),
      timeSeconds: Number((record.timeMs / 1000).toFixed(3)),
      bestTimeMs: record.bestTimeMs ? Math.round(record.bestTimeMs) : Math.round(record.timeMs),
      bestTimeSeconds: record.bestTimeMs ? Number((record.bestTimeMs / 1000).toFixed(3)) : Number((record.timeMs / 1000).toFixed(3)),
      attempts: record.attempts || [],
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
      // Queda pendiente hasta confirmar el guardado remoto (pushToServer lo quita)
      this.setPending([newEntry, ...this.getPending().filter(r => r.id !== newEntry.id)]);
      this.pushToServer(newEntry);
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
      this.setPending([]);
      this.deleteOnServer();
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
      this.setPending(this.getPending().filter(r => r.id !== id));
      this.deleteOnServer(id);
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

    const headers = ['Posición Ranking', 'Nivel / Modalidad', 'Nombre y Apellido', 'Email', 'Tiempo Promedio (seg)', 'Mejor Intento (seg)', 'Categoría', 'Fecha', 'Hora'];
    
    // Ordenados por mejor tiempo
    const sorted = [...records].sort((a, b) => a.timeMs - b.timeMs);

    const rows = sorted.map((item, index) => {
      const dateObj = new Date(item.createdAt);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString();
      const safeLevel = `"${(item.level || 'Reacción a Colores').replace(/"/g, '""')}"`;
      const safeName = `"${(item.name || '').replace(/"/g, '""')}"`;
      const safeEmail = `"${(item.email || '').replace(/"/g, '""')}"`;
      const safeRating = `"${(item.rating && item.rating.tier ? item.rating.tier : '').replace(/"/g, '""')}"`;
      const secondsStr = (item.timeMs / 1000).toFixed(3);
      const bestSecondsStr = item.bestTimeMs ? (item.bestTimeMs / 1000).toFixed(3) : secondsStr;

      return [
        index + 1,
        safeLevel,
        safeName,
        safeEmail,
        secondsStr,
        bestSecondsStr,
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
