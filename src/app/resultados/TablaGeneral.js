import React, { useState,useEffect } from "react";
import { useFirebaseApp } from 'reactfire';
import Tabla from "../../components/Tabla";

export default () => {

    const firebase = useFirebaseApp();

    var [equipoObjects, setEquipoObjects] = useState({});
    var [partidoObjects, setPartidoObjects] = useState({});
    const [ messageLoaded, setMessageLoaded ] = useState('');

    const torneoId = localStorage.getItem("torneo");  
    const jornadaId = localStorage.getItem("jornada");
    const equipos = [];

    useEffect( () => {
        
        setMessages(1,"Cargando datos...");

        firebase.database().ref().child("Torneo/"+torneoId+"/Equipos").on('value', snap => {
            if(snap.exists()){
                setMessages("");
                setItems(1,snap.val());
            }else{
                setMessages("No hay datos para mostrar");
            }
        });

    }, []);

    useEffect( () => {

        setMessages("Cargando datos...");

        let partidosRef = firebase.database().ref().child("Torneo/"+torneoId+"/Partidos");
        
        partidosRef.on('value', snap => {
            if(snap.exists()){
                setMessages("");
                setItems(2,snap.val());
            }else{
                setItems(2,"");
                setMessages("No hay datos para mostrar");
            }
        });

        partidosRef.on('child_changed', snap => {});

    }, []);


    const setMessages = (msg) => {
        setMessageLoaded(msg);  
    }

    const setItems = (type,items) => {
        if(type == 1){
            setEquipoObjects(items);
            equipos.push(items);
        }else{
            setPartidoObjects(items);
        }
    }

    return (
        <div class="row tm-content-row tm-mt-big">
            { messageLoaded !== "" &&
                <div class="col-xl-12 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                    <div class="partidos tm-block text-center">
                        <div class="text-center alert alert-warning">
                            {messageLoaded}
                        </div>
                    </div>
                </div>
            }
            <div class="col-xl-12 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                <div class="bg-white tm-block h-100">
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <h2 class="tm-block-title d-inline-block">Tabla de Posiciones</h2>
                        </div>
                    </div>
                    <Tabla equipos={equipoObjects} partidos={partidoObjects}/>
                </div>
            </div>
        </div>
    );
}
