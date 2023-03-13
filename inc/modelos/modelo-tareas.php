<?php
$accion = $_POST['accion'];

if($accion === "crear"){
    $tarea = $_POST['tarea'];
    $id_proyecto = (int) $_POST['id_proyecto'];
    //Importar la conexion
    include "../funciones/conexion.php";
    
    try{
        //Realizar la consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");

        $stmt->bind_param("ss",$tarea,$id_proyecto);
        $stmt->execute();

        if($stmt->affected_rows>0){
            $respuesta = array(
                "respuesta" => "correcto",
                "id_proyecto" => $stmt->insert_id,
                "tipo" => $accion,
                "tarea" => $tarea
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

if($accion === "actualizar"){
    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id'];
    //Importar la conexion
    include "../funciones/conexion.php";
    
    try{
        //Realizar la consulta a la base de datos
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id=?");

        $stmt->bind_param("ii",$estado,$id_tarea);
        $stmt->execute();

        if($stmt->affected_rows>0){
            $respuesta = array(
                "respuesta" => "correcto"
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

if($accion === "eliminar"){

    $id_tarea = (int) $_POST['id'];
    //Importar la conexion
    include "../funciones/conexion.php";
    
    try{
        //Realizar la consulta a la base de datos
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id=?");

        $stmt->bind_param("i",$id_tarea);
        $stmt->execute();

        if($stmt->affected_rows>0){
            $respuesta = array(
                "respuesta" => "correcto"
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

?>