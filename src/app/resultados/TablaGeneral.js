import React, { useState,useEffect } from "react";
import { useFirebaseApp } from 'reactfire';
import { useParams } from "react-router-dom";
import Tabla from "../../components/Tabla";

export default () => {

    const firebase = useFirebaseApp();

    var [torneo, setTorneo] = useState();
    var [equipoObjects, setEquipoObjects] = useState({});
    var [partidoObjects, setPartidoObjects] = useState({});
    var [partidoObjectsFiltrado, setPartidoObjectsFiltrados] = useState({});
    
    const [ messageLoadedEquipos, setMessageLoadedEquipos ] = useState('');
    const [ messageLoadedPartidos, setMessageLoadedPartidos ] = useState('');

    const torneoId = useParams().torneoId;
    const equipos = [];

    const estados = ["","iniciado","","","finalizado"];
    const path = "Torneo/"+torneoId+"/Partidos";

    useEffect( () => {
        
        setMessages(1,"Cargando datos...");
        
        firebase.database().ref().child('Torneo/'+torneoId).on('value', snap => {
            if(snap.exists()){
                setItems(3,snap.val());
            }else{
                setItems(3,{});
            }
        });

        firebase.database().ref().child("Torneo/"+torneoId+"/Equipos").on('value', snap => {
            if(snap.exists()){
                setMessages(1,"");
                setItems(1,snap.val());
            }else{
                setMessages(1,"No hay datos para mostrar");
            }
        });

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

        switch (type) {
            case 1:
                setEquipoObjects(items);
                equipos.push(items);
            break;
            case 2:
                
                setPartidoObjects(items);
                
                let filtrados = [];

                let jornadaId = localStorage.getItem("jornada");
                
                Object.keys(items).map( (key, value) => {
                    if(items[key].Jornada == jornadaId){
                        filtrados.push({...items[key],key});
                    }
                });

                if(!filtrados.length){
                    setMessageLoadedPartidos("No hay partidos para mostrar");
                }

                setPartidoObjectsFiltrados(filtrados);
                break;
            case 3:
                setTorneo(items);
                
                if(items.Jornadas){
                    let jornadas = items.Jornadas;
                    let jornada;
    
                    Object.keys(jornadas).map( (key) => {
                        jornada = key;
                    });
    
                    localStorage.setItem("jornada", jornada);
                    
                }
            break;
        }
    }

    const verPartido = (key) => {
        window.location = "/torneos/" + torneoId + "/jornadas/" + localStorage.getItem("jornada") + "/partidos/"+ key + "/show";
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
                    <table id="home-partidos" class="table table-hover table-striped mt-3">
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
                                        <td>
                                            <a title="Ver partido" href={"/torneos/"+torneoId+"/jornadas/"+localStorage.getItem("jornada")+"/partidos/"+partidoObjectsFiltrado[index].key+"/show"}><i class="fa fa-eye mr-3 btn-action"></i></a>
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
