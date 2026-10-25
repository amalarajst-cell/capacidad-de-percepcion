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

  // Elementos de Selección de Actividad (Login)
  const inputSelectedLevel = document.getElementById('selected-level-input');
  const actOptCards = document.querySelectorAll('.activity-option-card');
  actOptCards.forEach(card => {
    card.addEventListener('click', () => {
      actOptCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const lvl = card.getAttribute('data-level');
      if (inputSelectedLevel) inputSelectedLevel.value = lvl;
    });
  });

  // Elementos de Estímulo y Opciones de Pantalla de Test
  const colorsStimulusWrapper = document.getElementById('activity-colors-stimulus');
  const signalsStimulusWrapper = document.getElementById('activity-signals-stimulus');
  const signalsTargetBox = document.getElementById('signals-target-box');
  const signalsWaitingBox = document.getElementById('signals-waiting-box');
  const signalsTargetImg = document.getElementById('signals-target-img');
  const colorButtonsContainer = document.getElementById('color-buttons-container');
  const signalsOptionsContainer = document.getElementById('signals-options-container');

  // Variables de Estado para Ronda de 5 Intentos
  const TOTAL_ATTEMPTS = 5;
  let currentLevel = 'Reacción a Colores';
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

  // Estado para Memotest Vial (Reflejo y Reacción)
  let signalsPool = [];
  let currentSignalOptions = [];
  let currentTargetSignal = null;

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

    currentLevel = inputSelectedLevel ? inputSelectedLevel.value : 'Reacción a Colores';
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
      activeLevelIndicator.textContent = currentLevel === 'Memotest Vial (Señales)'
        ? 'MEMOTEST VIAL (REFLEJOS)'
        : 'REFLEJOS CROMÁTICOS';
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

      item.pip.classList.remove('active', 'completed', 'best', 'error');

      if (recorded) {
        item.pip.classList.add('completed');
        if (recorded.isError) {
          item.pip.classList.add('error');
        }
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
      signalsPool = [];
    }
    gameState = 'IDLE';
    activeColor = null;

    hideAlert();
    clearButtonHighlights();
    updatePipsUI();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
    }

    const isSignals = currentLevel === 'Memotest Vial (Señales)';

    if (colorsStimulusWrapper) {
      colorsStimulusWrapper.style.display = isSignals ? 'none' : 'flex';
    }
    if (signalsStimulusWrapper) {
      signalsStimulusWrapper.style.display = isSignals ? 'flex' : 'none';
    }
    if (colorButtonsContainer) {
      colorButtonsContainer.style.display = isSignals ? 'none' : 'grid';
    }
    if (signalsOptionsContainer) {
      signalsOptionsContainer.style.display = isSignals ? 'grid' : 'none';
    }

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-red';
    }
    if (signalsWaitingBox) {
      signalsWaitingBox.style.display = 'flex';
      const txt = signalsWaitingBox.querySelector('span');
      if (txt) txt.textContent = 'PREPARATE...';
    }
    if (signalsTargetImg) {
      signalsTargetImg.style.display = 'none';
    }
    if (signalsTargetBox) {
      signalsTargetBox.classList.remove('stimulus-active');
    }

    if (chromaticAttemptText) {
      const modeLabel = isSignals ? 'MEMOTEST VIAL' : 'NIVEL 1';
      chromaticAttemptText.textContent = `${modeLabel} • INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
    }

    if (stageTitle) {
      stageTitle.textContent = currentAttempt === 1
        ? (isSignals ? 'MEMOTEST VIAL: REFLEJOS' : 'REACCIÓN A COLORES')
        : `INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = isSignals
        ? 'Aparecerá una señal de tránsito sorpresa. Tocá la señal correcta entre las opciones <strong>lo más rápido posible</strong>.'
        : 'Aparecerá un color sorpresa. Presioná el botón correspondiente <strong>lo más rápido posible</strong>.';
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `COMENZAR INTENTO ${currentAttempt}`;
    }

    if (isSignals) {
      prepareSignalsRound();
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

    const isSignals = currentLevel === 'Memotest Vial (Señales)';

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-waiting';
    }
    if (signalsWaitingBox) {
      signalsWaitingBox.style.display = 'flex';
      const txt = signalsWaitingBox.querySelector('span');
      if (txt) txt.textContent = 'CONCENTRATE...';
    }
    if (signalsTargetImg) {
      signalsTargetImg.style.display = 'none';
    }
    if (signalsTargetBox) {
      signalsTargetBox.classList.remove('stimulus-active');
    }

    if (btnStartRound) {
      btnStartRound.className = 'btn-start-chromatic state-waiting';
    }

    if (btnStartLabel) {
      btnStartLabel.textContent = `CONCENTRATE (INTENTO ${currentAttempt}/${TOTAL_ATTEMPTS})...`;
    }

    if (stageTitle) {
      stageTitle.textContent = isSignals
        ? `¡ATENTO A LA SEÑAL! (${currentAttempt}/${TOTAL_ATTEMPTS})`
        : `¡ATENTO AL COLOR! (${currentAttempt}/${TOTAL_ATTEMPTS})`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = isSignals
        ? 'Esperá a que aparezca la señal en la caja central. <strong>¡No te anticipes!</strong>'
        : 'Esperá a que se ilumine el orbe central. <strong>¡No te anticipes!</strong>';
    }

    if (isSignals) {
      prepareSignalsRound();
    }

    // Retardo aleatorio de espera sorpresa (1200ms a 2800ms)
    const randomDelay = Math.floor(Math.random() * 1600) + 1200;

    waitingTimeout = setTimeout(() => {
      if (gameState !== 'WAITING') return;
      if (isSignals) {
        triggerSignalStimulus();
      } else {
        triggerColorStimulus();
      }
    }, randomDelay);
  }

  // Barajado Fisher-Yates
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Preparar opciones de Señales Viales
  function prepareSignalsRound() {
    if (typeof SENALES_DATA === 'undefined' || !Array.isArray(SENALES_DATA) || SENALES_DATA.length === 0) {
      return;
    }
    if (signalsPool.length < 10) {
      signalsPool = shuffleArray(SENALES_DATA);
    }

    currentSignalOptions = [];
    const usedIds = new Set();
    while (currentSignalOptions.length < 6 && signalsPool.length > 0) {
      const s = signalsPool.shift();
      if (!usedIds.has(s.id)) {
        usedIds.add(s.id);
        currentSignalOptions.push(s);
      }
    }
    currentTargetSignal = currentSignalOptions[Math.floor(Math.random() * currentSignalOptions.length)];

    renderSignalOptions();
  }

  function renderSignalOptions() {
    if (!signalsOptionsContainer) return;
    signalsOptionsContainer.innerHTML = currentSignalOptions.map((signal, idx) => `
      <div class="signal-option-card disabled" data-index="${idx}" data-id="${signal.id}" id="sig-card-${idx}">
        <img src="${signal.image}" alt="${signal.name}">
        <div class="signal-name-hint">${signal.name}</div>
      </div>
    `).join('');

    signalsOptionsContainer.querySelectorAll('.signal-option-card').forEach((card) => {
      card.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-index'), 10);
        handleSignalSelection(idx);
      });
    });
  }

  // Activación del Estímulo de Señal
  function triggerSignalStimulus() {
    if (!currentTargetSignal) return;
    gameState = 'ACTIVE';

    if (signalsWaitingBox) {
      signalsWaitingBox.style.display = 'none';
    }
    if (signalsTargetImg) {
      signalsTargetImg.src = currentTargetSignal.image;
      signalsTargetImg.alt = currentTargetSignal.name;
      signalsTargetImg.style.display = 'block';
    }
    if (signalsTargetBox) {
      signalsTargetBox.classList.add('stimulus-active');
    }

    if (signalsOptionsContainer) {
      signalsOptionsContainer.querySelectorAll('.signal-option-card').forEach(card => {
        card.classList.remove('disabled');
      });
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
      stageTitle.textContent = `¡¡${currentTargetSignal.name.toUpperCase()}!!`;
    }

    if (stageDesc) {
      stageDesc.innerHTML = `¡Encontrá la señal <strong>${currentTargetSignal.name}</strong> a máxima velocidad!`;
    }
  }

  function handleSignalSelection(selectedIndex) {
    if (gameState === 'WAITING') {
      handleEarlyTouch();
      return;
    }

    if (gameState === 'IDLE') {
      showAlert(`⚠️ Presioná el botón "COMENZAR INTENTO ${currentAttempt}"`);
      return;
    }

    if (gameState === 'ACTIVE') {
      const chosenSignal = currentSignalOptions[selectedIndex];
      if (!chosenSignal) return;

      const card = document.getElementById(`sig-card-${selectedIndex}`);

      if (chosenSignal.id === currentTargetSignal.id) {
        // Acierto
        const endTime = performance.now();
        reactionTime = Math.round(endTime - startTime);
        if (card) card.classList.add('glow-hit');
        handleReactionSuccess(reactionTime, chosenSignal.name, chosenSignal.image);
      } else {
        // Error
        if (card) card.classList.add('glow-wrong');
        handleWrongSignalTouch(chosenSignal);
      }
    }
  }

  function handleWrongSignalTouch(chosenSignal) {
    clearAllTimers();
    window.racingAudio.playWrongColorAlert();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
      void chromaticCard.offsetWidth;
      chromaticCard.classList.add('shake');
    }

    const penaltyMs = 1000;
    const targetName = currentTargetSignal ? currentTargetSignal.name : 'la correcta';
    showAlert(`❌ ¡SEÑAL INCORRECTA! Era "${targetName}". Penalización de 1.000 s.`);

    advanceAttempt(
      {
        attempt: currentAttempt,
        timeMs: penaltyMs,
        color: 'error',
        signalName: chosenSignal ? chosenSignal.name : '',
        signalImage: chosenSignal ? chosenSignal.image : '',
        isError: true
      },
      `❌ ¡SEÑAL INCORRECTA!`,
      `La señal era <strong>${targetName}</strong>. Penalización: <strong>1.000 s</strong>. Continuando...`,
      1300
    );
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

  // Anticipación / Salida en falso (se penaliza y continúa sin detener la ronda)
  function handleEarlyTouch() {
    clearAllTimers();
    window.racingAudio.playJumpStartAlert();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
      void chromaticCard.offsetWidth;
      chromaticCard.classList.add('shake');
    }

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    const penaltyMs = 1000;
    showAlert(`🚨 ¡ANTICIPACIÓN! Presionaste antes de tiempo. Penalización de 1.000 s.`);

    advanceAttempt(
      {
        attempt: currentAttempt,
        timeMs: penaltyMs,
        color: 'error',
        isError: true
      },
      `🚨 ¡ANTICIPACIÓN DETECTADA!`,
      `Presionaste antes de tiempo en el intento ${currentAttempt}. Penalización: <strong>1.000 s</strong>. Continuando...`,
      1300
    );
  }

  // Color equivocado (se penaliza y continúa sin detener la ronda)
  function handleWrongColorTouch(chosenColor) {
    clearAllTimers();
    window.racingAudio.playWrongColorAlert();

    if (chromaticCard) {
      chromaticCard.classList.remove('shake');
      void chromaticCard.offsetWidth;
      chromaticCard.classList.add('shake');
    }

    if (reactionOrb) {
      reactionOrb.className = 'chromatic-orb orb-idle';
    }

    const correctName = COLOR_DEFINITIONS[activeColor] ? COLOR_DEFINITIONS[activeColor].name : '';
    const chosenName = COLOR_DEFINITIONS[chosenColor] ? COLOR_DEFINITIONS[chosenColor].name : '';
    const penaltyMs = 1000;

    showAlert(`❌ ¡COLOR INCORRECTO! Era ${correctName} y presionaste ${chosenName}. Penalización de 1.000 s.`);

    advanceAttempt(
      {
        attempt: currentAttempt,
        timeMs: penaltyMs,
        color: chosenColor,
        isError: true
      },
      `❌ ¡BOTÓN INCORRECTO!`,
      `El color era <strong>${correctName}</strong>. Penalización: <strong>1.000 s</strong>. Continuando...`,
      1300
    );
  }

  // Reacción exitosa en un intento
  function handleReactionSuccess(timeMs, matchedLabel, signalImage = null) {
    window.racingAudio.playTouchHit();

    // Iluminar botón presionado si es color
    const targetBtn = colorButtons[matchedLabel];
    if (targetBtn) {
      targetBtn.classList.add('glow-hit');
    }

    advanceAttempt(
      {
        attempt: currentAttempt,
        timeMs: timeMs,
        color: matchedLabel,
        signalImage: signalImage
      },
      `¡INTENTO ${currentAttempt} REGISTRADO!`,
      `Tiempo: <strong>${(timeMs / 1000).toFixed(3)} s</strong>. ¡Preparate para el siguiente intento!`,
      1100
    );
  }

  // Avanzar intento o finalizar ronda completa (flujo continuo arcade)
  function advanceAttempt(attemptData, title, desc, delayMs = 1100) {
    roundAttempts.push(attemptData);
    updatePipsUI();

    // ¿Quedan intentos en la ronda?
    if (currentAttempt < TOTAL_ATTEMPTS) {
      gameState = 'TRANSITION';
      const prevAttempt = currentAttempt;
      currentAttempt++;

      if (chromaticAttemptText) {
        const modeLabel = currentLevel === 'Memotest Vial (Señales)' ? 'MEMOTEST VIAL' : 'NIVEL 1';
        chromaticAttemptText.textContent = `${modeLabel} • INTENTO ${currentAttempt} DE ${TOTAL_ATTEMPTS}`;
      }

      if (stageTitle) {
        stageTitle.textContent = title;
      }

      if (stageDesc) {
        stageDesc.innerHTML = desc;
      }

      if (btnStartRound) {
        btnStartRound.className = 'btn-start-chromatic state-waiting';
      }

      if (btnStartLabel) {
        btnStartLabel.textContent = `PREPARANDO INTENTO ${currentAttempt}...`;
      }

      // Transición automática al siguiente intento (sin detener la actividad)
      nextAttemptTimeout = setTimeout(() => {
        clearButtonHighlights();
        hideAlert();
        gameState = 'IDLE';
        handleStartRound();
      }, delayMs);

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
      }, 700);
    }
  }

  // 6. Mostrar Pantalla de Resultados
  function showResults(avgTimeMs, bestTimeMs, attempts, rating) {
    screenTest.style.display = 'none';
    screenResults.style.display = 'block';

    const avgInSeconds = (avgTimeMs / 1000).toFixed(3);
    const bestInSeconds = (bestTimeMs / 1000).toFixed(3);

    if (resultLevelBadge) {
      resultLevelBadge.textContent = currentLevel === 'Memotest Vial (Señales)'
        ? 'MEMOTEST VIAL: REFLEJOS (5 INTENTOS)'
        : 'REACCIÓN A COLORES (5 INTENTOS)';
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
        const isBest = item.timeMs === bestTimeMs && !item.isError;
        let colorDot = '#2979ff';
        if (item.isError) colorDot = '#ff1744';
        else if (item.color === 'red') colorDot = '#ff1744';
        else if (item.color === 'yellow') colorDot = '#ffb703';
        else if (item.color === 'green') colorDot = '#00e676';

        const timeSec = (item.timeMs / 1000).toFixed(3);
        const errorTag = item.isError ? ' ⚠️' : '';
        const signalThumbnail = item.signalImage ? `<img src="${item.signalImage}" alt="${item.signalName || ''}" style="width: 22px; height: 22px; object-fit: contain; border-radius: 4px; vertical-align: middle; margin-right: 4px;">` : '';

        return `
          <div class="attempt-result-chip ${isBest ? 'is-best' : ''} ${item.isError ? 'is-penalized' : ''}">
            <div class="chip-header">
              ${signalThumbnail || `<span class="chip-dot" style="background-color: ${colorDot};"></span>`}
              <span class="chip-num">#${item.attempt}${isBest ? ' ★' : ''}${errorTag}</span>
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

    // Teclas para botones de opciones (1, 2, 3, 4, 5, 6)
    if (currentLevel === 'Memotest Vial (Señales)') {
      if (key === '1') {
        e.preventDefault();
        handleSignalSelection(0);
      } else if (key === '2') {
        e.preventDefault();
        handleSignalSelection(1);
      } else if (key === '3') {
        e.preventDefault();
        handleSignalSelection(2);
      } else if (key === '4') {
        e.preventDefault();
        handleSignalSelection(3);
      } else if (key === '5') {
        e.preventDefault();
        handleSignalSelection(4);
      } else if (key === '6') {
        e.preventDefault();
        handleSignalSelection(5);
      }
    } else {
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
    if (signalsOptionsContainer) {
      signalsOptionsContainer.querySelectorAll('.signal-option-card').forEach(btn => {
        btn.classList.remove('glow-hit', 'glow-wrong');
      });
    }
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
