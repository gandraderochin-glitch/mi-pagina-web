// =============================================================
// CAZADORES TRANSPORTES — Interacciones del sitio
// =============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header con fondo al hacer scroll ----
  const encabezado = document.querySelector('.encabezado');
  const alScroll = () => {
    if (window.scrollY > 30) encabezado.classList.add('activo');
    else encabezado.classList.remove('activo');
  };
  window.addEventListener('scroll', alScroll);
  alScroll();

  // ---- Menú móvil ----
  const botonMenu = document.querySelector('.boton-menu');
  const menuMovil = document.querySelector('.menu-movil');
  const cerrarMenu = document.querySelector('.cerrar-menu');

  const abrirMenu = () => menuMovil.classList.add('abierto');
  const ocultarMenu = () => menuMovil.classList.remove('abierto');

  botonMenu?.addEventListener('click', abrirMenu);
  cerrarMenu?.addEventListener('click', ocultarMenu);
  menuMovil?.querySelectorAll('a').forEach(a => a.addEventListener('click', ocultarMenu));

  // ---- Año dinámico en footer ----
  const anioEl = document.querySelector('#anio-actual');
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  // ---- Reveal al hacer scroll (Intersection Observer) ----
  const elementosRevelar = document.querySelectorAll('.revelar');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });
  elementosRevelar.forEach(el => observador.observe(el));

  // ---- Contador animado en sección de números ----
  const numeros = document.querySelectorAll('.numero-item .num[data-objetivo]');
  const animarNumero = (el) => {
    const objetivo = parseFloat(el.dataset.objetivo);
    const sufijo = el.dataset.sufijo || '';
    const duracion = 1400;
    const inicio = performance.now();
    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const valor = Math.floor(progreso * objetivo);
      el.textContent = valor + sufijo;
      if (progreso < 1) requestAnimationFrame(paso);
      else el.textContent = objetivo + sufijo;
    };
    requestAnimationFrame(paso);
  };
  const observadorNumeros = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarNumero(entrada.target);
        observadorNumeros.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });
  numeros.forEach(n => observadorNumeros.observe(n));

  // ---- Mapa de cobertura interactivo: resaltar zona al pasar el mouse en la lista ----
  const zonas = document.querySelectorAll('.lista-zonas li');
  const regiones = document.querySelectorAll('.region');
  zonas.forEach(zona => {
    const objetivo = zona.dataset.region;
    zona.addEventListener('mouseenter', () => {
      regiones.forEach(r => r.classList.toggle('activa', r.dataset.region === objetivo));
    });
    zona.addEventListener('mouseleave', () => {
      regiones.forEach(r => r.classList.remove('activa'));
    });
  });

  // ---- Formulario de contacto → redirige a WhatsApp con los datos ----
  const formulario = document.querySelector('#formulario-contacto');
  if (formulario) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = formulario.nombre.value.trim();
      const empresa = formulario.empresa.value.trim();
      const servicio = formulario.servicio.value;
      const mensaje = formulario.mensaje.value.trim();

      const texto = `Hola, soy ${nombre}${empresa ? ' de ' + empresa : ''}. Me interesa el servicio de *${servicio}*. ${mensaje}`;
      const numeroWhatsapp = '5218119876755';
      const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');
    });
  }

  // ---- Suavizar anclas internas considerando header fijo ----
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      const destinoId = enlace.getAttribute('href');
      if (destinoId.length > 1) {
        const destino = document.querySelector(destinoId);
        if (destino) {
          e.preventDefault();
          const offset = 84;
          const top = destino.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});
