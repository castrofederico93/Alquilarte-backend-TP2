document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('clienteForm');
  const lista = document.getElementById('listaClientes');
  const limpiarBtn = document.getElementById('limpiarBtn');
  const filtroInput = document.getElementById('buscarInput');
  const botonSubmit = form.querySelector('button[type="submit"]');

  let clientesCargados = [];
  let clienteEditando = null;

  // Mensaje dinámico
  const mensaje = document.createElement('div');
  mensaje.className = 'mensaje';
  form.appendChild(mensaje);

  function mostrarMensaje(texto, color = 'green') {
    mensaje.textContent = texto;
    mensaje.style.color = color;
    mensaje.style.fontWeight = 'bold';
    setTimeout(() => {
      mensaje.textContent = '';
    }, 3000);
  }

  // Validaciones
  const nombreInput = form.querySelector('input[name="nombre"]');
  const apellidoInput = form.querySelector('input[name="apellido"]');
  const dniInput = form.querySelector('input[name="dni"]');
  const telefonoInput = form.querySelector('input[name="telefono"]');

  function soloLetras(e) {
    const char = String.fromCharCode(e.which);
    if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(char)) e.preventDefault();
  }

  function soloNumeros(e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) e.preventDefault();
  }

  function limpiarSoloLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
  }

  function limpiarSoloNumeros(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }

  nombreInput.addEventListener('keypress', soloLetras);
  apellidoInput.addEventListener('keypress', soloLetras);
  dniInput.addEventListener('keypress', soloNumeros);
  telefonoInput.addEventListener('keypress', soloNumeros);

  nombreInput.addEventListener('input', limpiarSoloLetras);
  apellidoInput.addEventListener('input', limpiarSoloLetras);
  dniInput.addEventListener('input', limpiarSoloNumeros);
  telefonoInput.addEventListener('input', limpiarSoloNumeros);

  // Cargar clientes
  fetch('/clientes')
    .then(res => res.json())
    .then(clientes => {
      clientesCargados = clientes;
      renderizarLista(clientesCargados);
    })
    .catch(err => {
      console.error('Error al cargar clientes:', err);
      mostrarMensaje('Error al cargar clientes', 'red');
    });

  // Guardar o Modificar
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (data.dni.length < 8) {
      mostrarMensaje('El DNI debe tener al menos 8 dígitos', 'red');
      return;
    }

    if (data.telefono && data.telefono.length < 10) {
      mostrarMensaje('El teléfono debe tener al menos 10 dígitos', 'red');
      return;
    }

    if (clienteEditando && clienteEditando._id) {
      // Modificar cliente
      fetch(`/clientes/${clienteEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(actualizado => {
          const index = clientesCargados.findIndex(c => c._id === actualizado._id);
          if (index !== -1) clientesCargados[index] = actualizado;

          clienteEditando = null;
          form.reset();
          filtroInput.value = '';
          botonSubmit.textContent = 'Agregar';
          renderizarLista(clientesCargados);
          mostrarMensaje('Cliente modificado correctamente');
        })
        .catch(err => {
          console.error('Error al modificar cliente:', err);
          mostrarMensaje('Error al modificar cliente', 'red');
        });
    } else {
      // Agregar nuevo cliente
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
          mostrarMensaje('Cliente guardado correctamente');
        })
        .catch(err => {
          console.error('Error al guardar cliente:', err);
          mostrarMensaje('Error al guardar cliente', 'red');
        });
    }
  });

  // Botón limpiar
  limpiarBtn.addEventListener('click', () => {
    form.reset();
    clienteEditando = null;
    botonSubmit.textContent = 'Agregar';
    mostrarMensaje('Formulario limpiado', 'gray');
  });

  // Filtro
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
//boton agregar
  function agregarClienteALista(cliente) {
    const div = document.createElement('div');
    div.classList.add('cliente-card');

    div.innerHTML = `
      <div class="icono-texto"><img src="/img/cliente.png" class="icono"> <strong>Cliente:</strong> ${cliente.nombre} ${cliente.apellido}</div>
      <div class="icono-texto"><img src="/img/licencia-de-conducir.png" class="icono"> <strong>DNI:</strong> ${cliente.dni}</div>
      <div class="icono-texto"><img src="/img/email.png" class="icono"> <strong>Email:</strong> ${cliente.email}</div>
      <div class="icono-texto"><img src="/img/llamada-telefonica.png" class="icono"> <strong>Teléfono:</strong> ${cliente.telefono || 'No registrado'}</div>
    `;

    // Botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.innerHTML = `<img src="/img/borrar.png" alt="Eliminar">`;

    btnEliminar.addEventListener('click', () => {
      if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

      fetch(`/clientes/${cliente._id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          clientesCargados = clientesCargados.filter(c => c._id !== cliente._id);
          filtroInput.value = '';
          renderizarLista(clientesCargados);
          mostrarMensaje('Cliente eliminado correctamente');
        })
        .catch(err => {
          console.error('Error al eliminar cliente:', err);
          mostrarMensaje('Error al eliminar cliente', 'red');
        });
    });

    // Botón modificar
    const btnModificar = document.createElement('button');
    btnModificar.classList.add('btn-modificar');
    btnModificar.innerHTML = `<img src="/img/editar.png" alt="Modificar">`;

    btnModificar.addEventListener('click', () => {
      form.nombre.value = cliente.nombre;
      form.apellido.value = cliente.apellido;
      form.dni.value = cliente.dni;
      form.email.value = cliente.email;
      form.telefono.value = cliente.telefono || '';
      clienteEditando = { ...cliente };
      botonSubmit.textContent = 'Actualizar';
      mostrarMensaje('Formulario cargado para modificar', 'blue');
    });

    div.appendChild(btnEliminar);
    div.appendChild(btnModificar);
    lista.appendChild(div);
  }
});
