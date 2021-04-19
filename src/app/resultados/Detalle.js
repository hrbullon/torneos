import React, { Component } from 'react';

//props.status => 
//0 -> Activo - 1er tiempo no iniciado, 
//1 -> Activo - 1er tiempo iniciado,
//2 -> Activo - 1er tiempo finalizado
//3 -> Activo - 2do tiempo iniciado
//4 -> Inactivo -> Final del partido
export default (props) => {
    
    console.log(props.partido);

    return (
        <div class="tm-col tm-col-big">
            <div class="bg-white tm-block h-100 text-center">
                <h3>{props.partido.Nombre}</h3>    
                <h3> {props.local} VS {props.visitante}</h3>
                <h4>MIN: </h4>
                <h1>0:0</h1>

                <button type="button" class="btn btn-primary">INICIAR PARTIDO</button><br/>
                <button type="button" class="btn btn-primary">FINAL PRIMER TIEMPO</button><br/>
                <button type="button" class="btn btn-primary">INICIO SEGUNDO TIEMPO</button><br/>
                <button type="button" class="btn btn-primary">FINALIZAR PARTIDO</button><br/>

                <h1>MARCADOR</h1>
                
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <td><h1>{props.partido.Punto_Local}</h1></td>
                            <td><h1>{props.partido.Punto_Visitante}</h1></td>
                        </tr>
                        <tr>
                            <td><h1>{props.local}</h1></td>
                            <td><h1>{props.visitante}</h1></td>
                        </tr>
                    </tbody>
                </table>
                

            </div>
        </div>
    )
}
