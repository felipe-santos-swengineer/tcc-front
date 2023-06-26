import React, { useContext, useEffect, useState } from "react";
import Backdrop from '@material-ui/core/Backdrop';
import parse from 'html-react-parser';
import StoreContext from "../../components/Store/Context";
import Portas from "../../portas";
import Header from "../../components/header/Header";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Group from "../../components/img/group.png";
import Button from '@material-ui/core/Button';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Textsms';
import SendIcon from '@material-ui/icons/Send';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import BtnCompartilhar from "../../components/btn_share/Btn_Share";
import Avatar from '@material-ui/core/Avatar';
import Profile from "../../components/img/profile.png";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';

import "./home.css";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: "5px",
        marginRight: "5px",
        color: "black",
        backgroundColor: "transparent",
        '&:hover': {
            backgroundColor: "transparent",
        },
    },
}))(Button);

const ColorButton1 = withStyles(() => ({
    root: {
        marginLeft: "5px",
        marginRight: "5px",
        color: "blue",
        backgroundColor: "transparent",
        '&:hover': {
            backgroundColor: "transparent",
        },
    },
}))(Button);

export default function Home() {
    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const [publicacoes, setPublicacoes] = useState([]);
    const [tipo, setTipo] = useState('');
    const [motivo, setMotivo] = useState("")
    const [link, setLink] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = React.useState(true);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [openEnviar, setOpenEnviar] = useState(false);
    const [selectedPubId, setSelectedPubId] = useState();
    const [privados, setPrivados] = React.useState([]);
    const [grupos, setGrupos] = React.useState([]);

    async function denunciar() {
        if (motivo.trim().length < 1) {
            alert("É necessário informar o motivo da denuncia.")
        }
        else {
            setOpen2(false)
            setMotivo("")
            alert("Denúncia incluída com sucesso, lamentamos pelo transtorno que a mesma possa ter lhe causado, caso uma ação sobre essa publicação seja tomada, você será notificado por email.")
        }
    }

    function removerPubId(id) {
        setSelectedPubId(id)
        setOpen3(true)
    }

    async function remover() {
        if (motivo.trim().length < 1) {
            alert("É necessário informar o motivo da remoção.")
        }
        else {
            setOpen3(false)
            setMotivo("")
            deletePublicacao()
        }
    }

    const deletePublicacao = async () => {
        if (token !== null) {
            try {
                const body = { usertoken: token, id: selectedPubId };
                const response = await fetch(Portas().serverHost + "/deleteModeracao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                alert("Exclusão realizada com sucesso, lamentamos pelo transtorno que a mesma possa ter lhe causado, a comunidade Talkdoor agradece pela sua colaboração na moderação da rede.")
                getPublications();


            } catch (err) {
                alert("Houve uma falha na exclusão da publicação")
                console.log(err.message);
            }

        }
    }

    const body2 = (
        <div style={modalStyle} className={classes.paper}>
            <div>Denunciar publicação:</div>
            <div style={{ marginTop: "10px" }}>
                <TextField value={motivo} onChange={(event) => setMotivo(event.target.value)} style={{ width: "100%" }} id={"denunciaHome"} label="Motivo" variant="filled" />
                <ColorButton onClick={() => denunciar()}
                >
                    Denunciar
                </ColorButton>
                <ColorButton onClick={() => setOpen2(false)}
                >
                    Cancelar
                </ColorButton>
            </div>
        </div>
    );

    const body3 = (
        <div style={modalStyle} className={classes.paper}>
            <div>Remover publicação:</div>
            <div style={{ marginTop: "10px" }}>
                <TextField value={motivo} onChange={(event) => setMotivo(event.target.value)} style={{ width: "100%" }} id={"denunciaHome"} label="Motivo" variant="filled" />
                <ColorButton onClick={() => remover()}
                >
                    Remover
                </ColorButton>
                <ColorButton onClick={() => setOpen3(false)}
                >
                    Cancelar
                </ColorButton>
            </div>
        </div>
    );

    function openShare(id) {
        setLink(Portas().clientHost + "/" + id);
        setLink("http://vitrinefuncap.com")
        setOpen(true)
    }

    function getData(timestamp) {
        var data = new Date(timestamp)
        var dia = data.getDate()
        var mes = data.getMonth() + 1
        var ano = data.getFullYear()
        var horas = (data.getHours() < 10 ? '0' : '') + data.getHours()
        var minutos = (data.getMinutes() < 10 ? '0' : '') + data.getMinutes()
        var miliseg = data.getMilliseconds() + ""

        return dia + "/" + mes + "/" + ano + " - " + horas + ":" + minutos + ":" + miliseg[0] + miliseg[1]
    }

    const comentar = async (id) => {
        if (token !== null) {
            try {
                const body = { usertoken: token, id: id, conteudo: document.getElementById("pubCHome" + id).value };
                const response = await fetch(Portas().serverHost + "/comentar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                document.getElementById("pubCHome" + id).value = ""
                getPublications()

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    function openComentarios(index) {

        let aux = [...publicacoes];
        aux[index].openComentarios = !aux[index].openComentarios;
        setPublicacoes(aux);

    }

    const editarLike = async (id) => {
        if (token !== null) {
            try {
                const body = { usertoken: token, id: id };
                const response = await fetch(Portas().serverHost + "/inserirLike", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                getPublications()

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getPublications = async () => {
        if (token !== null) {
            try {

                //rota de publicações gerais
                var rota = Portas().serverHost + "/getPublicacao"
                var body = { usertoken: token };

                if (window.location.href.substring(window.location.href.lastIndexOf("/") + 1) !== 'home' && window.location.href.substring(window.location.href.lastIndexOf("/") + 1) !== '' && window.location.href.indexOf('search=') > -1 === false) {
                    //rota de publicação especifica
                    rota = Portas().serverHost + "/getByIdPub2"
                    body = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                }

                if (window.location.href.indexOf('search=') > -1) {
                    //rota de publicação especifica
                    rota = Portas().serverHost + "/getByPubSearch"
                    body = { usertoken: token, search: decodeURI(window.location.href.substring(window.location.href.lastIndexOf("=") + 1)) };
                }

                const response = await fetch(rota, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                //mantem abas comentarios abertos
                if (publicacoes.length > 0) {
                    for (var i = 0; i < resJSON.length; i++) {
                        for (var j = 0; j < publicacoes.length; j++) {
                            if (resJSON[i].id === publicacoes[j].id) {
                                resJSON[i].openComentarios = publicacoes[j].openComentarios
                            }
                        }
                    }
                }

                setPublicacoes(resJSON);
                console.log(resJSON)

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getUser = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/perfil", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log(resJSON)
                if (resJSON.length > 0) {
                    setTipo(resJSON[0].tipo)
                }

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
                setLoading(false)

            } catch (err) {
                setLoading(false)
                console.log(err.message);
            }
        }
    }

    const sendMensagem = async (type, id) => {
        if (token !== null) {
            try {
                var mensagem = Portas().clientHost + "/home/" + id
                if (type === 'grupo') {
                    if (mensagem.trim().length > 1) {
                        const body = { usertoken: token, grupo_id: id, mensagem: mensagem };
                        const response = await fetch(Portas().serverHost + "/setMensagensGrupo", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });

                        var resJSON = await response.json();
                        setOpenEnviar(false)
                    }
                }
                if (type === 'privado') {
                    if (mensagem.trim().length > 1) {
                        const body = { usertoken: token, chatPrivado_id: id, mensagem: mensagem };
                        const response = await fetch(Portas().serverHost + "/setMensagensPrivado", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });

                        var resJSON = await response.json();
                        setOpenEnviar(false)
                        
                    }
                }
            } catch (err) {
                console.log(err.message);
            }
        }
    }


    useEffect(() => {
        getPublications();
        getUser();
        getPrivados();
        getGrupos();
    }, []);

    return (
        <div className="root">
            <Header />
            {open2
                ?
                <Modal
                    open={open2}
                    onClose={() => setOpen2(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body2}
                </Modal>
                :
                <></>
            }
            {open3
                ?
                <Modal
                    open={open3}
                    onClose={() => setOpen3(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body3}
                </Modal>
                :
                <></>
            }
            <div className="contentHome">
                <div className="publicationsHome">
                    {publicacoes.length > 0
                        ?
                        <div>
                            {publicacoes.map((publicacao, index) =>
                                <div className="publicacaoHome">
                                    <div className="publicacaoCabecalhoHome">
                                        {publicacao.img !== null
                                            ?
                                            <Avatar alt="Imagem de perfil" src={publicacao.img} className={classes.avatar} style={{ cursor: "pointer" }} onClick={() => (window.location = '/perfil/' + publicacao.id_publicador)} />
                                            :
                                            <Avatar alt="Imagem de perfil" src={Profile} className={classes.avatar} style={{ cursor: "pointer" }} onClick={() => (window.location = '/perfil/' + publicacao.id_publicador)} />
                                        }
                                        <div style={{ width: "70%" }}>
                                            <div className="publicacaoNomeHome" onClick={() => (window.location = '/perfil/' + publicacao.id_publicador)}>{publicacao.nome}</div>
                                            <div className="publicacaoDataHome">{getData(publicacao.data_criacao)}</div>
                                        </div>
                                        {!publicacao.owner ?
                                            <div className="publicationReportHome">
                                                {tipo !== 'Colaborador' ?
                                                    <Tooltip title="Denunciar publicação">
                                                        <ReportProblemIcon style={{ cursor: "pointer" }} onClick={() => setOpen2(true)} />
                                                    </Tooltip>
                                                    :
                                                    <Tooltip title="Remover publicação">
                                                        <ReportProblemIcon style={{ cursor: "pointer" }} onClick={() => removerPubId(publicacao.id)} />
                                                    </Tooltip>
                                                }
                                            </div>
                                            :
                                            <></>
                                        }


                                    </div>
                                    <div className="publicacaoConteudoHome">{parse(publicacao.conteudo)}</div>
                                    <div className="publicacaoBotoesHome">
                                        {publicacao.curtiu === false
                                            ?
                                            <ColorButton
                                                startIcon={<LikeIcon />}
                                                onClick={() => editarLike(publicacao.id)}
                                            >
                                                Gostei
                                            </ColorButton>
                                            :
                                            <ColorButton1
                                                startIcon={<LikeIcon />}
                                                onClick={() => editarLike(publicacao.id)}
                                            >
                                                Gostei
                                            </ColorButton1>
                                        }
                                        <ColorButton
                                            startIcon={<CommentIcon />}
                                            onClick={() => openComentarios(index)}
                                        >
                                            {"Comentarios (" + publicacao.comentarios.length + ")"}
                                        </ColorButton>
                                        <BtnCompartilhar id={publicacao.id} />
                                        <ColorButton
                                            onClick={() => setOpenEnviar(true)}
                                            startIcon={<SendIcon />}
                                        >
                                            Enviar
                                        </ColorButton>
                                    </div>
                                    {publicacao.openComentarios
                                        ? <div>
                                            {publicacao.comentarios.map((comentario) =>
                                                <Paper elevation={12} className="comentarioHome">
                                                    <div className="autorComentarioHome" style={{ cursor: "pointer" }} onClick={() => (window.location = '/perfil/' + comentario.id_autor)}>{comentario.nome + " em " + getData(comentario.data_criacao)}</div>
                                                    <div className="conteudoComentarioHome">{comentario.conteudo}</div>
                                                </Paper>

                                            )}
                                            <div className="textInputComentariosHome">
                                                <TextField style={{ width: "100%" }} id={"pubCHome" + publicacao.id} label="Adicionar Comentario" variant="filled" />
                                                <div className="textInputConfirmHome" onClick={() => comentar(publicacao.id)}>
                                                    <AddCommentIcon />
                                                </div>
                                            </div>
                                        </div>
                                        : <></>
                                    }
                                </div>
                            )}
                        </div>
                        :
                        <></>
                    }
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={openEnviar}
                        onClose={() => setOpenEnviar(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={openEnviar}>
                            <div className={classes.paper}>
                                <div>
                                    <div className='participantesGp' style={{ marginBottom: '10px', display: "flex", justifyContent: 'left', alignContent: 'left', justifyItems: 'left', alignItems: 'left' }}>Enviar para:</div>
                                    <List dense className={classes.root}>
                                        {loading
                                            ?
                                            <CircularProgress />
                                            : <div></div>
                                        }
                                        {grupos.length > 0
                                            ?
                                            <div>
                                                {grupos.map((grupo, index) => {
                                                    const labelId = `checkbox-list-secondary-label-${index}`;
                                                    return (
                                                        <ListItem key={index} button onClick={() => sendMensagem("grupo", grupo.id)}>
                                                            <ListItemAvatar >
                                                                <Avatar
                                                                    alt={'imagem de perfil'}
                                                                    src={Group}
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText id={labelId} primary={grupo.titulo} />
                                                        </ListItem>
                                                    );
                                                })}
                                            </div>
                                            : <></>
                                        }
                                        {privados.length > 0
                                            ?
                                            <div>
                                                {privados.map((privado, index) => {
                                                    const labelId = `checkbox-list-secondary-label-${index}`;
                                                    return (
                                                        <ListItem key={index} button onClick={() => sendMensagem("privado", privado.id)}>
                                                            <ListItemAvatar >
                                                                {privado.foto.length > 0 ?
                                                                    <Avatar alt="Imagem de perfil" src={privado.foto[0].img_json.img} />
                                                                    :
                                                                    <Avatar alt="Imagem de perfil" src={Profile} />
                                                                }
                                                            </ListItemAvatar>
                                                            <ListItemText id={labelId} primary={privado.participante[0].nome} />
                                                        </ListItem>
                                                    );
                                                })}
                                            </div>
                                            : <></>
                                        }
                                    </List>
                                    <div className='buttonsEndPublication' style={{ marginTop: '20px' }}>
                                        <ColorButton1 variant="contained" color="primary" onClick={() => setOpenEnviar(false)}>
                                            Cancelar
                                        </ColorButton1>
                                    </div>
                                </div>

                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
        </div>
    );
}