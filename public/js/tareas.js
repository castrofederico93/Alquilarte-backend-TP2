function toggleSubmenu(id) {
  const submenus = document.querySelectorAll('.submenu');
  submenus.forEach(sm => {
    sm.style.display = sm.id === id && sm.style.display !== 'flex' ? 'flex' : 'none';
  });
}

const form = document.getElementById('formTarea');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    titulo: form.titulo.value,
    descripcion: form.descripcion.value,
    estado: form.estado.value,
    prioridad: form.prioridad.value,
    area: form.area.value,
    fecha: form.fecha.value,
  };

  const id = form.id.value;
  const res = await fetch(id ? `/tareas/${id}` : '/tareas', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    mostrarMensaje(id ? 'Tarea actualizada con éxito' : 'Tarea creada con éxito', true);
    form.reset();
    form.id.value = '';
    setTimeout(() => location.reload(), 1500);
  } else {
    mostrarMensaje('Error al guardar tarea', false);
  }
});

function cargarTareaEnFormulario(tarea) {
  form.id.value = tarea.id;
  form.titulo.value = tarea.titulo;
  form.descripcion.value = tarea.descripcion;
  form.estado.value = tarea.estado;
  form.prioridad.value = tarea.prioridad;
  form.area.value = tarea.area;
  form.fecha.value = tarea.fecha;
  window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
}

async function eliminarTarea(id) {
  if (confirm('¿Estás seguro de que querés eliminar esta tarea?')) {
    const res = await fetch(`/tareas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      mostrarMensaje('Tarea eliminada con éxito', true);
      setTimeout(() => location.reload(), 1500);
    } else {
      mostrarMensaje('Error al eliminar la tarea', false);
    }
  }
}

function mostrarMensaje(texto, esExito) {
  mensaje.textContent = texto;
  mensaje.className = esExito ? 'exito' : 'error';
  mensaje.style.display = 'block';
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 3000);
}

function limpiarFormulario() {
  form.reset();
  form.id.value = '';
}
