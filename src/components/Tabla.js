import React from 'react';

export default (props) => {
    let posicion = 1;
    let posiciones = [];

    const getItemTotal = (type,key) => {
        let total = 0;
        Object.keys(props.partidos).map( (index, value) => {
            switch (type) {
                case "Ganador":
                        if(props.partidos[index].Ganador == key){
                            total++;
                        }
                    break;
                case "Perdedor":
                        if(props.partidos[index].Perdedor == key){
                            total++;
                        }
                case "Goles_Favor":
                        if(props.partidos[index].Local == key){
                            total += props.partidos[index].Goles_Local;
                        }
                        if(props.partidos[index].Visitante == key){
                            total += props.partidos[index].Goles_Visitante;
                        }
                    break;
                case "Goles_Contra":
                        if(props.partidos[index].Local == key){
                            total += props.partidos[index].Goles_Visitante;
                        }
                        if(props.partidos[index].Visitante == key){
                            total += props.partidos[index].Goles_Local;
                        }
                    break;
                case "Puntos":
                        if(props.partidos[index].Local == key){
                            total += props.partidos[index].Punto_Local;
                        }
                        if(props.partidos[index].Visitante == key){
                            total += props.partidos[index].Punto_Visitante;
                        }
                    break;
            }
        });

        return total;
    }

    const ordenarItems = () => {
        posiciones.sort( (a,b) => b.Puntos - a.Puntos  );
    }

    return (
        <div class="table-responsive">
            <table class="table table-hover table-striped tm-table-striped-even mt-3">
                <thead>
                    <tr class="tm-bg-gray">
                        <th scope="col">Posición</th>
                        <th scope="col">Equipo</th>
                        <th scope="col" class="text-center">P/Ganados</th>
                        <th scope="col" class="text-center">G/ Favor</th>
                        <th scope="col" class="text-center">P/Perdidos</th>
                        <th scope="col" class="text-center">G/Contra</th>
                        <th scope="col">Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        Object.keys(props.equipos).map( (index, value) => {
                            
                            posiciones.push({
                                Nombre:props.equipos[index].Nombre,
                                Ganador: getItemTotal("Ganador",index),
                                Goles_Favor: getItemTotal("Goles_Favor",index),
                                Perdedor: getItemTotal("Perdedor",index),
                                Goles_Contra: getItemTotal("Goles_Contra",index),
                                Puntos: getItemTotal("Puntos",index)
                            });

                            ordenarItems();

                        })

                    }
                    {
                        Object.keys(posiciones).map( (index, value) => {
                            
                            return (    
                                <tr key={index}>
                                    <td>{ (posicion++)}</td>
                                    <td>{ posiciones[index].Nombre }</td>
                                    <td>{ posiciones[index].Ganador }</td>
                                    <td>{ posiciones[index].Goles_Favor }</td>
                                    <td>{ posiciones[index].Perdedor }</td>
                                    <td>{ posiciones[index].Goles_Contra }</td>
                                    <td>{ posiciones[index].Puntos }</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>    
    )       
}   


