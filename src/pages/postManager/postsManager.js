import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaMessage } from 'react-icons/fa6';
import { MdAdd, MdError } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteButton from '../../components/deleteButton/deleteButton'
import Message from "../../components/message/message";
import Modal from "../../components/modal/modal";
import Navbar from "../../components/navbar/navbar";
import './postsManager.css';
import Button from "../../components/submitButton/submitButton";

export default function PostsManager(){
	const [postList, setPostList] = useState([])
	const [resMsg, setResMsg] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [token, setToken] = useState('')
	const [postToEdit, setPostToEdit] = useState('')
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [anexo, setAnexo] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [content, setContent] = useState('')
	const [showMsg, setShowMsg] = useState(false)
	const [isAnError, setIsAnError] = useState(false)
	const location = useLocation()
	const API_URL = "http://localhost:8000"
	const [havePostsInDatabase, setHavePostsInDatabase] = useState(false);

    useEffect(()=>{
		handleShowMessageToUser()
		setToken(Cookies.get('token'))
		handleGetAllPosts()
	}, [])

	function handleGetAllPosts(){
		const URL = `${API_URL}/posts`
		fetch(URL)
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status != 404){
				setHavePostsInDatabase(true)
				setPostList(json.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
			}else{
				setHavePostsInDatabase(false)
			}
		})
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

    function handleSeePostComments(postId){
		navigate(`/post/comments?q=${postId}`)
	}

	function utilHandleGetPostIdToEditAndLastValues(post){
		setIsOpen(true)
		setPostToEdit(post.id)
		setTitle(post.title)
		setContent(post.content)
	}

	function utilHandleClearUpdateStates(){
		setTitle("")
		setContent("")
		setAnexo('')
		setResMsg('')
	}

    function handleUpdatePost(e){
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
		}).then((res)=>res.json()).then((json)=>{
			if(json.status == 200){
				setIsOpen(false)
				localStorage.setItem('lastMsg', json.msg)
				utilHanldeReloadWindow(false)
				utilHandleClearUpdateStates()
			}else{
				setIsLoading(false)
				setIsAnError(true)
				setResMsg(json.msg)
			}
		})
    }

	function utilHandleFormateData(data){
		const createdAtFormated = formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
		return createdAtFormated;
	}

	const CreatePostButton = ()=>{
		const [isOpenFormCreatePost, setIsOpenFormCreatePost] = useState(false)
		const [title, setTitle] = useState('')
		const [content, setContent] = useState('')
		const [isLoading, setIsLoading] = useState(false)
	
		function handleCreatePost(e){
			setIsLoading(true)
			e.preventDefault()
			const token = Cookies.get('token')
			const adminId = Cookies.get('adminId')
			const URL = `${API_URL}/admin/post/create/${adminId}`
	
			const dados = {
				'title': title,
				'content': content
			}
			fetch(URL, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-type': 'application/json'
				},
				body: JSON.stringify(dados)
			}).then((res)=>res.json()).then((json)=>{
				if(json.status == 201){
					utilHanldeReloadWindow(false)
					setIsLoading(false)
					localStorage.setItem('lastMsg', json.msg)
				}else{
					setIsAnError(true)
					setResMsg(json.msg)
					setIsLoading(false)
				}
			})
		}
	
		return(
			<div>
				<button onClick={()=>setIsOpenFormCreatePost(true)} className="btn dooPost-btn" ><MdAdd size='20'/></button>
				<Modal isOpen={isOpenFormCreatePost} setIsOpen={()=>setIsOpenFormCreatePost(!isOpenFormCreatePost)}>
					<form onSubmit={(e)=>handleCreatePost(e)} className="form-add-post">
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do post" className="form-add-post-input"/>
						<textarea required onChange={(e)=>setContent(e.target.value)} value={content} type="text" placeholder="Conteúdo" className="form-add-post-input"/>
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
        <section id="admPanel-section">
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

									<div className="post-adm-options" style={{display: token? 'flex': 'none'}}>
										<div className="d-flex gap-2">
											<button className="btn btn-dark post-adm-options-btn" onClick={()=>utilHandleGetPostIdToEditAndLastValues(post)}><FaEdit/></button>
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
									{post.content}
									{
										post.anexo ?
										<p style={{color: "red"}}>{post.anexo}</p>:
										<p></p>
									}
								</div>
								
								<button className="btn ver-coments" onClick={()=>handleSeePostComments(post.id)}><FaMessage color="rgba(0, 0, 0, 0.5)"/></button>
							</div>
						)
					}): <h5 className="p-4">Faça sua primeira publicação!</h5>
				}
			</div>
        <Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
            <form className="edit-post-form" onSubmit={(e)=>handleUpdatePost(e)}>
				<input onChange={(e)=>setTitle(e.target.value)} value={title} className="edit-post-form-input" type="text" placeholder="Título"/>
				<textarea onChange={(e)=>setContent(e.target.value)} value={content} className="edit-post-form-input" type="text" placeholder="Publicação"/>
				<input onChange={(e)=>setAnexo(e.target.value)} value={anexo} className="edit-post-form-input" type="text" placeholder="Anexo"/>
				<Button isLoading={isLoading} value="Editar"/>
            </form>
			{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
        </Modal>
        </section>
    )
}
