import React, { useContext, useEffect, useState } from "react";
import StoreContext from "../../components/Store/Context";
import Header from "../../components/header/Header";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Portas from "../../portas";
import Profile from "../../components/img/profile.png";
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatIcon from '@material-ui/icons/Chat';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import "./amigos.css";


export default function Home() {

    const { token } = useContext(StoreContext);
    const [amigos, setAmigos] = useState([]);
    const [naoAmigos, setNaoAmigos] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [value, setValue] = React.useState(0);
    const [search, setSearch] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                setAmigos(resJSON)

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
                setNaoAmigos(resJSON)


            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getSolicitacoes = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/getSolicitacoes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();

                if (resJSON.length > 0) {
                    setSolicitacoes(resJSON)
                }

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const adicionarAmigo = async (id) => {
        if (token !== null) {
            try {
                const body = { usertoken: token, to_id: id };
                const response = await fetch(Portas().serverHost + "/adicionarAmigos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                getAmigos()
                getNaoAmigos()
                getSolicitacoes()

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const removerAmigo = async (id) => {
        if (token !== null) {
            try {
                const body = { usertoken: token, to_id: id };
                const response = await fetch(Portas().serverHost + "/removerAmigos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                getAmigos()
                getNaoAmigos()
                getSolicitacoes()

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    useEffect(() => {
        getAmigos();
        getNaoAmigos();
        getSolicitacoes()
    }, []);

    return (
        <div className="root">
            <Header />
            <div className="contentHome" >
                <div className="publicationsHome" style={{ backgroundColor: "white" }}>
                    <div className="searchDivAmigos">
                        <InputBase
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="searchInputAmigos"
                            placeholder="Buscar usuários"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <Paper className="contentPerfil">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Conhecer" />
                            <Tab label="Amigos" />
                            <Tab label="Solicitações" />
                        </Tabs>
                    </Paper>
                    {value === 0
                        ?
                        <div>
                            {naoAmigos.length > 0
                                ?
                                <div className="painelAmigos">
                                    {naoAmigos.map((pessoa) =>
                                        <div>
                                            {pessoa.nome.toLowerCase().indexOf(search.toLowerCase()) > -1 ?
                                                <div className="divPessoaPainelAmigos">
                                                    {pessoa.foto === ''
                                                        ?
                                                        <Avatar alt="Imagem de perfil" src={Profile} />
                                                        :
                                                        <Avatar alt="Imagem de perfil" src={pessoa.foto} />
                                                    }
                                                    <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                                    <div className="divOpcoesPainelAmigos">
                                                        <Tooltip title="Ver perfil">
                                                            <IconButton style={{ color: "blue" }} type="submit" aria-label="search" onClick={() => (window.location = '/perfil/' + pessoa.id)}>
                                                                <AccountBoxIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Adicionar">
                                                            <IconButton style={{ color: "#008240" }} type="submit" aria-label="search" onClick={() => adicionarAmigo(pessoa.id)}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                :
                                                <></>
                                            }
                                        </div>
                                    )}
                                </div>
                                : <></>
                            }
                        </div>
                        :
                        <div></div>
                    }
                    {value === 1
                        ?
                        <div>
                            {amigos.length > 0
                                ?
                                <div className="painelAmigos">
                                    {amigos.map((pessoa) =>
                                        <div>
                                            {pessoa.nome.toLowerCase().indexOf(search.toLowerCase()) > -1 ?
                                                <div className="divPessoaPainelAmigos">
                                                    {pessoa.foto === ''
                                                        ?
                                                        <Avatar alt="Imagem de perfil" src={Profile} />
                                                        :
                                                        <Avatar alt="Imagem de perfil" src={pessoa.foto} />
                                                    }
                                                    <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                                    <div className="divOpcoesPainelAmigos">
                                                        <Tooltip title="Ver perfil">
                                                            <IconButton style={{ color: "blue" }} type="submit" aria-label="search" onClick={() => (window.location = '/perfil/' + pessoa.id)}>
                                                                <AccountBoxIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Conversar">
                                                            <IconButton type="submit" aria-label="search">
                                                                <ChatIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Remover" >
                                                            <IconButton style={{ color: "red" }} type="submit" aria-label="search" onClick={() => removerAmigo(pessoa.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                : <></>}
                                        </div>
                                    )}
                                </div>
                                : <></>
                            }</div>
                        :
                        <div></div>
                    }
                    {value === 2
                        ?
                        <div>
                            {solicitacoes.length > 0
                                ?
                                <div className="painelAmigos">
                                    <div className="tituloSolicitacoes">{"Solicitaçoes Recebidas (" + solicitacoes[0].recebidas.length + ")"}</div>
                                    {solicitacoes[0].recebidas.map((pessoa) =>
                                        <div>
                                            <div className="divPessoaPainelAmigos">
                                                {pessoa.foto === ''
                                                    ?
                                                    <Avatar alt="Imagem de perfil" src={Profile} />
                                                    :
                                                    <Avatar alt="Imagem de perfil" src={pessoa.foto} />
                                                }
                                                <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                                <div className="divOpcoesPainelAmigos">
                                                    <Tooltip title="Ver perfil">
                                                        <IconButton style={{ color: "blue" }} type="submit" aria-label="search" onClick={() => (window.location = '/perfil/' + pessoa.id)}>
                                                            <AccountBoxIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Aceitar solicitação">
                                                        <IconButton style={{ color: "#008240" }} type="submit" aria-label="search" onClick={() => adicionarAmigo(pessoa.id)}>
                                                            <DoneIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Recusar solicitação">
                                                        <IconButton style={{ color: "red" }} type="submit" aria-label="search" onClick={() => removerAmigo(pessoa.id)}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="tituloSolicitacoes">{"Solicitaçoes enviadas(" + solicitacoes[0].enviadas.length + ")"}</div>
                                    {solicitacoes[0].enviadas.map((pessoa) =>
                                        <div>
                                            <div className="divPessoaPainelAmigos">
                                                {pessoa.foto === ''
                                                    ?
                                                    <Avatar alt="Imagem de perfil" src={Profile} />
                                                    :
                                                    <Avatar alt="Imagem de perfil" src={pessoa.foto} />
                                                }
                                                <div className="nomePessoaPainelAmigos">{pessoa.nome}</div>
                                                <div className="divOpcoesPainelAmigos">
                                                    <Tooltip title="Ver perfil">
                                                        <IconButton style={{ color: "blue" }} type="submit" aria-label="search" onClick={() => (window.location = '/perfil/' + pessoa.id)}>
                                                            <AccountBoxIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancelar solicitação">
                                                        <IconButton style={{ color: "red" }} type="submit" aria-label="search" onClick={() => removerAmigo(pessoa.id)}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                : <></>
                            }</div>
                        :
                        <div></div>
                    }
                </div>
            </div>
        </div>
    );
}