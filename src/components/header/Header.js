import React, { useContext } from "react";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ChatIcon from "@material-ui/icons/Chat";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import StoreContext from "../Store/Context";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Logo from "../logo/logo.jpg";
import { TextField } from "@material-ui/core";
import "./header.css";


export default function Header() {

    const { setToken } = useContext(StoreContext);

    return (
        <div className="header_content_home">
            <div style={{ display: "flex", marginLeft: "5px", marginTop: "10px", marginBottom: "10px" }}>
                <Tooltip title="Inicio">
                    <Avatar style={{ cursor: "pointer" }} alt="Talk Door Logo" src={Logo} onClick={() => window.location = "/"} />
                </Tooltip>
                <TextField
                    style={{ marginLeft: "5px" }}
                    className="inputRounded"
                    placeholder="Pesquisar no Talk Door"
                    variant="outlined"
                    size="small"
                />
            </div>
            <div style={{ display: "flex" }}>
                <Tooltip title="Perfil">
                    <div className="div_icon_header_home" onClick={() => window.location = "/meuPerfil"}>
                        <PersonIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Publicar">
                    <div className="div_icon_header_home" onClick={() => window.location = "/criarPublicacao"}>
                        <AddBoxIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Chat">
                    <div className="div_icon_header_home" onClick={() => window.location = "/chat"}>
                        <ChatIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Amigos">
                    <div className="div_icon_header_home" onClick={() => window.location = "/amigos"}>
                        <AccountBoxIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Sair">
                    <div className="div_icon_header_home">
                        <ExitToAppIcon onClick={() => setToken(null)} className="icon_header_home" />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}