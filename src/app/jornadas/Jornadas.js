import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';


export default () => {

    const torneoId = useParams().torneoId;

    var [jornadaObjects, setJornadaObjects] = useState({});
    
    const [ jornadaId, setJornadaId ] = useState('');
    const [ descripcion, setDescripcion ] = useState('');
    const [ action, setAction ] = useState('create');
    const [ message, setMessage ] = useState('');
    const [ messageLoaded, setMessageLoaded ] = useState('');
    const [ error, setError ] = useState('');

    const firebase = useFirebaseApp();
    const path = 'Torneo/'+torneoId+'/Jornadas';

    document.body.style = 'background-image: url("/images/dash-bg-03.jpg");';

    useEffect( () => {
        
        setMessages("Cargando datos...");

        firebase.database().ref().child(path).on('value', snap => {
            
            if(snap.exists()){
                setMessages("");
                setItems(snap.val());
            }else{
                setMessages("No hay datos para mostrar");
            }
        });

    }, []);

    const saveJornada = async () => {

        if(descripcion !== ""){

            let flag = true;
            
            Object.keys(jornadaObjects).map( key => {
                if(jornadaObjects[key].Descripcion.trim() == descripcion.trim()){
                    if(key !== jornadaId){
                        flag = false;
                    }       
                }
            });

            if(flag){
                if(action == "create"){
                
                    let jornadaRef = firebase.database().ref(path);
    
                    await jornadaRef.push({          
                        Descripcion:descripcion
                    }).then( () => {
                        jornadaSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
    
                }else{
    
                    let jornadaRef = firebase.database().ref(path+"/"+jornadaId);
    
                    await jornadaRef.set({
                        Descripcion:descripcion
                    }).then( () => {
                        jornadaSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                } 
            }else{
                setError("El nombre: " + descripcion + " ya ha sido tomado");
            }
            
            
        }else{
            setError("Descripción de la jornada es requerida");
        }
    }

    const jornadaSaved = () => {
        
        setMessage("Jornada guardada!");
        setError("");
        formReset();
        setDescripcion("");
        setAction("create");
        
        setTimeout(() => {
            setMessage("");    
        }, 3000);
    }

    const formReset = () => {
        document.getElementById('jornadasForm').reset();
    }

    const editJornada = async (key) => {
        
        setAction("edit");
        setJornadaId(key);

        await firebase.database().ref(path+"/"+key)
        .get().then((snap) => {
            if(snap.exists()){
                setDescripcion(snap.val().Descripcion);
            }else{
                alert("Error al obtener los datos");
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const deleteJornada = async (key) => {
        if (window.confirm("Desea eliminar esta jornada?")) {
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
        setJornadaObjects(items);
    }
    
    return (
        <div class="row tm-content-row tm-mt-big">
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="tm-block-title">CREAR/EDITAR JORNADA</h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            { message !== "" &&
                                <div class="alert alert-success text-center">
                                    { message }
                                </div>
                            }
                            <form id="jornadasForm" action="" class="tm-signup-form">
                                <div class="form-group">
                                    <label for="name">JORNADA</label>
                                    <input placeholder="Ejem; JORNADA" name="name" value={ descripcion } type="text" onChange={ (ev) => setDescripcion(ev.target.value) } class="form-control validate"/>
                                </div>
                                {  
                                    error !=="" &&
                                    <div class="alert alert-danger">
                                        { error }
                                    </div>
                                }
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <button type="button" onClick={saveJornada} class="btn btn-primary">GUARDAR
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
                            <h2 class="tm-block-title d-inline-block">JORNADA</h2>
                        </div>
                    </div>
                    { messageLoaded !== "" &&
                      <div class="text-center alert alert-warning">
                        {messageLoaded}
                    </div>}
                    <table class="table table-hover table-striped mt-3">
                        <tbody>
                            { Object.keys(jornadaObjects).map( (index, value) => {
                                return (<tr key={index}>
                                    <td>{jornadaObjects[index].Descripcion}</td>
                                    <td class="text-right">
                                        <i onClick={(e) => editJornada(index)} class="fa fa-edit mr-3 btn-action"></i>
                                        <i onClick={(e) => deleteJornada(index)} class="fa fa-trash btn-action"></i>
                                    </td>
                                </tr>)    
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}