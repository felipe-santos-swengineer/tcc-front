import React, { useContext, useState, useEffect } from "react";
import StoreContext from "../../../components/Store/Context";
import Header from "../../../components/header/Header";
import Profile from "../../../components/img/profile.png";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import WorkIcon from '@material-ui/icons/Work';
import HomeIcon from '@material-ui/icons/Home';
import CakeIcon from '@material-ui/icons/Cake';
import InfoIcon from '@material-ui/icons/Info';
import parse from 'html-react-parser';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Button from '@material-ui/core/Button';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Textsms';
import SendIcon from '@material-ui/icons/Send';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import BtnCompartilhar from "../../../components/btn_share/Btn_Share";
import EditLocationIcon from '@material-ui/icons/Edit';
import Portas from "../../../portas";
import Chip from '@material-ui/core/Chip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Backdrop from '@material-ui/core/Backdrop';
import Group from "../../../components/img/group.png";
import "./perfilView.css";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        background: "white",
        zIndex: 1000
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    avatar: {
        width: 200,
        height: 200
    },
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

export default function Perfil() {

    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const [tags, setTags] = useState([])
    const [insertedTag, setInsertedTag] = useState("");
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [cidade, setCidade] = useState("");
    const [idade, setIdade] = useState(0);
    const [sobre, setSobre] = useState("");
    const [tagsAux, setTagsAux] = useState("");
    const [nomeAux, setNomeAux] = useState("");
    const [cidadeAux, setCidadeAux] = useState("");
    const [sobreAux, setSobreAux] = useState("");
    const [amigos, setAmigos] = useState([]);
    const [naoAmigos, setNaoAmigos] = useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [value, setValue] = React.useState(0);
    const [publicacoes, setPublicacoes] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [storedImage, setStoredImage] = useState('');
    const [userImage, setUserImage] = useState('');
    const [consEnded, setconsEnded] = useState(false);
    const [privados, setPrivados] = React.useState([]);
    const [grupos, setGrupos] = React.useState([]);
    const [openEnviar, setOpenEnviar] = useState(false);
    const [loading, setLoading] = React.useState(true);

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

                const body = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                const response = await fetch(Portas().serverHost + "/getByIdPub", {
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

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getUser = async () => {
        if (token !== null) {
            try {
                const body1 = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                const response1 = await fetch(Portas().serverHost + "/foto-byId", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body1)
                });
                var resJSON1 = await response1.json();
                console.log(resJSON1)

                if (resJSON1.length > 0) {
                    setStoredImage(resJSON1[0].img_json.img)
                }

                const body = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                const response = await fetch(Portas().serverHost + "/getPerfilById", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                if (resJSON.length > 0) {
                    setNome(resJSON[0].nome)
                    setCidade(resJSON[0].cidade)
                    setIdade(resJSON[0].idade)
                    setTipo(resJSON[0].tipo)
                    setSobre(resJSON[0].sobre)
                    setTags(resJSON[0].tags.split(','))
                }

                setconsEnded(true)

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAmigos = async () => {
        if (token !== null) {
            try {
                const body = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                const response = await fetch(Portas().serverHost + "/amigosComum", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log("amigos em comum")
                console.log(resJSON)
                setAmigos(resJSON)

            } catch (err) {
                console.log("erro" + err.message);
            }
        }
    }

    const getNaoAmigos = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token, id: window.location.href.substring(window.location.href.lastIndexOf("/") + 1) };
                const response = await fetch(Portas().serverHost + "/naoAmigosComum", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                console.log("desconhecidos")
                console.log(resJSON)
                setNaoAmigos(resJSON)


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
        getUser();
        getPublications();
        //getNaoAmigos();
        getAmigos();
        getPrivados();
        getGrupos();

    }, []);

    return (
        <div className="root">
            {consEnded
                ?
                <div>
                    <Header />
                    <div className="contentHome">
                        <div className="publicationsHome">
                            <div className="perfilHeader" >
                                <div className="perfilCapa" style={{ backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg")` }}>
                                    <div style={{ paddingTop: "200px", display: "flex", marginLeft: "10px" }}>
                                        {storedImage === ''
                                            ?
                                            <Avatar alt="Imagem de perfil" src={Profile} className={classes.avatar} />
                                            :
                                            <Avatar alt="Imagem de perfil" src={storedImage} className={classes.avatar} />
                                        }
                                        <div className="perfilInfos">
                                            <div className="align">
                                                <div className="perfilNome">{nome}</div>
                                            </div>
                                            <div className="perfilTags">
                                                {tags.length > 0
                                                    ?
                                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                        {tags.map((item, index) => (
                                                            <div className={"perfilTag" + (index + 1)}>{"#" + item}</div>
                                                        ))}
                                                    </div>
                                                    :
                                                    <>Sem Tags.</>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Paper className="contentPerfil">
                                            <Tabs
                                                value={value}
                                                onChange={handleChange}
                                                indicatorColor="primary"
                                                textColor="primary"
                                                centered
                                            >
                                                <Tab label="Apresentação" />
                                                <Tab label="Conexões" />
                                                <Tab label="Publicações" />
                                            </Tabs>

                                        </Paper>
                                        {value === 0
                                            ?
                                            <div style={{ paddingBottom: "10px" }}>
                                                {tipo.length > 0
                                                    ?
                                                    <div className="infoDivPerfil">
                                                        <WorkIcon style={{ fontSize: 30, color: "brown" }}></WorkIcon>
                                                        <div className="textAboutPerfil">
                                                            {tipo}
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                                {cidade.length > 0
                                                    ?
                                                    <div className="infoDivPerfil">
                                                        <HomeIcon style={{ fontSize: 30, color: "#20b2aa" }}></HomeIcon>
                                                        <div className="textAboutPerfil">
                                                            {cidade}
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                                {idade > 0
                                                    ?
                                                    <div className="infoDivPerfil">
                                                        <CakeIcon style={{ fontSize: 30, color: "pink" }}></CakeIcon>
                                                        <div className="textAboutPerfil">
                                                            {idade + " Anos"}
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                                {sobre.length > 0
                                                    ?
                                                    <div className="infoDivPerfil">
                                                        <InfoIcon style={{ fontSize: 30, color: "gray" }}></InfoIcon>
                                                        <div className="textAboutPerfil">
                                                            {sobre}
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                            </div>
                                            : <></>
                                        }
                                        {value === 1
                                            ?
                                            <div>
                                                <div className="tituloSolicitacoes" style={{ width: "100%", paddingTop: "10px" }}>{"Amigos (" + amigos.length + ")"}</div>
                                                <div>
                                                    {amigos.length > 0
                                                        ?
                                                        <div className="painelAmigos">
                                                            {amigos.map((pessoa) =>
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
                                                                        {!pessoa.comum
                                                                            ?
                                                                            <Tooltip title="Adicionar">
                                                                                <IconButton style={{ color: "#008240" }} type="submit" aria-label="search" onClick={() => adicionarAmigo(pessoa.id)}>
                                                                                    <AddIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            :
                                                                            <></>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        : <></>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <></>

                                        }
                                        {value === 2
                                            ?
                                            <div style={{ paddingBottom: "10px" }}>
                                                {publicacoes.length > 0
                                                    ?
                                                    <div>
                                                        {publicacoes.map((publicacao, index) =>
                                                            <div className="publicacaoHome">
                                                                <div className="publicacaoCabecalhoHome">
                                                                    <Avatar alt="Imagem de perfil" src={storedImage} />
                                                                    <div style={{ width: "70%" }}>
                                                                        <div className="publicacaoNomeHome">{publicacao.nome}</div>
                                                                        <div className="publicacaoDataHome">{getData(publicacao.data_criacao)}</div>
                                                                    </div>
                                                                    {/*}
                                                                    <div className="publicationReportHome">
                                                                        <Tooltip title="Denunciar">
                                                                            <ReportProblemIcon style={{ cursor: "pointer" }} onClick={() => setOpen2(true)} />
                                                                        </Tooltip>
                                                                    </div>
                                                        */}
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
                                                                        onClick={() => setOpenEnviar(true)}

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

                                                        )}
                                                    </div>
                                                    :
                                                    <></>
                                                }
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>
            }
        </div>
    );
}