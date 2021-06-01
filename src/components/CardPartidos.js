import React from 'react';

export default (props) => {
    return (
        <div class="col-xl-3 col-lg-12 mt-4">
            <button onClick={props.action}>{ props.item.Estado }</button>
            <div key={props.index} class="bg-white partidos tm-block text-center">
                
                { props.item.Estado == 1 &&
                    <div class="alert alert-info">
                        PARTIDO INICIADO
                    </div>
                }
                { props.item.Estado == 2 &&
                    <div class="alert alert-danger">
                        PARTIDO FINALIZADO
                    </div>
                }
                { props.item.Estado > 0 &&
                <div>
                    <h5>MARCADOR</h5>
                    <span class="marcador">
                        { props.item.Goles_Local }
                    </span>-
                    <span class="marcador">
                        { props.item.Goles_Visitante }
                    </span>
                </div>
                }
                <ul>
                    <li>
                        { props.item.Nombre+" " } 
                    </li>        
                    <li>
                        <img src={props.equipos[props.item.Local].Imagen} width="30px"/>
                        { "      "}<b>VS</b>{ "      "} 
                        <img src={props.equipos[props.item.Visitante].Imagen} width="30px"/>
                    </li>
                    <li>
                        { props.equipos[props.item.Local].Nombre +"    -    "}  
                        { props.equipos[props.item.Visitante].Nombre } 
                    </li>
                    <li><b>Estadio:</b></li>        
                    <li>{ props.item.Estadio+" " } </li>    
                    <li></li>    
                    <li>
                        <b>Fecha:</b>{ " "+props.item.Fecha+" " } 
                        <b>Hora:</b>{ " "+props.item.Hora } 
                    </li>
                </ul>
                <hr/>
                    { props.item.Estado == 0 && props.actions == true &&
                        <button onClick={(e) => props.changeEstado(1,props.index)} class="btn btn-sm btn-primary">INICIAR</button>
                    }
                    { props.item.Estado == 1 && props.actions == true &&
                        <button onClick={(e) => props.changeEstado(2,props.index)} class="btn btn-sm btn-primary">TERMINAR</button>
                    }
                    { props.actions == true &&
                        <a href={"/torneos/"+props.torneoId+"/jornadas/"+props.jornadaId+"/partidos/"+props.index} class="btn btn-sm btn-primary">EDITAR</a>
                    }

                    <a href={"/torneos/"+props.torneoId+"/jornadas/"+props.jornadaId+"/partidos/"+props.index+"/show"} class="btn btn-sm btn-primary">VER</a>

                    { props.actions == true &&
                        <a onClick={(e) => props.deletePartido(props.index)} class="btn btn-primary">ELIMINAR</a>
                    }
                <hr/>
            </div>
        </div>
    )
}
