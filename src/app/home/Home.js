import React, { useState,useEffect } from "react";
import { useFirebaseApp } from 'reactfire';

export default () => { 

    const firebase = useFirebaseApp();

    var [torneoObjects, setTorneoObjects] = useState({});

    const [ messageLoadedTorneos, setMessageLoadedTorneos ] = useState('');

    useEffect( () => {
        
        setMessages("Cargando datos...");

        const roorRef = firebase.database().ref();
        const torneo = roorRef.child("Torneo").orderByKey().limitToLast(10);
        
        torneo.on('value', (snap) => {
            if(snap.exists()){
                setMessages("");
                setItems(snap.val());
            }else{
                setMessages("No hay torneo registrados para mostrar");
            }
        });

    }, []);

    const setMessages = (msg) => {
        setMessageLoadedTorneos(msg);
    }

    const setItems = (items) => {
        setTorneoObjects(items);
    }

    return (
        <div class="row tm-content-row tm-mt-big">
            <div class="col-xl-12 col-lg-12 tm-md-12 tm-sm-12 tm-col">
                <div class="bg-white tm-block h-100">
                    <div class="row">
                        <div class="col-12">
                            <h2 class="tm-block-title d-inline-block">Listado de torneos</h2>
                        </div>
                    </div>
                    { messageLoadedTorneos !== "" &&
                    <div class="bg-white partidos tm-block text-center">
                        <div class="text-center alert alert-warning">
                            {messageLoadedTorneos}
                        </div>
                    </div>}
                    <div class="table-responsive">
                        <table class="table table-hover table-striped tm-table-striped-even mt-3">
                            <tbody>
                                { Object.keys(torneoObjects).map( (index, value) => {
                                    return (<tr key={index}>
                                        <td class="torneo-item" title="Ver torneo"><a href={"/torneos/"+index+"/tabla-general"}>{torneoObjects[index].Descripcion}</a></td>
                                    </tr>)    
                                })}
                            </tbody>
                        </table>
                    </div>                
                </div>
            </div>
        </div>    
    );
    
}