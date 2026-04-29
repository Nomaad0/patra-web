(function(){
  var canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var wrap = canvas.parentElement;

  function resize(){
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight || 700;
  }
  resize();
  window.addEventListener('resize', resize);

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // dir = -1 : monte (bleu), dir = 1 : descend (violet)
  function randCandle(W, H, startY, dir){
    if(dir === undefined) dir = Math.random() > .5 ? 1 : -1;
    var y = startY !== undefined ? startY : (.05 + Math.random() * .90) * H;
    return {
      x:     (.04 + Math.random() * .92) * W,
      y:     y,
      vy:    (0.20 + Math.random() * 0.35) * dir,
      vx:    (Math.random() - .5) * 0.07,
      body:  .030 + Math.random() * .080,
      wick:  .015 + Math.random() * .040,
      dir:   dir,
      op:    .13 + Math.random() * .24,
      scale: .45 + Math.random() * 1.0,
    };
  }

  var isMobile = window.innerWidth < 600;
  var COUNT = isMobile ? 9 : 18;
  var candles = [];
  var W = canvas.width, H = canvas.height;
  for(var i = 0; i < COUNT; i++) candles.push(randCandle(W, H));

  function draw(){
    if(prefersReduced) return;
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    for(var i = 0; i < candles.length; i++){
      var cd = candles[i];
      cd.y += cd.vy;
      cd.x += cd.vx;

      var bh     = cd.body * H * cd.scale;
      var wh     = cd.wick * H * cd.scale;
      var bw     = 13 * cd.scale;
      var margin = bh/2 + wh + 20;

      // sorti par le bas → réapparaît en haut avec la même direction
      if(cd.y > H + margin){
        candles[i] = randCandle(W, H, -margin, cd.dir);
        continue;
      }
      // sorti par le haut → réapparaît en bas avec la même direction
      if(cd.y < -margin){
        candles[i] = randCandle(W, H, H + margin, cd.dir);
        continue;
      }

      // fade aux bords
      var fadeTop    = Math.min(1, cd.y / (H * .10));
      var fadeBottom = Math.min(1, (H - cd.y) / (H * .10));
      var op = cd.op * Math.min(fadeTop, fadeBottom);

      // bleu = monte (dir=-1), violet = descend (dir=1)
      var col = cd.dir === -1 ? '79,143,247' : '168,85,247';

      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(cd.x, cd.y - bh/2 - wh);
      ctx.lineTo(cd.x, cd.y + bh/2 + wh);
      ctx.stroke();

      ctx.fillStyle   = 'rgba('+col+','+(op * .65)+')';
      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.rect(cd.x - bw/2, cd.y - bh/2, bw, bh);
      ctx.fill();
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
