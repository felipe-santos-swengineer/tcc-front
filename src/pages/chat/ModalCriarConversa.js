import React, { useContext, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Portas from '../../portas';
import Button from '@material-ui/core/Button';
import StoreContext from "../../components/Store/Context";
import CircularProgress from '@material-ui/core/CircularProgress';
import './modalCriarConversas.css';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    root: {
        width: '100%',
        maxWidth: 360,
        maxHeight: 360,
        overflowY: 'scroll',
        backgroundColor: theme.palette.background.paper,
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: "white",
        backgroundColor: "#003A65",
        marginRight: "5px",
        '&:hover': {
            backgroundColor: "#003A65",
        }
    },
}))(Button);

const ColorButton1 = withStyles((theme) => ({
    root: {
        color: "white",
        backgroundColor: "red",
        '&:hover': {
            backgroundColor: "red",
        },
    },
}))(Button);

export default function TransitionsModal({ open, setOpen, type }) {

    const classes = useStyles();
    const { token } = useContext(StoreContext);
    const [titulo, setTitulo] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [amigos, setAmigos] = React.useState([]);
    const [checked, setChecked] = React.useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    function contChecked() {
        for (var i = 0; i < checked.length; i++) {
            if (checked[i]) {
                return true
            }
        }
        return false
    }

    const handleToggle = (index) => () => {

        const newChecked = [...checked];
        newChecked[index] = !newChecked[index]
        setChecked(newChecked);
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

                //inicializacao checkbox - Todos amigos desmarcados (false)
                var selecao = []
                for (var i = 0; i < resJSON.length; i++) {
                    selecao.push(false)
                }

                setChecked(selecao)
                setAmigos(resJSON)
                setLoading(false)

            } catch (err) {
                setLoading(false)
                console.log(err.message);
            }
        }
    }

    const criarGrupo = async () => {
        if (token !== null) {
            try {
                if (titulo.trim().length < 5) {
                    alert("Insira um titulo com pelo menos 5 caracteres")
                    return
                }
                var membros = []
                for (var i = 0; i < amigos.length; i++) {
                    if (checked[i]) {
                        membros.push(amigos[i].id)
                    }
                }
                if (membros.length < 2) {
                    alert('Para a criação de grupo, é necessário o minimo de 2 pessoas, incluindo o criador.')
                    return
                }
                const body = { usertoken: token, titulo: titulo, membros: membros };
                const response = await fetch(Portas().serverHost + "/criarGrupo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                if (resJSON === 'Grupo Inserido!') {
                    window.location.reload(false)
                }

            } catch (err) {
                console.log(err.message);
            }
        }
    }


    useEffect(() => {
        getAmigos();
    }, []);

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        {type === 'grupo'
                            ?
                            <div>
                                <form noValidate autoComplete="off" style={{ marginBottom: '20px', display: "flex", justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center' }}>
                                    <TextField value={titulo} onChange={(event) => setTitulo(event.target.value)} fullWidth id="standard-basic" label="Titulo do Grupo" />
                                </form>
                                <div className='participantesGp' style={{ marginBottom: '10px', display: "flex", justifyContent: 'left', alignContent: 'left', justifyItems: 'left', alignItems: 'left' }}>Participantes:</div>
                                <List dense className={classes.root}>
                                    {loading
                                        ?
                                        <CircularProgress />
                                        : <div></div>
                                    }
                                    {amigos.map((amigo, index) => {
                                        const labelId = `checkbox-list-secondary-label-${index}`;
                                        return (
                                            <ListItem key={index} button>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={`imagem de perfil`}
                                                        src={amigo.foto}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary={amigo.nome} />
                                                <ListItemSecondaryAction>
                                                    <Checkbox
                                                        edge="end"
                                                        onChange={handleToggle(index)}
                                                        checked={checked[index] === true}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                </List>

                                <div className='buttonsEndPublication' style={{ marginTop: '20px' }}>
                                    {contChecked()
                                        ?
                                        <ColorButton variant="contained" color="primary" onClick={() => criarGrupo()}>
                                            Criar Grupo
                                        </ColorButton>
                                        :
                                        <></>
                                    }
                                    <ColorButton1 variant="contained" color="primary" onClick={() => setOpen(false)}>
                                        Cancelar
                                    </ColorButton1>

                                </div>

                            </div>
                            :
                            <div>
                                <div className='participantesGp' style={{ marginBottom: '10px', display: "flex", justifyContent: 'left', alignContent: 'left', justifyItems: 'left', alignItems: 'left' }}>Selecionar contato:</div>
                                <List dense className={classes.root}>
                                    {loading
                                        ?
                                        <CircularProgress />
                                        : <div></div>
                                    }
                                    {amigos.map((amigo, index) => {
                                        const labelId = `checkbox-list-secondary-label-${index}`;
                                        return (
                                            <ListItem key={index} button>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={'imagem de perfil'}
                                                        src={amigo.foto}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText id={labelId} primary={amigo.nome} />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <div className='buttonsEndPublication' style={{ marginTop: '20px' }}>
                                    <ColorButton1 variant="contained" color="primary" onClick={() => setOpen(false)}>
                                        Cancelar
                                    </ColorButton1>
                                </div>
                            </div>
                        }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}