/**
 * PARTICIPANT CHROMATIC REACTION CONTROLLER
 * Desafío de tiempo de reacción a 4 colores sorpresa:
 * - Rojo (Detención) - Tecla 1 / R
 * - Amarillo (Precaución) - Tecla 2 / A
 * - Verde (Avanzar) - Tecla 3 / V
 * - Azul (Información) - Tecla 4 / Z
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM de Pantalla
  const screenLogin = document.getElementById('screen-login');
  const screenTest = document.getElementById('screen-test');
  const screenResults = document.getElementById('screen-results');

  // Formulario y campos de login
  const formLogin = document.getElementById('form-login');
  const inputName = document.getElementById('input-player-name');
  const inputEmail = document.getElementById('input-player-email');
  const activePlayerName = document.getElementById('active-player-name');
  const activeLevelIndicator = document.getElementById('active-level-indicator');
  const playerRoleLabel = document.getElementById('player-role-label');
  const telemetryDriverLabel = document.getElementById('telemetry-driver-label');

  // Detección de género basada en el primer nombre (Conductor vs Conductora)
  function detectDriverGender(fullName) {
    if (!fullName) return 'M';
    const firstName = fullName.trim().split(/\s+/)[0].toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Excepciones masculinas que terminan en 'a' o 'as'
    const masculineExceptions = new Set([
      'luca', 'lucas', 'bautista', 'sasha', 'matias', 'nicolas', 'elias', 'jonas',
      'tomas', 'isaias', 'jeremias', 'josue', 'tobias', 'borja', 'noa', 'noah',
      'ezra', 'dakota'
    ]);

    // Nombres femeninos frecuentes que no terminan en 'a'
    const feminineNames = new Set([
      'carmen', 'pilar', 'mercedes', 'belen', 'ines', 'rocio', 'sol', 'luz',
      'abril', 'guadalupe', 'rosario', 'concepcion', 'dolores', 'soledad',
      'mar', 'noemi', 'iris', 'ruth', 'esther', 'miriam', 'yanet', 'anet',
      'karen', 'sharon', 'ayelen', 'maiten', 'guillermina', 'yasmin', 'jazmin',
      'astrid', 'berenice', 'gladys', 'beatriz', 'haydee', 'nerea', 'zoe',
      'chloe', 'monse', 'monserrat', 'cleo', 'fabi', 'dani', 'angeles', 'nieves',
      'reyes', 'meri', 'eli', 'vivi', 'gaby', 'maby', 'nati', 'silvi', 'ana'
    ]);

    if (feminineNames.has(firstName)) return 'F';
    if (masculineExceptions.has(firstName)) return 'M';
    if (firstName.endsWith('a') || firstName.endsWith('ia') || firstName.endsWith('na') || firstName.endsWith('ela') || firstName.endsWith('ina')) {
      return 'F';
    }
    return 'M';
  }

  // Elementos de la Tarjeta Cromática Principal
  const chromaticCard = document.querySelector('.chromatic-stage-card');
  const reactionOrb = document.getElementById('reaction-orb');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc = document.getElementById('stage-desc');
  const btnStartRound = document.getElementById('btn-start-round');
  const btnStartLabel = document.getElementById('btn-start-label');
  const alertBanner = document.getElementById('stage-alert-banner');
  const alertIcon = document.getElementById('stage-alert-icon');
  const alertText = document.getElementById('stage-alert-text');

  // Botones de Selección de Color
  const colorButtons = {
    red: document.getElementById('btn-color-red'),
    yellow: document.getElementById('btn-color-yellow'),
    green: document.getElementById('btn-color-green'),
    blue: document.getElementById('btn-color-blue')
  };

  const COLOR_DEFINITIONS = {
    red: { id: 'red', name: 'ROJO', orbClass: 'orb-red', keyText: '1/R' },
    yellow: { id: 'yellow', name: 'AMARILLO', orbClass: 'orb-yellow', keyText: '2/A' },
    green: { id: 'green', name: 'VERDE', orbClass: 'orb-green', keyText: '3/V' },
    blue: { id: 'blue', name: 'AZUL', orbClass: 'orb-blue', keyText: '4/Z' }
  };

  // Elementos de Intentos y Progreso
  const chromaticAttemptText = document.getElementById('chromatic-attempt-text');
  const attemptPips = [
    { pip: document.getElementById('pip-1'), val: document.getElementById('pip-val-1') },
    { pip: document.getElementById('pip-2'), val: document.getElementById('pip-val-2') },
    { pip: document.getElementById('pip-3'), val: document.getElementById('pip-val-3') },
    { pip: document.getElementById('pip-4'), val: document.getElementById('pip-val-4') },
    { pip: document.getElementById('pip-5'), val: document.getElementById('pip-val-5') }
  ];

  // Elementos de la Pantalla de Resultados
  const resultLevelBadge = document.getElementById('result-level-badge');
  const resultTimeNumber = document.getElementById('result-time-number');
  const resultBadge = document.getElementById('result-tier-badge');
  const resultRankIcon = document.getElementById('result-rank-icon');
  const resultRankText = document.getElementById('result-rank-text');
  const resultsAttemptsGrid = document.getElementById('results-attempts-grid');
  const breakdownBestBadge = document.getElementById('breakdown-best-badge');
  const telemetryPlayerName = document.getElementById('telemetry-player-name');
  const telemetryBestTime = document.getElementById('telemetry-best-time');
  const telemetryDiff = document.getElementById('telemetry-verstappen-diff');
  const btnRetry = document.getElementById('btn-retry-test');
  const btnNextPlayer = document.getElementById('btn-next-player');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  // Variables de Estado para Ronda de 5 Intentos
  const TOTAL_ATTEMPTS = 5;
  const currentLevel = 'Reacción a Colores';
  let currentPlayer = { name: '', email: '' };
  let currentAttempt = 1;
  let roundAttempts = []; // [{ attempt: 1, timeMs: 320, color: 'red' }, ...]
  let gameState = 'IDLE'; // 'IDLE', 'WAITING', 'ACTIVE', 'TRANSITION', 'FINISHED'
  let activeColor = null;
  let startTime = 0;
  let reactionTime = 0;
  let waitingTimeout = null;
  let alertTimeout = null;
  let nextAttemptTimeout = null;

  // Manejo de Sonido
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', () => {
      const isMuted = window.racingAudio.toggleMute();
      if (soundIcon) {
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
      }
    });
  }

  // 1. Envío del Formulario de Ingreso
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();

    if (!name) {
      alert('Por favor, ingresá tu nombre para participar.');
      inputName.focus();
      return;
    }

    currentPlayer = { name, email };
    activePlayerName.textContent = name;

    const gender = detectDriverGender(name);
    const roleUpper = gender === 'F' ? 'CONDUCTORA EN PISTA:' : 'CONDUCTOR EN PISTA:';
    const roleTitle = gender === 'F' ? 'Conductora' : 'Conductor';

    if (playerRoleLabel) {
      playerRoleLabel.textContent = roleUpper;
    }
    if (telemetryDriverLabel) {
      telemetryDriverLabel.textContent = roleTitle;
    }

    if (activeLevelIndicator) {
      activeLevelIndicator.textContent = 'REFLEJOS CROMÁTICOS';
    }

    // Cambiar a pantalla de Test
    screenLogin.style.display = 'none';
    screenResults.style.display = 'none';
    screenTest.style.display = 'flex';

    resetToIdleState(true);
  });

  // Actualizar indicadores visuales de los 5 intentos (Pips)
  function updatePipsUI() {
    attemptPips.forEach((item, idx) => {
      if (!item.pip || !item.val) return;
      const attemptNum = idx + 1;
      const recorded = roundAttempts.find(r => r.attempt === attemptNum);

      item.pip.classList.remove('active', 'completed', 'best');

      if (recorded) {
        item.pip.classList.add('completed');
        item.val.textContent = (recorded.timeMs / 1000).toFixed(3) + 's';
      } else if (attemptNum === currentAttempt) {
        item.pip.classList.add('active');
        item.val.textContent = gameState === 'WAITING' ? 'ATENTO...' : 'EN ESPERA';
      } else {
        item.val.textContent = '--';
      }
    });

    // Marcar el intento más veloz si hay registros
    if (roundAttempts.length > 0) {
      const minTime = Math.min(...roundAttempts.map(r => r.timeMs));
      roundAttempts.forEach(r => {
        if (r.timeMs === minTime) {
          const bestItem = attemptPips[r.attempt - 1];
          if (bestItem && bestItem.pip) {
            bestItem.pip.classList.add('best');
          }
        }
      });
    }
  }

  // 2. Restablecer al estado inicial de ronda o de intento
  function resetToIdleState(resetAll = false) {
    clearAllTimers();
    if (resetAll) {
      currentAttempt = 1;
      roundAttempts = [];
    }
    gameState = 'IDLE';
    activeColor = null;

    hideAlert();
    clearButtonHighlights();
    updatePipsUI();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
    }

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-red';
    }

    if (chromaticAttemptText) {
      chromaticAttemptText.textContent = `NIVEL 1 • INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
    }

    if (stageTitle) {
      stageTitle.textContent = currentAttempt === 1 ? 'REACCIÓN A COLORES' : `INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = 'Aparecerá un color sorpresa. Presioná el botón correspondiente <strong>lo más rápido posible</strong>.';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `COMENZAR INTENTO ${currentAttempt}`;
    }
  }

  // 3. Comenzar Ronda de Desafío
  if (btnStartRound) {
    btnStartRound.addEventListener('click', handleStartRound);
  }

  function handleStartRound() {
    if (gameState !== 'IDLE') return;

    gameState = 'WAITING';
    hideAlert();
    clearButtonHighlights();
    updatePipsUI();

    window.racingAudio.playLightBeep(1);

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-waiting';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic state-waiting';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `CONCENTRATE (INTENTO ${currentAttempt}/${TOTAL_ATTEMPTS})...`;
    }

    if (stageTitle) {
      stageTitle.textContent = `¡ATENTO AL COLOR! (${currentAttempt}/${TOTAL_ATTEMPTS})`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = 'Esperá a que se ilumine el orbe central. <strong>¡No te anticipes!</strong>';
    }

    // Retardo aleatorio de espera sorpresa (1300ms a 3200ms)
    const randomDelay = Math.floor(Math.random() * 1900) + 1300;

    waitingTimeout = setTimeout(() => {
      if (gameState !== 'WAITING') return;
      triggerColorStimulus();
    }, randomDelay);
  }

  // 4. Activación del Estímulo Cromático
  function triggerColorStimulus() {
    gameState = 'ACTIVE';

    const colorKeys = Object.keys(COLOR_DEFINITIONS);
    const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const colorInfo = COLOR_DEFINITIONS[randomColorKey];

    activeColor = colorInfo.id;

    if (reactionOrb) {
      reactionOrb.className = `chromatic-orb ${colorInfo.orbClass}`;
    }

    startTime = performance.now();
    window.racingAudio.playStartLightsOut();

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic state-active';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = '¡¡TOCÁ AHORA!!';
    }

    if (stageTitle) {
      stageTitle.textContent = `¡¡COLOR ${colorInfo.name}!!`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = `¡Presioná el botón <strong>${colorInfo.name}</strong> a máxima velocidad!`;
    }
  }

  // 5. Interacción del Usuario con los Botones de Color
  Object.keys(colorButtons).forEach((colorKey) => {
    const btn = colorButtons[colorKey];
    if (btn) {
      // Evento pointerdown para latencia mínima sin retraso de 300ms
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        handleColorSelection(colorKey);
      });
    }
  });

  function handleColorSelection(chosenColor) {
    if (gameState === 'WAITING') {
      // Salida en falso / Anticipación en el intento actual
      handleEarlyTouch();
      return;
    }

    if (gameState === 'IDLE') {
      showAlert(`⚠️ Presioná el botón "COMENZAR INTENTO ${currentAttempt}"`);
      return;
    }

    if (gameState === 'ACTIVE') {
      if (chosenColor === activeColor) {
        // ¡Acierto de color en el intento actual!
        const endTime = performance.now();
        reactionTime = Math.round(endTime - startTime);
        handleReactionSuccess(reactionTime, chosenColor);
      } else {
        // Color Incorrecto
        handleWrongColorTouch(chosenColor);
      }
    }
  }

  // Anticipación / Salida en falso
  function handleEarlyTouch() {
    clearAllTimers();
    gameState = 'IDLE';

    window.racingAudio.playJumpStartAlert();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
      void chromaticCard.offsetWidth; // Force reflow
      chromaticCard.classList.add('shake');
    }

    showAlert(`🚨 ¡SALIDA EN FALSO! Tocaste antes de tiempo en el intento ${currentAttempt}.`);

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `REINTENTAR INTENTO ${currentAttempt}`;
    }

    if (stageTitle) {
      stageTitle.textContent = '¡ANTICIPACIÓN DETECTADA!';
    }

    if (stageDesc) {
      stageDesc.innerHTML = `Debés esperar a que el orbe se ilumine antes de presionar. Intento ${currentAttempt} de ${TOTAL_ATTEMPTS}.`;
    }

    updatePipsUI();
  }

  // Color equivocado
  function handleWrongColorTouch(chosenColor) {
    clearAllTimers();
    gameState = 'IDLE';

    window.racingAudio.playWrongColorAlert();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
      void chromaticCard.offsetWidth;
      chromaticCard.classList.add('shake');
    }

    const correctName = COLOR_DEFINITIONS[activeColor] ? COLOR_DEFINITIONS[activeColor].name : '';
    const chosenName = COLOR_DEFINITIONS[chosenColor] ? COLOR_DEFINITIONS[chosenColor].name : '';

    showAlert(`❌ ¡COLOR INCORRECTO! Era ${correctName} y presionaste ${chosenName}. Reintentá el intento ${currentAttempt}.`);

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `REINTENTAR INTENTO ${currentAttempt}`;
    }

    if (stageTitle) {
      stageTitle.textContent = '¡BOTÓN EQUIVOCADO!';
    }

    if (stageDesc) {
      stageDesc.innerHTML = `El color era <strong>${correctName}</strong>. Mantené la concentración e intentá de nuevo.`;
    }

    updatePipsUI();
  }

  // Reacción exitosa en un intento
  function handleReactionSuccess(timeMs, matchedColor) {
    window.racingAudio.playTouchHit();

    // Registrar intento actual
    roundAttempts.push({
      attempt: currentAttempt,
      timeMs: timeMs,
      color: matchedColor
    });

    // Iluminar botón presionado
    const targetBtn = colorButtons[matchedColor];
    if (targetBtn) {
      targetBtn.classList.add('glow-hit');
    }

    updatePipsUI();

    // ¿Quedan intentos en la ronda?
    if (currentAttempt < TOTAL_ATTEMPTS) {
      gameState = 'TRANSITION';
      const prevAttempt = currentAttempt;
      currentAttempt++;

      if (chromaticAttemptText) {
        chromaticAttemptText.textContent = `NIVEL 1 • INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
      }

      if (stageTitle) {
        stageTitle.textContent = `¡INTENTO ${prevAttempt} REGISTRADO!`;
      }

      if (stageDesc) {
        stageDesc.innerHTML = `Tiempo: <strong>${(timeMs / 1000).toFixed(3)} s</strong>. ¡Preparate para el <strong>intento ${currentAttempt} de ${TOTAL_ATTEMPTS}</strong>!`;
      }

      if (btnStartRound) {
        btnStartRound.className = 'btn-start-chromatic state-waiting';
      }

      if (btnStartLabel) {
        btnStartLabel.textContent = `PREPARANDO INTENTO ${currentAttempt}...`;
      }

      // Transición automática al siguiente intento (fluidez tipo arcade de stand)
      nextAttemptTimeout = setTimeout(() => {
        clearButtonHighlights();
        gameState = 'IDLE';
        handleStartRound();
      }, 1100);

    } else {
      // ¡Ronda completa finalizada con los 5 intentos!
      gameState = 'FINISHED';

      const times = roundAttempts.map(r => r.timeMs);
      const avgTimeMs = Math.round(times.reduce((sum, val) => sum + val, 0) / times.length);
      const bestTimeMs = Math.min(...times);
      const rating = window.racingStorage.calculateRating(avgTimeMs);

      // Guardar en Storage
      window.racingStorage.saveParticipant({
        name: currentPlayer.name,
        email: currentPlayer.email,
        level: currentLevel,
        timeMs: avgTimeMs,
        bestTimeMs: bestTimeMs,
        attempts: roundAttempts,
        rating: rating
      });

      if (avgTimeMs < 300 || bestTimeMs < 250) {
        window.racingAudio.playFanfare();
      }

      setTimeout(() => {
        showResults(avgTimeMs, bestTimeMs, roundAttempts, rating);
      }, 650);
    }
  }

  // 6. Mostrar Pantalla de Resultados
  function showResults(avgTimeMs, bestTimeMs, attempts, rating) {
    screenTest.style.display = 'none';
    screenResults.style.display = 'block';

    const avgInSeconds = (avgTimeMs / 1000).toFixed(3);
    const bestInSeconds = (bestTimeMs / 1000).toFixed(3);

    if (resultLevelBadge) {
      resultLevelBadge.textContent = 'REACCIÓN A COLORES (5 INTENTOS)';
    }
    if (resultTimeNumber) {
      resultTimeNumber.textContent = avgInSeconds;
    }
    if (resultBadge) {
      resultBadge.className = `result-badge ${rating.classBadge}`;
    }
    if (resultRankIcon) {
      resultRankIcon.textContent = rating.icon;
    }
    if (resultRankText) {
      resultRankText.textContent = rating.tier;
    }

    if (telemetryDriverLabel) {
      const gender = detectDriverGender(currentPlayer.name);
      telemetryDriverLabel.textContent = gender === 'F' ? 'Conductora' : 'Conductor';
    }
    if (telemetryPlayerName) {
      telemetryPlayerName.textContent = currentPlayer.name;
    }
    if (telemetryBestTime) {
      telemetryBestTime.textContent = `${bestInSeconds} s`;
    }
    if (telemetryDiff) {
      const diffSec = ((avgTimeMs - 200) / 1000).toFixed(3);
      telemetryDiff.textContent = (avgTimeMs <= 200) ? '¡Superaste el récord!' : `+${diffSec} s`;
    }

    if (breakdownBestBadge) {
      breakdownBestBadge.textContent = `⭐ MEJOR: ${bestInSeconds} s`;
    }

    // Renderizar los 5 chips de intentos
    if (resultsAttemptsGrid) {
      resultsAttemptsGrid.innerHTML = attempts.map(item => {
        const isBest = item.timeMs === bestTimeMs;
        const colorDot = item.color === 'red' ? '#ff1744' : (item.color === 'yellow' ? '#ffb703' : (item.color === 'green' ? '#00e676' : '#2979ff'));
        const timeSec = (item.timeMs / 1000).toFixed(3);
        return `
          <div class="attempt-result-chip ${isBest ? 'is-best' : ''}">
            <div class="chip-header">
              <span class="chip-dot" style="background-color: ${colorDot};"></span>
              <span class="chip-num">#${item.attempt}${isBest ? ' ★' : ''}</span>
            </div>
            <div class="chip-time">${timeSec}s</div>
          </div>
        `;
      }).join('');
    }
  }

  // 7. Botones de Resultados
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      screenResults.style.display = 'none';
      screenTest.style.display = 'flex';
      resetToIdleState(true);
    });
  }

  if (btnNextPlayer) {
    btnNextPlayer.addEventListener('click', () => {
      inputName.value = '';
      inputEmail.value = '';
      currentPlayer = { name: '', email: '' };

      screenResults.style.display = 'none';
      screenTest.style.display = 'none';
      screenLogin.style.display = 'block';

      setTimeout(() => {
        inputName.focus();
      }, 200);
    });
  }

  // 8. Soporte para Teclado y Atajo Secreto de Administración (Ctrl + Alt + A)
  window.addEventListener('keydown', (e) => {
    // Atajo Secreto para Administrador: Ctrl + Alt + A
    if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      const adminWindow = window.open('admin.html', '_blank');
      if (!adminWindow) {
        window.location.href = 'admin.html';
      }
      return;
    }

    // Si el usuario está escribiendo en un input, ignorar atajos del juego
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const key = e.key.toLowerCase();

    // Iniciar nivel con Espacio o Enter si está en IDLE en la pantalla de test
    if ((key === ' ' || key === 'enter') && screenTest.style.display !== 'none' && gameState === 'IDLE') {
      e.preventDefault();
      handleStartRound();
      return;
    }

    // Teclas para botones de colores
    if (key === '1' || key === 'r') {
      e.preventDefault();
      handleColorSelection('red');
    } else if (key === '2' || key === 'a') {
      e.preventDefault();
      handleColorSelection('yellow');
    } else if (key === '3' || key === 'v') {
      e.preventDefault();
      handleColorSelection('green');
    } else if (key === '4' || key === 'z') {
      e.preventDefault();
      handleColorSelection('blue');
    }
  });

  // Utilidades auxiliares
  function clearAllTimers() {
    if (waitingTimeout) {
      clearTimeout(waitingTimeout);
      waitingTimeout = null;
    }
    if (alertTimeout) {
      clearTimeout(alertTimeout);
      alertTimeout = null;
    }
    if (nextAttemptTimeout) {
      clearTimeout(nextAttemptTimeout);
      nextAttemptTimeout = null;
    }
  }

  function clearButtonHighlights() {
    Object.values(colorButtons).forEach(btn => {
      if (btn) btn.classList.remove('glow-hit');
    });
  }

  function showAlert(msg) {
    if (!alertBanner || !alertText) return;
    alertText.textContent = msg;
    alertBanner.style.display = 'inline-flex';

    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      hideAlert();
    }, 3500);
  }

  function hideAlert() {
    if (alertBanner) {
      alertBanner.style.display = 'none';
    }
  }
});
