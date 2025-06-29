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
    fecha: new Date(form.fecha.value).toISOString(),
    asignadoA: form.asignadoA.value || null
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

// Nueva función para cargar empleados que devuelve promesa
function cargarEmpleadosPorArea(area) {
  const selectAsignado = form.asignadoA;

  return new Promise(async (resolve) => {
    if (!area) {
      selectAsignado.innerHTML = '<option value="">-- Sin asignar --</option>';
      resolve();
      return;
    }

    try {
      const res = await fetch(`/empleados/por-sector/${encodeURIComponent(area)}`);
      if (!res.ok) throw new Error('Error al cargar empleados');

      const empleados = await res.json();
      selectAsignado.innerHTML = '<option value="">-- Sin asignar --</option>';
      empleados.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp._id;
        option.textContent = `${emp.nombre} ${emp.apellido}`;
        selectAsignado.appendChild(option);
      });
      resolve();
    } catch (err) {
      console.error(err);
      mostrarMensaje('Error al cargar empleados del sector', false);
      resolve();
    }
  });
}

async function cargarTareaEnFormulario(tarea) {
  form.id.value = tarea._id;
  form.titulo.value = tarea.titulo;
  form.descripcion.value = tarea.descripcion;
  form.estado.value = tarea.estado;
  form.prioridad.value = tarea.prioridad;
  form.area.value = tarea.area;

  // Formatear fecha a YYYY-MM-DD
  const fecha = new Date(tarea.fecha);
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  form.fecha.value = `${yyyy}-${mm}-${dd}`;

  // Esperar que carguen los empleados antes de asignar el valor
  await cargarEmpleadosPorArea(tarea.area);

  if (tarea.asignadoA) {
    form.asignadoA.value = tarea.asignadoA._id;
  } else {
    form.asignadoA.value = "";
  }

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
  mensaje.className = `alerta-mensaje ${esExito ? 'visible' : 'visible error'}`;
  setTimeout(() => {
    mensaje.className = 'alerta-mensaje oculto';
  }, 3000);
}

function limpiarFormulario() {
  form.reset();
  form.id.value = '';
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  mostrarMensaje('Formulario cancelado', true);
}

form.area.addEventListener('change', () => {
  cargarEmpleadosPorArea(form.area.value);
});

// =======================
// FILTROS
// =======================
function toggleCheckboxList(id) {
  document.querySelectorAll('.checkbox-list').forEach(list => {
    if (list.id !== 'lista-' + id) {
      list.classList.remove('show');
    }
  });
  const el = document.getElementById('lista-' + id);
  el.classList.toggle('show');
}

function aplicarFiltros() {
  const estados = [...document.querySelectorAll('input[name="estado"]:checked')].map(e => e.value);
  const prioridades = [...document.querySelectorAll('input[name="prioridad"]:checked')].map(e => e.value);
  const areas = [...document.querySelectorAll('input[name="area"]:checked')].map(e => e.value);

  let filasVisibles = 0;

  document.querySelectorAll('tr.fila-tarea').forEach(row => {
    const estado = row.dataset.estado;
    const prioridad = row.dataset.prioridad;
    const area = row.dataset.area;

    const visible =
      (estados.length === 0 || estados.includes(estado)) &&
      (prioridades.length === 0 || prioridades.includes(prioridad)) &&
      (areas.length === 0 || areas.includes(area));

    row.style.display = visible ? '' : 'none';

    if (visible) filasVisibles++;
  });

  const sinTareas = document.getElementById('sin-tareas');
  if (sinTareas) {
    sinTareas.style.display = filasVisibles === 0 ? 'table-row' : 'none';
  }
}

function limpiarFiltros() {
  document.querySelectorAll('.checkbox-list input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });

  document.querySelectorAll('tr.fila-tarea').forEach(row => {
    row.style.display = '';
  });

  const sinTareas = document.getElementById('sin-tareas');
  if (sinTareas) sinTareas.style.display = 'none';
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.filtro')) {
    document.querySelectorAll('.checkbox-list').forEach(el => el.classList.remove('show'));
  }
});
