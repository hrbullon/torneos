import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';

export default () => {

    const firebase = useFirebaseApp();
    const [ torneo, setTorneo] = useState('');
    const [ jornadaId, setJornadaId] = useState('');
    const [ torneoId, setTorneoId] = useState('');

    const [ fmenu, setFmenu] = useState('');
    const [ smenu, setSmenu] = useState('');
    const [ menu, setMenu] = useState('');
    const [ isMobile, setIsMobile] = useState(false);

    const logOut = async() => {
        await firebase.auth().signOut();
        localStorage.setItem('logged',false);
        window.location = "/auth/login";
    }

    const showMenu = (item) => {

        if(item == "Menu"){
            if(menu == "show"){
                setMenu("hide");
            }else{
                setMenu("show");
            }
        }
        
        if(item == "fMenu"){
            if(fmenu == "show"){
                setFmenu("hide");
            }else{
                setFmenu("show");
            }
        }
        
        if(item == "sMenu"){
            if(smenu == "show"){
                setSmenu("hide");
            }else{
                setSmenu("show");
            }
        }

        return false;
    }

    useEffect( async () => { 

        const roorRef = firebase.database().ref();
        const torneo = roorRef.child("Torneo").orderByKey().limitToLast(1);
        
        await torneo.on('value', (snap) => {

            if(snap.exists()){

                let item = snap.val();
                Object.keys(item).map( row => {
                    setLastTorneo(row);
                    setTorneo(item[row]);
                    if(item[row].Jornadas){
                        setLastJornada(item[row].Jornadas);
                    }
                });
            }
        })

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

    const setLastTorneo = (key) => {
        setTorneoId(key);
        localStorage.setItem("torneo",key);
    }

    const setLastJornada = (items) => {
        Object.keys(items).map( key => {
            setJornadaId(key);
            localStorage.setItem("jornada",key);
        });
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
                                    <li class="nav-link dropdown-toggle"><a>{torneo.Descripcion}</a>
                                    <ul>
                                            <li class="nav-link dropdown-toggle"><a href={"/torneos/"+torneoId+"/equipos"}>Equipos</a></li>
                                            <li class="nav-link dropdown-toggle"><a href={"/torneos/"+torneoId+"/jornadas"}><span>Jornada</span></a>
                                            { jornadaId &&
                                                <ul>
                                                    <li class="nav-link dropdown-toggle"><a href={"/torneos/"+torneoId+"/jornadas/"+jornadaId+"/partidos"}>Partidos</a></li>
                                                </ul>
                                            }
                                            </li>
                                            <li class="nav-link dropdown-toggle"><a href={"/torneos/"+torneoId+"/tabla-general"}>Tabla General</a></li>
                                        </ul></li>
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
                                <a class="nav-link dropdown-toggle" onClick={(e) => showMenu("Menu")}>
                                    Torneos
                                </a>
                                <div class={"dropdown-menu "+menu}  aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="#">Crear Torneo</a>
                                    <a onClick={(e) => showMenu("fMenu")} class="nav-link dropdown-toggle">{torneo.Descripcion}</a>
                                    <div class={"dropdown-menu "+fmenu} aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href={"/torneos/"+torneoId+"/equipos"}>Equipos</a>
                                        <a onClick={(e) => showMenu("sMenu")} class="nav-link dropdown-toggle">Jornadas</a>
                                        <div class={"dropdown-menu "+smenu} aria-labelledby="navbarDropdown">
                                            <a class="dropdown-item" href={"/torneos/"+torneoId+"/jornadas"}>Crear Jornada</a>
                                            <a class="dropdown-item" href={"/torneos/"+torneoId+"/jornadas/"+jornadaId+"/partidos"}>Partidos</a>
                                        </div>
                                        <a class="dropdown-item" href={"/torneos/"+torneoId+"/tabla-general"}>Tabla General</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a onClick={logOut} class="nav-link d-flex">
                                    <i class="far fa-user mr-2 tm-logout-icon"></i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>}
                </nav>
            </div>
        </div>
    );
}