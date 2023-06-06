import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import "./mensagens.css"

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function App({ setOpen, id }) {

    const [modalStyle] = React.useState(getModalStyle);

    useEffect(() => {
        //getInfo();
    }, [id]);

    return (
        <Paper style={{maxWidth: "1024px", backgroundColor: "red"}}>
            <div className="contentMensagens">
                <div className="mensagensDiv">
                    EFVSDFVDVF
                </div>
            </div>
        </Paper>
    );
}
