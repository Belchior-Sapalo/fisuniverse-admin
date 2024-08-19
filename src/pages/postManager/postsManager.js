import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import Cookies from "js-cookie";
import React, { useEffect, useState, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { FaMessage } from 'react-icons/fa6';
import { MdAdd, MdError } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import DeleteButton from '../../components/deleteButton/deleteButton';
import { API_URL } from "../../components/globalVarables/variaveis";
import Message from "../../components/message/message";
import Modal from "../../components/modal/modal";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/submitButton/submitButton";
import './postsManager.css';

export default function PostsManager(){
	const [postList, setPostList] = useState([])
	const [resMsg, setResMsg] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [token, setToken] = useState('')
	const [postToEdit, setPostToEdit] = useState('')
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [currentAnexo, setCurrentAnexo] = useState('')
	const [currentContent, setCurrentContent] = useState('')
	const [currentTitle, setCurrentTitle] = useState('')
	const [anexo, setAnexo] = useState('')
	const [content, setContent] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingPosts, setIsLoadingPosts] = useState(false)
	const [showMsg, setShowMsg] = useState(false)
	const [isAnError, setIsAnError] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const maxLength = 350;
	const [havePostsInDatabase, setHavePostsInDatabase] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	const handleGetAllPosts = useCallback(() => {
		setIsLoadingPosts(true)
		const URL = `${API_URL}/posts`
		fetch(URL)
		.then((res)=>{
			if(res.status === 500){
                throw new Error('Falha no servidor')
            }

            return res.json()
		}).then((json)=>{
			if(json.founded){
				setHavePostsInDatabase(true)
				setPostList(json.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
				setIsLoadingPosts(false)
			}else{
				setHavePostsInDatabase(false)
				setIsLoadingPosts(false)
			}
		}).catch(error => {
			navigate('/error')
		})
	}, [navigate])

    useEffect(()=>{
		handleShowMessageToUser()
		setToken(Cookies.get('token'))
		handleGetAllPosts()
	}, [handleGetAllPosts])

	function handleShowMessageToUser(){
		if(localStorage.getItem("reloaded") === 'true'){
			if(localStorage.getItem("isAnError") === 'true'){
				setIsAnError(true)
			}else{
				setIsAnError(false)
			}
			setResMsg(localStorage.getItem("lastMsg"))
			setShowMsg(true)
            setTimeout(()=>{setShowMsg(false); setResMsg('')}, 3000)
			localStorage.removeItem("reloaded")
			localStorage.removeItem('lastMsg')
			localStorage.removeItem("isAnError")
		}
	}

    function handleSeePostComments(postId){
		navigate(`/post/comments?q=${postId}`)
	}

	function utilHandleGetPostIdToEditAndLastValues(post){
		setIsOpen(true)
		setPostToEdit(post.id)
		setTitle(post.title)
		setCurrentTitle(post.title)
		setAnexo(post.anexo)
		setCurrentAnexo(post.anexo)
		setContent(post.content)
		setCurrentContent(post.content)
	}

    function utilThereWasNoChange(){
		return (title === currentTitle) && (anexo === currentAnexo) && (content === currentContent)
	}

    function handleUpdatePost(e){
		if(!utilThereWasNoChange()){
			e.preventDefault()
			setIsLoading(true)
			const URL = `${API_URL}/admin/post/update/${postToEdit}`

			const dados = {
				'title': title,
				'content': content,
				'anexo' : anexo
			}

			fetch(URL,{
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
			}).then((json)=>{
				if(json.updated){
					setIsOpen(false)
					localStorage.setItem('lastMsg', json.msg)
					utilHanldeReloadWindow(false)
					utilHandleClearUpdateStates()
				}else{
					setIsLoading(false)
					setIsAnError(true)
					setResMsg(json.msg)
				}
			}).catch(error => {
				navigate('/error')
			})
		}else{
			setResMsg('Precisa atualizar algo')
		}
    }

	function utilHandleClearUpdateStates(){
		setTitle("")
		setContent("")
		setAnexo('')
		setResMsg('')
	}

	function utilHandleFormateData(data){
		const createdAtFormated = formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
		return createdAtFormated;
	}

	const CreatePostButton = ()=>{
		const [isOpenFormCreatePost, setIsOpenFormCreatePost] = useState(false)
		const [title, setTitle] = useState('')
		const [content, setContent] = useState('')
		const [anexo, setAnexo] = useState('')
		const [isLoading, setIsLoading] = useState(false)
	
		function handleCreatePost(e){
			setIsLoading(true)
			e.preventDefault()
			const token = Cookies.get('token')
			const adminId = Cookies.get('adminId')
			const URL = `${API_URL}/admin/post/create/${adminId}`
	
			const dados = {
				'title': title,
				'content': content,
				'anexo' : anexo
			}
			fetch(URL, {
				method: 'POST',
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
			}).then((json)=>{
				if(json.created){
					utilHanldeReloadWindow(false)
					setIsLoading(false)
					localStorage.setItem('lastMsg', json.msg)
				}else{
					setIsAnError(true)
					setResMsg(json.msg)
					setIsLoading(false)
				}
			}).catch(error => {
				navigate('/error')
			})
		}
	
		return(
			<div>
				<button onClick={()=>setIsOpenFormCreatePost(true)} className="btn create-post-btn" ><MdAdd size='20'/></button>
				<Modal isOpen={isOpenFormCreatePost} setIsOpen={()=>setIsOpenFormCreatePost(!isOpenFormCreatePost)}>
					<form onSubmit={(e)=>handleCreatePost(e)} className="form-posts-page">
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do post" className="form-posts-page-input"/>
						<textarea required onChange={(e)=>setContent(e.target.value)} value={content} type="text" placeholder="Conteúdo" className="form-posts-page-input"/>
						<input onChange={(e)=>setAnexo(e.target.value)} value={anexo} className="form-posts-page-input" type="text" placeholder="Anexo"/>
						<Button  isLoading={isLoading} value='Publicar'/>
					</form>
				</Modal>
			</div>
		)
	}

	function utilHanldeReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}

    return(
        <section id="admin-section-posts">
			<Navbar CreatePostButton={CreatePostButton()}/>

            <div id="posts-container" className="container">
				<Message isOpen={showMsg} isAnError={isAnError}>
					<h5>{resMsg}</h5>
				</Message>	
				{
					havePostsInDatabase ? postList.map(post=>{
						return(
							<div className="post">
								<div className="post-header">
									<h3 className="post-title">
										{post.title}
									</h3>

									<div className="post-admin-options" style={{display: token? 'flex': 'none'}}>
										<div className="d-flex gap-2">
											<button className="btn btn-dark post-admin-options-btn" onClick={()=>utilHandleGetPostIdToEditAndLastValues(post)}><FaEdit/></button>
											{<DeleteButton endPoint={`admin/post/delete/${post.id}`}/>}
										</div>
									</div>
								</div>
								
								<h5 className="post-autor">
									{post.autor}
								</h5>
								<p className="post-data-create">
									{utilHandleFormateData(post.createdAt)}
								</p>
								<div className="post-content">
									{ isExpanded ?  post.content : `${post.content.substring(0, maxLength)}...`}
									{
                                        post.anexo && <a className="anexo" href={post.anexo} target="_blank" rel="noreferrer">{post.anexo}</a>
							       }
								</div>
								<div id="post-more-options">
									<button className="btn" onClick={toggleExpand}>{isExpanded ? 'Ver menos' : 'Ver mais'}</button>
									<button className="btn ver-coments" onClick={()=>handleSeePostComments(post.id)}><FaMessage color="rgba(0, 0, 0, 0.5)"/> Comentários</button>
								</div>
							</div>
						)
					}): isLoadingPosts ? <h4 className="p-4 text-center">Buscando publicação...</h4> : <h5 className="p-4 text-center">Faça sua primeira publicação!</h5>
				}
			</div>
        <Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
            <form className="form-posts-page" onSubmit={(e)=>handleUpdatePost(e)}>
				<input onChange={(e)=>setTitle(e.target.value)} value={title} className="form-posts-page-input" type="text" placeholder="Título"/>
				<textarea onChange={(e)=>setContent(e.target.value)} value={content} className="form-posts-page-input" type="text" placeholder="Publicação"/>
				<input onChange={(e)=>setAnexo(e.target.value)} value={anexo} className="form-posts-page-input" type="text" placeholder="Anexo"/>
				<Button thereWasNoChange={utilThereWasNoChange()} isLoading={isLoading} value="Editar"/>
            </form>
			{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
        </Modal>
        </section>
    )
}
