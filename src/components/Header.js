import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';

export default () => {

    const firebase = useFirebaseApp();
    const torneoId = useParams().torneoId;
    const jornadaId = useParams().jornadaId;
    
    var [torneoObjects, setTorneoObjects] = useState({});
    const [ isMobile, setIsMobile] = useState(false);

    const logOut = async() => {
        await firebase.auth().signOut();
        localStorage.setItem('logged',false);
        window.location = "/auth/login";
    }

    useEffect( () => { 

        const roorRef = firebase.database().ref();
        const torneo = roorRef.child("Torneo").orderByKey().limitToLast(10);
       
        torneo.on('value', (snap) => {
            if(snap.exists()){
                setItems(snap.val());
            }
        });

        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)){
            setIsMobile(true);        
        }
        
    }, []);

    const setItems = (items) => {
        setTorneoObjects(items);
    }

    const getElementsLi = (torneo, items) => {
        let item = "";
        Object.keys(items).map( key => {
            item = <li class="nav-link dropdown-toggle"><a href={"/torneos/"+torneo+"/jornadas/"+key+"/partidos"}>Partidos</a></li>
        })
        return item;
    }

    const showTorneo = () => {
        let split = window.location.href.split("/");
        let torneo;

        if(split.length > 6){
            return (Object.keys(torneoObjects).map( (key) => {
                if(key == split[4]){
                    torneo = torneoObjects[key];
                    let jornadaTxt = (torneoObjects[key].Jornadas[split[6]])? " - " + torneoObjects[key].Jornadas[split[6]].Descripcion : "";
                    return torneo.Descripcion + jornadaTxt;
                }
            }));
        }
    }

    return ( 
        <div class="row">
            <div class="col-12">
                <nav class="navbar navbar-expand-xl navbar-light bg-light">
                    <a class="navbar-brand" href="/">
                        <h1 class="tm-site-title mb-0">Mis Torneos</h1>
                    </a>
                    <button class="navbar-toggler ml-auto mr-0" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    { !isMobile &&
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <input type="checkbox" id="css3menu-switcher" class="c3m-switch-input"></input>
                            <ul id="css3menu1" class="navbar-nav mx-auto">
                                <li class="nav-item dropdown">
                                    <label onclick="" for="css3menu-switcher"></label></li>
                                <li class="nav-link dropdown-toggle"><a href="#" >
                                    <span>Torneo</span></a>
                                <ul>
                                    <li class="nav-link dropdown-toggle">
                                        <a href="/torneos">Crear Nuevo Torneo</a>
                                    </li>
                                        { Object.keys(torneoObjects).map( key => {
                                            return (
                                                
                                                <li key={key} class="nav-link dropdown-toggle">
                                                    <a>{ torneoObjects[key].Descripcion }</a>
                                                    <ul>
                                                        <li class="nav-link dropdown-toggle"><a href={"/torneos/"+key+"/equipos"}>Equipos</a></li>
                                                        <li class="nav-link dropdown-toggle"><a href={"/torneos/"+key+"/jornadas"}><span>Jornada</span></a>
                                                            {   torneoObjects[key].Jornadas &&
                                                                <ul>
                                                                { getElementsLi(key,torneoObjects[key].Jornadas) }
                                                                </ul>
                                                            }
                                                        </li>   
                                                        <li class="nav-link dropdown-toggle"><a href={"/torneos/"+key+"/tabla-general"}>Tabla General</a></li>
                                                    </ul>
                                                </li>
                                            )
                                        })}
                                    </ul></li>
                                </ul>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link d-flex" href="javascript:void(0);" onClick={logOut}>
                                        <i class="far fa-user mr-2 tm-logout-icon"></i>
                                        <span>Cerrar Sesi&oacute;n</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    }
                    { isMobile &&
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mx-auto">
                            <li class="nav-item dropdown">
                                <div class={"dropdown-menu show"}  aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="/torneos">Crear Torneo</a>
                                    { Object.keys(torneoObjects).map( key => {
                                            return (
                                                <a href={"/torneos/"+key} class="nav-link">{torneoObjects[key].Descripcion}</a>
                                            )
                                        })      
                                    }
                                    
                                </div>
                            </li>
                        </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a onClick={logOut} class="nav-link d-flex">
                                    <i class="far fa-user mr-2 tm-logout-icon"></i>
                                    <span>Cerrar Sesi&oacute;n</span>
                                </a>
                            </li>
                        </ul>
                    </div>}
                </nav>
            </div>
            {   !/home/.test(window.location.href) &&
                <div class="col-12 justify-content-center">
                    <div class="bg-white mt-4 p-4 text-center">
                        <h4>{ showTorneo()}</h4>
                    </div>    
                </div>                        
            }   
        </div> 
    );
}