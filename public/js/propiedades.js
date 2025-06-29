// public/js/propiedades.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('propiedades-container');
  const btnAll = document.getElementById('f-all');
  const btnDisp = document.getElementById('f-disponible');
  const btnAlq = document.getElementById('f-alquilada');

  btnAll.addEventListener('click', () => loadProps());
  btnDisp.addEventListener('click', () => loadProps('disponible'));
  btnAlq.addEventListener('click', () => loadProps('alquilada'));

  loadProps(); // carga inicial

  async function loadProps(estado) {
    let url = '/propiedades';
    if (estado) url += `/estado/${estado}`;
    try {
      const res = await fetch(url, { headers: { 'Authorization': localStorage.getItem('token') } });
      const props = await res.json();
      render(props);
      setActiveButton(estado);
    } catch (e) {
      console.error(e);
    }
  }

  function render(props) {
    container.innerHTML = '';
    props.forEach(p => {
      const card = document.createElement('div');
      card.className = 'propiedad-card';
      card.innerHTML = `
        <h2>${p.tipo} · ${p.direccion}</h2>
        <p><strong>Ambientes:</strong> ${p.ambientes} · <strong>Superficie:</strong> ${p.superficie} m²</p>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <p><strong>Estado:</strong> ${p.estado}</p>
        <p>${p.descripcion || ''}</p>
        <p><em>${p.observaciones || ''}</em></p>
      `;
      container.appendChild(card);
    });
  }

  function setActiveButton(estado) {
    [btnAll, btnDisp, btnAlq].forEach(b => b.classList.remove('active'));
    if (!estado) btnAll.classList.add('active');
    else if (estado === 'disponible') btnDisp.classList.add('active');
    else if (estado === 'alquilada') btnAlq.classList.add('active');
  }
});
