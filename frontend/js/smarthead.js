//------------------------ SMARTHEADER ANIMATION -------------------------//
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tech-smart');
  const ctx = canvas.getContext('2d');

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  const mouse = { x: width / 2, y: height / 2, radius: 150 };
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  const particleCount = 80;
  const particles = [];
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: Math.random()*width,
      y: Math.random()*height,
      vx: (Math.random()-0.5)*0.8,
      vy: (Math.random()-0.5)*0.8,
      baseRadius: Math.random()*2+1.5,
      radius: 0,
      phase: Math.random()*Math.PI*2
    });
  }

  function draw() {
    ctx.clearRect(0,0,width,height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if(p.x<0||p.x>width) p.vx*=-1;
      if(p.y<0||p.y>height) p.vy*=-1;

      p.phase += 0.05;
      p.radius = p.baseRadius + Math.sin(p.phase)*1.5;

      let grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.radius*5);
      grad.addColorStop(0,'rgba(70, 203, 255, 0.9)');
      grad.addColorStop(1,'rgb(126, 229, 255)');

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${1-dist/120})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }

      const dxm = particles[i].x - mouse.x;
      const dym = particles[i].y - mouse.y;
      const distMouse = Math.sqrt(dxm*dxm + dym*dym);
      if(distMouse<mouse.radius){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - distMouse/mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
});
