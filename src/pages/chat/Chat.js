import React, { useEffect, useContext } from 'react';
import Header from "../../components/header/Header";
import Avatar from '@material-ui/core/Avatar';
import Group from "../../components/img/group.png";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ModalCriarConversa from "./ModalCriarConversa";
import Profile from "../../components/img/profile.png";
import ModalChat from "./ModalChat";
import Portas from '../../portas';
import StoreContext from "../../components/Store/Context";
import "./chat.css";

const ColorButton = withStyles((theme) => ({
    root: {
        color: "white",
        backgroundColor: "green",
        marginRight: "5px",
        '&:hover': {
            backgroundColor: "gray",
        }
    },
}))(Button);


export default function MiniDrawer() {

    const { token } = useContext(StoreContext);
    const [openCreateGp, setOpenCreateGp] = React.useState(false);
    const [openCreateCp, setOpenCreateCp] = React.useState(false);
    const [grupos, setGrupos] = React.useState([])
    const [privados, setPrivados] = React.useState([])
    const [openChatGrupo, setOpenChatGrupo] = React.useState(false);
    const [openChatPrivado, setOpenChatPrivado] = React.useState(false);
    const [selectedGrupo, setSelectedGrupo] = React.useState(1);
    const [selectedPrivado, setSelectedPrivado] = React.useState(1);

    const getGrupos = async () => {
        if (token !== null) {
            try {
                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/getGrupos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                setGrupos(resJSON)

            } catch (err) {
                console.log(err.message);
            }
        }
    }

    const getPrivados = async () => {
        if (token !== null) {
            try {
                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/getChatPrivado", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                setPrivados(resJSON)

            } catch (err) {
                console.log(err.message);
            }
        }
    }

    function getParticipantesGp(grupo) {
        var participantes = 'Eu'
        for (var i = 0; i < grupo.participantes.length; i++) {
            participantes += ', ' + grupo.participantes[i].nome
        }
        return participantes
    }

    function handleGrupoClick(grupo_id) {
        setSelectedGrupo(grupo_id)
        setOpenChatGrupo(!openChatGrupo)
    }

    function handlePrivadoClick(privado_id) {
        setSelectedPrivado(privado_id)
        setOpenChatPrivado(!openChatPrivado)
    }

    function updateOpenCreateGp(state){
        setOpenCreateGp(state)
        if(state === false){
            getGrupos();
        }
    }

    function updateOpenCreateCp(state){
        setOpenCreateCp(state)
        if(state === false){
            getPrivados();
        }
    }

    function updateOpenChatGp(state){
        setOpenChatGrupo(state)
        if(state === false){
            getGrupos();
        }
    }

    function updateOpenChatCp(state){
        setOpenChatPrivado(state)
        if(state === false){
            getPrivados();
        }
    }

    useEffect(() => {
        getGrupos();
        getPrivados();
    }, []);

    return (
        <div className="root">
            {openCreateGp ? (
                <ModalCriarConversa
                    open={openCreateGp}
                    setOpen={() => updateOpenCreateGp(!openCreateGp)}
                    type={'grupo'}
                ></ModalCriarConversa>
            ) : (
                <></>
            )}
            {openCreateCp ? (
                <ModalCriarConversa
                    open={openCreateCp}
                    setOpen={() => updateOpenCreateCp(!openCreateCp)}
                    type={'privado'}
                ></ModalCriarConversa>
            ) : (
                <></>
            )}
            {openChatGrupo ? (
                <ModalChat
                    open={openChatGrupo}
                    setOpen={() => updateOpenChatGp(!openChatGrupo)}
                    type={'grupo'}
                    id={selectedGrupo}
                ></ModalChat>
            ) : (
                <></>
            )}
            {openChatPrivado ? (
                <ModalChat
                    open={openChatPrivado}
                    setOpen={() => updateOpenChatCp(!openChatPrivado)}
                    type={'privado'}
                    id={selectedPrivado}
                    privado={privados}
                ></ModalChat>
            ) : (
                <></>
            )}
            <Header />
            <div className="contentHome" >
                <div className="publicationsHome" style={{ marginTop: "30px", backgroundColor: "white" }}>
                    <div className='buttonsEndPublication' style={{ paddingBottom: "25px" }}>
                        <ColorButton variant="contained" color="primary" endIcon={<AddIcon></AddIcon>} onClick={() => setOpenCreateGp(true)}>
                            Criar grupo
                        </ColorButton>
                        <ColorButton variant="contained" color="primary" endIcon={<AddIcon></AddIcon>} onClick={() => setOpenCreateCp(true)}>
                            Iniciar conversa privada
                        </ColorButton>
                    </div>
                    {grupos.length > 0
                        ?
                        <div style={{ backgroundColor: "white" }}>
                            <div className="tituloSolicitacoes" style={{ width: "100%", paddingTop: "10px" }}>{"Grupos (" + grupos.length + ")"}</div>
                            {grupos.map((grupo, index) =>
                                <div className="chatList" onClick={() => handleGrupoClick(grupo.id)}>
                                    <div className="chatItem">
                                        <div className="chatIcon">
                                            <Avatar alt="Imagem de perfil" src={Group} />
                                        </div>
                                    </div>
                                    <div style={{ margin: '5px' }} >
                                        <div className='chatGroupTitle'>
                                            {grupo.titulo}
                                        </div>
                                        <div className='chatGroupParticipantes'>
                                            {getParticipantesGp(grupo)}
                                        </div>
                                        <div className='chatLastMsg'>
                                            {grupo.last_msg_autor + ": "}
                                            {grupo.last_msg}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <></>
                    }
                    {privados.length > 0
                        ?
                        <div style={{ backgroundColor: "white" }}>
                            <div className="tituloSolicitacoes" style={{ width: "100%", paddingTop: "10px" }}>{"Conversas privadas (" + privados.length + ")"}</div>
                            {privados.map((privado, index) =>
                                <div className="chatList" onClick={() => handlePrivadoClick(privado.id)}>
                                    <div className="chatItem">
                                        <div className="chatIcon">
                                            {privado.foto.length > 0 ?
                                                <Avatar alt="Imagem de perfil" src={privado.foto[0].img_json.img} />
                                                :
                                                <Avatar alt="Imagem de perfil" src={Profile} />
                                            }
                                        </div>
                                    </div>
                                    <div style={{ margin: '5px' }} >
                                        <div className='chatGroupTitle'>
                                            {privado.participante[0].nome}
                                        </div>
                                        <div className='chatLastMsg'>
                                            {privado.last_msg_autor + ": "}
                                            {privado.last_msg}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <></>
                    }
                </div>
            </div>
        </div >
    );
}