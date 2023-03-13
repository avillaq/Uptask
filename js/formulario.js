eventListeners();

function eventListeners() {
    document.querySelector("#formulario").addEventListener("submit", validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    let usuario = document.querySelector("#usuario").value;
    let password = document.querySelector("#password").value;
    let tipo = document.querySelector("#tipo").value;


    if (usuario === "" || usuario ==="") {
        //La validacion fallo
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios!'
          })
    }else{
        //Ambos campos tienes algo, mandar a ejecutar ajax
        
        //Datos que se envian al servidor
        let datos = new FormData();
        datos.append("usuario", usuario);
        datos.append("password", password);
        datos.append("accion", tipo);

        //Crear el llamdo a ajax
        let xhr = new XMLHttpRequest()

        //abrir la conexion
        xhr.open("POST", "inc/modelos/modelo-admin.php", true);

        //retorno de datos
        xhr.onload = function () {
            if (this.status === 200) {
                //console.log(xhr.responseText);
                let respuesta = JSON.parse(xhr.responseText);

                //Si la respuesta es correcta
                if(respuesta.respuesta === "correcto"){
                    //Si es un nuevo usuario
                    if (respuesta.tipo === "crear") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creo correctamente'
                          })
                    }

                    else if (respuesta.tipo ==="login") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Iniciando sesion...',
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() =>window.location.href = "index.php");

                    }

                }else if (respuesta.respuesta ==="error"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                      })
                }
                else if (respuesta.respuesta ==="noLogin"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Usuario o contraseña incorrectos'
                      })
                }
            }
        }

        //Enviar los datos
        xhr.send(datos)


    }

}