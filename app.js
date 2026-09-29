/**
 * LUMINA AUTH - DYNAMIC ENGINE
 * - HTML5 Canvas Constellation Physics
 * - Mouse Follow Spotlight
 * - Web Audio Sound Synthesizer
 * - Smart Email Domain Predictor
 * - Password Strength Analyzer & Caps Lock Detection
 * - Magic Link & OTP Code Flow
 * - Confetti Celebration Engine & Toast Notifications
 */

// ==========================================================================
// 1. Web Audio Sound Synthesizer (Zero Dependencies)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window.AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  click() {
    this.playTone(820, 'triangle', 0.05, 0.04);
  }

  tab() {
    this.playTone(580, 'sine', 0.07, 0.05);
  }

  chip() {
    this.playTone(950, 'sine', 0.06, 0.03);
  }

  success() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.18, 0.06), i * 70);
    });
  }

  error() {
    this.playTone(220, 'sawtooth', 0.15, 0.05);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

const sfx = new SoundFX();

// ==========================================================================
// 2. Interactive Background Canvas (Constellation & Particle Mesh)
// ==========================================================================
class CanvasConstellation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999, radius: 150 };
    this.config = {
      particleCount: 65,
      connectionDistance: 130,
      baseSpeed: 0.4
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.config.particleCount = window.innerWidth < 768 ? 35 : 70;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.baseSpeed,
        vy: (Math.random() - 0.5) * this.config.baseSpeed,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? 'rgba(99, 102, 241,' : (i % 3 === 1 ? 'rgba(6, 182, 212,' : 'rgba(168, 85, 247,'),
        baseAlpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
      }

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${p.baseAlpha})`;
      this.ctx.fill();

      // Connect neighbor particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const distance = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (distance < this.config.connectionDistance) {
          const alpha = (1 - distance / this.config.connectionDistance) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================================================
// 3. Confetti Celebration Burst (Canvas-Based)
// ==========================================================================
function launchConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ffffff'];
  const confettiCount = 100;
  const confettis = [];

  for (let i = 0; i < confettiCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 9 + 4;
    confettis.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      gravity: 0.28,
      opacity: 1
    });
  }

  let frames = 0;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    for (let p of confettis) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    frames++;
    if (activeCount > 0 && frames < 140) {
      requestAnimationFrame(updateConfetti);
    } else {
      canvas.remove();
    }
  }

  updateConfetti();
}

// ==========================================================================
// 4. Toast Notification Service
// ==========================================================================
function showToast(title, message, type = 'info', duration = 3800) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    info: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ==========================================================================
// 5. Main App Initialization & Interactive Logic
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas constellation
  new CanvasConstellation('bgCanvas');

  // Ambient Cursor Glow & Card Spotlight
  const cursorGlow = document.getElementById('ambientCursorGlow');
  const authCard = document.getElementById('authCard');

  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    if (authCard) {
      const rect = authCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      authCard.style.setProperty('--mouse-x', `${x}px`);
      authCard.style.setProperty('--mouse-y', `${y}px`);
    }
  });

  // Sound toggle button
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = sfx.toggleMute();
      if (soundIcon) {
        soundIcon.innerHTML = isMuted
          ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`
          : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
      }
      showToast(isMuted ? 'Muted' : 'Audio Enabled', isMuted ? 'Sound effects disabled' : 'Interactive audio active', 'info', 2000);
    });
  }

  // ========================================================================
  // Tab Switching (Sign In / Magic Link / Sign Up)
  // ========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.getElementById('tabIndicator');
  const authPanels = {
    signin: document.getElementById('panelSignIn'),
    magic: document.getElementById('panelMagicLink'),
    signup: document.getElementById('panelSignUp')
  };

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      sfx.tab();
      const targetTab = btn.getAttribute('data-tab');

      // Update indicator position
      if (tabIndicator) {
        tabIndicator.style.transform = `translateX(${index * 100}%)`;
      }

      // Update active button state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all panels, show active
      Object.values(authPanels).forEach(panel => {
        if (panel) panel.classList.remove('active');
      });

      if (authPanels[targetTab]) {
        authPanels[targetTab].classList.add('active');
      }

      // Reset magic link sent view if switching away
      const magicSentView = document.getElementById('magicLinkSentView');
      const magicFormView = document.getElementById('magicLinkFormView');
      if (magicSentView && magicFormView) {
        magicSentView.classList.remove('active');
        magicFormView.style.display = 'block';
      }
    });
  });

  // ========================================================================
  // Smart Email Domain Suggestions
  // ========================================================================
  const domains = ['@gmail.com', '@outlook.com', '@icloud.com', '@proton.me', '@company.com'];

  function setupDomainSuggestions(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;

    function renderChips(typedValue) {
      container.innerHTML = '';
      if (!typedValue || typedValue.includes('@')) {
        // If user already typed @, check if they are typing domain
        if (typedValue && typedValue.includes('@')) {
          const parts = typedValue.split('@');
          const prefix = parts[0];
          const typedDomain = parts[1].toLowerCase();

          const matches = domains.filter(d => d.slice(1).startsWith(typedDomain));
          if (matches.length > 0 && typedDomain.length > 0 && typedDomain !== matches[0].slice(1)) {
            matches.slice(0, 3).forEach(dom => {
              const chip = document.createElement('button');
              chip.type = 'button';
              chip.className = 'domain-chip';
              chip.textContent = `${prefix}${dom}`;
              chip.addEventListener('click', () => {
                sfx.chip();
                input.value = `${prefix}${dom}`;
                container.innerHTML = '';
                input.focus();
              });
              container.appendChild(chip);
            });
            return;
          }
        }
        return;
      }

      // User typed username before @
      domains.slice(0, 4).forEach(dom => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'domain-chip';
        chip.textContent = dom;
        chip.addEventListener('click', () => {
          sfx.chip();
          input.value = `${typedValue}${dom}`;
          container.innerHTML = '';
          input.focus();
        });
        container.appendChild(chip);
      });
    }

    input.addEventListener('input', (e) => {
      renderChips(e.target.value.trim());
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        container.innerHTML = '';
      }, 250);
    });

    input.addEventListener('focus', () => {
      renderChips(input.value.trim());
    });
  }

  setupDomainSuggestions('signInEmail', 'signInDomainChips');
  setupDomainSuggestions('magicEmail', 'magicDomainChips');
  setupDomainSuggestions('signUpEmail', 'signUpDomainChips');

  // Clear Input Buttons
  document.querySelectorAll('.btn-clear-input').forEach(btn => {
    btn.addEventListener('click', (e) => {
      sfx.click();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input'));
      }
    });
  });

  // Password Visibility Toggle
  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Toggle icon path
        btn.innerHTML = isPassword
          ? `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>`
          : `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
      }
    });
  });

  // Caps Lock Warning Detection
  function watchCapsLock(inputId, warningId) {
    const input = document.getElementById(inputId);
    const warning = document.getElementById(warningId);
    if (!input || !warning) return;

    ['keydown', 'keyup'].forEach(ev => {
      input.addEventListener(ev, (e) => {
        if (e.getModifierState && e.getModifierState('CapsLock')) {
          warning.classList.add('visible');
        } else {
          warning.classList.remove('visible');
        }
      });
    });

    input.addEventListener('blur', () => warning.classList.remove('visible'));
  }

  watchCapsLock('signInPassword', 'signInCapsLock');
  watchCapsLock('signUpPassword', 'signUpCapsLock');

  // ========================================================================
  // Password Strength Analyzer (Sign Up)
  // ========================================================================
  const signUpPwd = document.getElementById('signUpPassword');
  const strengthWrap = document.getElementById('signUpStrengthMeter');
  const strengthStatus = document.getElementById('strengthStatusText');
  const bars = [
    document.getElementById('strBar1'),
    document.getElementById('strBar2'),
    document.getElementById('strBar3'),
    document.getElementById('strBar4')
  ];

  const criteria = {
    length: document.getElementById('critLength'),
    number: document.getElementById('critNumber'),
    upper: document.getElementById('critUpper'),
    special: document.getElementById('critSpecial')
  };

  if (signUpPwd && strengthWrap) {
    signUpPwd.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        strengthWrap.classList.remove('active');
        return;
      }
      strengthWrap.classList.add('active');

      const hasLength = val.length >= 8;
      const hasNumber = /\d/.test(val);
      const hasUpper = /[A-Z]/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val);

      criteria.length?.classList.toggle('met', hasLength);
      criteria.number?.classList.toggle('met', hasNumber);
      criteria.upper?.classList.toggle('met', hasUpper);
      criteria.special?.classList.toggle('met', hasSpecial);

      const score = [hasLength, hasNumber, hasUpper, hasSpecial].filter(Boolean).length;

      // Color tiers
      const colors = ['#f43f5e', '#f59e0b', '#06b6d4', '#10b981'];
      const labels = ['Weak', 'Fair', 'Good', 'Unbreakable'];

      bars.forEach((bar, idx) => {
        if (idx < score) {
          bar.style.backgroundColor = colors[score - 1];
        } else {
          bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });

      if (strengthStatus) {
        strengthStatus.textContent = labels[score - 1] || 'Too short';
        strengthStatus.style.color = colors[score - 1] || '#94a3b8';
      }
    });
  }

  // ========================================================================
  // Form Submission Handlers (Simulated 60FPS Dynamic Auth)
  // ========================================================================
  const formSignIn = document.getElementById('formSignIn');
  const formSignUp = document.getElementById('formSignUp');
  const formMagic = document.getElementById('formMagic');
  const successOverlay = document.getElementById('successOverlay');
  const successMsg = document.getElementById('successUserMsg');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function triggerCardShake() {
    sfx.error();
    authCard.classList.remove('shake-error');
    void authCard.offsetWidth; // Trigger reflow
    authCard.classList.add('shake-error');
  }

  function triggerAuthSuccess(title, userEmail) {
    sfx.success();
    launchConfetti();
    if (successMsg) {
      successMsg.innerHTML = `Authenticated as <strong style="color:#67e8f9;">${userEmail}</strong>. Session encrypted with zero-knowledge token.`;
    }
    if (successOverlay) {
      successOverlay.classList.add('active');
    }
  }

  // 1. Sign In Submit
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signInEmail').value.trim();
      const pwd = document.getElementById('signInPassword').value;
      const submitBtn = document.getElementById('btnSignInSubmit');

      if (!validateEmail(email)) {
        triggerCardShake();
        showToast('Invalid Email', 'Please enter a valid email address.', 'error');
        document.getElementById('signInEmail').focus();
        return;
      }

      if (!pwd || pwd.length < 6) {
        triggerCardShake();
        showToast('Password Required', 'Password must be at least 6 characters.', 'error');
        document.getElementById('signInPassword').focus();
        return;
      }

      // Simulated network verification
      sfx.click();
      submitBtn.classList.add('loading');

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        triggerAuthSuccess('Welcome back!', email);
      }, 1100);
    });
  }

  // 2. Magic Link Submit & OTP Code Simulation
  if (formMagic) {
    const magicFormView = document.getElementById('magicLinkFormView');
    const magicSentView = document.getElementById('magicLinkSentView');
    const magicTargetEmail = document.getElementById('magicTargetEmail');
    const resendBtn = document.getElementById('magicResendBtn');
    const countdownSpan = document.getElementById('magicCountdown');

    formMagic.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('magicEmail').value.trim();
      const submitBtn = document.getElementById('btnMagicSubmit');

      if (!validateEmail(email)) {
        triggerCardShake();
        showToast('Invalid Email', 'Please enter a valid email for magic link delivery.', 'error');
        return;
      }

      sfx.click();
      submitBtn.classList.add('loading');

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        magicFormView.style.display = 'none';
        magicSentView.classList.add('active');
        if (magicTargetEmail) magicTargetEmail.textContent = email;

        sfx.playTone(880, 'sine', 0.15, 0.05);
        showToast('Magic Link Dispatched', `Instant login link sent to ${email}`, 'success');

        // Focus first OTP input
        const firstOtp = document.querySelector('.otp-digit-input');
        if (firstOtp) firstOtp.focus();

        // Start 60s countdown
        let count = 60;
        if (resendBtn) resendBtn.disabled = true;
        const timer = setInterval(() => {
          count--;
          if (countdownSpan) countdownSpan.textContent = `(${count}s)`;
          if (count <= 0) {
            clearInterval(timer);
            if (countdownSpan) countdownSpan.textContent = '';
            if (resendBtn) resendBtn.disabled = false;
          }
        }, 1000);
      }, 1000);
    });

    // Auto-advance OTP inputs
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    otpInputs.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        sfx.chip();
        if (input.value.length >= 1) {
          input.value = input.value.slice(0, 1);
          if (idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
          } else {
            // All digits filled - auto verify!
            const fullOtp = Array.from(otpInputs).map(i => i.value).join('');
            if (fullOtp.length === 6) {
              const email = document.getElementById('magicEmail').value.trim();
              showToast('Verifying Token...', 'Validating cryptographic OTP token', 'info');
              setTimeout(() => {
                triggerAuthSuccess('Magic Link Authenticated', email);
              }, 700);
            }
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          otpInputs[idx - 1].focus();
        }
      });
    });

    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        sfx.click();
        showToast('Resent!', 'New verification link sent to your inbox', 'info');
      });
    }
  }

  // 3. Sign Up Submit
  if (formSignUp) {
    formSignUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName').value.trim();
      const email = document.getElementById('signUpEmail').value.trim();
      const pwd = document.getElementById('signUpPassword').value;
      const terms = document.getElementById('signUpTerms').checked;
      const submitBtn = document.getElementById('btnSignUpSubmit');

      if (!name) {
        triggerCardShake();
        showToast('Name Required', 'Please enter your full name.', 'error');
        document.getElementById('signUpName').focus();
        return;
      }

      if (!validateEmail(email)) {
        triggerCardShake();
        showToast('Invalid Email', 'Please enter a valid work or personal email.', 'error');
        document.getElementById('signUpEmail').focus();
        return;
      }

      if (pwd.length < 8) {
        triggerCardShake();
        showToast('Weak Password', 'Password must be at least 8 characters long.', 'error');
        document.getElementById('signUpPassword').focus();
        return;
      }

      if (!terms) {
        triggerCardShake();
        showToast('Terms Required', 'Please agree to the Security Terms & Privacy Policy.', 'error');
        return;
      }

      sfx.click();
      submitBtn.classList.add('loading');

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        triggerAuthSuccess('Account Provisioned!', email);
      }, 1200);
    });
  }

  // Reset Session from Success Overlay
  const resetBtn = document.getElementById('btnResetSession');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      sfx.click();
      if (successOverlay) {
        successOverlay.classList.remove('active');
      }
      showToast('Session Reset', 'Ready for next authentication', 'info', 2000);
    });
  }

  // Social OAuth click simulation
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      const provider = btn.getAttribute('data-provider') || 'OAuth';
      showToast('Connecting Identity Provider', `Redirecting to verified ${provider} handshake...`, 'info', 2500);
      btn.style.transform = 'scale(0.96)';
      setTimeout(() => {
        btn.style.transform = '';
        triggerAuthSuccess(`Verified via ${provider}`, `user@${provider.toLowerCase()}.id`);
      }, 1300);
    });
  });
});
