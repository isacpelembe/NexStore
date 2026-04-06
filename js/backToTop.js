/*------------------------ BACK TO TOP ------------------------*/
const backToTop = document.querySelector('.backToTop');
const progressCircle = backToTop.querySelectorAll('circle')[1];
const radius = 18;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  const offset = circumference * (1 - scrollPercent);
  progressCircle.style.strokeDashoffset = offset;

  backToTop.classList.toggle('show', scrollTop > 150);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('mousemove', e => {
  const rect = backToTop.getBoundingClientRect();
  const bx = rect.left + rect.width / 2;
  const by = rect.top + rect.height / 2;

  const dx = e.clientX - bx;
  const dy = e.clientY - by;
  const distance = Math.hypot(dx, dy);

  if (distance < 80) {
    backToTop.style.setProperty('--mx', dx * 0.3 + 'px');
    backToTop.style.setProperty('--my', dy * 0.3 + 'px');
    backToTop.classList.add('magnet');
  } else {
    backToTop.style.setProperty('--mx', '0px');
    backToTop.style.setProperty('--my', '0px');
    backToTop.classList.remove('magnet');
  }
});
