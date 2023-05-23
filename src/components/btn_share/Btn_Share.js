import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SvgIcon from "@material-ui/core/SvgIcon";
import Modal from '@material-ui/core/Modal';
import { ReactComponent as Share } from './share.svg';
import { ReactComponent as Whats } from './whats.svg';
import { ReactComponent as Facebook } from './facebook.svg';
import { ReactComponent as Linkedin } from './linkedin.svg';
import portas from '../../portas';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        marginLeft: "5px",
        marginRight: "5px",
        color: "black",
        backgroundColor: "transparent",
        '&:hover': {
            backgroundColor: "transparent",
        },
    },
}))(Button);

export default function BtnCompartilhar(props) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false);


    function share(api_url) {
        window.open(api_url + portas().clientHost + "/home/" + props.id, '_blank', 'noopener,noreferrer');
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div>Compartilhar com:</div>
            <div style={{ marginTop: "10px" }}>
                <SvgIcon style={{ fontSize: "50px", cursor: "pointer", marginRight: "10px" }} onClick={() => share("https://api.whatsapp.com/send?text=")}>
                    <Whats />
                </SvgIcon>
                <SvgIcon style={{ fontSize: "50px", cursor: "pointer", marginRight: "10px" }} onClick={() => share("https://www.facebook.com/sharer/sharer.php?u=")}>
                    <Facebook />
                </SvgIcon>
                <SvgIcon style={{ fontSize: "50px", cursor: "pointer" }} onClick={() => share("https://www.linkedin.com/shareArticle?mini=true&url=")}>
                    <Linkedin />
                </SvgIcon>
            </div>
            <div style={{ marginTop: "10px" }}>Ou via link direto:</div>
            <div>{portas().clientHost + "/home/" + props.id}</div>

        </div>
    );

    return (
        <div>
            {open
                ?
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
                :
                <></>
            }
            <ColorButton
                onClick={() => setOpen(true)}
                color="primary"
                startIcon={<SvgIcon style={{ fontSize: "20px", color: "#405965" }}>
                    <Share />
                </SvgIcon>}>
                Compartilhar
            </ColorButton>
        </div>
    )
}