const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


const toggle = document.querySelector('.theme-toggle');

function actualizarBoton() {
  if (!toggle) return;
  const oscuro = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
}

function aplicarTema(tema) {
  root.dataset.theme = tema;
  try { localStorage.setItem('tema', tema); } catch (e) {}
  actualizarBoton();
}

if (toggle) {
  actualizarBoton();

  toggle.addEventListener('click', () => {
    const siguiente = root.dataset.theme === 'dark' ? 'light' : 'dark';

   
    if (!document.startViewTransition || reduceMotion) {
      aplicarTema(siguiente);
      return;
    }

  
    const r = toggle.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transicion = document.startViewTransition(() => aplicarTema(siguiente));
    transicion.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  });
}


function separarLetras(elemento) {
  let i = 0;
  const recorrer = nodo => {
    [...nodo.childNodes].forEach(hijo => {
      if (hijo.nodeType === Node.TEXT_NODE) {
        const fragmento = document.createDocumentFragment();
        [...hijo.textContent].forEach(letra => {
          if (letra.trim() === '') { fragmento.append(letra); return; }
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = letra;
          span.setAttribute('aria-hidden', 'true');
          span.style.setProperty('--i', i++);
          fragmento.append(span);
        });
        hijo.replaceWith(fragmento);
      } else if (hijo.nodeType === Node.ELEMENT_NODE) {
        recorrer(hijo);
      }
    });
  };
  recorrer(elemento);
}

if (!reduceMotion) {
  document.querySelectorAll('.split').forEach(separarLetras);
}


const typed = document.querySelector('.typed');

if (typed && !reduceMotion) {
  const frases = ['desarrollo frontend', 'desarrollo backend', 'bases de datos', 'aplicaciones web'];
  let f = 0;
  let i = 0;
  let borrando = false;

  const escribir = () => {
    const frase = frases[f];
    typed.textContent = frase.slice(0, i);

    if (!borrando && i < frase.length) {
      i++;
      setTimeout(escribir, 70);
    } else if (!borrando) {
      borrando = true;
      setTimeout(escribir, 1800);
    } else if (i > 0) {
      i--;
      setTimeout(escribir, 35);
    } else {
      borrando = false;
      f = (f + 1) % frases.length;
      setTimeout(escribir, 350);
    }
  };

  typed.textContent = '';
  setTimeout(escribir, 1200);
}


if (!reduceMotion && 'IntersectionObserver' in window) {
  const elementos = document.querySelectorAll('.section-head, .card, .subject-row, .empty, .page-head > *');
  elementos.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.setProperty('--d', `${Math.min(n++, 6) * 80}ms`);
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(el => observer.observe(el));
}


document.querySelectorAll('.glow').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - r.left}px`);
    card.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});


const brillo = document.querySelector('.cursor-glow');

if (brillo && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  window.addEventListener('pointermove', e => {
    brillo.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
}
