eventListener();
//Lista de proyecto
const listaProyecto = document.querySelector("ul#proyectos");

function eventListener() {
    //Document Ready
    document.addEventListener("DOMContentLoaded", function () {
        actualizarProgreso();
    })



    //Boton para crear proyecto
    document.querySelector(".crear-proyecto a").addEventListener("click", nuevoProyecto)

    //Boton para una nueva tarea
    document.querySelector(".nueva-tarea").addEventListener("click", agregarTarea);

    //Botones para las acciones de las tareas
    document.querySelector(".listado-pendientes").addEventListener("click", accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();

    //Crea un input para el nombre del nuevo pryecto
    let nuevoProyecto = document.createElement("li");
    nuevoProyecto.innerHTML = "<input type='text' id='nuevo-proyecto'>"
    listaProyecto.appendChild(nuevoProyecto);


    //Seleccionar el id con el nuevo-proyecto
    let inputNuevoProyecto = document.querySelector("#nuevo-proyecto");

    //El cursor se posicionara en el input
    inputNuevoProyecto.focus();

    //Al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener("keypress", function (e) {
        let tecla = e.which || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyecto.removeChild(nuevoProyecto)
        }
    })
}

function guardarProyectoDB(nombreProyecto) {

    //Crear llamado a ajax
    let xhr = new XMLHttpRequest();

    //Enviar datos por formdata
    let datos = new FormData();
    datos.append("proyecto", nombreProyecto);
    datos.append("accion", "crear");


    //Abrir la conextion
    xhr.open("POST", "inc/modelos/modelo-proyecto.php", true);

    //En la carga
    xhr.onload = function () {
        if (this.status === 200) {
            //console.log(xhr.responseText);
            let respuesta = JSON.parse(xhr.responseText);

            //Si la respuesta es correcta
            if (respuesta.respuesta === "correcto") {

                if (respuesta.tipo === "crear") {
                    //Se creo un nuevo proyecto

                    //inyectar el html
                    let nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto=${respuesta.id_proyecto}" id="proyecto:${respuesta.id_proyecto}">
                    ${respuesta.nombre_proyecto}
                    </a>`;

                    //Agregar al html
                    listaProyecto.appendChild(nuevoProyecto);

                    Swal.fire({
                        icon: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + respuesta.nombre_proyecto + ' se creo correctamente',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => window.location.href = `index.php?id_proyecto=${respuesta.id_proyecto}`);

                } else {
                    //Si queremos podemos añadir las funcionalidades de
                    //actualizar o eliminar los proyectos
                }


            } else if (respuesta.respuesta === "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error!'
                })
            }
        }
    }

    //Envia la request
    xhr.send(datos);
}

//Agragar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();

    let nombreTarea = document.querySelector(".nombre-tarea").value;

    //Validar que el campo tenga algo escrito
    if (nombreTarea === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Una tarea no puede ir vacia'
        })

    } else {//Si tiene algo
        //Insertar en php

        //Crear llamado a ajax
        let xhr = new XMLHttpRequest();

        //Enviar datos por formdata
        let datos = new FormData();
        datos.append("tarea", nombreTarea);
        datos.append("accion", "crear");
        datos.append("id_proyecto", document.querySelector("#id_proyecto").value);


        //Abrir la conextion
        xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

        //En la carga
        xhr.onload = function () {
            if (this.status === 200) {
                //console.log(xhr.responseText);
                let respuesta = JSON.parse(xhr.responseText);

                //Si la respuesta es correcta
                if (respuesta.respuesta === "correcto") {

                    if (respuesta.tipo === "crear") {
                        //Se creo una tarea
                        Swal.fire({
                            icon: 'success',
                            title: 'Tarea Creada',
                            showConfirmButton: false,
                            timer: 1000,
                        });

                        //Seleccionar el parrafo con la lista vacia
                        let parrafoListaVacia = document.querySelectorAll(".lista-vacia");
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector(".lista-vacia").remove();
                        }

                        //inyectar el html
                        let nuevaTarea = document.createElement('li');

                        //Agragamos un id
                        nuevaTarea.id = "tarea:" + respuesta.id_proyecto;

                        //Agragamos una clase
                        nuevaTarea.classList.add("tarea")

                        nuevaTarea.innerHTML = `
                        <p>${respuesta.tarea}</p>
                        <div class="acciones">
                            <i class="far fa-check-circle"></i>
                            <i class="fas fa-trash"></i>
                        </div>`;

                        //Agregar al html
                        let listado = document.querySelector(".listado-pendientes ul");
                        listado.appendChild(nuevaTarea);

                        //Limpiear el formulario
                        document.querySelector(".agregar-tarea").reset();

                        //Actualizamos la barra de progreso
                        actualizarProgreso()

                    }

                } else if (respuesta.respuesta === "error") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error!'
                    })
                }
            }
        }

        //Envia la request
        xhr.send(datos);
    }
}

//El estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains("fa-check-circle")) {
        if (e.target.classList.contains("completo")) {
            e.target.classList.remove("completo")
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add("completo")
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains("fa-trash")) {
        Swal.fire({
            title: 'Esta seguro?',
            text: "Esta accion no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                let tareaEliminar = e.target.parentElement.parentElement;
                //Borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                //Borrar del html
                tareaEliminar.remove();


                Swal.fire({
                    title: 'Eliminado!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        })
    }

}
//Completa o descompleta una tarea

function cambiarEstadoTarea(tarea, estado) {
    let idTarea = tarea.parentElement.parentElement.id.split(":");

    //Crear llamado a ajax
    let xhr = new XMLHttpRequest();

    //Enviar datos por formdata
    let datos = new FormData();
    datos.append("id", idTarea[1]);
    datos.append("accion", "actualizar");
    datos.append("estado", estado);


    //Abrir la conextion
    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

    //En la carga
    xhr.onload = function () {
        if (this.status === 200) {
            //console.log(xhr.responseText);

            //Actualizamos la barra de progreso
            actualizarProgreso()
        }
    }

    //Envia la request
    xhr.send(datos);
}

//Elimina las tareas de la base de datos
function eliminarTareaBD(tarea) {
    let idTarea = tarea.id.split(":");

    //Crear llamado a ajax
    let xhr = new XMLHttpRequest();

    //Enviar datos por formdata
    let datos = new FormData();
    datos.append("id", idTarea[1]);
    datos.append("accion", "eliminar");

    //Abrir la conextion
    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);

    //En la carga
    xhr.onload = function () {
        if (this.status === 200) {
            //console.log(xhr.responseText);


            //Combrobar que haya tareas restantes
            let listaTareasRestantes = document.querySelectorAll("li.tarea");
            if (listaTareasRestantes.length === 0) {
                document.querySelector(".listado-pendientes ul").innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            //Actualizamos la barra de progreso
            actualizarProgreso()

        }
    }

    //Envia la request
    xhr.send(datos);
}

//Actualiza el avanze del Proyecto
function actualizarProgreso() {
    //Obteber todoas las tareas
    const tareas = document.querySelectorAll("li.tarea");

    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll("i.completo");

    if(tareas.length === 0){
        document.querySelector("#barra-avance #porcentaje").style.width = `0%`;
    }

    else if (tareas.length > 0) {
        //Determinar el Avance
        const progreso = Math.round((tareasCompletadas.length / tareas.length) * 100);

        //Asignar el progreso a la barra
        document.querySelector("#barra-avance #porcentaje").style.width = `${progreso}%`;

        //Mostrar una alerta al completar el 100%
        if (progreso === 100) {
            Swal.fire({
                title: 'Proyecto Terminado',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            })
        }
    }


}