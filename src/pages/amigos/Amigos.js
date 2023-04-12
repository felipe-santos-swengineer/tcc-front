import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../../components/Store/Context";
import Header from "../../components/header/Header";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import Portas from "../../portas";

import "./amigos.css";


export default function Home() {

    const { token } = useContext(StoreContext);
    const [amigos, setAmigos] = useState([]);
    const [naoAmigos, setNaoAmigos] = useState([]);
    const [selecao, setSelecao] = useState("amigos");

    const getAmigos = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/amigos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                
                var amigos = [];
                
                for(var i = 0; i < resJSON.length; i++){
                    amigos.push(resJSON[i])
                    amigos[i].adicionado = false;
                }
                setAmigos(amigos)
                

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getNaoAmigos = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/naoAmigos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                var namigos = [];
                
                for(var i = 0; i < resJSON.length; i++){
                    namigos.push(resJSON[i])
                    namigos[i].adicionado = false;
                }
                setNaoAmigos(namigos)
                

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const adicionarAmigo = async (id) => {
        if (token !== null) {
            try {
                const body = { usertoken: token, to_id: id  };
                const response = await fetch(Portas().serverHost + "/adicionarAmigos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                getNaoAmigos()

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    useEffect(() => {
        getAmigos();
        getNaoAmigos();
    }, []);

    return (
        <div className="root">
            <Header />
            <div className="contentHome">
                <div className="publicationsHome">
                    <div className="searchDivAmigos">
                        <InputBase
                            className="searchInputAmigos"
                            placeholder="Buscar usuários"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <div className="painelUsuarios">
                        <div className="selecaoPainelUsuarios">
                            {selecao === "amigos"
                            ?
                            <button className="selectedBtnAmigos" onClick={() => setSelecao("amigos")}>Amigos</button>
                            :
                            <button className="unSelectedBtnAmigos" onClick={() => setSelecao("amigos")}>Amigos</button>
                            }
                            {selecao === "outros"
                            ?
                            <button className="selectedBtnAmigos" onClick={() => setSelecao("outros")}>Conhecer</button>
                            :
                            <button className="unSelectedBtnAmigos" onClick={() => setSelecao("outros")}>Conhecer</button>
                            }
                            {selecao === "solicitacoes"
                            ?
                            <button className="selectedBtnAmigos" onClick={() => setSelecao("solicitacoes")}>Solicitações</button>
                            :
                            <button className="unSelectedBtnAmigos" onClick={() => setSelecao("solicitacoes")}>Solicitações</button>
                            }
                        </div>
                        {amigos.length > 0 && selecao === "amigos"
                            ?
                            <div className="painelAmigos">
                                {amigos.map((pessoa) =>
                                    <div className="divPessoaPainelAmigos">
                                        <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                        <div className="divOpcoesPainelAmigos">
                                            <Tooltip title="Adicionar">
                                                <IconButton type="submit" aria-label="search" onClick={() => adicionarAmigo(pessoa.id)}>
                                                    <AddIcon />
                                                </IconButton> 
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            : <></>
                        }
                        {naoAmigos.length > 0 && selecao === "outros"
                            ?
                            <div className="painelAmigos">
                                {naoAmigos.map((pessoa) =>
                                    <div className="divPessoaPainelAmigos">
                                        <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                        <div className="divOpcoesPainelAmigos">
                                            <Tooltip title="Adicionar">
                                                <IconButton type="submit" aria-label="search" onClick={() => adicionarAmigo(pessoa.id)}>
                                                    <AddIcon />
                                                </IconButton> 
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}