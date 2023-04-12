import React, { useState } from 'react';
import Logo from "../../components/logo/logo.jpg";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import validator from 'validator';
import Portas from "../../portas";
import { useContext } from 'react';
import StoreContext from "../../components/Store/Context";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: "url('./background/bg.jpg')",
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(14),
    height: theme.spacing(14)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const { token, setToken } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  //função que verifica se o usuario existe
  const validar_login = async () => {

    if (email.length < 1 || senha.length < 1) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (validator.isEmail(email)) {
      if (email.includes("@ufc.br") || email.includes("@alu.ufc.br")) {
        try {
          const body = { email, senha };
          const response = await fetch(Portas().serverHost + "/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            }
          );

          const resJSON = await response.json();

          if (typeof resJSON.usertoken === "undefined") {
            alert(resJSON);
            return;
          }

          setToken(resJSON.usertoken)
          window.location = "/home";

        } catch (err) {
          console.error(err.message);
        }
      }
      else {
        alert("Insira um email de dominio ufc: @ufc.br ou @alu.ufc.br")
        return;
      }

    }
    else {
      alert("Formato de email inválido")
      return;
    }

  }

  //redireciona quando já está logado
  if (token !== null) {
    window.location = "/home";
    return (<></>)
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} id="image" />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar alt="LDC Icone" className={classes.avatar} src={Logo}>
          </Avatar>
          <Typography component="h1" variant="h5">
            UFC - Talk door
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              inputProps={{ maxLength: 199 }}
              onChange={e => setEmail(e.target.value.toLowerCase())}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={senha}
              inputProps={{ maxLength: 49 }}
              onChange={e => setSenha(e.target.value)}
            />
            {/* in button if wnat join with enter type="submit"*/}
            <Button
              id="entrar"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={validar_login}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/recuperarSenha" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/cadastro" variant="body2">
                  {"Não tem conta? Cadastre-se!"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}