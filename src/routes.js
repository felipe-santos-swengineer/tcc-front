import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

//public pages import
import Login from "./pages/login/Login";
import Cadastro from './pages/cadastro/Cadastro';
import VerificarEmail from './pages/verificarEmail/verificarEmail';

//private pages import
import Home from "./pages/home/Home";
import Amigos from './pages/amigos/Amigos';
import Create_Publication from "./components/create_publication/publication";
import Perfil from "./pages/perfil/meuPerfil/Perfil";
import PerfilView from "./pages/perfil/perfilView/PerfilView";

//auth
import StoreProvider from './components/Store/Provider';
import PrivateRoute from "./components/Routes/Private/private";

export default function Routes() {
    return (
        <BrowserRouter>
            <StoreProvider>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/cadastro" component={Cadastro} />
                    <Route path="/verificarEmail" component={VerificarEmail} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute path="/amigos" component={Amigos} />
                    <PrivateRoute path="/criarPublicacao" component={Create_Publication} />  
                    <PrivateRoute path="/meuPerfil" component={Perfil} />
                    <PrivateRoute path="/perfil" component={PerfilView} />    
                </Switch>
            </StoreProvider>
        </BrowserRouter>
    )
}