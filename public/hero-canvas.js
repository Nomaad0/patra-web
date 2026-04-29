(function(){
  var canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var wrap = canvas.parentElement;

  function resize(){
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight || 700;
  }
  resize();
  window.addEventListener('resize', resize);

  var blobs = [
    { x:.15, y:.25, r:.55, cx:79,  cg:143, cb:247, op:.65, vx:.00022,  vy:.00015,  ph:0   },
    { x:.85, y:.15, r:.48, cx:168, cg:85,  cb:247, op:.55, vx:-.00018, vy:.00020,  ph:2.1 },
    { x:.50, y:.80, r:.40, cx:79,  cg:143, cb:247, op:.40, vx:.00015,  vy:-.00018, ph:4.4 },
    { x:.28, y:.60, r:.32, cx:168, cg:85,  cb:247, op:.35, vx:-.00012, vy:.00022,  ph:1.3 },
  ];

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(t){
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    blobs.forEach(function(b){
      var drift = prefersReduced ? 0 : .14;
      var bx = (b.x + Math.sin(t * b.vx + b.ph) * drift) * W;
      var by = (b.y + Math.cos(t * b.vy + b.ph) * drift) * H;
      var radius = b.r * Math.min(W, H);

      var g = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
      g.addColorStop(0,    'rgba('+b.cx+','+b.cg+','+b.cb+','+b.op+')');
      g.addColorStop(0.25, 'rgba('+b.cx+','+b.cg+','+b.cb+','+(b.op*.7)+')');
      g.addColorStop(0.6,  'rgba('+b.cx+','+b.cg+','+b.cb+','+(b.op*.2)+')');
      g.addColorStop(1,    'rgba('+b.cx+','+b.cg+','+b.cb+',0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
