const lista = document.getElementById('lista-empleados');
const formAgregar = document.getElementById('form-agregar');
const formEditar = document.getElementById('form-editar');

const selectSectorAgregar = document.getElementById('sector-agregar');
const selectRolAgregar = document.getElementById('rol-agregar');
const selectSectorEditar = document.getElementById('sector-editar');
const selectRolEditar = document.getElementById('rol-editar');
let rolesPorSector = {};

const esRRHH = window.usuario.sector === 'Administración' && window.usuario.rol === 'Responsable de RRHH';

fetch('/empleados/sectores-roles')
  .then(res => res.json())
  .then(data => {
    rolesPorSector = data;

    [selectSectorAgregar, selectSectorEditar].forEach(select => {
      if (!select) return;
      select.innerHTML = '<option value="">-- Seleccionar sector --</option>';
      Object.keys(data).forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        select.appendChild(option);
      });
    });
  });

function actualizarRoles(selectSector, selectRol) {
  const sector = selectSector.value;
  selectRol.innerHTML = '<option value="">-- Seleccionar rol --</option>';
  selectRol.disabled = !sector;

  if (sector && rolesPorSector[sector]) {
    rolesPorSector[sector].forEach(rol => {
      const option = document.createElement('option');
      option.value = rol;
      option.textContent = rol;
      selectRol.appendChild(option);
    });
  }
}

if (selectSectorAgregar) {
  selectSectorAgregar.addEventListener('change', () => {
    actualizarRoles(selectSectorAgregar, selectRolAgregar);
  });
}

if (selectSectorEditar) {
  selectSectorEditar.addEventListener('change', () => {
    actualizarRoles(selectSectorEditar, selectRolEditar);
  });
}

function cargarEmpleados() {
  fetch('/empleados')
    .then(res => res.json())
    .then(data => {
      lista.innerHTML = '';
      data.forEach(emp => {
        const tr = document.createElement('tr');

        const esElMismo = emp._id === window.usuario.id;

        let botones = '';
        if (esRRHH || esElMismo) {
          botones += `<button onclick="prepararEdicion('${emp._id}', '${emp.nombre}', '${emp.apellido}', '${emp.usuario}', '${emp.rol}', '${emp.sector}')">Editar</button>`;
        }
        if (esRRHH) {
          botones += `<button onclick="eliminarEmpleado('${emp._id}')">Eliminar</button>`;
        }

        tr.innerHTML = `
          <td>${emp.nombre}</td>
          <td>${emp.apellido}</td>
          <td>${emp.usuario}</td>
          <td>${emp.rol}</td>
          <td>${emp.sector}</td>
          <td>${botones}</td>
        `;
        lista.appendChild(tr);
      });
    });
}

function eliminarEmpleado(id) {
  const confirmado = confirm('¿Estás seguro de que querés eliminar este empleado?');
  if (!confirmado) return;

  fetch('/empleados/' + id, { method: 'DELETE' })
    .then(async res => {
      if (res.ok) {
        cargarEmpleados();
      } else {
        const error = await res.text();
        alert('Error al eliminar empleado: ' + error);
      }
    })
    .catch(() => {
      alert('Error de red al eliminar empleado');
    });
}

function prepararEdicion(id, nombre, apellido, usuario, rol, sector) {
  document.getElementById('seccion-editar').style.display = 'block';
  formEditar.id.value = id;

  if (esRRHH) {
    formEditar.nombre.value = nombre;
    formEditar.apellido.value = apellido;
    formEditar.usuario.value = usuario;
    formEditar.rol.value = rol;
    formEditar.sector.value = sector;
    actualizarRoles(selectSectorEditar, selectRolEditar);
  } else {
    formEditar.nombre.value = '';
    formEditar.apellido.value = '';
    formEditar.usuario.value = '';
  }

  formEditar.passwordActual.value = '';
  formEditar.passwordNueva.value = '';
  window.scrollTo(0, document.body.scrollHeight);
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

if (formAgregar) {
  formAgregar.addEventListener('submit', async e => {
    e.preventDefault();

    const pass1 = formAgregar.password?.value || '';
    const pass2 = formAgregar.passwordConfirmar?.value || '';

    if (pass1 !== pass2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const datosRaw = Object.fromEntries(new FormData(formAgregar));

    const datos = {
      nombre: capitalizar(datosRaw.nombre),
      apellido: capitalizar(datosRaw.apellido),
      usuario: datosRaw.usuario.toLowerCase(),
      password: pass1,
      sector: datosRaw.sector,
      rol: datosRaw.rol
    };

    try {
      const res = await fetch('/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!res.ok) {
        const error = await res.text();
        alert('Error al crear empleado: ' + error);
        return;
      }

      formAgregar.reset();
      document.getElementById('seccion-alta').style.display = 'none';
      cargarEmpleados();
    } catch (err) {
      alert('Error de red al crear empleado');
    }
  });
}

const cancelarAlta = document.getElementById('cancelar-alta');
if (cancelarAlta) {
  cancelarAlta.addEventListener('click', () => {
    formAgregar.reset();
    document.getElementById('seccion-alta').style.display = 'none';
  });
}

if (formEditar) {
  formEditar.addEventListener('submit', async e => {
    e.preventDefault();
    const id = formEditar.id.value;

    const pass1 = formEditar.passwordNueva?.value || '';
    const pass2 = formEditar.passwordConfirmar?.value || '';

    if (pass1 || pass2) {
      if (pass1 !== pass2) {
        alert('Las contraseñas no coinciden');
        return;
      }
    }

    const datos = {
      nombre: capitalizar(formEditar.nombre?.value || ''),
      apellido: capitalizar(formEditar.apellido?.value || ''),
      usuario: formEditar.usuario?.value.toLowerCase() || '',
      rol: formEditar.rol?.value || '',
      sector: formEditar.sector?.value || ''
    };

    if (formEditar.passwordActual) {
      datos.passwordActual = formEditar.passwordActual.value;
    }

    if (formEditar.passwordNueva) {
      datos.passwordNueva = pass1;
    }

    try {
      const res = await fetch('/empleados/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!res.ok) {
        const error = await res.text();
        alert('Error al editar empleado: ' + error);
        return;
      }

      formEditar.reset();
      document.getElementById('seccion-editar').style.display = 'none';
      cargarEmpleados();
    } catch (err) {
      alert('Error de red al editar empleado');
    }
  });
}

const mostrarAlta = document.getElementById('mostrar-alta');
if (mostrarAlta) {
  mostrarAlta.addEventListener('click', () => {
    const seccionAlta = document.getElementById('seccion-alta');
    seccionAlta.style.display = (seccionAlta.style.display === 'none') ? 'block' : 'none';
  });
}

const cancelarEdicion = document.getElementById('cancelar-edicion');
if (cancelarEdicion) {
  cancelarEdicion.addEventListener('click', () => {
    formEditar.reset();
    document.getElementById('seccion-editar').style.display = 'none';
  });
}

cargarEmpleados();