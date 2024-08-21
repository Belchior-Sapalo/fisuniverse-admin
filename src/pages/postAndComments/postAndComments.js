import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { MdError } from "react-icons/md";
import Cookies from "js-cookie";
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeleteButton from '../../components/deleteButton/deleteButton';
import { API_URL } from "../../components/globalVarables/variaveis";
import Logo from '../../components/logo/logo';
import Message from '../../components/message/message';
import Modal from "../../components/modal/modal";
import ComentForm from '../../components/postComentForm/comentForm';
import ScrollTop from "../../components/scrollTop/scrollTop";
import './postAndComments.css';

export default function PostAndComments(){
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
	const [token, setToken] = useState('')
    const [commentId, setCommentId] = useState('')
    const [post, setPost] = useState({})
    const [resMsg, setResMsg] = useState('')
    const [comments, setComments] = useState([])
	const [showMsg, setShowMsg] = useState(false)
    const [isLoadingPost, setIsLoadingPost] = useState(false)
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [haveComments, setHaveComments] = useState(false)
	const [isAnError, setIsAnError] = useState(false)
    const q = searchParams.get('q')
	const [isOpen, setIsOpen] = useState(false)

    function voltar(){
        navigate(-1)
    }

    const hanldeGetPostById = useCallback(() => {
        setIsLoadingPost(true)
        setIsLoadingComments(true)
        const URL = `${API_URL}/post/${q}`
        fetch(URL).then((res)=>{
            if(res.status === 500){
                throw new Error('Falha no servidor')
            }

            return res.json()
        })
        .then((json)=>{
            if(json.founded){
                setPost(json.post);
                setIsLoadingPost(false)
                if(json.comments.length !== 0){
                    setComments(json.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
                    setHaveComments(true)
                    setIsLoadingComments(false)
                }else{
                    setHaveComments(false)
                    setIsLoadingComments(false)
                }
            }
        }).catch(error => {
            navigate('/error')
        })
    }, [navigate, q])

    useEffect(()=>{
		setToken(Cookies.get('token'))
        hanldeGetPostById()
        handleShowMessageToUser()
    },[hanldeGetPostById, navigate, q])

    function utilHandleFormateData(data){
		let createdAt = data;
		const createdAtFormated = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR });
		return createdAtFormated;
	}

    function handleShowMessageToUser(){
		if(localStorage.getItem("reloaded") === 'true'){
			if(localStorage.getItem("isAnError") === 'true'){
				setIsAnError(true)
			}else{
				setIsAnError(false)
			}
			setResMsg(localStorage.getItem("lastMsg"))
			setShowMsg(true)
            setTimeout(()=>{setShowMsg(false)}, 3000)
			localStorage.removeItem("reloaded")
			localStorage.removeItem('lastMsg')
			localStorage.removeItem("isAnError")
		}
	}

    function Header(){
		return(
			<nav id="header">
                <button id='back-btn' onClick={()=>voltar()}><FaArrowLeft/></button>
				<div id="logo-container">
					<Logo/>
				</div>
			</nav>
		)
	}

    function utilOpenModal(commentId){
        setCommentId(commentId)
        setIsOpen(true)
    }

    function hanldeDeleteCommentResponse(commentId){
		const URL = `${API_URL}/admin/post/comment/response/${commentId}`

		const dados = {
			'response': null
		}

		fetch(URL, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then((res)=>{
			if(res.status === 500){
				throw new Error('Falha no servidor')
			}

			return res.json()
		}).then(json => {
			if(json.updated){
				window.location.reload()
			}
		}).catch(error => {
			navigate("/error")
		})
	}

    return(
        <div className="OnePost container">
            <ScrollTop/>
            <Header/>
            <Message isOpen={showMsg} isAnError={isAnError}>
				<h5>{resMsg}</h5>
			</Message>
           { 
            isLoadingPost ? <h5>Aguarde...</h5> :
                <div>
                    <h4>{post.title}</h4>
                    <h5 className="post-autor">
                        {post.autor}
                    </h5>
                    <h5 className="post-autor">
                        {post.email}
                    </h5>
                    <div className="post-content">
                        {post.content}
                    </div>
                    {
                        post.anexo && <a className="anexo" href={post.anexo} target="_blank" rel="noreferrer">{post.anexo}</a>
		           }
                </div>
            }
            {/* <ComentForm postId={q}/> */}
            <div id="comements-container">
                {
                    haveComments ? comments.map(coment => {
                        return(
                            <div className="coment">
                                <div className='coment-header'>
                                    <div className='coment_info'>
                                        <p className="coment-email">{coment.autor}</p>
                                        <p className="coment-data">{utilHandleFormateData(coment.createdAt)}</p>
                                    </div>
                                    <DeleteButton endPoint={`admin/post/comment/delete/${coment.id}`}/>
                                </div>
                                <div className='coment-content-container'>
                                    <p className="coment-content">{coment.content}</p>
                                </div>
                                <div className="response-container">
                                    {
                                        coment.response ? 
                                        <div>
                                            <p className="admin">@Administardor</p>
                                            <p>{coment.response}</p>
                                            <button onClick={() => hanldeDeleteCommentResponse(coment.id)} className="btn btn-danger">Eliminar</button>

                                        </div> : 
                                        <div>
                                            <button onClick={() => utilOpenModal(coment.id)} className="btn btn-primary">Responder</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                        }): isLoadingComments ? <p>Buscando comentários...</p> : <p>Sem comentários</p>
                }
            </div>
            <Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
                <ComentForm commentId={commentId} token={token}/>
                {resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
            </Modal> 
        </div>
    )
}