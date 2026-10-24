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

  // Elementos de la Pantalla de Resultados
  const resultLevelBadge = document.getElementById('result-level-badge');
  const resultTimeNumber = document.getElementById('result-time-number');
  const resultBadge = document.getElementById('result-tier-badge');
  const resultRankIcon = document.getElementById('result-rank-icon');
  const resultRankText = document.getElementById('result-rank-text');
  const telemetryPlayerName = document.getElementById('telemetry-player-name');
  const telemetryDiff = document.getElementById('telemetry-verstappen-diff');
  const telemetrySpeedRank = document.getElementById('telemetry-speed-rank');
  const btnRetry = document.getElementById('btn-retry-test');
  const btnNextPlayer = document.getElementById('btn-next-player');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  // Variables de Estado
  const currentLevel = 'Reacción a Colores';
  let currentPlayer = { name: '', email: '' };
  let gameState = 'IDLE'; // 'IDLE', 'WAITING', 'ACTIVE', 'FINISHED'
  let activeColor = null;
  let startTime = 0;
  let reactionTime = 0;
  let waitingTimeout = null;
  let alertTimeout = null;

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
    if (activeLevelIndicator) {
      activeLevelIndicator.textContent = 'REFLEJOS CROMÁTICOS';
    }

    // Cambiar a pantalla de Test
    screenLogin.style.display = 'none';
    screenResults.style.display = 'none';
    screenTest.style.display = 'flex';

    resetToIdleState();
  });

  // 2. Restablecer al estado inicial (listo para comenzar)
  function resetToIdleState() {
    clearAllTimers();
    gameState = 'IDLE';
    activeColor = null;

    hideAlert();
    clearButtonHighlights();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
    }

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-red';
    }

    if (stageTitle) {
      stageTitle.textContent = 'REACCIÓN A COLORES';
    }

    if (stageDesc) {
      stageDesc.innerHTML = 'Aparecerá un color sorpresa. Presioná el botón correspondiente <strong>lo más rápido posible</strong>.';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = 'COMENZAR NIVEL';
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

    window.racingAudio.playLightBeep(1);

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-waiting';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic state-waiting';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = 'CONCENTRATE...';
    }

    if (stageTitle) {
      stageTitle.textContent = '¡ATENTO AL COLOR!';
    }

    if (stageDesc) {
      stageDesc.innerHTML = 'Esperá a que se ilumine el orbe central. <strong>¡No te anticipes!</strong>';
    }

    // Retardo aleatorio de espera sorpresa (1400ms a 3400ms)
    const randomDelay = Math.floor(Math.random() * 2000) + 1400;

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
      // Salida en falso / Anticipación
      handleEarlyTouch();
      return;
    }

    if (gameState === 'IDLE') {
      showAlert('⚠️ Primero presioná el botón "COMENZAR NIVEL"');
      return;
    }

    if (gameState === 'ACTIVE') {
      if (chosenColor === activeColor) {
        // ¡Acierto de color!
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

    showAlert('🚨 ¡SALIDA EN FALSO! Tocaste antes de tiempo.');

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = 'REINTENTAR NIVEL';
    }

    if (stageTitle) {
      stageTitle.textContent = '¡ANTICIPACIÓN DETECTADA!';
    }

    if (stageDesc) {
      stageDesc.innerHTML = 'Debés esperar a que el orbe se ilumine antes de presionar.';
    }
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

    showAlert(`❌ ¡COLOR INCORRECTO! Era ${correctName} y presionaste ${chosenName}.`);

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = 'REINTENTAR';
    }

    if (stageTitle) {
      stageTitle.textContent = '¡BOTÓN EQUIVOCADO!';
    }

    if (stageDesc) {
      stageDesc.innerHTML = `El color era <strong>${correctName}</strong>. Mantené la concentración e intentá de nuevo.`;
    }
  }

  // Reacción exitosa
  function handleReactionSuccess(timeMs, matchedColor) {
    gameState = 'FINISHED';
    window.racingAudio.playTouchHit();

    // Iluminar el botón presionado
    const targetBtn = colorButtons[matchedColor];
    if (targetBtn) {
      targetBtn.classList.add('glow-hit');
    }

    // Guardar en Storage
    const rating = window.racingStorage.calculateRating(timeMs);
    window.racingStorage.saveParticipant({
      name: currentPlayer.name,
      email: currentPlayer.email,
      level: currentLevel,
      timeMs: timeMs,
      rating: rating
    });

    if (timeMs < 280) {
      window.racingAudio.playFanfare();
    }

    setTimeout(() => {
      showResults(timeMs, rating);
    }, 450);
  }

  // 6. Mostrar Pantalla de Resultados
  function showResults(timeMs, rating) {
    screenTest.style.display = 'none';
    screenResults.style.display = 'block';

    if (resultLevelBadge) {
      resultLevelBadge.textContent = 'REACCIÓN A COLORES';
    }
    if (resultTimeNumber) {
      resultTimeNumber.textContent = timeMs;
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

    if (telemetryPlayerName) {
      telemetryPlayerName.textContent = currentPlayer.name;
    }
    if (telemetryDiff) {
      telemetryDiff.textContent = (timeMs <= 200) ? '¡Superaste a un piloto F1!' : `+${timeMs - 200} ms`;
    }
    if (telemetrySpeedRank) {
      telemetrySpeedRank.textContent = timeMs < 250 ? 'Sobrenatural' : (timeMs < 350 ? 'Avanzado' : 'Normal');
    }
  }

  // 7. Botones de Resultados
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      screenResults.style.display = 'none';
      screenTest.style.display = 'flex';
      resetToIdleState();
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

  // 8. Soporte para Teclado (1/R, 2/A, 3/V, 4/Z, Barra Espaciadora / Enter)
  window.addEventListener('keydown', (e) => {
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
