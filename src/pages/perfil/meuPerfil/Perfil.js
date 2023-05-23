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
import Avatar from '@material-ui/core/Avatar';
import "./perfil.css";

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
    const [tags, setTags] = useState(["Desenvolvimento", "Javascript", "DataScience", "Diagramas", "Requisitos"])
    const [insertedTag, setInsertedTag] = useState("");
    const [nome, setNome] = useState("Nome do usuário");
    const [tipo, setTipo] = useState("Aluno");
    const [cidade, setCidade] = useState("Russas - CE");
    const [idade, setIdade] = useState(23);
    const [sobre, setSobre] = useState("Sobre Mim");
    const [tagsAux, setTagsAux] = useState("");
    const [nomeAux, setNomeAux] = useState("");
    const [cidadeAux, setCidadeAux] = useState("");
    const [sobreAux, setSobreAux] = useState("");
    const [modalStyle] = React.useState(getModalStyle);
    const [value, setValue] = React.useState(0);
    const [publicacoes, setPublicacoes] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [storedImage, setStoredImage] = useState('');
    const [userImage, setUserImage] = useState('');
    const [consEnded, setconsEnded] = useState(false);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getPublications = async () => {
        if (token !== null) {
            try {
                const body1 = { usertoken: token };
                const response1 = await fetch(Portas().serverHost + "/usuarios-byToken", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body1)
                });

                var resJSON1 = await response1.json();
                console.log(resJSON1)

                const body = { usertoken: token, id: resJSON1.id };
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
                const body1 = { usertoken: token, id: '' };
                const response1 = await fetch(Portas().serverHost + "/foto-byToken", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body1)
                });
                var resJSON1 = await response1.json();

                if (resJSON1.length > 0) {
                    setStoredImage(resJSON1[0].img_json.img)
                }

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/perfil", {
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

    const handleDelete = (index) => {
        var auxArr = []
        for (var i = 0; i < tagsAux.length; i++) {
            if (i !== index) {
                auxArr.push(tagsAux[i])
            }
        }
        setTagsAux(auxArr)
    };

    const handleAddTag = () => {
        if (insertedTag.length > 0 && tagsAux.length < 5) {
            var auxArr = []
            for (var i = 0; i < tagsAux.length; i++) {
                auxArr.push(tagsAux[i])
            }
            auxArr.push(insertedTag)
            setInsertedTag('')
            setTagsAux(auxArr)
        }
    };

    const handleUpdate = async () => {
        if (token !== null) {
            try {
                //VLDS
                if (nomeAux.trim().length < 5) {
                    alert("O nome pode estar vazio ou conter menos que 5 caracteres!")
                    return
                }

                //UPDT
                if (userImage !== '') {
                    const body1 = { usertoken: token, img: userImage };
                    const response1 = await fetch(Portas().serverHost + "/foto", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body1)
                    });

                    var resJSON2 = await response1.json();
                    console.log(resJSON2)
                }

                const body = { usertoken: token, nome: nomeAux, tags: tagsAux.toString(), cidade: cidadeAux, sobre: sobreAux };
                const response = await fetch(Portas().serverHost + "/updatePerfil", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();

                if (resJSON.length > 0) {
                    alert(resJSON[0].msg)
                    window.location.reload(false)
                }

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    function updateAuxFields() {
        setNomeAux(nome)
        setCidadeAux(cidade)
        setSobreAux(sobre)
        setTagsAux(tags)
    }

    async function convertBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    async function handleFileRead(event) {
        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        setUserImage(base64)
    }

    useEffect(() => {
        getUser();
        getPublications();
    }, []);

    return (
        <div className="root">
            {consEnded
                ?
                <div>
                    <Header />
                    {open
                        ?
                        <Modal
                            open={open}
                            onClose={() => (setOpen(false), setUserImage(''))}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div style={modalStyle} className={classes.paper}>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", justifyItems: "center", alignItems: "center" }}>
                                    {storedImage === ''
                                        ?
                                        <div>
                                            {userImage === ''
                                                ?
                                                <Avatar alt="Imagem de perfil" src={Profile} className={classes.avatar} />
                                                :
                                                <Avatar alt="Imagem de perfil" src={userImage} className={classes.avatar} />
                                            }
                                        </div>
                                        :
                                        <div>
                                            {userImage === ''
                                                ?
                                                <Avatar alt="Imagem de perfil" src={storedImage} className={classes.avatar} />
                                                :
                                                <Avatar alt="Imagem de perfil" src={userImage} className={classes.avatar} />
                                            }
                                        </div>
                                    }

                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <div style={{ margin: "5px" }}>
                                        <TextField
                                            style={{ margin: "5px" }}
                                            //id="originalFileName"
                                            type="file"
                                            inputProps={{ accept: 'image/*' }}
                                            label="Foto de perfil"
                                            name="originalFileName"
                                            onChange={e => handleFileRead(e)}
                                            size="small"
                                            variant="standard"
                                        />
                                        {tagsAux.length < 5
                                            ?
                                            <div className="align">
                                                <TextField
                                                    value={insertedTag}
                                                    onChange={(event) => setInsertedTag(event.target.value.replace('#', '').replace(' ', ''))}
                                                    style={{ margin: "5px" }}
                                                    fullWidth
                                                    label="Tag"
                                                    variant="filled"
                                                />
                                                <AddCircleIcon onClick={() => handleAddTag()} />
                                            </div>

                                            :
                                            <></>
                                        }
                                        {tagsAux.map((tag, index) => (
                                            <Chip
                                                //icon={'#'}
                                                label={tag}
                                                //onClick={() => handleClick(index)}
                                                onDelete={() => handleDelete(index)}
                                            />
                                        ))}
                                    </div>

                                    <TextField
                                        value={nomeAux}
                                        onChange={(event) => setNomeAux(event.target.value)}
                                        style={{ margin: "5px" }}
                                        fullWidth
                                        label="Nome"
                                        variant="filled"
                                    />

                                    <TextField
                                        value={cidadeAux}
                                        onChange={(event) => setCidadeAux(event.target.value)}
                                        style={{ margin: "5px" }}
                                        fullWidth
                                        label="Cidade"
                                        variant="filled"
                                    />
                                    <TextField
                                        value={sobreAux}
                                        onChange={(event) => setSobreAux(event.target.value)}
                                        style={{ margin: "5px" }}
                                        fullWidth
                                        multiline
                                        maxRows={6}
                                        label="Sobre mim"
                                        variant="filled"
                                    />
                                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", justifyItems: 'center', alignItems: 'center', marginTop: '10px' }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        {/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}
                                        <Button
                                            style={{ marginLeft: '5px' }}
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            onClick={() => handleUpdate()}
                                        //endIcon={<Icon>send</Icon>}
                                        >
                                            Atualizar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        :
                        <></>
                    }
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
                            <div className="perfilHeader">
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
                                                <Tooltip title="Editar apresentação">
                                                    <EditLocationIcon style={{ fontSize: 30, color: "gray", marginLeft: "5px", cursor: "pointer" }} onClick={() => (updateAuxFields(), setOpen(!open))} />
                                                </Tooltip>
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
                                            <div>
                                                {tipo.length > 0
                                                    ?
                                                    <div className="infoDivPerfil">
                                                        <WorkIcon style={{ fontSize: 30, color: "brown" }}></WorkIcon>
                                                        <div className="textAboutPerfil">
                                                            Aluno
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
                                        {value === 2
                                            ?
                                            <div>
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