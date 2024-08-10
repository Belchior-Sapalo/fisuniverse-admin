import React from "react";
import '../Posts/postsManager.css'
import Navbar from "../../components/navbar/navbar";
import {useState, useEffect} from 'react'
import {FaMessage} from 'react-icons/fa6'
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import Modal from "../../components/modal/modal";
import Msg from "../../components/msg/msg";
import { useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale';

export default function PostsManager(){
	const [posts, setPosts] = useState([])
	const [res, setRes] = useState('')
	const [token, setToken] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [postToEdit, setPostToEdit] = useState('')
	const navigate = useNavigate()
	const [nomeAutor, setNomeAutor] = useState('')
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [showMsg, setShowMsg] = useState(false)
	const location = useLocation()
	const nomeAdm = location.state?.nomeAdm;
	const API_URL = "http://localhost:8000"
	const [havePostsInDatabase, setHavePostsInDatabase] = useState(false);

    useEffect(()=>{
		const URL = `${API_URL}/verPosts`
		fetch(URL)
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status != 404){
				setPosts(json.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
				setHavePostsInDatabase(true)
			}else{
				setHavePostsInDatabase(false)
			}
		})
        setToken(Cookies.get('token'))
	}, [])

    function verPost(postId){
		navigate(`/post?q=${postId}`)
	}

    function deletarPost(postId){
        const URL = `${API_URL}/adm/apagar_post/${postId}`

        fetch(URL,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res)=>res.json()).then((json)=>{setRes(json.msg)})

		setIsOpen(false)
		setShowMsg(true)
    }

	function getIdPostToEditAndLastValues(postId, autor, title, content){
		setIsOpen(true)
		setPostToEdit(postId)
		setNomeAutor(autor)
		setTitle(title)
		setContent(content)
	}

    function editarPost(e){
		e.preventDefault()
        const URL = `${API_URL}/adm/atualizar_post/${postToEdit}`

				const dados = {
					'autor': nomeAutor,
					'title': title,
					'content': content
				}
				fetch(URL,{
					method: 'PUT',
					headers: {
							'Authorization': `Bearer ${token}`,
							'Content-type': 'application/json'
					},
					body: JSON.stringify(dados)
			}).then((res)=>res.json()).then((json)=>setRes(json.msg))
			setIsOpen(false)
			setShowMsg(true)
    }

	function formatarData(data){
		const createdAtFormated = formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
		return createdAtFormated;
	}

	const DoPostBtn = ()=>{
		const [formPost, setFormPost] = useState(false)
		const [autor, setAutor] = useState('')
		const [title, setTitle] = useState('')
		const [content, setContent] = useState('')
		const [res, setRes] = useState('')
		const [showMsg, setShowMsg] = useState(false)
		const [token, setToken] = useState('')
		const API_URL = "http://localhost:8000"

		useEffect(()=>{
			setToken(Cookies.get('token'))
		}, [])
	
		function publicar(e){
			e.preventDefault()
			const token = Cookies.get('token')
			const URL = `${API_URL}/adm/adicionar_post`
	
			const dados = {
				'autor': autor,
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
			}).then((res)=>res.json()).then((json)=>setRes(json.msg))
	
			setFormPost(false)
			setShowMsg(true)
		}
	
		return(
			<div>
				<button onClick={()=>setFormPost(true)} className="btn dooPost-btn" ><MdAdd size='20'/></button>
	
				<Modal isOpen={formPost} setIsOpen={()=>setFormPost(!formPost)}>
					<form onSubmit={(e)=>publicar(e)} className="form-add-post">
						<input required onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor" className="form-add-post-input"/>
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do post" className="form-add-post-input"/>
						<textarea required onChange={(e)=>setContent(e.target.value)} value={content} type="text" placeholder="Conteúdo" className="form-add-post-input"/>
						<button type="submit" className="btn btn-success add-post-btn">Publicar</button>
					</form>
				</Modal>
				
	
			<Msg isOpen={showMsg} setIsOpen={()=>{setShowMsg(!showMsg); document.location.reload()}}>
				<h4>{res}</h4>
			</Msg>
			</div>
		)
	}

    return(
        <section id="admPanel-section">
			<Navbar DoPostBtn={DoPostBtn()}/>
            <h4 style={{display: nomeAdm? 'flex': 'none', justifyContent: 'center', textTransform: "capitalize"}} className="text-center">{nomeAdm}</h4>
            <div id="posts-container" className="container">
				
			{ 
				havePostsInDatabase ? posts.map(post=>{
					return(
						<div className="post">
                            
							<div className="post-header">
                                <h3 className="post-title">
                                    {post.title}
                                </h3>

                                <div className="post-adm-options" style={{display: token? 'flex': 'none'}}>
                                    <div className="d-flex gap-2">
										<button className="btn btn-primary post-adm-options-btn" onClick={()=>getIdPostToEditAndLastValues(post.id, post.autor, post.title, post.content)}><FaEdit/></button>
										<button className="btn btn-danger post-adm-options-btn" onClick={()=>deletarPost(post.id)}><MdDelete/></button>
									</div>
                                </div>
                            </div>
                            
							<h5 className="post-autor">
								{post.autor}
							</h5>
							<p className="post-data-create">
								{formatarData(post.createdAt)}
							</p>
							<div className="post-content">
								{post.content}
							</div>
							
							<button className="btn ver-coments" onClick={()=>verPost(post.id)}><FaMessage color="rgba(0, 0, 0, 0.5)"/></button>
						</div>
					)
				}): <h5 className="p-4">Faça sua primeira publicação!</h5>
			}
		</div>
        <Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
            <form className="edit-post-form" onSubmit={(e)=>editarPost(e)}>
				<input onChange={(e)=>setNomeAutor(e.target.value)} value={nomeAutor} className="edit-post-form-input" type="text" placeholder="Nome de autor"/>
				<input onChange={(e)=>setTitle(e.target.value)} value={title} className="edit-post-form-input" type="text" placeholder="Título"/>
				<textarea onChange={(e)=>setContent(e.target.value)} value={content} className="edit-post-form-input" type="text" placeholder="Publicação"/>
				<button type="submit" className="btn btn-success">Editar</button>
            </form>
        </Modal>
		<Msg isOpen={showMsg} setIsOpen={()=>{setShowMsg(!showMsg); document.location.reload()}}>
			<h4>{res}</h4>
		</Msg>
        </section>
    )
}
