/**
 * PARTICIPANT REACTION TEST CONTROLLER
 * Máquina de estados para:
 * - Nivel 1: Semáforo F1 (5 Luces de Largada)
 * - Nivel 2: Solo Colores (Reflejos Cromáticos Sorpresa)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM de Pantalla
  const screenLogin = document.getElementById('screen-login');
  const screenTest = document.getElementById('screen-test');
  const screenResults = document.getElementById('screen-results');

  // Selector de Nivel
  const btnSelectF1 = document.getElementById('btn-select-level-f1');
  const btnSelectColors = document.getElementById('btn-select-level-colors');
  const selectedLevelInput = document.getElementById('selected-level-input');
  const activeLevelIndicator = document.getElementById('active-level-indicator');
  const f1Gantry = document.getElementById('f1-gantry');
  const colorStageContainer = document.getElementById('color-stage-container');
  const colorOrb = document.getElementById('color-orb-display');
  const colorOrbSymbol = document.getElementById('color-orb-symbol');

  // Formulario y campos
  const formLogin = document.getElementById('form-login');
  const inputName = document.getElementById('input-player-name');
  const inputEmail = document.getElementById('input-player-email');
  const activePlayerName = document.getElementById('active-player-name');

  // Semáforo F1 y Zona de Reacción
  const reactionZone = document.getElementById('reaction-touch-zone');
  const touchIcon = document.getElementById('touch-zone-icon');
  const touchTitle = document.getElementById('touch-zone-title');
  const touchSubtitle = document.getElementById('touch-zone-subtitle');
  const bulbs = [
    document.getElementById('bulb-1'),
    document.getElementById('bulb-2'),
    document.getElementById('bulb-3'),
    document.getElementById('bulb-4'),
    document.getElementById('bulb-5')
  ];

  // Resultados
  const resultLevelBadge = document.getElementById('result-level-badge');
  const resultTimeNumber = document.getElementById('result-time-number');
  const resultBadge = document.getElementById('result-tier-badge');
  const resultRankIcon = document.getElementById('result-rank-icon');
  const resultRankText = document.getElementById('result-rank-text');
  const btnRetry = document.getElementById('btn-retry-test');
  const btnNextPlayer = document.getElementById('btn-next-player');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  // Estado del juego
  let currentLevel = 'Semáforo F1'; // 'Semáforo F1' o 'Solo Colores'
  let currentPlayer = { name: '', email: '' };
  let gameState = 'IDLE'; // 'IDLE', 'COUNTDOWN', 'HOLDING', 'GO', 'JUMP_START', 'FINISHED'
  let startTime = 0;
  let reactionTime = 0;
  let countdownTimers = [];
  let holdingTimeout = null;

  // Manejo de Selección de Nivel
  if (btnSelectF1 && btnSelectColors) {
    btnSelectF1.addEventListener('click', () => {
      currentLevel = 'Semáforo F1';
      selectedLevelInput.value = currentLevel;
      btnSelectF1.classList.add('active');
      btnSelectColors.classList.remove('active');
    });

    btnSelectColors.addEventListener('click', () => {
      currentLevel = 'Solo Colores';
      selectedLevelInput.value = currentLevel;
      btnSelectColors.classList.add('active');
      btnSelectF1.classList.remove('active');
    });
  }

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

    currentLevel = selectedLevelInput ? selectedLevelInput.value : 'Semáforo F1';
    currentPlayer = { name, email };
    activePlayerName.textContent = name;
    if (activeLevelIndicator) {
      activeLevelIndicator.textContent = `NIVEL: ${currentLevel.toUpperCase()}`;
    }

    // Configurar visibilidad según el nivel elegido
    if (currentLevel === 'Solo Colores') {
      if (f1Gantry) f1Gantry.style.display = 'none';
      if (colorStageContainer) colorStageContainer.style.display = 'flex';
    } else {
      if (f1Gantry) f1Gantry.style.display = 'inline-flex';
      if (colorStageContainer) colorStageContainer.style.display = 'none';
    }

    // Cambiar a pantalla de Test
    screenLogin.style.display = 'none';
    screenResults.style.display = 'none';
    screenTest.style.display = 'block';

    // Iniciar test según nivel
    startLevelTest();
  });

  function startLevelTest() {
    clearAllTimers();

    if (currentLevel === 'Solo Colores') {
      initColorTest();
    } else {
      initF1Countdown();
    }
  }

  // =========================================================================
  // NIVEL 1: SEMÁFORO DE FÓRMULA 1
  // =========================================================================
  function initF1Countdown() {
    resetBulbs();
    gameState = 'COUNTDOWN';

    reactionZone.className = 'reaction-touch-zone state-ready';
    touchIcon.textContent = '⏱️';
    touchTitle.textContent = 'PREPARATE...';
    touchSubtitle.textContent = 'Las 5 luces se van a encender. Apenas se apaguen todas, ¡tocá la pantalla!';

    const intervalStep = 850;
    for (let i = 0; i < 5; i++) {
      const timer = setTimeout(() => {
        if (gameState !== 'COUNTDOWN') return;
        turnOnBulb(i);
        window.racingAudio.playLightBeep(i + 1);

        if (i === 4) {
          startF1HoldingPhase();
        }
      }, (i + 1) * intervalStep);

      countdownTimers.push(timer);
    }
  }

  function turnOnBulb(index) {
    if (bulbs[index]) {
      bulbs[index].classList.add('on');
    }
  }

  function resetBulbs() {
    bulbs.forEach(b => {
      if (b) b.classList.remove('on');
    });
  }

  function startF1HoldingPhase() {
    gameState = 'HOLDING';
    touchTitle.textContent = '¡ATENCIÓN!';
    touchSubtitle.textContent = 'Esperá a que se apaguen las luces... ¡No te anticipes!';

    const randomDelay = Math.floor(Math.random() * 2200) + 1200;

    holdingTimeout = setTimeout(() => {
      if (gameState !== 'HOLDING') return;
      triggerF1LightsOut();
    }, randomDelay);
  }

  function triggerF1LightsOut() {
    gameState = 'GO';
    resetBulbs();
    startTime = performance.now();

    window.racingAudio.playStartLightsOut();

    reactionZone.className = 'reaction-touch-zone state-go';
    touchIcon.textContent = '⚡';
    touchTitle.textContent = '¡¡TOCÁ AHORA!!';
    touchSubtitle.textContent = '¡¡DALE RÁPIDO!!';
  }

  // =========================================================================
  // NIVEL 2: TEST SOLO COLORES (ESTÍMULO CROMÁTICO SORPRESA)
  // =========================================================================
  function initColorTest() {
    gameState = 'HOLDING';

    // Establecer orbe en ROJO (Espera/Detención)
    if (colorOrb) {
      colorOrb.className = 'color-stage-orb color-red';
      if (colorOrbSymbol) colorOrbSymbol.textContent = '🔴';
    }

    reactionZone.className = 'reaction-touch-zone state-ready';
    touchIcon.textContent = '🎨';
    touchTitle.textContent = 'ATENTO AL COLOR ROJO...';
    touchSubtitle.textContent = '¡No toques todavía! Esperá a que cambie de color inesperadamente.';

    window.racingAudio.playLightBeep(1);

    // Retardo aleatorio de 1.4s a 3.6s
    const randomDelay = Math.floor(Math.random() * 2200) + 1400;

    holdingTimeout = setTimeout(() => {
      if (gameState !== 'HOLDING') return;
      triggerColorChange();
    }, randomDelay);
  }

  function triggerColorChange() {
    gameState = 'GO';

    // Elegir aleatoriamente entre Verde Competición, Amarillo Eléctrico o Azul
    const colors = [
      { cls: 'color-green', symbol: '🟢', name: 'VERDE' },
      { cls: 'color-yellow', symbol: '🟡', name: 'AMARILLO' },
      { cls: 'color-blue', symbol: '🔵', name: 'AZUL' }
    ];
    const picked = colors[Math.floor(Math.random() * colors.length)];

    if (colorOrb) {
      colorOrb.className = `color-stage-orb ${picked.cls}`;
      if (colorOrbSymbol) colorOrbSymbol.textContent = picked.symbol;
    }

    startTime = performance.now();
    window.racingAudio.playStartLightsOut();

    reactionZone.className = 'reaction-touch-zone state-go';
    touchIcon.textContent = picked.symbol;
    touchTitle.textContent = `¡¡CAMBIÓ A ${picked.name}!!`;
    touchSubtitle.textContent = '¡¡TOCÁ LA PANTALLA YA!!';
  }

  // =========================================================================
  // CONTROL DE TOQUE & MEDICIÓN
  // =========================================================================
  function clearAllTimers() {
    countdownTimers.forEach(t => clearTimeout(t));
    countdownTimers = [];
    if (holdingTimeout) {
      clearTimeout(holdingTimeout);
      holdingTimeout = null;
    }
  }

  reactionZone.addEventListener('pointerdown', handleUserTouch);

  function handleUserTouch(e) {
    e.preventDefault();

    if (gameState === 'COUNTDOWN' || gameState === 'HOLDING') {
      handleJumpStart();
    } else if (gameState === 'GO') {
      const endTime = performance.now();
      reactionTime = Math.round(endTime - startTime);
      handleReactionSuccess(reactionTime);
    }
  }

  function handleJumpStart() {
    gameState = 'JUMP_START';
    clearAllTimers();
    resetBulbs();

    window.racingAudio.playJumpStartAlert();

    reactionZone.className = 'reaction-touch-zone state-jumpstart';
    touchIcon.textContent = '🚨';
    touchTitle.textContent = '¡SALIDA EN FALSO!';
    touchSubtitle.textContent = currentLevel === 'Solo Colores'
      ? '¡Tocaste antes de que cambie de color! Tenés que esperar.'
      : 'Te anticipaste antes de que se apaguen las luces.';

    setTimeout(() => {
      if (gameState === 'JUMP_START') {
        touchTitle.textContent = 'TOCÁ PARA REINTENTAR';
        touchSubtitle.textContent = 'Mantené la calma y esperá la señal.';
        const oneTimeRestart = () => {
          reactionZone.removeEventListener('click', oneTimeRestart);
          startLevelTest();
        };
        reactionZone.addEventListener('click', oneTimeRestart, { once: true });
      }
    }, 1200);
  }

  function handleReactionSuccess(timeMs) {
    gameState = 'FINISHED';
    window.racingAudio.playTouchHit();

    // Guardar en Storage con el nivel correspondiente
    const rating = window.racingStorage.calculateRating(timeMs);
    window.racingStorage.saveParticipant({
      name: currentPlayer.name,
      email: currentPlayer.email,
      level: currentLevel,
      timeMs: timeMs,
      rating: rating
    });

    if (timeMs < 250) {
      window.racingAudio.playFanfare();
    }

    setTimeout(() => {
      showResults(timeMs, rating);
    }, 400);
  }

  function showResults(timeMs, rating) {
    screenTest.style.display = 'none';
    screenResults.style.display = 'block';

    if (resultLevelBadge) {
      resultLevelBadge.textContent = currentLevel.toUpperCase();
    }
    resultTimeNumber.textContent = timeMs;
    resultBadge.className = `result-badge ${rating.classBadge}`;
    resultRankIcon.textContent = rating.icon;
    resultRankText.textContent = rating.tier;

    document.getElementById('telemetry-player-name').textContent = currentPlayer.name;
    document.getElementById('telemetry-verstappen-diff').textContent = (timeMs <= 200) ? '¡Superaste a un piloto F1!' : `+${timeMs - 200} ms`;
    document.getElementById('telemetry-speed-rank').textContent = timeMs < 280 ? 'Élite' : (timeMs < 380 ? 'Avanzado' : 'Normal');
  }

  // Botón: Reintentar
  btnRetry.addEventListener('click', () => {
    screenResults.style.display = 'none';
    screenTest.style.display = 'block';
    startLevelTest();
  });

  // Botón: Siguiente Participante
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
});
