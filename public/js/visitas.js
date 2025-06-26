// public/js/visitas.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('visitaForm');
  const tableBody = document.querySelector('#visitasTable tbody');
  const fields = ['cliente','propiedad','fecha','hora','estado','agente','observaciones'];

  async function loadSelect(id, endpoint) {
    const sel = document.getElementById(id);
    const res = await fetch(`/${endpoint}`);
    const data = await res.json();
    data.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item._id;
      opt.textContent = item.nombre || item.direccion || item.nombreCompleto;
      sel.appendChild(opt);
    });
  }

  async function fetchVisitas() {
    const res = await fetch('/visitas');
    const visitas = await res.json();
    tableBody.innerHTML = '';
    visitas.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${v.cliente.nombre}</td>
        <td>${v.propiedad.direccion}</td>
        <td>${new Date(v.fecha).toLocaleDateString()}</td>
        <td>${v.hora}</td>
        <td>${v.estado}</td>
        <td>${v.agente? v.agente.nombre : ''}</td>
        <td>${v.observaciones || ''}</td>
        <td>
          <button data-id='${v._id}' class='edit'>Editar</button>
          <button data-id='${v._id}' class='delete'>Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('visitaId').value;
    const body = {};
    fields.forEach(f => body[f] = document.getElementById(f).value);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/visitas/${id}` : '/visitas';
    await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)});
    form.reset(); document.getElementById('visitaId').value = '';
    fetchVisitas();
  });

  tableBody.addEventListener('click', async e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('edit')) {
      const res = await fetch(`/visitas/${id}`);
      const v = await res.json();
      fields.forEach(f => document.getElementById(f).value = v[f] || '');
      document.getElementById('visitaId').value = id;
    }
    if (e.target.classList.contains('delete')) {
      if (confirm('¿Eliminar visita?')) {
        await fetch(`/visitas/${id}`, { method: 'DELETE' });
        fetchVisitas();
      }
    }
  });

  // Cargar selects y lista inicial
  ['clientes','propiedades','empleados'].forEach(ep => loadSelect(ep.slice(0,-1), ep));
  fetchVisitas();
});