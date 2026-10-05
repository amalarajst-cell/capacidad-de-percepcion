/**
 * PARTICIPANT REACTION TEST CONTROLLER
 * Máquina de estados para semáforo F1 y registro en stand
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM de Pantalla
  const screenLogin = document.getElementById('screen-login');
  const screenTest = document.getElementById('screen-test');
  const screenResults = document.getElementById('screen-results');

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
  const resultTimeNumber = document.getElementById('result-time-number');
  const resultBadge = document.getElementById('result-tier-badge');
  const resultRankIcon = document.getElementById('result-rank-icon');
  const resultRankText = document.getElementById('result-rank-text');
  const btnRetry = document.getElementById('btn-retry-test');
  const btnNextPlayer = document.getElementById('btn-next-player');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  // Estado del juego
  let currentPlayer = { name: '', email: '' };
  let gameState = 'IDLE'; // 'IDLE', 'COUNTDOWN', 'HOLDING', 'GO', 'JUMP_START', 'FINISHED'
  let startTime = 0;
  let reactionTime = 0;
  let countdownTimers = [];
  let holdingTimeout = null;

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

    // Cambiar a pantalla de Test
    screenLogin.style.display = 'none';
    screenResults.style.display = 'none';
    screenTest.style.display = 'block';

    // Preparar el test
    initTestCountdown();
  });

  // 2. Iniciar la secuencia de luces de F1
  function initTestCountdown() {
    clearAllTimers();
    resetBulbs();
    gameState = 'COUNTDOWN';

    // Actualizar UI
    reactionZone.className = 'reaction-touch-zone state-ready';
    touchIcon.textContent = '⏱️';
    touchTitle.textContent = 'PREPARATE...';
    touchSubtitle.textContent = 'Las 5 luces se van a encender. Apenas se apaguen todas, ¡tocá la pantalla!';

    // Encender las 5 luces una por una cada 900ms
    const intervalStep = 900;
    for (let i = 0; i < 5; i++) {
      const timer = setTimeout(() => {
        if (gameState !== 'COUNTDOWN') return;
        turnOnBulb(i);
        window.racingAudio.playLightBeep(i + 1);

        // Si es la última luz, pasar al estado de espera aleatoria (Holding)
        if (i === 4) {
          startHoldingPhase();
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

  function clearAllTimers() {
    countdownTimers.forEach(t => clearTimeout(t));
    countdownTimers = [];
    if (holdingTimeout) {
      clearTimeout(holdingTimeout);
      holdingTimeout = null;
    }
  }

  // 3. Fase de Espera Aleatoria (Holding - como en la FIA)
  function startHoldingPhase() {
    gameState = 'HOLDING';
    touchTitle.textContent = '¡ATENCIÓN!';
    touchSubtitle.textContent = 'Esperá a que se apaguen las luces... ¡No te anticipes!';

    // Tiempo aleatorio entre 1.2s y 3.6s
    const randomDelay = Math.floor(Math.random() * 2400) + 1200;

    holdingTimeout = setTimeout(() => {
      if (gameState !== 'HOLDING') return;
      triggerLightsOut();
    }, randomDelay);
  }

  // 4. Luces Apagadas: ¡LARGADA / GO!
  function triggerLightsOut() {
    gameState = 'GO';
    resetBulbs();
    startTime = performance.now();

    window.racingAudio.playStartLightsOut();

    reactionZone.className = 'reaction-touch-zone state-go';
    touchIcon.textContent = '⚡';
    touchTitle.textContent = '¡¡TOCÁ AHORA!!';
    touchSubtitle.textContent = '¡¡RÁPIDO, DALE!!';
  }

  // 5. Manejo del Toque del Participante
  reactionZone.addEventListener('pointerdown', handleUserTouch);

  function handleUserTouch(e) {
    e.preventDefault();

    if (gameState === 'COUNTDOWN' || gameState === 'HOLDING') {
      // Salida en falso / Jump Start
      handleJumpStart();
    } else if (gameState === 'GO') {
      // Reacción Exitosa
      const endTime = performance.now();
      reactionTime = Math.round(endTime - startTime);
      handleReactionSuccess(reactionTime);
    }
  }

  // Manejo de Salida en Falso (Jump Start)
  function handleJumpStart() {
    gameState = 'JUMP_START';
    clearAllTimers();
    resetBulbs();

    window.racingAudio.playJumpStartAlert();

    reactionZone.className = 'reaction-touch-zone state-jumpstart';
    touchIcon.textContent = '🚨';
    touchTitle.textContent = '¡SALIDA EN FALSO!';
    touchSubtitle.textContent = 'Te anticipaste antes de que se apaguen las luces. Tocá para reintentar.';

    // Permitir reiniciar el intento tras 1.5s
    setTimeout(() => {
      if (gameState === 'JUMP_START') {
        touchTitle.textContent = 'TOCÁ PARA REINICIAR';
        touchSubtitle.textContent = 'Mantené la calma y esperá a que las luces se apaguen.';
        const oneTimeRestart = () => {
          reactionZone.removeEventListener('click', oneTimeRestart);
          initTestCountdown();
        };
        reactionZone.addEventListener('click', oneTimeRestart, { once: true });
      }
    }, 1200);
  }

  // Reacción Exitosa y Cálculo de Telemetría
  function handleReactionSuccess(timeMs) {
    gameState = 'FINISHED';
    window.racingAudio.playTouchHit();

    // Guardar en Storage y sincronizar con Admin en vivo
    const rating = window.racingStorage.calculateRating(timeMs);
    const savedEntry = window.racingStorage.saveParticipant({
      name: currentPlayer.name,
      email: currentPlayer.email,
      timeMs: timeMs,
      rating: rating
    });

    if (timeMs < 250) {
      window.racingAudio.playFanfare();
    }

    // Pasar a pantalla de resultados
    setTimeout(() => {
      showResults(timeMs, rating);
    }, 400);
  }

  // Mostrar Pantalla de Resultados
  function showResults(timeMs, rating) {
    screenTest.style.display = 'none';
    screenResults.style.display = 'block';

    // Rellenar métricas
    resultTimeNumber.textContent = timeMs;
    resultBadge.className = `result-badge ${rating.classBadge}`;
    resultRankIcon.textContent = rating.icon;
    resultRankText.textContent = rating.tier;

    // Métricas complementarias
    document.getElementById('telemetry-player-name').textContent = currentPlayer.name;
    document.getElementById('telemetry-verstappen-diff').textContent = (timeMs <= 200) ? '¡Superaste a un piloto F1!' : `+${timeMs - 200} ms`;
    document.getElementById('telemetry-speed-rank').textContent = timeMs < 280 ? 'Élite' : (timeMs < 380 ? 'Avanzado' : 'Normal');
  }

  // Botón: Reintentar con el mismo participante
  btnRetry.addEventListener('click', () => {
    screenResults.style.display = 'none';
    screenTest.style.display = 'block';
    initTestCountdown();
  });

  // Botón: Siguiente Participante (limpia y vuelve a pantalla de registro)
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
