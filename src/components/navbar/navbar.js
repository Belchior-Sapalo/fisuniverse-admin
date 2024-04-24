import React, { useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {MdAdminPanelSettings, MdClose} from 'react-icons/md'
import '../navbar/navbar.css'
import Modal from "../modal/modal";
import Cookies from "js-cookie";
import { MdAdd, MdLogout } from "react-icons/md";
import Msg from "../msg/msg";

export default function Navbar(){
	const DooPostBtn = ()=>{
		const [formPost, setFormPost] = useState(false)
		const [autor, setAutor] = useState('')
		const [title, setTitle] = useState('')
		const [content, setContent] = useState('')
		const [res, setRes] = useState('')
		const [showMsg, setShowMsg] = useState(false)
		const [token, setToken] = useState('')
	
		useEffect(()=>{
			setToken(Cookies.get('token'))
		}, [])
	
		function publicar(e){
			e.preventDefault()
			const token = Cookies.get('token')
			const URL = 'http://192.168.43.58:8000/adm/adicionar_post'
	
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

	const LogoutBtn = ()=>{
		const navigate = useNavigate()
		function logout(){
			Cookies.remove('token')
			window.location.replace('/')
		}
		return(
			<button className="btn logout-btn" onClick={()=>logout()}><MdLogout size='20'/></button>
		)
	}
	return(
		<div id="header">
				<nav id="nav-bar">
					<div className="logo-container">
						<h4 className="logo-link">Vic<span style={{color: "var(--color-3)"}}>Blog</span></h4>
					</div>
					<div id="adm-actions" className="d-flex gap-2">
						{DooPostBtn()}
						{LogoutBtn()}
					</div>
				</nav>
		</div>
	)
}