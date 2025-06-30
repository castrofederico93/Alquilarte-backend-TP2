
// Mostrar detalles del pago dentro de la tarjeta
function verDetallePago(id) {
  fetch(`/pagos/${id}`)
    .then(res => res.json())
    .then(pago => {
      // Eliminar cualquier detalle expandido anterior
      document.querySelectorAll('.detalle-expandido').forEach(el => {
        el.parentElement.classList.remove('expanded');
        el.remove();
      });

      const tarjeta = document.querySelector(`.pago-card[data-id="${id}"]`);
      if (!tarjeta) {
        console.error("No se encontró la tarjeta con ID:", id);
        return;
      }

      const detalleDiv = document.createElement('div');
      detalleDiv.className = 'detalle-expandido';
      detalleDiv.innerHTML = `
        <p><strong>ID:</strong> ${pago._id}</p>
        <p><strong>Cliente:</strong> ${pago.cliente.nombre} ${pago.cliente.apellido} - DNI: ${pago.cliente.dni}</p>
        <p><strong>Propiedad:</strong> ${pago.propiedad.direccion}</p>
        <p><strong>Monto:</strong> $${pago.monto}</p>
        <p><strong>Periodo:</strong> ${pago.periodo}</p>
        <p><strong>Adicionales:</strong> ${pago.adicionales || 'Ninguno'}</p>
        <p><strong>Fecha:</strong> ${new Date(pago.fechaPago).toLocaleDateString()}</p>
        <p><strong>Forma de pago:</strong> ${pago.formaPago}</p>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
          <button onclick="cerrarDetalle(event, '${id}')" class="btn-cerrar">Ocultar</button>
          <a href="/pagos/pdf/${pago._id}" target="_blank" class="btn-pdf">Descargar PDF</a>
        </div>
      `;

      tarjeta.appendChild(detalleDiv);
      tarjeta.classList.add('expanded');
    })
    .catch(err => {
      console.error('Error al cargar detalle del pago:', err);
      alert('No se pudo cargar el detalle del pago.');
    });
}


// Cerrar el detalle del pago
function cerrarDetalle(event, id) {
  event.stopPropagation();

  const tarjeta = document.querySelector(`.pago-card[data-id="${id}"]`);
  if (!tarjeta) return;

  const detalle = tarjeta.querySelector('.detalle-expandido');
  if (detalle) detalle.remove();

  tarjeta.classList.remove('expanded');
}
// Cancelar formulario de pago
function cancelarFormulario() {
  const form = document.getElementById('formularioPago');
  if (!form) return;

  form.style.display = 'none';

  // Limpiar todos los inputs dentro del formulario
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = '';
    input.style.border = ''; // Quita bordes de validación si los había
  });
}



// Buscar pagos por DNI (o todos)
function buscarPagos() {
  const dni = String(document.getElementById('dniBuscar').value.trim());

  fetch(`/pagos?dni=${dni}`)
    .then(res => res.json())
    .then(pagos => {
      console.log('Pagos recibidos:', pagos);
      const resultados = document.getElementById('resultados');
      resultados.innerHTML = '';

      if (pagos.length === 0) {
        resultados.innerHTML = '<p>No se encontraron pagos.</p>';
        return;
      }

      pagos.forEach(pago => {
        const div = document.createElement('div');
        div.className = 'pago-card';
        div.dataset.id = pago._id;
        div.onclick = () => verDetallePago(pago._id);
        div.innerHTML = `
          <h3>${pago.cliente.nombre} ${pago.cliente.apellido}</h3>
          <p>DNI: ${pago.cliente.dni}</p>
          <p>Propiedad: ${pago.propiedad.direccion}</p>
        `;
        resultados.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error al buscar pagos:', err);
      alert('Error al buscar pagos.');
    });
}

// Mostrar u ocultar el formulario de carga
function toggleform() {
  const form = document.getElementById('formularioPago');
  if (!form) return;
  const isHidden = form.style.display === '' || form.style.display === 'none';
  form.style.display = isHidden ? 'flex' : 'none';
}

// Enviar nuevo pago
function guardarPago() {
  const campos = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'direccion', 'monto', 'periodo', 'adicionales', 'fechaPago', 'formaPago'];
  const nuevoPago = {
    cliente: {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      dni: document.getElementById('dni').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
    },
    propiedad: {
      direccion: document.getElementById('direccion').value,
    },
    monto: document.getElementById('monto').value,
    periodo: document.getElementById('periodo').value,
    adicionales: document.getElementById('adicionales').value,
    fechaPago: document.getElementById('fechaPago').value,
    formaPago: document.getElementById('formaPago').value,
  };

  // Validación básica
  let valido = true;
  ['dni', 'monto', 'periodo'].forEach(id => {
    const el = document.getElementById(id);
    if (el.value.trim() === '') {
      el.style.border = '2px solid red';
      valido = false;
    } else {
      el.style.border = '';
    }
  });

  if (!valido) {
    alert('Por favor completá los campos obligatorios (DNI, Monto y Periodo).');
    return;
  }

  fetch('/pagos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoPago)
  })
    .then(res => res.json())
    .then(data => {
      alert('Pago creado correctamente');
      location.reload(); // recarga la vista
    })
    .catch(err => {
      console.error('Error al guardar pago:', err);
      alert('Error al guardar el pago.');
    });
}