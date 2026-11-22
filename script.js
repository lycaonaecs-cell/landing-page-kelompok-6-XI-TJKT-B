/* ============================================================
   SKYNET SOLUSINDO — MAIN SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ───── CACHED ELEMENTS ─────
  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.querySelectorAll('.nav__link');
  const sections    = document.querySelectorAll('section[id]');
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');

  // ───── MOBILE NAV OVERLAY ─────
  // Create overlay element for mobile navigation
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  // ───── HEADER SCROLL EFFECT ─────
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Add/remove scrolled class
        if (scrollY > 50) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        lastScroll = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ───── HAMBURGER MENU ─────
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('active');
    navbar.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navbar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ───── ACTIVE NAV LINK ON SCROLL ─────
  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ───── SMOOTH SCROLL FOR ANCHOR LINKS ─────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ───── SCROLL REVEAL ─────
  const revealElements = document.querySelectorAll(
    '.section__header, .service-card, .process-card, .system-status-widget, .network-map-container, .whyus-card, .portfolio-card, .contact-item, .contact__visual'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards within the same section
    if (el.classList.contains('service-card') || el.classList.contains('process-card') ||
        el.classList.contains('whyus-card') || el.classList.contains('portfolio-card') ||
        el.classList.contains('contact-item')) {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    }
    revealObserver.observe(el);
  });

  // ───── COUNTER ANIMATION ─────
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Observe stats section
  const statsSection = document.querySelector('.hero__stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ───── SERVER UNIT HOVER GLOW (SVG) ─────
  const serverUnits = document.querySelectorAll('.server-unit');
  serverUnits.forEach(unit => {
    const rect = unit.querySelector('rect');
    if (rect) {
      unit.addEventListener('mouseenter', () => {
        rect.style.transition = 'stroke 0.3s ease';
        rect.style.stroke = '#2563eb';
      });
      unit.addEventListener('mouseleave', () => {
        rect.style.stroke = '#1e3a5f';
      });
    }
  });

  // ───── INTERACTIVE NETWORK MAP ─────
  const networkNodes = document.querySelectorAll('.net-node--interactive');
  const hudNodeTitle = document.getElementById('hudNodeTitle');
  const hudNodeRole = document.getElementById('hudNodeRole');
  const hudNodeProtocol = document.getElementById('hudNodeProtocol');
  const hudNodeSpeed = document.getElementById('hudNodeSpeed');
  const hudNodeSecurity = document.getElementById('hudNodeSecurity');

  const nodeData = {
    internet: {
      title: 'Internet (WAN Gateway)',
      role: 'Penyedia konektivitas global fiber optic kecepatan tinggi dengan multi-upstream redundancy.',
      protocol: 'BGP, IPv4 / IPv6 Dual-Stack, DNSSEC',
      speed: '10 Gbps Symmetrical Uplink',
      security: 'Mitigasi Anti-DDoS & Hardware Firewall Layer 7'
    },
    router: {
      title: 'Router (MikroTik Core Gateway)',
      role: 'Mengatur routing tabel dinamis, manajemen bandwidth traffic, load-balancing, dan pembagian segmen VLAN kantor.',
      protocol: 'OSPF, RIP, WireGuard VPN, DHCP Server',
      speed: 'Throughput 10 Gbps Routing Wire-Speed',
      security: 'Stateful Packet Inspection, NAT, Port Security'
    },
    server: {
      title: 'Server (Data Center & Cloud)',
      role: 'Pusat penyimpanan database terenkripsi, virtualisasi server aplikasi bisnis, dan backup otomatis offsite.',
      protocol: 'TCP/IP, SSH, TLS 1.3, NFS / SMB, LDAP',
      speed: 'Dual 10GbE SFP+ Direct Attached Storage',
      security: 'Automated Snapshot, RAID 10 Redundancy, ACL'
    },
    computer: {
      title: 'Komputer (Client Workstation)',
      role: 'Perangkat kerja operasional karyawan dan terminal akses yang terhubung aman ke jaringan lokal (LAN & Wi-Fi).',
      protocol: 'Gigabit Ethernet (Cat6a), Wi-Fi 6 (802.11ax), WPA3',
      speed: '1000 Mbps Full-Duplex per Workstation',
      security: '802.1X Network Access Control & Endpoint Shield'
    }
  };

  function activateNode(nodeKey) {
    if (!nodeData[nodeKey]) return;

    // Update active class on nodes
    networkNodes.forEach(node => {
      if (node.getAttribute('data-node') === nodeKey) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });

    // Update HUD inspector
    if (hudNodeTitle) {
      hudNodeTitle.textContent = nodeData[nodeKey].title;
      hudNodeRole.textContent = nodeData[nodeKey].role;
      hudNodeProtocol.textContent = nodeData[nodeKey].protocol;
      hudNodeSpeed.textContent = nodeData[nodeKey].speed;
      hudNodeSecurity.textContent = nodeData[nodeKey].security;
    }
  }

  networkNodes.forEach(node => {
    const key = node.getAttribute('data-node');

    node.addEventListener('click', () => activateNode(key));
    node.addEventListener('mouseenter', () => activateNode(key));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateNode(key);
      }
    });
  });

  // ───── SYSTEM STATUS TELEMETRY SIMULATION ─────
  const latencyElem = document.getElementById('telemetryLatency');
  if (latencyElem) {
    setInterval(() => {
      const ping = (1.2 + Math.random() * 0.5).toFixed(1);
      latencyElem.textContent = `${ping} ms`;
    }, 4000);
  }

  // ───── LIVE WALLPAPER: GLOBAL CYBER NETWORK CONSTELLATION ─────
  // Active across entire website except footer
  const canvas = document.getElementById('globalLiveCanvas') || document.getElementById('liveWallpaperCanvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let isVisible = true;

    // Mouse telemetry across window
    const mouse = {
      x: null,
      y: null,
      radius: 180
    };

    // Shockwave ripples
    const ripples = [];

    function resizeCanvas() {
      width = window.innerWidth || document.documentElement.clientWidth || 1200;
      height = window.innerHeight || document.documentElement.clientHeight || 800;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    }

    // Particle nodes
    let particles = [];
    const maxDistance = 145;
    const colors = [
      'rgba(37, 99, 235, ',   // Electric Blue
      'rgba(29, 78, 216, ',   // Navy Blue
      'rgba(2, 132, 199, '    // Deep Sky Blue
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
        this.y = Math.random() * height;
        const speed = 0.35 + Math.random() * 0.45;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = 2.4 + Math.random() * 2.2;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = 0.55 + Math.random() * 0.35;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulseAngle += this.pulseSpeed;

        // Position update
        this.x += this.vx;
        this.y += this.vy;

        // Wrap or bounce on boundary
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        else if (this.x > width) { this.x = width; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        else if (this.y > height) { this.y = height; this.vy *= -1; }

        // Mouse organic interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const pushX = (dx / (dist || 1)) * force * 2.5;
            const pushY = (dy / (dist || 1)) * force * 2.5;
            this.x += pushX;
            this.y += pushY;
          }
        }

        // Ripple interaction
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          const dx = this.x - r.x;
          const dy = this.y - r.y;
          const dist = Math.hypot(dx, dy);
          const diff = dist - r.radius;

          if (Math.abs(diff) < 30) {
            const push = ((30 - Math.abs(diff)) / 30) * r.strength;
            this.x += (dx / (dist || 1)) * push;
            this.y += (dy / (dist || 1)) * push;
          }
        }
      }

      draw() {
        const alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0.2, alpha)})`;
        ctx.shadowColor = 'rgba(37, 99, 235, 0.45)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Packet pulse along links
    const packets = [];
    class Packet {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.progress = 0;
        this.speed = 0.012 + Math.random() * 0.015;
      }
      update() {
        this.progress += this.speed;
      }
      draw() {
        const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
        const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.95)';
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((width * height) / 13000), 85);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    // Animation loop
    function animate() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.02;
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(37, 99, 235, ${r.alpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Spawn data packet occasionally
            if (packets.length < 6 && Math.random() < 0.0008) {
              packets.push(new Packet(p1, p2));
            }
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const opacity = (1 - dist / mouse.radius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw data packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const pkt = packets[i];
        pkt.update();
        pkt.draw();
        if (pkt.progress >= 1) {
          packets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Global Event listeners
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('click', (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 12,
        speed: 4.5,
        strength: 5,
        alpha: 1
      });
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Throttled window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
      }, 150);
    });

    // Battery & GPU friendly: Pause when tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isVisible = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        isVisible = true;
        if (!animationFrameId) {
          animate();
        }
      }
    });

    // Initial setup
    resizeCanvas();
    animate();
    window.addEventListener('load', resizeCanvas);
  }

  // ───── INITIAL STATE ─────
  // Trigger scroll check on load
  onScroll();
  updateActiveNav();
});
