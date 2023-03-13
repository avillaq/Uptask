<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === "crear"){
    //Codigo para crear los administradores
    
    //Hashear passwords
    $opciones = array(
        "cost" => 12
    );
    $has_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //Importar la conexion
    include "../funciones/conexion.php";
    
    try{
        //Realizar la consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario,password) VALUES (?,?)");

        $stmt->bind_param("ss",$usuario,$has_password);
        $stmt->execute();

        if($stmt->affected_rows>0){
            $respuesta = array(
                "respuesta" => "correcto",
                "id_insertado" => $stmt->insert_id,
                "tipo" => $accion
            );
        }else{
            $respuesta = array(
                "respuesta" => "error"
            );
        }

        $stmt->close();
        $conn->close();

    }catch(Exception  $e){
        $respuesta = array(
            "error" => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === "login"){
    //Codigo para logear a los administradores
    //Importar la conexion
    include "../funciones/conexion.php";
    
    try{
        //Seleccionar el administrador de la base de datos
        $stmt = $conn->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario=?");

        $stmt->bind_param("s",$usuario);
        $stmt->execute();

        //Loguear el usuario
        $stmt->bind_result($id_usuario,$nombre_usuario,$pass_usuario);

        $stmt->fetch();

        if($nombre_usuario){
            //El usuario existe, verificar el password
            if(password_verify($password,$pass_usuario)){
                //Iniciar la sesion
                session_start();
                $_SESSION["nombre"] = $nombre_usuario;
                $_SESSION["id"] = $id_usuario;
                $_SESSION["login"] = true;

                //Login correcto
                $respuesta = array(
                    "respuesta" => "correcto",
                    "nombre" => $nombre_usuario,
                    "tipo" => $accion
                );
                
            }
            else{
                //Login incorrecti, enviar error
                $respuesta = array(
                    "respuesta" => "noLogin"
                );
            }

        }else{
            $respuesta = array(
                "respuesta" => "noLogin"
            );
        }


        $stmt->close();
        $conn->close();

    }catch(Exception  $e){
        $respuesta = array(
            "error" => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
?>