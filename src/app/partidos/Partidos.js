
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import Countdown from 'react-countdown';

export default () => {

    const torneoId = useParams().torneoId;
    const jornadaId = useParams().jornadaId;

    const firebase = useFirebaseApp();

    var [equipoObjects, setEquipoObjects] = useState({});
    var [partidoObjects, setPartidoObjects] = useState({});
    const [ messageLoaded, setMessageLoaded ] = useState('');

    const path = "Torneo/"+torneoId+"/Partidos";

    useEffect( () => {
        
        firebase.database().ref().child("Torneo/"+torneoId+"/Equipos").on('value', snap => {
            if(snap.exists()){
                setItems(1,snap.val());
            }
        });

    }, []);

    useEffect( () => {

        setMessages("Cargando datos...");

        let partidosRef = firebase.database().ref(path);

        partidosRef.orderByChild("Jornada").equalTo(jornadaId)
        .on("value", (snap) => {
            if(snap.exists()){
                setMessages("");
                setItems(2,snap.val());

            }else{
                setItems(2,"");
                setMessages("No hay datos para mostrar");
            }
        });

        partidosRef.orderByChild("Jornada").equalTo(jornadaId).on('child_changed', snap => {});

    }, []);

    const changeEstado = async (type,key) => {

        let msg = "";

        switch (type) {
            case 1:
                msg = "Desea iniciar partido?"
                break;
            case 2:
                msg = "Desea finalizar primer tiempo";
                break;
            case 3:
                msg = "Desea iniciar segundo tiempo";
                break;
            case 4:
                msg = "Desea finalizar partido?";
                break;

        }

        if (window.confirm(msg)) {

            let flag = true;
            if(flag && type == 1){

                await firebase.database().ref(path+"/"+key).set({
                    ...partidoObjects[key],Estado:type,Inicio:new Date().toString()
                }).then( () => {
                }).catch(e => {
                    console.log(e.message);
                });
            }

            if(flag && type == 2){

                await firebase.database().ref(path+"/"+key).set({
                    ...partidoObjects[key],Estado:type,Mitad:new Date().toString()
                }).then( () => {
                }).catch(e => {
                    console.log(e.message);
                });
            }

            if(flag && type == 3){

                await firebase.database().ref(path+"/"+key).set({
                    ...partidoObjects[key],Estado:type,Segundo:new Date().toString()
                }).then( () => {
                }).catch(e => {
                    console.log(e.message);
                });
            }
            
            if(flag && type == 4){
                if(partidoObjects[key].Goles_Local > partidoObjects[key].Goles_Visitante){
                    partidoObjects[key].Ganador = partidoObjects[key].Local;
                    partidoObjects[key].Perdedor = partidoObjects[key].Visitante;
                    partidoObjects[key].Punto_Local = 2;
                }
                
                if(partidoObjects[key].Goles_Local < partidoObjects[key].Goles_Visitante){
                    partidoObjects[key].Ganador = partidoObjects[key].Visitante;
                    partidoObjects[key].Perdedor = partidoObjects[key].Local;
                    partidoObjects[key].Punto_Visitante = 2;
                }

                if(partidoObjects[key].Goles_Local == partidoObjects[key].Goles_Visitante){
                    partidoObjects[key].Punto_Local = 1;
                    partidoObjects[key].Punto_Visitante = 1;
                }

                let fin = new Date();
                let time = getTime(partidoObjects[key].Segundo, fin);
                
                await firebase.database().ref(path+"/"+key).set({
                    ...partidoObjects[key],Estado:type,Fin:fin.toString(), EndTime:time 
                }).then( () => {
                }).catch(e => {
                    console.log(e.message);
                });
            }
        }
    }

    const deletePartido = async (key) => {
        if (window.confirm("Desea eliminar esta partido?")) {
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

    const setItems = (type,items) => {
        
        switch (type) {
            
            case 1:
                setEquipoObjects(items);
                break;
            case 2:
                setPartidoObjects(items);
                break;
        }
    }

    const getTime = (inicio, actual = false) => {
        var timeActual = (actual)? actual : new Date();
        var acumularTime = timeActual - new Date(inicio);;
        var acumularTime2 = new Date();
        acumularTime2.setTime(acumularTime); 
        var cc = Math.round(acumularTime2.getMilliseconds()/10);
        var ss = acumularTime2.getSeconds();
        var mm = acumularTime2.getMinutes();
        var hh = acumularTime2.getHours()-18;
        if (cc < 10) {cc = "0"+cc;}
        if (ss < 10) {ss = "0"+ss;} 
        if (mm < 10) {mm = "0"+mm;}
        if (hh < 10) {hh = "0"+hh;}

        return  mm+" : "+ss;
    }

    return (
        <div class="row">
            <div class="col-xl-12 col-lg-12">
                <div class="bg-white mt-4 p-2">
                    <div class="row">
                        <div class="col-xl-10">
                            <h2 class="tm-block-title pt-4 pl-4 pb-0">LISTADO DE PARTIDOS</h2>
                        </div>
                        <div class="col-xl-2 pt-3 text-right">
                            <a href={"/torneos/"+torneoId+"/jornadas/"+jornadaId+"/partidos/create"} class="btn btn-primary">AGREGAR PARTIDO</a>
                        </div>       
                    </div>
                </div>
            </div>
            { messageLoaded !== "" &&
                <div class="col-xl-12 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                    <div class="partidos tm-block text-center">
                        <div class="text-center alert alert-warning">
                            {messageLoaded}
                        </div>
                    </div>
                </div>
            }
            {

                Object.keys(partidoObjects).map( (index, value) => {
                    let flag = (partidoObjects[index].Estado == 4)? true : false;
                    return (
                        <div class="col-xl-3 col-lg-12 mt-4">
                            <div key={index} class="bg-white partidos tm-block text-center">
                                { partidoObjects[index].Estado == 1 &&
                                    <div class="alert alert-info">
                                        PARTIDO INICIADO
                                    </div>
                                }
                                { partidoObjects[index].Estado == 2 &&
                                    <div class="alert alert-info">
                                        FINAL PRIMER TIEMPO
                                    </div>
                                }
                                { partidoObjects[index].Estado == 3 &&
                                    <div class="alert alert-info">
                                        SEGUNDO TIEMPO INICIADO
                                    </div>
                                }
                                { partidoObjects[index].Estado == 4 &&
                                    <div class="alert alert-danger">
                                        PARTIDO FINALIZADO
                                    </div>
                                }
                                { partidoObjects[index].Estado > 0 &&
                                <div>
                                    <h5>MARCADOR</h5>
                                    <span class="marcador">
                                        { partidoObjects[index].Goles_Local }
                                    </span>-
                                    <span class="marcador">
                                        { partidoObjects[index].Goles_Visitante }
                                    </span>
                                </div>
                                }
                                <div class="cronometro">
                                
                                { (partidoObjects[index].Estado == 1) && 
                                    <Countdown
                                        date={Date.now() + 10000000000}
                                        intervalDelay={0}
                                        precision={3}
                                        total={0}
                                        hours={0}
                                        minutes={0}
                                        seconds={0}
                                        milliseconds={0}
                                        renderer={props => <div>{ getTime(partidoObjects[index].Inicio) }</div>}
                                        />
                                }
                                { (partidoObjects[index].Estado == 3) && 
                                    <Countdown
                                        date={Date.now() + 10000000000}
                                        intervalDelay={0}
                                        precision={3}
                                        total={0}
                                        hours={0}
                                        minutes={0}
                                        seconds={0}
                                        milliseconds={0}
                                        renderer={props => <div>{ getTime(partidoObjects[index].Segundo) }</div>}
                                        />
                                }
                                { partidoObjects[index].Estado == 4 &&
                                    partidoObjects[index].EndTime
                                }
                                { partidoObjects[index].Estado == 2 &&
                                    <span>45:00</span>
                                }
                                </div>
                                <ul>
                                    <li>
                                        { partidoObjects[index].Nombre+" " } 
                                    </li>        
                                    <li>
                                        <img src={equipoObjects[partidoObjects[index].Local].Imagen} width="30px"/>
                                        { "      "}<b>VS</b>{ "      "} 
                                        <img src={equipoObjects[partidoObjects[index].Visitante].Imagen} width="30px"/>
                                    </li>
                                    <li>
                                        { equipoObjects[partidoObjects[index].Local].Nombre +"    -    "}  
                                        { equipoObjects[partidoObjects[index].Visitante].Nombre } 
                                    </li>
                                    <li><b>Estadio:</b></li>        
                                    <li>{ partidoObjects[index].Estadio+" " } </li>    
                                    <li></li>    
                                    <li>
                                        <b>Fecha:</b>{ " "+partidoObjects[index].Fecha+" " } 
                                        <b>Hora:</b>{ " "+partidoObjects[index].Hora } 
                                    </li>
                                </ul>
                                <hr/>
                                { partidoObjects[index].Estado == 0 &&
                                    <button onClick={(e) => changeEstado(1,index)} class="btn btn-sm btn-primary">INICIAR</button>
                                }
                                { partidoObjects[index].Estado == 1 &&
                                    <button onClick={(e) => changeEstado(2,index)} class="btn btn-sm btn-primary">F. 1ER TIEMPO</button>
                                }
                                { partidoObjects[index].Estado == 2 &&
                                    <button onClick={(e) => changeEstado(3,index)} class="btn btn-sm btn-primary">INICIAR 2DO TIEMPO</button>
                                }
                                { partidoObjects[index].Estado == 3 &&
                                    <button onClick={(e) => changeEstado(4,index)} class="btn btn-sm btn-primary">FINALIZAR</button>
                                }
                                <a href={"/torneos/"+torneoId+"/jornadas/"+jornadaId+"/partidos/"+index} class="btn btn-sm btn-primary">EDITAR</a>
                                <a onClick={(e) => deletePartido(index)} class="btn btn-primary">ELIMINAR</a>
                            </div>
                        </div> 
                       
                    )    
                })
            }   
        </div>
    )
}
