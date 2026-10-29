(function () {
  "use strict";

  var button = document.getElementById("cheer-button");
  var status = document.getElementById("cheer-status");
  var messages = ["为自己喝彩！", "今天也很棒，继续加油！", "每一步都值得点赞！", "辛苦啦，给自己一个赞！"];
  var messageIndex = 0;
  var statusTimer;
  var canvas;
  var context;
  var particles = [];
  var animationFrame;

  function showEncouragement() {
    status.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    status.classList.add("is-visible");
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      status.classList.remove("is-visible");
    }, 2200);
  }

  function createFirework(x, y) {
    var colors = ["#ffd166", "#4fb8c9", "#ff6b8a", "#a78bfa", "#ffffff"];
    var count = 34;
    var i;

    for (i = 0; i < count; i += 1) {
      var angle = Math.PI * 2 * i / count + Math.random() * 0.12;
      var speed = 1.5 + Math.random() * 3.2;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function animate() {
    var i;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (i = particles.length - 1; i >= 0; i -= 1) {
      var particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.vx *= 0.99;
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      context.globalAlpha = particle.life;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
    if (particles.length) {
      animationFrame = window.requestAnimationFrame(animate);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      animationFrame = null;
    }
  }

  function celebrate() {
    showEncouragement();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "cheer-fireworks";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      context = canvas.getContext("2d");
    }

    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    var rect = button.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    createFirework(x, y);
    createFirework(x - 24, y - 46);
    createFirework(x + 22, y - 88);

    if (animationFrame === null || animationFrame === undefined) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  }

  button.addEventListener("click", celebrate);
})();
