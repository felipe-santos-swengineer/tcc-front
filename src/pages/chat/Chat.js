import React, { useEffect, useContext } from 'react';
import Header from "../../components/header/Header";
import Avatar from '@material-ui/core/Avatar';
import Group from "../../components/img/group.png";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ModalCriarConversa from "./ModalCriarConversa";
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

    function getParticipantesGp(grupo) {
        var participantes = 'Eu'
        for (var i = 0; i < grupo.participantes.length; i++) {
            participantes += ', ' + grupo.participantes[i].nome
        }
        return participantes
    }



    useEffect(() => {
        getGrupos();
    }, []);

    return (
        <div className="root">
            {openCreateGp ? (
                <ModalCriarConversa
                    open={openCreateGp}
                    setOpen={() => setOpenCreateGp(!openCreateGp)}
                    type={'grupo'}
                ></ModalCriarConversa>
            ) : (
                <></>
            )}
            {openCreateCp ? (
                <ModalCriarConversa
                    open={openCreateCp}
                    setOpen={() => setOpenCreateCp(!openCreateCp)}
                    type={'privado'}
                ></ModalCriarConversa>
            ) : (
                <></>
            )}
            {openChatGrupo ? (
                <ModalChat
                    open={openChatGrupo}
                    setOpen={() => setOpenChatGrupo(!openChatGrupo)}
                    type={'grupo'}
                    grupo={selectedGrupo}
                    privado={selectedPrivado}
                ></ModalChat>
            ) : (
                <></>
            )}
            {openChatPrivado ? (
                <ModalChat
                    open={openChatPrivado}
                    setOpen={() => setOpenChatPrivado(!openChatPrivado)}
                    type={'privado'}
                    grupo={selectedGrupo}
                    privado={selectedPrivado}
                ></ModalChat>
            ) : (
                <></>
            )}
            <Header />
            <div className="contentHome">
                <div className="publicationsHome" style={{ marginTop: "30px" }}>
                    <div className='buttonsEndPublication'>
                        <ColorButton variant="contained" color="primary" endIcon={<AddIcon></AddIcon>} onClick={() => setOpenCreateGp(true)}>
                            Criar grupo
                        </ColorButton>
                        <ColorButton variant="contained" color="primary" endIcon={<AddIcon></AddIcon>} onClick={() => setOpenCreateCp(true)}>
                            Iniciar conversa privada
                        </ColorButton>
                    </div>
                    {grupos.length > 0
                        ?
                        <div>
                            {grupos.map((grupo, index) =>
                                <div className="chatList" onClick={() => setOpenChatGrupo(true)}>
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
                                            João: E ai?
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