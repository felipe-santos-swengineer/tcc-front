import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar';
import Portas from '../../portas';
import StoreContext from "../../components/Store/Context";
import Group from "../../components/img/group.png";
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Profile from "../../components/img/profile.png";
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './modalChat.css';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'center',

  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 360,
    height: 490
  },
  root: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 360,
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function TransitionsModal({ open, setOpen, type, id }) {

  const classes = useStyles();
  const { token } = useContext(StoreContext);
  const [mensagens, setMensagens] = React.useState([]);
  const [mensagem, setMensagem] = React.useState('');
  const [grupo, setGrupo] = React.useState([]);
  const [privado, setPrivado] = React.useState([]);
  const [openOpcoes, setOpenOpcoes] = React.useState(false);
  const [verParticipantes, setVerPartipantes] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenOpcoes = () => {
    setOpenOpcoes(true)
  };

  const handleCloseOpcoes = () => {
    setOpenOpcoes(false)
  };

  const getGrupo = async () => {
    if (token !== null) {
      try {
        if (type === 'grupo') {
          const body = { usertoken: token, grupo_id: id };
          const response = await fetch(Portas().serverHost + "/getGrupoById", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          var resJSON = await response.json();
          console.log(resJSON)
          setGrupo(resJSON)
        }

      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const getPrivado = async () => {
    if (token !== null) {
      try {
        if (type === 'privado') {
          const body = { usertoken: token, chatPrivadoId: id };
          const response = await fetch(Portas().serverHost + "/getChatPrivadoById", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          var resJSON = await response.json();
          console.log(resJSON)
          setPrivado(resJSON)
        }

      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const exitGp = async (id_grupo) => {
    if (token !== null) {
      try {
        const body = { usertoken: token, id: id_grupo };
        const response = await fetch(Portas().serverHost + "/sairGrupo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        var resJSON = await response.json();
        console.log(resJSON)
        window.location.reload(false);

      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const exitCp = async (id1, id2) => {
    if (token !== null) {
      try {
        const body = { usertoken: token, id1: id1, id2: id2 };
        const response = await fetch(Portas().serverHost + "/sairConversa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        var resJSON = await response.json();
        console.log(resJSON)
        window.location.reload(false);

      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const getMensagens = async () => {
    if (token !== null) {
      try {
        if (type === 'grupo') {
          const body = { usertoken: token, grupo_id: id };
          const response = await fetch(Portas().serverHost + "/getMensagensGrupo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          var resJSON = await response.json();
          setMensagens(resJSON)
        }
        if (type === 'privado') {
          const body = { usertoken: token, chatPrivado_id: id };
          const response = await fetch(Portas().serverHost + "/getMensagensPrivado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          var resJSON = await response.json();
          console.log(resJSON)
          setMensagens(resJSON)
        }

      } catch (err) {
        console.log(err.message);
      }
    }
  }

  const sendMensagem = async () => {
    if (token !== null) {
      try {
        if (type === 'grupo') {
          if (mensagem.trim().length > 1) {
            const body = { usertoken: token, grupo_id: id, mensagem: mensagem };
            const response = await fetch(Portas().serverHost + "/setMensagensGrupo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });

            var resJSON = await response.json();
            getMensagens();
            setMensagem('')
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
            getMensagens();
            setMensagem('')
          }
        }
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
    getGrupo();
    getPrivado();
    getMensagens();
    const interval = setInterval(() => {
      getMensagens();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {type === 'grupo' && grupo.length > 0 && !verParticipantes
        ?
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
            <div className='chatBox'>
              <div className='chatHeader' style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center' }}>
                  <div className="chatItem">
                    <div className="chatIcon">
                      <Avatar alt="Imagem de perfil" src={Group} />
                    </div>
                  </div>
                  <div style={{ margin: '5px' }} >
                    <div className='chatGroupTitle'>
                      {grupo[0].titulo}
                    </div>
                    <div className='chatGroupParticipantes'>
                      {getParticipantesGp(grupo[0])}
                    </div>
                  </div>
                </div>
                <div style={{ marginRight: "10px" }}>
                  <IconButton
                    ref={anchorRef}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={() => handleOpenOpcoes()}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Popper style={{ zIndex: "1000000" }} open={openOpcoes} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleCloseOpcoes}>
                            <MenuList autoFocusItem={open} id="menu-list-grow">
                            <MenuItem onClick={() => setOpen(false)}>Voltar</MenuItem>
                              <MenuItem onClick={() => setVerPartipantes(true)}>Integrantes</MenuItem>
                              <MenuItem onClick={() => exitGp(grupo[0].id)}>Sair do grupo</MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </div>
              {mensagens.length > 0
                ?
                <div className='mensagensChat'>
                  {mensagens.map((mensagem, index) =>
                    <div className={mensagem.self ? 'mensagemPessoal' : 'mensagemOutro'}>
                      <div className="chatIcon">
                        {mensagem.hasOwnProperty('foto')
                          ?
                          <Avatar alt="Imagem de perfil" src={mensagem.foto} />
                          :
                          <Avatar alt="Imagem de perfil" src={Profile} />
                        }
                      </div>
                      <div>
                        <div className={mensagem.self ? 'ballonPessoal' : 'ballonOutro'}>
                          {mensagem.self === false
                            ?
                            <div className='userNameOutro'>{mensagem.nome}</div>
                            : <></>
                          }
                          <div>{mensagem.conteudo}</div>
                        </div>
                        <div className={mensagem.self ? 'timePessoal' : 'timeOutro'}>{mensagem.data_criacao}</div>
                      </div>
                    </div>
                  )}
                </div>
                :
                <div className='mensagensChat' />
              }
              <div className='mensagemInput'>
                <TextField value={mensagem} onChange={(event) => setMensagem(event.target.value)} label="Adicionar mensagem" variant="filled" fullWidth />
                <AddCircleIcon className='iconSendMsg' style={{ fontSize: 40 }} onClick={() => sendMensagem()} />
              </div>
            </div>
          </Fade>
        </Modal>
        : <></>
      }
      {type === 'grupo' && grupo.length > 0 && verParticipantes
        ?
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={verParticipantes}
          onClose={() => setVerPartipantes(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className='chatBox'>
              <div className='chatHeader' style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center' }}>
                  <div className="chatItem">
                    <div className="chatIcon">
                      <Avatar alt="Imagem de perfil" src={Group} />
                    </div>
                  </div>
                  <div style={{ margin: '5px' }} >
                    <div className='chatGroupTitle'>
                      {grupo[0].titulo}
                    </div>
                  </div>

                </div>
                <div style={{ marginRight: "10px" }}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={() => { setVerPartipantes(false); setOpenOpcoes(false) }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </div>
              </div>
              {grupo[0].participantes.length > 0
                ?
                <div className='mensagensChat'>
                  {grupo[0].participantes.map((participante, index) =>
                    <div className={'mensagemOutro'}>
                      <div className="chatIcon">
                        {participante.hasOwnProperty('foto')
                          ?
                          <Avatar alt="Imagem de perfil" src={participante.foto} style={{cursor: "pointer"}} onClick={() => (window.location = '/perfil/' + participante.id)}/>
                          :
                          <Avatar alt="Imagem de perfil" src={Profile} style={{cursor: "pointer"}} onClick={() => (window.location = '/perfil/' + participante.id)}/>
                        }
                      </div>
                      <div>
                        <div className={'ballonOutro'}>
                          <div className='userNameOutro' style={{cursor: "pointer"}} onClick={() => (window.location = '/perfil/' + participante.id)}>{participante.nome}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                :
                <div className='mensagensChat' />
              }
            </div>
          </Fade>
        </Modal>
        : <></>
      }
      {type === 'privado' && privado.length > 0
        ?
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
            <div className='chatBox'>
              <div className='chatHeader' style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: 'center', alignContent: 'center', justifyItems: 'center', alignItems: 'center' }}>
                  <div className="chatItem">
                    <div className="chatIcon">
                      {privado[0].foto.length > 0
                        ?
                        <Avatar alt="Imagem de perfil" src={privado[0].foto[0].img_json.img} />
                        :
                        <Avatar alt="Imagem de perfil" src={Profile} />
                      }
                    </div>
                  </div>
                  <div style={{ margin: '5px' }} >
                    <div className='chatGroupTitle'>
                      {privado[0].participante[0].nome}
                    </div>
                  </div>
                </div>
                <div style={{ marginRight: "10px" }}>
                  <IconButton
                    ref={anchorRef}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={() => handleOpenOpcoes()}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Popper style={{ zIndex: "1000000" }} open={openOpcoes} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleCloseOpcoes}>
                            <MenuList autoFocusItem={open} id="menu-list-grow">
                              <MenuItem onClick={() => setOpen(false)}>Voltar</MenuItem>
                              <MenuItem onClick={() => exitCp(privado[0].pessoa1_id, privado[0].pessoa2_id)}>Encerrar conversa</MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </div>
              {mensagens.length > 0
                ?
                <div className='mensagensChat'>
                  {mensagens.map((mensagem, index) =>
                    <div className={mensagem.self ? 'mensagemPessoal' : 'mensagemOutro'}>
                      <div className="chatIcon">
                        {mensagem.hasOwnProperty('foto')
                          ?
                          <Avatar alt="Imagem de perfil" src={mensagem.foto} />
                          :
                          <Avatar alt="Imagem de perfil" src={Profile} />
                        }
                      </div>
                      <div>
                        <div className={mensagem.self ? 'ballonPessoal' : 'ballonOutro'}>
                          {mensagem.self === false
                            ?
                            <div className='userNameOutro'>{mensagem.nome}</div>
                            : <></>
                          }
                          <div>{mensagem.conteudo}</div>
                        </div>
                        <div className={mensagem.self ? 'timePessoal' : 'timeOutro'}>{mensagem.data_criacao}</div>
                      </div>
                    </div>
                  )}
                </div>
                :
                <div className='mensagensChat' />
              }
              <div className='mensagemInput'>
                <TextField value={mensagem} onChange={(event) => setMensagem(event.target.value)} label="Adicionar mensagem" variant="filled" fullWidth />
                <AddCircleIcon className='iconSendMsg' style={{ fontSize: 40 }} onClick={() => sendMensagem()} />
              </div>
            </div>
          </Fade>
        </Modal>
        : <></>
      }
    </div>
  );
}