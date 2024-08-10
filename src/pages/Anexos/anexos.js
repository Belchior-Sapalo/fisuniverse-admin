import React from "react";
import '../Anexos/anexos.css'
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
import cover1 from '../../assets/images/back6.jpg'
import Card from "../../components/card/card";

export default function AnexosManager(){
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

    // useEffect(()=>{
	// 	const URL = `${API_URL}/verPosts`
	// 	fetch(URL)
	// 	.then((res)=>res.json())
	// 	.then((json)=>{
	// 		if(json.status != 404){
	// 			setPosts(json.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
	// 			setHavePostsInDatabase(true)
	// 		}else{
	// 			setHavePostsInDatabase(false)
	// 		}
	// 	})
    //     setToken(Cookies.get('token'))
	// }, [])

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
    const [year, setYear] = useState("")
    const [editora, setEditora] = useState("")
		const [description, setDescription] = useState('')
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
					<form onSubmit={(e)=>publicar(e)} className="form-add-post-anexos">
            			<h5>Poste um novo livro</h5>
						<input required onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor" className="form-add-post-input"/>
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do livro" className="form-add-post-input"/>
						<input required onChange={(e)=>setYear(e.target.value)} value={year} type="text" placeholder="Ano de publicação" className="form-add-post-input"/>
						<input required onChange={(e)=>setEditora(e.target.value)} value={editora} type="text" placeholder="Editora" className="form-add-post-input"/>
						<textarea required onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder="Descrição" className="form-add-post-input"/>
						<input type="file"/>
						<p>Obs: A capa deve ter no máximo 5MB (jpeg, png)</p>
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
            <div id="posts-container" className="container row">
				<Card className="col-sm-12 col-md-6 col-lg-4" title="Fisica do universo" autor="Vicelino Chilua" ano="2024" editora="Viveclino" description="Ad voluptatum qui dolorum aspernatur quisquam eligendi sit. Mollitia consequatur" img={cover1}/>
				<Card className="col-sm-12 col-md-6 col-lg-6" title="Fisica do universo" autor="Vicelino Chilua" ano="2024" editora="Viveclino" description="Ad voluptatum qui dolorum aspernatur quisquam eligendi sit. Mollitia consequatur" img={cover1}/>
				<Card className="col-sm-12 col-md-6 col-lg-6" title="Fisica do universo" autor="Vicelino Chilua" ano="2024" editora="Viveclino" description="Ad voluptatum qui dolorum aspernatur quisquam eligendi sit. Mollitia consequatur" img={cover1}/>
				<Card className="col-sm-12 col-md-6 col-lg-6" title="Fisica do universo" autor="Vicelino Chilua" ano="2024" editora="Viveclino" description="Ad voluptatum qui dolorum aspernatur quisquam eligendi sit. Mollitia consequatur" img={cover1}/>
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
