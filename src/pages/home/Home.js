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
    const [link, setLink] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    function share(api_url) {
        window.open(api_url + link, '_blank', 'noopener,noreferrer');
    }

    const body2 = (
        <div style={modalStyle} className={classes.paper}>
            <div>Denunciar publicação:</div>
            <div style={{ marginTop: "10px" }}>
                <TextField style={{ width: "100%" }} id={"denunciaHome"} label="Motivo" variant="filled" />
                <ColorButton onClick={() => setOpen2(false)}
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

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/getPublicacao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();

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

    useEffect(() => {
        getPublications();
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
            <div className="contentHome">
                <div className="publicationsHome">
                    {publicacoes.length > 0
                        ?
                        <div>
                            {publicacoes.map((publicacao, index) =>
                                <div className="publicacaoHome">
                                    <div className="publicacaoCabecalhoHome">
                                        <div className="publicacaoFotoHome"></div>
                                        <div style={{ width: "70%" }}>
                                            <div className="publicacaoNomeHome">{publicacao.nome}</div>
                                            <div className="publicacaoDataHome">{getData(publicacao.data_criacao)}</div>
                                        </div>

                                        <div className="publicationReportHome">
                                            <Tooltip title="Denunciar">
                                                <ReportProblemIcon style={{ cursor: "pointer" }} onClick={() => setOpen2(true)} />
                                            </Tooltip>
                                        </div>

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
                                            startIcon={<SendIcon />}

                                        >
                                            Enviar
                                        </ColorButton>
                                    </div>
                                    {publicacao.openComentarios
                                        ? <div>
                                            {publicacao.comentarios.map((comentario) =>
                                                <Paper elevation={12} className="comentarioHome">
                                                    <div className="autorComentarioHome">{comentario.nome + " em " + getData(comentario.data_criacao)}</div>
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