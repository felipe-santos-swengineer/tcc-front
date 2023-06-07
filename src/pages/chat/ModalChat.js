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
  const [destinatario, setDestinatario] = React.useState([]);

  const handleClose = () => {
    setOpen(false);
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
          setGrupo(resJSON)
        }

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
    getMensagens();
    const interval = setInterval(() => {
      getMensagens();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {type === 'grupo' && grupo.length > 0
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
              <div className='chatHeader'>
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