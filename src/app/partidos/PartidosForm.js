import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import Option from '../../components/Option';

export default () =>  {

    document.body.style = 'background-image: url("/images/dash-bg-03.jpg");';
    
    const torneoId = useParams().torneoId;
    const jornadaId = useParams().jornadaId;
    const partidoId = useParams().partidoId;

    const firebase = useFirebaseApp();

    var [equipoObjects, setEquipoObjects] = useState({});
    
    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState('');

    const [ Jornada, setJornada] = useState('');
    const [ Nombre, setNombre] = useState('');
    const [ Local, setLocal] = useState();
    const [ Visitante, setVisitante] = useState();
    const [ Punto_Local, setPunto_Local] = useState(0);
    const [ Goles_Local, setGolesLocal] = useState(0);
    const [ Punto_Visitante, setPunto_Visitante] = useState(0);
    const [ Goles_Visitante, setGolesVisitante] = useState(0);
    const [ Ganador, setGanador] = useState(0);
    const [ Perdedor, setPerdedor] = useState(0);
    const [ Estadio, setEstadio] = useState('');
    const [ Fecha, setFecha] = useState('');
    const [ Hora, setHora] = useState('');
    const [ Estado, setEstado] = useState('');
    
    const path = "Torneo/"+torneoId+"/Partidos";
    
    useEffect( () => {
        
        firebase.database().ref().child("Torneo/"+torneoId+"/Equipos").on('value', snap => {
            if(snap.exists()){
                setItems(snap.val());
            }
        });

    }, []);

    useEffect( () => {

        if(partidoId){
            loadData();
        }

    }, []);


    const savePartido = async () => {
        
        var validated = true;
        const items = document.forms[0].elements;

        for (let x = 0; x < 10; x++) {
            if(items[x].value == ""){
                validated = false;
            }   
        }

        if(validated){
            if(Local == Visitante){
                setError("El equipo local y visitante no pueden ser los mismos");
            }else{
                if(!partidoId){
                    await firebase.database().ref(path).push({
                        Jornada:jornadaId,
                        Nombre,Local,Visitante,Estadio,Fecha,Hora,
                        Punto_Local:0,Punto_Visitante:0,Estado:0,
                        Goles_Local:0,Goles_Visitante:0,
                        Ganador:0,Perdedor:0
                    }).then( () => {
                        partidoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                }else{
                    await firebase.database().ref(path+"/"+partidoId).set({
                        Jornada,
                        Nombre,Local,Visitante,Estadio,Fecha,Hora,
                        Punto_Local: parseInt(Punto_Local),
                        Punto_Visitante: parseInt(Punto_Visitante),
                        Estado,
                        Goles_Local: parseInt(Goles_Local),
                        Goles_Visitante: parseInt(Goles_Visitante),
                        Ganador,Perdedor
                    }).then( () => {
                        partidoSaved();
                    }).catch(e => {
                        setError(e.message);
                    });
                }
            }    
        }else{
            setError("Por favor rellene todos los campos");
        }

    }

    const partidoSaved = () => {
        
        setMessage("Partido guardado!");
        
        if(!partidoId){
            setError("");
            setNombre("");
            setLocal("");
            setPunto_Local("");
            setVisitante("");
            setPunto_Visitante("");
            setEstadio("");
            setFecha("");
            setHora("");
        }

        setTimeout(() => {
            setMessage("");
        }, 3000);
    }



    const loadData = async () => {
        
        await firebase.database().ref(path+"/"+partidoId)
        .get().then((snap) => {
            if(snap.exists()){
                setJornada(snap.val().Jornada);
                setNombre(snap.val().Nombre);
                setEstadio(snap.val().Estadio);
                setEstado(snap.val().Estado);
                setLocal(snap.val().Local);
                setPunto_Local(parseInt(snap.val().Punto_Local));
                setGolesLocal(parseInt(snap.val().Goles_Local));
                setVisitante(snap.val().Visitante);
                setPunto_Visitante(parseInt(snap.val().Punto_Visitante));
                setGolesVisitante(parseInt(snap.val().Goles_Visitante));
                setFecha(snap.val().Fecha);
                setHora(snap.val().Hora);
            }else{
                alert("Error al obtener los datos");
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const setItems = (items) => {
        setEquipoObjects(items);
    }

    return (
        <form id="partidosForm">
            <div class="row">
                <div class="col-xl-12 col-lg-12">
                    <div class="bg-white mt-4 mb-4 p-2">
                        <div class="row">
                            <div class="col-xl-3">
                                <h2 class="tm-block-title pt-4 pl-4 pb-0">CREAR PARTIDO</h2>
                            </div>
                            <div class="col-xl-6">
                            { message !== "" &&
                                    <div class="alert alert-success pt-3 mt-3 text-center">
                                        { message }
                                    </div>
                                }
                                {  
                                    error !=="" &&
                                    <div class="alert alert-danger pt-3 mt-3 text-center">
                                        { error }
                                    </div>
                                }
                            </div>
                            <div class="col-xl-3 pt-3">
                                <a onClick={savePartido} class="btn btn-primary">GUARDAR</a>
                                <a href={"/torneos/"+torneoId+"/jornadas/"+jornadaId+"/partidos"} class="btn btn-primary">IR AL LISTADO</a>
                            </div>       
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-12 mb-4">
                    <div class="bg-white tm-block h-100">
                        <h2 class="tm-block-title">PARTIDO</h2>
                        <div class="form-group">
                            <label>PARTIDO</label>
                            <input placeholder="Ejem; Nombre" name="Nombre" value={ Nombre } onChange={ (ev) => setNombre(ev.target.value) }  type="text" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label>ESTADIO</label>
                            <input placeholder="Ejem; Nombre" name="Estadio" value={ Estadio } onChange={ (ev) => setEstadio(ev.target.value) } type="text" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label>FECHA</label>
                            <input placeholder="Ejem; Fecha" name="Fecha" value={ Fecha } onChange={ (ev) => setFecha(ev.target.value) } type="date" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label>HORA</label>
                            <input placeholder="Ejem; Fecha" name="Hora" value={ Hora } onChange={ (ev) => setHora(ev.target.value) } type="time" class="form-control"/>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-12 mb-4">
                    <div class="bg-white tm-block h-100">
                        <h2 class="tm-block-title d-inline-block">EQUIPO LOCAL</h2>
                        <div class="form-group">
                            <label>PUNTOS OBTENIDOS</label>
                            <input placeholder="Ejem; 1" name="Puntos_Local" value={ Punto_Local } onChange={ (ev) => setPunto_Local(ev.target.value) } type="text" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label>LOCAL</label>
                            <select name="Local" onChange={ (ev) => setLocal(ev.target.value) } class="select">
                                <option value="">Seleccione un equipo</option>
                                <Option items={equipoObjects} selected={Local}/>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GOLES</label>
                            <input placeholder="Ejem; 1" name="Goles_Local" value={ Goles_Local } onChange={ (ev) => setGolesLocal(ev.target.value) } type="text" class="form-control"/>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-12 mb-4">
                    <div class="bg-white tm-block h-100">
                        <h2 class="tm-block-title d-inline-block">EQUIPO VISITANTE</h2>
                        <div class="form-group">
                            <label>PUNTOS OBTENIDOS</label>
                            <input placeholder="Ejem; 1" name="Puntos_Visitante" value={ Punto_Visitante } onChange={ (ev) => setPunto_Visitante(ev.target.value) } type="text" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label>VISITANTE</label>
                            <select name="Visitante" onChange={ (ev) => setVisitante(ev.target.value) } class="select">
                                <option value="">Seleccione un equipo</option>
                                <Option items={equipoObjects} selected={Visitante}/>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>GOLES</label>
                            <input placeholder="Ejem; 1" name="Goles_Visitante" value={ Goles_Visitante } onChange={ (ev) => setGolesVisitante(ev.target.value) } type="text" class="form-control"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}