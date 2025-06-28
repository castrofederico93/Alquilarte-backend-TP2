function toggleform(){
    const form = document.getElementById('formCrearPropiedad')
    if(!form) return;
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function editarPropiedad(boton){


    document.getElementById('propiedadId').value = boton.dataset.id;
    document.getElementById('direccion').value = boton.dataset.direccion;
    document.getElementById('tipo').value = boton.dataset.tipo;
    document.getElementById('ambientes').value = boton.dataset.ambientes;
    document.getElementById('superficie').value = boton.dataset.superficie;
    document.getElementById('descripcion').value = boton.dataset.descripcion;
    document.getElementById('estado').value = boton.dataset.estado;
    document.getElementById('precio').value = boton.dataset.precio;
    document.getElementById('observaciones').value = boton.dataset.observaciones;
    document.getElementById('methodField').value = 'PUT';

    toggleform('formCrearPropiedad');
    
}

/* async function guardarPropiedad() {
  const id = document.getElementById('propiedadId').value;
  const method = document.getElementById('methodField').value; // POST o PUT

  // Recopilar datos del formulario
  const datos = {
    direccion: document.getElementById('direccion').value,
    tipo: document.getElementById('tipo').value,
    ambientes: document.getElementById('ambientes').value,
    superficie: document.getElementById('superficie').value,
    descripcion: document.getElementById('descripcion').value,
    estado: document.getElementById('estado').value,
    precio: document.getElementById('precio').value,
    observaciones: document.getElementById('observaciones').value,
  };

  // Definir URL según método
  const url = method === 'POST' ? '/propiedades' : `/propiedades/${id}`;

  try {
    const respuesta = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) throw new Error('Error al guardar la propiedad');

    alert('Operación exitosa');
    // Aquí podés recargar los datos o la página si querés
    // Por ahora, limpiar el formulario y ocultarlo
    limpiarFormulario();
    toggleform('formCrearPropiedad'); // ocultar el formulario

    // Opcional: recargar la página para ver cambios
    // location.reload();

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function limpiarFormulario() {
  const form = document.getElementById('formCrearPropiedad');
  form.reset(); // resetea todos los campos a sus valores por defecto
  // Además, ponemos los campos ocultos para modo crear
  document.getElementById('methodField').value = 'POST';
  document.getElementById('propiedadId').value = '';
}


async function eliminarPropiedad(id) {
  if (!confirm(`¿Estás seguro de que quieres eliminar esta propiedad (${id})?`)) {
    return; // Si el usuario cancela, no hacer nada
  }

  try {
    const response = await fetch(`/propiedades/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la propiedad');
    }

    alert('Propiedad eliminada correctamente');
    // Opcional: recargar la página o actualizar la tabla sin recargar
    location.reload();

  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
    alert('Error al eliminar la propiedad');
  }
} */
