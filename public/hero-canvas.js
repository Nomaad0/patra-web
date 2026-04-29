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

  var candles = [];
  for(var i=0; i<16; i++){
    candles.push({
      x: .04 + Math.random() * .92,
      y: .05 + Math.random() * .90,
      body: .028 + Math.random() * .075,
      wick: .014 + Math.random() * .038,
      bull: Math.random() > .42,
      op: .10 + Math.random() * .22,
      speed: .00014 + Math.random() * .00018,
      ph: Math.random() * Math.PI * 2,
      scale: .45 + Math.random() * .95
    });
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(t){
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    candles.forEach(function(cd){
      var cx = cd.x * W;
      var cy = prefersReduced
        ? cd.y * H
        : (cd.y + Math.sin(t * cd.speed + cd.ph) * .18 + Math.sin(t * cd.speed * 2.3 + cd.ph) * .06) * H;
      var bh = cd.body * H * cd.scale;
      var wh = cd.wick * H * cd.scale;
      var bw = 13 * cd.scale;
      var op = cd.op + Math.sin(t * cd.speed * 1.5 + cd.ph) * .04;
      var col = cd.bull ? '79,143,247' : '168,85,247';

      // mèche
      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - bh/2 - wh);
      ctx.lineTo(cx, cy + bh/2 + wh);
      ctx.stroke();

      // corps
      ctx.fillStyle   = 'rgba('+col+','+(op * .65)+')';
      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(cx - bw/2, cy - bh/2, bw, bh);
      ctx.fill();
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
