import React, { Component, useState, useEffect } from 'react'
import 'firebase/database';
import { useFirebaseApp } from 'reactfire';
import List from '../../components/List';

export default () => {

    var [torneoObjects, setTorneoObjects] = useState({});

    const [ torneoId, setTorneoId ] = useState('');
    const [ Descripcion, setDescripcion ] = useState('');
    const [ action, setAction ] = useState('create');
    const [ message, setMessage ] = useState('');
    const [ messageLoaded, setMessageLoaded ] = useState('');
    const [ error, setError ] = useState('');
    const [ Torneo, setTorneo ] = useState('');
    const [ Exists, setExists ] = useState('');

    const firebase = useFirebaseApp();
    const path = 'Torneo';
    
    useEffect( () => {
        
        setMessages("Cargando datos...");

        firebase.database().ref().child('Torneo').on('value', snap => {
            if(snap.exists()){
                setMessages("");
                setItems(snap.val());
            }else{
                setMessages("No hay datos para mostrar");
            }
        });

    }, []);

    const saveTorneo = async () => {

        if(Descripcion !== ""){
            
            let flag = true;
            
            Object.keys(torneoObjects).map( key => {
                if(torneoObjects[key].Descripcion.trim() == Descripcion.trim()){
                    if(key !== torneoId){
                        flag = false;
                    }       
                }
            });

            if(flag){

                if(action == "create"){
    
                    let torneoRef = firebase.database().ref("Torneo");
                    
                    await torneoRef.push({
                        Descripcion
                    }).then( () => {
                        torneoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                }else{
                    
                    let torneoRef = firebase.database().ref("Torneo/"+torneoId);
                    
                    await torneoRef.set({
                        ...Torneo,
                        Descripcion
                    }).then( () => {
                        torneoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                } 
            }else{
                setError("El nombre: " + Descripcion + " ya ha sido tomado");
            } 
        }else{
            setError("Descripción del torneo requerida");
        }
    }

    const torneoSaved = () => {
        setMessage("Torneo guardado!");
        setError("");
        formReset();
        setDescripcion("");
        setAction("create");
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }

    const formReset = () => {
        document.getElementById('torneosForm').reset();
    }

    const editTorneo = async (key) => {
        
        setAction("edit");
        setTorneoId(key);

        await firebase.database().ref(path+"/"+key)
        .get().then((snap) => {
            if(snap.exists()){
                setDescripcion(snap.val().Descripcion);
                setTorneo(snap.val());
            }else{
                alert("Error al obtener los datos");
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const deleteTorneo = async (key) => {
        if (window.confirm("Desea eliminar este torneo?")) {
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
        setTorneoObjects(items);
    }

    return (
        <div class="row tm-content-row tm-mt-big">
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="tm-block-title">CREAR/EDITAR TORNEO</h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            { message !== "" &&
                                <div class="alert alert-success text-center">
                                    { message }
                                </div>
                            }
                            <form id="torneosForm" action="" class="tm-signup-form">
                                <div class="form-group">
                                    <label for="name">TORNEO</label>
                                    <input placeholder="Ejem; Torneo 2021" name="Descripcion" value={ Descripcion } onChange={ (ev) => setDescripcion(ev.target.value) } type="text" class="form-control"/>
                                </div>
                                {  
                                    error !=="" &&
                                    <div class="alert alert-danger">
                                        { error }
                                    </div>
                                }
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <button type="button" onClick={saveTorneo} class="btn btn-primary">GUARDAR
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
                            <h2 class="tm-block-title d-inline-block">TORNEOS</h2>
                        </div>
                    </div>
                    { messageLoaded !== "" &&
                      <div class="text-center alert alert-warning">
                        {messageLoaded}
                    </div>}
                    <table class="table table-hover table-striped mt-3">
                        <tbody>
                            { Object.keys(torneoObjects).map( (index, value) => {
                                return (<tr key={index}>
                                    <td>{torneoObjects[index].Descripcion}</td>
                                    <td class="text-right">
                                        <i onClick={(e) => editTorneo(index)} class="fa fa-edit mr-3 btn-action"></i>
                                        <i onClick={(e) => deleteTorneo(index)} class="fa fa-trash btn-action"></i>
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
