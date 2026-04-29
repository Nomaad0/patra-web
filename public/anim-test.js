function fitCanvas(canvas){
  var p=canvas.parentElement;
  canvas.width=p.offsetWidth;
  canvas.height=p.offsetHeight;
}

// ── A : Lignes de cours animées ───────────────────────────────────────────────
(function(){
  var c=document.getElementById('ca'); if(!c)return;
  var ctx=c.getContext('2d');
  fitCanvas(c); window.addEventListener('resize',function(){fitCanvas(c);});
  var lines=[];
  for(var i=0;i<6;i++){
    var pts=[]; var y0=0.15+i*0.13;
    for(var j=0;j<=12;j++) pts.push({x:j/12,y:y0+(Math.random()-.5)*.12});
    lines.push({pts:pts,color:i%2===0?'79,143,247':'168,85,247',speed:.00008+i*.00003,ph:i*1.1});
  }
  function draw(t){
    var W=c.width,H=c.height; ctx.clearRect(0,0,W,H);
    lines.forEach(function(l){
      ctx.beginPath();
      l.pts.forEach(function(p,i){
        var x=p.x*W, y=(p.y+Math.sin(t*l.speed+l.ph+p.x*3)*.04)*H;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.strokeStyle='rgba('+l.color+',.15)'; ctx.lineWidth=1.2; ctx.stroke();
    });
    var l=lines[2]; ctx.beginPath();
    l.pts.forEach(function(p,i){
      var x=p.x*W, y=(p.y+Math.sin(t*l.speed+l.ph+p.x*3)*.04)*H;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.strokeStyle='rgba(79,143,247,.55)'; ctx.lineWidth=2; ctx.stroke();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ── B : Faisceaux diagonaux montants ─────────────────────────────────────────
(function(){
  var c=document.getElementById('cb'); if(!c)return;
  var ctx=c.getContext('2d');
  fitCanvas(c); window.addEventListener('resize',function(){fitCanvas(c);});
  var beams=[
    {x:.05,w:.18,color:'79,143,247',op:.32,speed:.00012,ph:0},
    {x:.28,w:.12,color:'168,85,247',op:.28,speed:.00009,ph:1.8},
    {x:.48,w:.22,color:'79,143,247',op:.22,speed:.00015,ph:3.2},
    {x:.70,w:.14,color:'168,85,247',op:.30,speed:.00010,ph:0.9},
    {x:.88,w:.16,color:'79,143,247',op:.25,speed:.00013,ph:2.5},
  ];
  function draw(t){
    var W=c.width,H=c.height; ctx.clearRect(0,0,W,H);
    ctx.save(); ctx.transform(1,0,-0.5,1,0,0);
    beams.forEach(function(b){
      var drift=Math.sin(t*b.speed+b.ph)*30;
      var cx=(b.x*W*1.5)+drift, bw=b.w*W;
      var op=b.op+Math.sin(t*b.speed*1.3+b.ph)*.06;
      var g=ctx.createLinearGradient(cx-bw/2,0,cx+bw/2,0);
      g.addColorStop(0,'rgba('+b.color+',0)');
      g.addColorStop(.5,'rgba('+b.color+','+op+')');
      g.addColorStop(1,'rgba('+b.color+',0)');
      ctx.fillStyle=g; ctx.fillRect(cx-bw/2,-H*.2,bw,H*1.6);
    });
    ctx.restore(); requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ── C : Grille financière + glow ─────────────────────────────────────────────
(function(){
  var c=document.getElementById('cc'); if(!c)return;
  var ctx=c.getContext('2d');
  fitCanvas(c); window.addEventListener('resize',function(){fitCanvas(c);});
  var nodes=[];
  for(var i=0;i<8;i++) nodes.push({x:Math.random(),y:Math.random(),ph:Math.random()*Math.PI*2,speed:.0006+Math.random()*.0008,color:i%2===0?'79,143,247':'168,85,247'});
  function draw(t){
    var W=c.width,H=c.height; ctx.clearRect(0,0,W,H);
    var step=60;
    ctx.strokeStyle='rgba(79,143,247,.06)'; ctx.lineWidth=.8;
    for(var x=0;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(var y=0;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    nodes.forEach(function(n){
      var nx=n.x*W,ny=n.y*H;
      var pulse=.5+.5*Math.sin(t*n.speed+n.ph);
      var r=40+pulse*30, op=.2+pulse*.3;
      var g=ctx.createRadialGradient(nx,ny,0,nx,ny,r);
      g.addColorStop(0,'rgba('+n.color+','+op+')');
      g.addColorStop(1,'rgba('+n.color+',0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(nx,ny,r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba('+n.color+','+(op*2)+')';
      ctx.beginPath(); ctx.arc(nx,ny,2,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// ── D : Chandeliers flottants ─────────────────────────────────────────────────
(function(){
  var c=document.getElementById('cd'); if(!c)return;
  var ctx=c.getContext('2d');
  fitCanvas(c); window.addEventListener('resize',function(){fitCanvas(c);});
  var candles=[];
  for(var i=0;i<14;i++){
    candles.push({
      x:.05+Math.random()*.9, y:.1+Math.random()*.8,
      body:.025+Math.random()*.07, wick:.012+Math.random()*.035,
      bull:Math.random()>.45, op:.12+Math.random()*.2,
      speed:.00008+Math.random()*.00012, ph:Math.random()*Math.PI*2,
      scale:.5+Math.random()*.9
    });
  }
  function draw(t){
    var W=c.width,H=c.height; ctx.clearRect(0,0,W,H);
    candles.forEach(function(cd){
      var cx=cd.x*W, cy=(cd.y+Math.sin(t*cd.speed+cd.ph)*.05)*H;
      var bh=cd.body*H*cd.scale, wh=cd.wick*H*cd.scale, bw=14*cd.scale;
      var op=cd.op+Math.sin(t*cd.speed*1.5+cd.ph)*.04;
      var col=cd.bull?'79,143,247':'168,85,247';
      ctx.strokeStyle='rgba('+col+','+op+')'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx,cy-bh/2-wh); ctx.lineTo(cx,cy+bh/2+wh); ctx.stroke();
      ctx.fillStyle='rgba('+col+','+(op*.7)+')';
      ctx.strokeStyle='rgba('+col+','+op+')'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.rect(cx-bw/2,cy-bh/2,bw,bh);
      ctx.fill(); ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
