import React, { Component, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import Detalle from './Detalle';

export default () => {

    const torneoId = useParams().torneoId;
    const partidoId = useParams().partidoId;
    const jornadaId = useParams().jornadaId;
    const path = 'Torneo/'+torneoId+'/Jornadas/'+jornadaId+'/Partidos/'+partidoId;
    
    const [ data, setData] = useState('');
    const [ ptoLocal, setPtoLocal] = useState('');
    const [ ptoVisitante, setPtoVisitante] = useState('');

    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState('');

    const [ local, setLocal] = useState('');
    const [ visitante, setVisitante] = useState('');

    const firebase = useFirebaseApp();

    const updateScore = async () => {

        if(ptoLocal !== "" && ptoVisitante !== ""){
            await firebase.database().ref("Torneo/"+torneoId+"/Jornadas/"+jornadaId+"/Partidos/"+partidoId).set({
                ...data,
                Punto_Local: ptoLocal,Punto_Visitante: ptoVisitante
            }).then( () => {
                
                let up = {...data, Punto_Local: ptoLocal,Punto_Visitante: ptoVisitante};
                
                setData(up);
                
                setMessage("Datos actualizados!");
                
                setTimeout(() => {
                    setMessage("");
                }, 2000);
    
            }).catch(e => {
                setError(e.message);
            });
        }else{
            setError("Rellene los campos del formualrio");
        }


    }

    useEffect( () => {
        
        let handles = [];

        const roorRef = firebase.database().ref();
        const partido = roorRef.child("Torneo/"+torneoId+"/Jornadas/"+jornadaId+"/Partidos/"+partidoId);
        
        partido.on('value', snap => {
            
            handles.push(snap.val());
            setPtoLocal(snap.val().Punto_Local);
            setPtoVisitante(snap.val().Punto_Visitante);

            let equiposRef = roorRef.child("Torneo/"+torneoId+"/Equipos/");
            equiposRef.once("value", snapEquipo => {
                let items = snapEquipo.val();
                Object.keys(items).map( (index, value) => {

                    if(handles[0].Local == index){
                        setLocal(items[index].Nombre);
                    }

                    if(handles[0].Visitante == index){
                        setVisitante(items[index].Nombre);
                    }

                });
            });

            setData(handles[0]);
        });


    }, []);

    return (
        <div class="row tm-content-row tm-mt-big">
            <Detalle partido={data} local={local} visitante={visitante}/>
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block h-100">
                    <center> 
                        <h2 class="tm-block-title">EDITAR RESULTADOS</h2>
                    </center> 
                    { message !== "" &&
                        <div class="alert alert-success text-center">
                            { message }
                        </div>
                    }
                    <hr/>
                    <div class="table-responsive">
                        <table class="table table-hover table-striped tm-table-striped-even mt-3">
                            <thead>
                                <tr class="tm-bg-gray">
                                    <th scope="col">EQUIPO</th>
                                    <th scope="col" class="text-center">GOLES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center">{ local }</td>
                                    <td class="text-center">
                                        <input type="text" value={ ptoLocal } onChange={ (ev) => setPtoLocal(ev.target.value) } class="form-control validate"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center">{ visitante }</td>
                                    <td class="text-center">
                                        <input type="text" value={ ptoVisitante } onChange={ (ev) => setPtoVisitante(ev.target.value) } class="form-control validate"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button class="button" onClick={updateScore} class="btn btn-primary">ACTUALIZAR</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
