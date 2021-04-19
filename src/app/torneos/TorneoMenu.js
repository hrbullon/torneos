import { useParams } from "react-router-dom";

export default () => {

    const torneoId = useParams().torneoId;

    return (
        <div class="row tm-content-row tm-mt-big">
            <div class="tm-col tm-col-big">
                <div class="bg-white tm-block">
                    <div class="row">
                        <div class="col-12">
                            <ul>
                                <li><a href={"/torneos/"+torneoId+"/equipos"}>Equipos</a></li>    
                                <li><a href={"/torneos/"+torneoId+"/jornadas"}>Jornadas</a></li>    
                                <li><a>Tabla General</a></li>    
                            </ul>
                        </div>
                    </div>
                </div>
            </div>             
        </div>
    )
}
