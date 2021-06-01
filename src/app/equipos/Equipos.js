import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import 'firebase/database';
import 'firebase/storage';
import { useStorage, useFirebaseApp } from 'reactfire';

export default () => {

    const storage = useStorage();
    const firebase = useFirebaseApp();

    const torneoId = useParams().torneoId;

    var [equipoObjects, setEquipoObjects] = useState({});

    const [ equipoId, setEquipoId ] = useState('');
    const [ Nombre, setNombre ] = useState('');
    const [ Imagen, setImagen ] = useState();
    const [ File, setFile ] = useState();
    const [ action, setAction ] = useState('create');
    const [ message, setMessage ] = useState('');
    const [ messageLoaded, setMessageLoaded ] = useState('');
    const [ error, setError ] = useState('');
    const path = "Torneo/" + torneoId + "/Equipos";

    useEffect( () => {

        setMessages("Cargando data...");

        document.getElementById("inputImage").style.display = "none";
        
        firebase.database().ref().child(path)
            .on('value', snap => {
                if (snap.exists()) {
                    setMessages("");
                    setItems(snap.val());
                } else {
                    setItems({});
                    setMessages("No hay datos para mostrar");
                }
            });

    }, []);

    const saveEquipo = async () => {

        if(Nombre !== "" && Imagen !== ""){
            
            let flag = true;
            
            Object.keys(equipoObjects).map( key => {
                if(equipoObjects[key].Nombre.trim() == Nombre.trim()){
                    if(key !== equipoId){
                        flag = false;
                    }       
                }
            });

            if(flag){

                if(action == "create"){
                    
                    let equipoRef = firebase.database().ref(path);
    
                    await equipoRef.push({
                        Nombre,
                        Imagen
                    }).then( () => {
                        equipoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
    
                }else{
    
                    let equipoRef = firebase.database().ref(path+"/"+equipoId);
    
                    await equipoRef.set({
                        Nombre,
                        Imagen
                    }).then( () => {
                        equipoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                } 
            }else{
                setError("El nombre: " + Nombre + " ya ha sido tomado");
            }

        }else{
            setError("Nombre del equipo e Imagen son requeridos");
        }
    }

    const equipoSaved = () => {
        
        setMessage("Equipo guardado!");
        setError("");
        formReset();
        setNombre("");
        setImagen("");
        setAction("create");
        
        setTimeout(() => {
            setMessage("");    
        }, 3000);
    }

    const formReset = () => {
        document.getElementById('equiposForm').reset();
        document.getElementById('imagePreview').src = "/images/dash-bg-03.jpg";
    }


    const choseImage = () => {
        document.getElementById("inputImage").click()
    }

    const changeImagen = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function(){
            let preview = document.getElementById('imagePreview');
            preview.src = reader.result;
            setFile(file);
        };

    }

    const enableAndDisableBtn = (flag) => {
        document.getElementById("btnUpload").disabled = flag;
    }

    const uploadImage = async () => {
        
        enableAndDisableBtn(true);
        setMessage("Subiendo archivo...");

        try {
        
            const newRef = storage.ref('Imagenes').child(File.name); // nombre del archivo
            await newRef.put(File);
            
            let urlImagen = await newRef.getDownloadURL()
            setImagen(urlImagen)
            setMessage("Subir imagen completada");
            enableAndDisableBtn(false);

            setTimeout(() => {
                setMessage("");    
            }, 3000);

        } catch (e) {
            setError(e.message);
        }
    };

    const editEquipo = async (key) => {
        
        setAction("edit");
        setEquipoId(key);

        await firebase.database().ref(path+"/"+key)
        .get().then((snap) => {
            if(snap.exists()){

                let response = snap.val();
                setNombre(response.Nombre);
                setImagen(response.Imagen);
                document.getElementById('imagePreview').src = response.Imagen;

            }else{
                alert("Error al obtener los datos");
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const deleteEquipo = async (key) => {
        if (window.confirm("Desea eliminar este equipo?")) {
            await firebase.database().ref(path+"/"+key).remove((error) => {
                if(error){
                    alert("Ocurrió un error, intente de nuevo más tarde");
                }
            });
        }
    }

    const setMessages = (msg) => {
        setMessageLoaded(msg);
    }

    const setItems = (items) => {
        setEquipoObjects(items);
    }

    return ( 
        <div class="row tm-content-row tm-mt-big">
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="tm-block-title">CREAR NUEVO EQUIPO</h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            { message !== "" &&
                                <div class="alert alert-success text-center">
                                    { message }
                                </div>
                            }
                            <form id="equiposForm" class="tm-signup-form">
                                <div class="form-group">
                                    <label >NOMBRE DEL EQUIPO</label>
                                    <input placeholder="Ejem; MEXICO" name="Nombre" value={Nombre} onChange={ (ev) => setNombre(ev.target.value) } type="text" class="form-control"/>
                                </div>
                                <div class="bg-white tm-block">
                                    <h2 class="tm-block-title">IMAGEN DEL EQUIPO</h2>
                                    <img id="imagePreview" width="80%" src="/images/dash-bg-03.jpg" alt="Imagen de equipo"  class="img-fluid"/>
                                    <div class="custom-file mt-3 mb-3">
                                        <input type="file" id="inputImage" name="imagen" onChange={changeImagen} />
                                        <input type="button" onClick={choseImage} class="btn btn-primary  mx-xl-auto" value="Elegir Imagen"/>
                                        <input type="button" id="btnUpload" onClick={uploadImage} class="btn btn-primary  mx-xl-auto" value="Subir Imagen"/>
                                    </div>
                                </div>
                                {  
                                    error !=="" &&
                                    <div class="alert alert-danger">
                                        { error }
                                    </div>
                                }
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <button type="button" onClick={saveEquipo} class="btn btn-primary">GUARDAR
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="tm-block-title d-inline-block">EQUIPOS</h2>
                        </div>
                    </div>
                    { messageLoaded !== "" &&
                      <div class="text-center alert alert-warning">
                        {messageLoaded}
                    </div>}
                    <table class="table table-hover table-striped mt-3">
                        <tbody>
                            { Object.keys(equipoObjects).map( (index, value) => {
                                return (<tr key={index}>
                                    <td>{equipoObjects[index].Nombre}</td>
                                    <td><img src={equipoObjects[index].Imagen} width="60px"/></td>
                                    <td class="text-right">
                                        <i onClick={(e) => editEquipo(index)} class="fa fa-edit mr-3 btn-action"></i>
                                        <i onClick={(e) => deleteEquipo(index)} class="fa fa-trash btn-action"></i>
                                    </td>
                                </tr>)    
                            })}
                        </tbody>
                    </table>                    
                </div>
            </div>
        
        </div>   
    );
}
