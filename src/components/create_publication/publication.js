import React, { useState, useContext, useEffect } from 'react';
import StoreContext from "../Store/Context";
import { CKEditor } from 'ckeditor4-react';
import parse from 'html-react-parser';
import Header from "../header/Header";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Portas from "../../portas";
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import "./publication.css";

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


//Config Generator
//https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#basic

export default function Publication() {

    const [editorData, setEditorData] = useState("")
    const [noticia, setNoticia] = React.useState(false);
    const [tipo, setTipo] = useState("");
    const { token } = useContext(StoreContext);
    const update = (event) => {

        var content = event.editor.getData();
        setEditorData(content)
        return;

    }

    const publicar = async () => {
        if (token !== null) {
            try {
                const body = { usertoken: token, conteudo: editorData, noticia: noticia };
                const response = await fetch(Portas().serverHost + "/criarPublicacao", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                alert(resJSON);

                if (resJSON === "Publicação feita!") {
                    window.location = "/"
                }

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    const getUser = async () => {
        if (token !== null) {
            try {

                const body = { usertoken: token };
                const response = await fetch(Portas().serverHost + "/perfil", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                var resJSON = await response.json();
                if (resJSON.length > 0) {
                    setTipo(resJSON[0].tipo)
                }

            } catch (err) {
                console.log(err.message);
            }

        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="root">
            <Header />
            <div className="publication">
                <div className="titleCreatePublication">Criar Publicação</div>
                {tipo === 'Colaborador' ?
                    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center", justifyItems: "center", alignItems: "center", alignContent: "center" }}>
                        <div>
                            Cadastrar como notícia?
                        </div>
                        <Tooltip title="Notícias são publicações apresentadas para todos usuários da rede, amigos ou não." placement="bottom">
                            <Switch
                                checked={noticia}
                                onChange={() => setNoticia(!noticia)}
                                name="checkedA"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </Tooltip>
                    </div>
                    :
                    <></>
                }
                <CKEditor
                    data={editorData}
                    id="editor_home"
                    name="editor_home"
                    onChange={event => { update(event) }}
                    config={{
                        contentsCss: [
                            'http://cdn.ckeditor.com/4.19.1/full-all/contents.css',
                            'https://ckeditor.com/docs/ckeditor4/4.19.1/examples/assets/css/widgetstyles.css'
                        ],
                        language: 'pt-br',
                        embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
                        uiColor: '#FFFFFF',
                        toolbarCanCollapse: false,
                        toolbarGroups: [
                            { name: 'clipboard', groups: ['clipboard', 'undo'] },
                            { name: 'styles', groups: ['styles'] },
                            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                            { name: 'paragraph', groups: ['align', 'list', 'indent', 'blocks', 'bidi', 'paragraph'] },
                            { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                            { name: 'links', groups: ['links'] },
                            { name: 'insert', groups: ['insert'] },
                            { name: 'forms', groups: ['forms'] },
                            { name: 'document', groups: ['mode', 'document', 'doctools'] },
                            { name: 'others', groups: ['others'] },
                            { name: 'colors', groups: ['colors'] },
                            { name: 'about', groups: ['about'] },
                            { name: 'tools', groups: ['tools'] }
                        ],
                        extraPlugins: 'justify, font, embed, autoembed',
                        removeButtons: 'FontSize,Subscript,Superscript,Scayt,PasteText,PasteFromWord,Anchor,Strike,RemoveFormat,About,Styles'
                    }}
                    onInstanceReady={() => {

                    }}
                />
                {editorData.length > 0
                    ?
                    <div>
                        <div className="previewPublication">Pré visualização:</div>
                        <div className="publicationField">{parse(editorData)}
                            {
                                editorData.length > 0
                                    ?
                                    <div className='buttonsEndPublication'>
                                        <ColorButton variant="contained" color="primary" endIcon={<Icon>send</Icon>} onClick={() => publicar()}>
                                            Publicar
                                        </ColorButton>
                                        <ColorButton1 variant="contained" color="primary" onClick={() => window.location = "/home"}>
                                            Cancelar
                                        </ColorButton1>

                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>

    )

}
