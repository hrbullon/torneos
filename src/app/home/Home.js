import React, { useState,useEffect } from "react";
import { useFirebaseApp } from 'reactfire';
import Tabla from "../../components/Tabla";

export default () => {

    const firebase = useFirebaseApp();

    var [equipoObjects, setEquipoObjects] = useState({});
    var [partidoObjects, setPartidoObjects] = useState({});
    var [partidoObjectsFiltrado, setPartidoObjectsFiltrados] = useState({});
    const [ messageLoadedEquipos, setMessageLoadedEquipos ] = useState('');
    const [ messageLoadedPartidos, setMessageLoadedPartidos ] = useState('');

    const torneoId = localStorage.getItem("torneo");  
    const jornadaId = localStorage.getItem("jornada");
    const equipos = [];

    const estados = ["","iniciado","finalizado"];
    const path = "Torneo/"+torneoId+"/Partidos";
    
    useEffect( () => {
        
        setMessages(1,"Cargando datos...");

        firebase.database().ref().child("Torneo/"+torneoId+"/Equipos").on('value', snap => {
            if(snap.exists()){
                setMessages(1,"");
                setItems(1,snap.val());
            }else{
                setMessages(1,"No hay datos para mostrar");
            }
        });

    }, []);

    useEffect( () => {

        setMessages(2,"Cargando datos...");

        let partidosRef = firebase.database().ref(path);

        partidosRef.on("value", (snap) => {
            if(snap.exists()){
                setMessages(2,"");
                setItems(2,snap.val());
            }else{
                setItems(2,"");
                setMessages(2,"No hay datos para mostrar");
            }
        });

        partidosRef.on('child_changed', snap => {});

    }, []);

    const setMessages = (type, msg) => {
        if(type == 1){
            setMessageLoadedEquipos(msg);
        }else{
            setMessageLoadedPartidos(msg);
        }
    }

    const setItems = (type,items) => {
        if(type == 1){
            setEquipoObjects(items);
            equipos.push(items);
        }else{
            setPartidoObjects(items);

            let filtrados = [];

            Object.keys(items).map( (key, value) => {
                if(items[key].Jornada == jornadaId){
                    filtrados.push(items[key]);
                }
            });

            setPartidoObjectsFiltrados(filtrados);
        }
    }

    return (
        <div class="row tm-content-row tm-mt-big">
            <div class="col-xl-8 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                <div class="bg-white tm-block h-100">
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <h2 class="tm-block-title d-inline-block">Tabla de Posiciones</h2>
                        </div>
                    </div>
                    { messageLoadedEquipos !== "" &&
                    <div class="bg-white partidos tm-block text-center">
                        <div class="text-center alert alert-warning">
                            {messageLoadedEquipos}
                        </div>
                    </div>}
                    <Tabla equipos={equipoObjects} partidos={partidoObjects}/>
                </div>
            </div>

            <div class="col-xl-4 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                <div class="bg-white tm-block h-100">
                    <h2 class="tm-block-title d-inline-block">Resultados última Jornada</h2>
                    { messageLoadedPartidos !== "" &&
                    <div class="bg-white partidos tm-block text-center">
                        <div class="text-center alert alert-warning">
                            {messageLoadedPartidos}
                        </div>
                    </div>}
                    <table class="table table-hover table-striped mt-3">
                        <tbody>
                        {
                            Object.keys(partidoObjectsFiltrado).map( (index, value) => {
                                return (
                                    
                                    <tr class={estados[ partidoObjectsFiltrado[index].Estado]} key={index}>
                                        <td>
                                            { equipoObjects[partidoObjectsFiltrado[index].Local].Nombre+"   " }
                                        </td>
                                        <td class="puntos_equipos">                                            
                                            { partidoObjectsFiltrado[index].Goles_Local +" - " + partidoObjectsFiltrado[index].Goles_Visitante}
                                        </td>
                                        <td>
                                            { equipoObjects[partidoObjectsFiltrado[index].Visitante].Nombre}
                                        </td>
                                    </tr>    
                                )
                            })    
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
