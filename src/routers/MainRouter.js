import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Home from "../app/home/Home";
import Torneos from "../app/torneos/Torneos";
import TorneoMenu from "../app/torneos/TorneoMenu";
import Equipos from "../app/equipos/Equipos";
import Header from "../components/Header";
import Jornadas from "../app/jornadas/Jornadas";
import Partidos from "../app/partidos/Partidos";
import TablaGeneral from "../app/resultados/TablaGeneral";
import PartidosForm from "../app/partidos/PartidosForm";
import Partido from "../app/partidos/Partido";
  
export const MainRouter = () => {
    return (
      
      <Router>
          <Header/>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/torneos" component={Torneos} />
            <Route exact path="/torneos/:torneoId" component={TorneoMenu} />
            <Route exact path="/torneos/:torneoId/equipos" component={Equipos} />
            <Route exact path="/torneos/:torneoId/jornadas" component={Jornadas} />
            <Route exact path="/torneos/:torneoId/tabla-general" component={TablaGeneral} />
            <Route exact path="/torneos/:torneoId/jornadas/:jornadaId/partidos" component={Partidos} />
            <Route exact path="/torneos/:torneoId/jornadas/:jornadaId/partidos/create" component={PartidosForm} />
            <Route exact path="/torneos/:torneoId/jornadas/:jornadaId/partidos/:partidoId" component={PartidosForm} />
            <Route exact path="/torneos/:torneoId/jornadas/:jornadaId/partidos/:partidoId/show" component={Partido} />
            <Redirect to="/home"/>
          </Switch>
      </Router>
    );
}  
