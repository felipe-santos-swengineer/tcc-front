import React, { useContext } from "react";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ChatIcon from "@material-ui/icons/Chat";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import StoreContext from "../Store/Context";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import "./header.css";

export default function Header() {

    const { setToken } = useContext(StoreContext);

    return (
        <div className="header_content_home">
            <Tooltip title="Inicio">
            <div className="title_header_home" onClick={() => window.location = "/home"}>Talk Door</div>
            </Tooltip>
            <div style={{ display: "flex" }}>
                <Tooltip title="Consulta">
                    <div className="div_icon_header_home" >
                        <SearchIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Publicar">
                    <div className="div_icon_header_home" onClick={() => window.location = "/criarPublicacao"}>
                        <AddBoxIcon className="icon_header_home" />
                    </div>
                </Tooltip>
                <Tooltip title="Chat">
                    <div className="div_icon_header_home">
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