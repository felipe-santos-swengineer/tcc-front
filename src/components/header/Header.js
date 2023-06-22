import React, { useContext, useState } from "react";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ChatIcon from "@material-ui/icons/Chat";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import StoreContext from "../Store/Context";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';
import Logo from "../logo/logo.jpg";
import SearchIcon from '@material-ui/icons/Search';
import { TextField } from "@material-ui/core";
import "./header.css";

function getPath(){
    if(window.location.href.indexOf('search=') > -1){ //se contem pesquisa
        return decodeURI(window.location.href.substring(window.location.href.lastIndexOf("=") + 1))
    }
    else return ''
}

export default function Header() {

    const { setToken } = useContext(StoreContext);
    const [search, setSearch] = useState(getPath())

    function searchPub(){
        if(search.length === 0){
            window.location = "/"
        }
        else {
            window.location = "/home/search=" + search
        }
    }

    return (
        <div className="header_content_home">
            <div style={{ display: "flex", marginLeft: "5px", marginTop: "10px", marginBottom: "10px" }}>
                <Tooltip title="Inicio">
                    <Avatar style={{ cursor: "pointer" }} alt="Talk Door Logo" src={Logo} onClick={() => window.location = "/"} />
                </Tooltip>
                <TextField
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    style={{ marginLeft: "5px" }}
                    className="inputRounded"
                    placeholder="Pesquisar no Talk Door"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton type="submit" aria-label="search" onClick={() => searchPub()}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
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
        </div >
    );
}