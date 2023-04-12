import React, { useState, useEffect } from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import Logo from "../../components/logo/logo.jpg";
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Portas from "../../portas";
import "./verificarEmail.css";

export default function VerificarEmail() {
    const [verificando, setVerificando] = useState(true);
    const [param, setParam] = useState(window.location.toString().slice(window.location.toString().indexOf("verificarEmail/") + 15));
    const [result, setResult] = useState("Validando...")

    //função que verifica se o usuario existe
    const validar_conta = async () => {

        setVerificando(true)

        try {
            const body = { usertoken: param };
            const response = await fetch(Portas().serverHost + "/validar-email",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            const resJSON = await response.json();

            if (typeof resJSON === "string") {
                setResult(resJSON);
                if (resJSON === "Validação concluída!") {
                    window.location="/";
                }
                setVerificando(false)
                return;
            }

            setVerificando(false)

        } catch (err) {

            setVerificando(false)
            console.error(err.message);
        }

    }

    useEffect(() => {
        // Update the document title using the browser API
        validar_conta()
    }, []);

    return (
        <div className="divVerificarEmail">
            <Paper elevation={12} className="contentVerificarEmail">
                <Avatar alt="LDC Icone" src={Logo} />
                <Typography component="h1" variant="h5">
                    {result}
                </Typography>
                {verificando
                    ?
                    <>

                        <CircularProgress></CircularProgress>
                    </>
                    :
                    <></>
                }

            </Paper>
        </div >

    )
}