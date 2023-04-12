import React, { useState } from 'react';
import Logo from "../../components/logo/logo.jpg";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import validator from 'validator';
import Portas from "../../portas";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import "./cadastro.css";

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

export default function Cadastro() {

  const classes = useStyles();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sexo, setSexo] = React.useState('Masculino');
  const [telefone, setTelefone] = React.useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChange = (event) => {
    setSexo(event.target.value);
  };


  //função que verifica se o usuario existe
  const validar_cadastro = async () => {

    var day = selectedDate.getDate();
    var month = selectedDate.getMonth() + 1;
    var year = selectedDate.getFullYear();

    if (day < 10) {
      day = "0" + day;
    }

    if (month < 10) {
      month = "0" + month;
    }

    var data = day + "/" + month + "/" + year;

    if (nome.length < 1 || email.length < 1 || senha.length < 1 || senha2.length < 1) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    if (validator.isEmail(email)) {
      if (email.includes("@ufc.br") || email.includes("@alu.ufc.br")) {
        if (senha === senha2) {
          try {
            const body = { nome, email, senha, telefone, data, sexo };
            const response = await fetch(Portas().serverHost + "/usuarios",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
              }
            );

            const resJSON = await response.json();
            alert(resJSON);
            if(resJSON === "Usuário inserido"){
              window.location="/"
            }
            return;

          } catch (err) {
            console.error(err.message);
          }
        }
        else {
          alert("As senhas informadas não são iguais")
          return;
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
          <Typography component="h1" variant="h6">
            Cadastro de Usuário
          </Typography>
          <div className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              value={nome}
              inputProps={{ maxLength: 199 }}
              onChange={e => setNome(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", justifyItems: "center", alignItems: "center" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="outlined"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Data de Nascimento"
                  helperText={null}
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <FormControl variant="outlined" style={{ width: "50%", marginLeft: "5px" }}>
                <InputLabel id="demo-simple-select-outlined-label">Sexo</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={sexo}
                  onChange={handleChange}
                  label="G�nero"
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Outros / Prefiro n�o dizer">Outros / Prefiro n�o dizer</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="telefone"
              label="Telefone"
              name="telefone"
              value={telefone}
              inputProps={{ maxLength: 199 }}
              onChange={e => setTelefone(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              helperText="Somente email institucional UFC"
              name="email"
              value={email}
              inputProps={{ maxLength: 199 }}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              helperText="Minimo de 6 caracteres alfanumericos"
              type="password"
              id="password"
              value={senha}
              inputProps={{ maxLength: 49 }}
              onChange={e => setSenha(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Insira a senha novamente"
              type="password"
              id="password2"
              value={senha2}
              inputProps={{ maxLength: 49 }}
              onChange={e => setSenha2(e.target.value)}
            />
            {/* in button if wnat join with enter type="submit"*/}
            <Button
              id="entrar"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => validar_cadastro()}
            >
              Entrar
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}