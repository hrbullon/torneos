import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import Countdown from 'react-countdown';

export default () => {

    const torneoId = useParams().torneoId;
    const jornadaId = useParams().jornadaId;
    const partidoId = useParams().partidoId;

    const firebase = useFirebaseApp();

    var [partido, setPartido] = useState({});
    var [equipoObjects, setEquipoObjects] = useState({});
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

        partidosRef.orderByKey().equalTo(partidoId)
        .on("value", (snap) => {
            if(snap.exists()){
                setMessages("");
                setItems(2,snap.val());

            }else{
                setItems(2,"");
                setMessages("No hay datos para mostrar");
            }
        });

    }, []);

    const setMessages = (msg) => {
        setMessageLoaded(msg);
    }

    const setItems = (type,items) => {
        if(type == 1){
            setEquipoObjects(items);
        }else{
            setPartido(items);
        }
    }

    const getTime = (inicio) => {
        var timeActual = new Date();
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
        <div class="row ">
            <div class="col-12 justify-content-center">
                <div id="partido" class="bg-white mt-4 p-4 text-center">
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
                        Object.keys(partido).map( (index, value) => {
                            return (
                            <div>  
                                { partido[index].Estado == 1 &&
                                    <div class="alert alert-info">
                                        PARTIDO INICIADO
                                    </div>
                                }
                                { partido[index].Estado == 2 &&
                                    <div class="alert alert-info">
                                        FINAL PRIMER TIEMPO
                                    </div>
                                }
                                { partido[index].Estado == 3 &&
                                    <div class="alert alert-info">
                                        SEGUNDO TIEMPO INICIADO
                                    </div>
                                }
                                { partido[index].Estado == 4 &&
                                    <div class="alert alert-danger">
                                        PARTIDO FINALIZADO
                                    </div>
                                }
                                <h2>TIEMPO</h2>
                                <div class="cronometro">
                                { partido[index].Estado == 4 &&
                                    partido[index].EndTime
                                }
                                { (partido[index].Estado == 1) && 
                                    <Countdown
                                        date={Date.now() + 10000000000}
                                        intervalDelay={0}
                                        precision={3}
                                        total={0}
                                        hours={0}
                                        minutes={0}
                                        seconds={0}
                                        milliseconds={0}
                                        renderer={props => <div>{ getTime(partido[index].Inicio) }</div>}
                                        />
                                }
                                { (partido[index].Estado == 3) && 
                                    <Countdown
                                        date={Date.now() + 10000000000}
                                        intervalDelay={0}
                                        precision={3}
                                        total={0}
                                        hours={0}
                                        minutes={0}
                                        seconds={0}
                                        milliseconds={0}
                                        renderer={props => <div>{ getTime(partido[index].Segundo) }</div>}
                                        />
                                }
                                { partido[index].Estado == 2 &&
                                    <span>45:00</span>
                                }
                                </div>
                                { partido[index].Estado > 0 &&
                                <div>
                                    <h5>MARCADOR</h5>
                                    <span class="marcador">
                                        { partido[index].Goles_Local }
                                    </span>-
                                    <span class="marcador">
                                        { partido[index].Goles_Visitante }
                                    </span>
                                </div>
                                }
                                <ul>    
                                    <li>
                                        { partido[index].Nombre+" " } 
                                    </li>        
                                    <li>
                                        <img src={equipoObjects[partido[index].Local].Imagen} width="100px"/>
                                        { "      "}<b>VS</b>{ "      "} 
                                        <img src={equipoObjects[partido[index].Visitante].Imagen} width="100px"/>
                                    </li>
                                    <li>
                                        { equipoObjects[partido[index].Local].Nombre +"    -    "}  
                                        { equipoObjects[partido[index].Visitante].Nombre } 
                                    </li>
                                    <li><b>Estadio:</b></li>        
                                    <li>{ partido[index].Estadio+" " } </li>    
                                    <li></li>    
                                    <li>
                                        <b>Fecha:</b>{ " "+partido[index].Fecha+" " } 
                                        <b>Hora:</b>{ " "+partido[index].Hora } 
                                    </li>
                                </ul>
                            </div>            
                            )    
                        })
                    }

                </div>
            </div>  
        </div>
    )
}
