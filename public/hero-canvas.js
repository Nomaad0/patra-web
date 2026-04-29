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

  function randCandle(W, H, forceY){
    var dir = Math.random() > .5 ? 1 : -1; // 1 = descend, -1 = monte
    return {
      x:     (.04 + Math.random() * .92) * W,
      y:     forceY !== undefined ? forceY : (.05 + Math.random() * .90) * H,
      vy:    (0.18 + Math.random() * 0.32) * dir,   // px/frame
      vx:    (Math.random() - .5) * 0.08,            // légère dérive horizontale
      body:  .030 + Math.random() * .080,
      wick:  .015 + Math.random() * .040,
      bull:  Math.random() > .42,
      op:    .12 + Math.random() * .24,
      scale: .45 + Math.random() * 1.0,
      dir:   dir
    };
  }

  function initCandles(){
    var W = canvas.width, H = canvas.height;
    var candles = [];
    for(var i = 0; i < 18; i++) candles.push(randCandle(W, H));
    return candles;
  }

  var candles = initCandles();

  function draw(){
    if(prefersReduced){ return; }
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    candles.forEach(function(cd, i){
      // déplacement
      cd.y += cd.vy;
      cd.x += cd.vx;

      var bh  = cd.body  * H * cd.scale;
      var wh  = cd.wick  * H * cd.scale;
      var bw  = 13 * cd.scale;
      var margin = bh/2 + wh + 20;

      // fade selon la proximité des bords
      var fadeTop    = Math.min(1, cd.y / (H * .12));
      var fadeBottom = Math.min(1, (H - cd.y) / (H * .12));
      var fade       = Math.min(fadeTop, fadeBottom);
      var op = cd.op * fade;

      // reset quand sorti du cadre
      if(cd.y < -margin || cd.y > H + margin){
        var entryY = cd.dir === 1 ? -margin : H + margin;
        candles[i] = randCandle(W, H, entryY);
        candles[i].dir = cd.dir * -1; // alterne direction à la réapparition
        candles[i].vy  = (0.18 + Math.random() * 0.32) * candles[i].dir;
        return;
      }

      var col = cd.bull ? '79,143,247' : '168,85,247';

      // mèche
      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(cd.x, cd.y - bh/2 - wh);
      ctx.lineTo(cd.x, cd.y + bh/2 + wh);
      ctx.stroke();

      // corps
      ctx.fillStyle   = 'rgba('+col+','+(op * .65)+')';
      ctx.strokeStyle = 'rgba('+col+','+op+')';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.rect(cd.x - bw/2, cd.y - bh/2, bw, bh);
      ctx.fill();
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
