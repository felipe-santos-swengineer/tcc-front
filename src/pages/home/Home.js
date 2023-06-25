import React, { useContext, useEffect, useState } from "react";
import parse from 'html-react-parser';
import StoreContext from "../../components/Store/Context";
import Portas from "../../portas";
import Header from "../../components/header/Header";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
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
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    function share(api_url) {
        window.open(api_url + link, '_blank', 'noopener,noreferrer');
    }

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

    async function remover() {
        if (motivo.trim().length < 1) {
            alert("É necessário informar o motivo da remoção.")
        }
        else {
            setOpen3(false)
            setMotivo("")
            alert("Exclusão realizada com sucesso, lamentamos pelo transtorno que a mesma possa ter lhe causado, a comunidade Talkdoor agradece pela sua colaboração na moderação da rede.")
            window.location.reload(false);
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

    useEffect(() => {
        getPublications();
        getUser();
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
                                                        <ReportProblemIcon style={{ cursor: "pointer" }} onClick={() => setOpen3(true)} />
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
                                            onClick={() => alert(publicacao.id)}
                                            startIcon={<SendIcon />}

                                        >
                                            Enviar
                                        </ColorButton>
                                    </div>
                                    {publicacao.openComentarios
                                        ? <div>
                                            {publicacao.comentarios.map((comentario) =>
                                                <Paper elevation={12} className="comentarioHome">
                                                    <div className="autorComentarioHome" style={{cursor: "pointer"}} onClick={() => (window.location = '/perfil/' + comentario.id_autor)}>{comentario.nome + " em " + getData(comentario.data_criacao)}</div>
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
                </div>
            </div>
        </div>
    );
}