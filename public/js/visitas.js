const {json} = require('express');

function editarVisita(boton) {
  document.getElementById('visitaId').value = boton.dataset.id;
  document.getElementById('cliente').value = boton.dataset.cliente;
  document.getElementById('propiedad').value = boton.dataset.propiedad;
  // Para input date, solo YYYY-MM-DD
  document.getElementById('fecha').value = boton.dataset.fecha ? boton.dataset.fecha.slice(0,10) : '';
  document.getElementById('hora').value = boton.dataset.hora || '';
  document.getElementById('estado').value = boton.dataset.estado;
  document.getElementById('agente').value = boton.dataset.agente;
  document.getElementById('observaciones').value = boton.dataset.observaciones || '';
  document.getElementById('methodField').value = 'PUT';
}

async function guardarVisita() {
  const id = document.getElementById('visitaId').value;
  const method = document.getElementById('methodField').value;
  const datos = {
    cliente:       document.getElementById('cliente').value,
    propiedad:     document.getElementById('propiedad').value,
    fecha:         document.getElementById('fecha').value,
    hora:          document.getElementById('hora').value,
    estado:        document.getElementById('estado').value,
    agente:        document.getElementById('agente').value,
    observaciones: document.getElementById('observaciones').value
  };

  const url = method === 'POST' ? '/visitas' : `/visitas/${id}`;

  try {
    const respuesta = await fetch(
      url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos),}
      )
    if (!respuesta.ok) {
      throw new Error('Error al guardar la visita');
    }

    alert('Operación exitosa');
    limpiarFormulario();
    location.reload();

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function limpiarFormulario() {
  const form = document.getElementById('visitaForm');
  form.reset();
  document.getElementById('visitaId').value = 'POST';
  document.getElementById('visitaId').value = '';
}

async function eliminarVisita(id) {
  if(!confirm(`Estas seguro que quieres eliminar la visita con id (${id})?`)) {
    return
  }

  try {
    const respuesta = await fetch(`/visitas/${id}`, {
      method: 'DELETE'
    });
  alert('Visita eliminada correctamente');
  location.reload();
  } catch (error) {
    alert('Error al eliminar la visita: ' + error.message);
  }
}
