import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DeleteButton from '../../components/deleteButton/deleteButton'
import Message from '../../components/message/message'
import ComentForm from '../../components/postComentForm/comentForm'
import Logo from '../../components/logo/logo'
import './postAndComments.css'

export default function PostAndComments(){
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [post, setPost] = useState({})
    const [token, setToken] = useState(null)
    const [resMsg, setResMsg] = useState('')
    const [comments, setComments] = useState([])
	const [showMsg, setShowMsg] = useState(false)
	const [isAnError, setIsAnError] = useState(false)
    const q = searchParams.get('q')
    const API_URL = "http://localhost:8000"

    function voltar(){
        navigate(-1)
    }

    useEffect(()=>{
        hanldeGetPostById()
        handleShowMessageToUser()
        setToken(Cookies.get('token'))
    },[])

    function hanldeGetPostById(){
        const URL = `${API_URL}/post/${q}`
        fetch(URL)
        .then((res)=>res.json())
        .then((json)=>{
            setPost(json.post);
            setComments(json.post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        })
    }

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

    return(
        <div className="OnePost container">
            <Header/>
            <Message isOpen={showMsg} isAnError={isAnError}>
				<h5>{resMsg}</h5>
			</Message>
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
            <ComentForm postId={q}/>
            <div id="comements-container">
                {
                    comments.length == 0? <p>Sem comentários</p>: comments.map(coment => {
                    return(
                        <div className="coment">
                            <div className='coment-header'>
                                <div className='coment_info'>
                                    <p className="coment-email">{coment.email}</p>
                                    <p className="coment-data">{utilHandleFormateData(coment.createdAt)}</p>
                                </div>
                                <DeleteButton endPoint={`admin/post/comment/delete/${coment.id}`}/>
                            </div>
                            <div className='coment-content-container'>
                                <p className="coment-content">{coment.content}</p>
                            </div>
                        </div>
                    )
                    })
                }
            </div>
        </div>
    )
}