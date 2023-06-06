import React, { useContext, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar';
import Portas from '../../portas';
import Button from '@material-ui/core/Button';
import StoreContext from "../../components/Store/Context";
import Group from "../../components/img/group.png";
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
    width: 360
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

export default function TransitionsModal({ open, setOpen, type, grupo, privado }) {

  const classes = useStyles();
  const { token } = useContext(StoreContext);
  const [titulo, setTitulo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [amigos, setAmigos] = React.useState([]);
  const [checked, setChecked] = React.useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const getMensagens = async () => {
    if (token !== null) {
      try {
        if (titulo.trim().length < 5) {
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
    getMensagens();
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
            <div className='chatHeader'>
              <div className="chatItem">
                <div className="chatIcon">
                  <Avatar alt="Imagem de perfil" src={Group} />
                </div>
              </div>
              <div style={{ margin: '5px' }} >
                <div className='chatGroupTitle'>
                  {'Titulo'}
                </div>
                <div className='chatGroupParticipantes'>
                  {'Criado por'}
                </div>
                <div className='chatLastMsg'>
                  Ultima atualização: 
                  01/01/2023 - 10:00
                </div>
              </div>
            </div>
            <div className='mensagensChat'>
              <div className='mensagemOutro'>
                <div className="chatIcon">
                  <Avatar alt="Imagem de perfil" src={Group} />
                </div>
                <div>
                  <div className='ballonOutro'>
                    Oi bom dia
                  </div>
                  <div className='timeOutro'>01/01/2023 - 10:00</div>
                </div>
              </div>
              <div className='mensagemPessoal'>
                <div className="chatIcon">
                  <Avatar alt="Imagem de perfil" src={Group} />
                </div>
                <div>
                  <div className='ballonPessoal'>
                    Olá, tudo bem?
                  </div>
                  <div className='timePessoal'>01/01/2023 - 10:00</div>
                </div>
              </div>
              <div className='mensagemPessoal'>
                <div className="chatIcon">
                  <Avatar alt="Imagem de perfil" src={Group} />
                </div>
                <div>
                  <div className='ballonPessoal'>
                    Estou otimo!
                  </div>
                  <div className='timePessoal'>01/01/2023 - 10:00</div>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}