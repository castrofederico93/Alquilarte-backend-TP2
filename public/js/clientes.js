document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const lista = document.getElementById('listaClientes');
  const limpiarBtn = document.getElementById('limpiarBtn');
  const filtroInput = document.getElementById('buscarInput');

  let clientesCargados = [];

  fetch('/clientes')
    .then(res => res.json())
    .then(clientes => {
      clientesCargados = clientes;
      renderizarLista(clientesCargados);
    })
    .catch(err => console.error('Error al cargar clientes:', err));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    fetch('/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(cliente => {
        clientesCargados.push(cliente);
        form.reset();
        filtroInput.value = '';
        renderizarLista(clientesCargados);
      })
      .catch(err => console.error('Error al agregar cliente:', err));
  });

  limpiarBtn.addEventListener('click', () => form.reset());

  filtroInput.addEventListener('input', () => {
    const texto = filtroInput.value.toLowerCase();
    const filtrados = clientesCargados.filter(c =>
      `${c.nombre} ${c.apellido} ${c.dni}`.toLowerCase().includes(texto)
    );
    renderizarLista(filtrados);
  });

  function renderizarLista(clientes) {
    lista.innerHTML = '';

    if (clientes.length === 0) {
      lista.innerHTML = '<p>No se encontraron clientes.</p>';
      return;
    }

    clientes.forEach(cliente => agregarClienteALista(cliente));
  }

  function agregarClienteALista(cliente) {
    const div = document.createElement('div');
    div.classList.add('cliente-card');

    div.innerHTML = `
      <div class="icono-texto"><img src="/img/cliente.png" class="icono"> <strong>Cliente:</strong> ${cliente.nombre} ${cliente.apellido}</div>
      <div class="icono-texto"><img src="/img/licencia-de-conducir.png" class="icono"> <strong>DNI:</strong> ${cliente.dni}</div>
      <div class="icono-texto"><img src="/img/email.png" class="icono"> <strong>Email:</strong> ${cliente.email}</div>
      <div class="icono-texto"><img src="/img/llamada-telefonica.png" class="icono"> <strong>Teléfono:</strong> ${cliente.telefono || 'No registrado'}</div>
    `;

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.innerHTML = `<img src="/img/borrar.png" alt="Eliminar" class="icono-borrar">`;

    btnEliminar.addEventListener('click', () => {
      if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

      fetch(`/clientes/${cliente._id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          clientesCargados = clientesCargados.filter(c => c._id !== cliente._id);
          filtroInput.value = '';
          renderizarLista(clientesCargados);
        })
        .catch(err => console.error('Error al eliminar cliente:', err));
    });

    div.appendChild(btnEliminar);
    lista.appendChild(div);
  }
});
