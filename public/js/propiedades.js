const { json } = require("express");

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

}

async function guardarPropiedad() {
  const id = document.getElementById('propiedadId').value;
  const method = document.getElementById('methodField').value;

  const datos = {
    direccion: document.getElementById('direccion').value,
    tipo: document.getElementById('tipo').value,
    estado: document.getElementById('estado').value,
    ambientes: document.getElementById('ambientes').value,
    superficie: document.getElementById('superficie').value,
    descripcion: document.getElementById('descripcion').value,
    precio: document.getElementById('precio').value,
    observaciones: document.getElementById('observaciones').value
  }
 
  const url = method === 'POST' ? '/propiedades' : `/propiedades/${id}`;

      try{
        const respuesta = await fetch(
          url,{method: method, 
              headers: {'Content-Type':'application/json'}, 
              body: JSON.stringify(datos),}
        )

        if (!respuesta.ok){throw new Error('Error al guardar la propiedad')};


      alert('Operacion exitosa');

      limpiarFormulario();

      location.reload();
        


      }catch(error){
        alert('Error' + error.message);
      }

}


function limpiarFormulario() {

  const form = document.getElementById('formCrearPropiedad');

  form.reset();

  document.getElementById('methodField').value = 'POST';
  document.getElementById('propiedadId').value = '';



}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
}

async function eliminarPropiedad(id){

  if(!confirm(`Estas seguro que quieres eliminar la propiedad con id (${id})?`)) {
    return
  }
  
  try {
    const respuesta = await fetch(`/propiedades/${id}`,{
      method:'DELETE'
    });

    if(!respuesta.ok)
      throw new error('Error al eliminar la propiedad');

    alert('La propiedad se elimino correctamente');

    location.reload();


    

  }catch(error){
    console.error('Error al eliminar la propiedad');
    alert('Error al eliminar la propiedad');

  }


}






