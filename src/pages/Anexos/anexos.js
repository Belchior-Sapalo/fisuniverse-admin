import React from "react";
import '../Anexos/anexos.css'
import Navbar from "../../components/navbar/navbar";
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd, MdEco } from "react-icons/md";
import Modal from "../../components/modal/modal";
import Msg from "../../components/msg/msg";
import { useLocation } from "react-router-dom";
import Card from "../../components/card/card";

export default function AnexosManager(){
	const [res, setRes] = useState('')
	const [token, setToken] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [postToEdit, setPostToEdit] = useState('')
	const navigate = useNavigate()
	const [formPost, setFormPost] = useState(false)
	const [autor, setAutor] = useState('')
	const [title, setTitle] = useState('')
	const [year, setYear] = useState("")
	const [editora, setEditora] = useState("")
	const [bookToDelete, setBookToDelete] = useState("")
	const [description, setDescription] = useState('')
	const [selectedFile, setSelectedFile] = useState(null)
	const [showMsg, setShowMsg] = useState(false)
	const [havebooksInDatabase, setHavebooksInDatabase] = useState(false)
	const [isAnerrorMessage, setIsAnErrorMessage] = useState(false)
	const [books, setBooks] = useState([])
	const location = useLocation()
	const maxLength = 250;
	const nomeAdm = location.state?.nomeAdm;
	const API_URL = "http://localhost:8000"

	useEffect(()=>{
		const URL = `${API_URL}/books`
		fetch(URL)
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status != 404){
				setBooks(json.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
				setHavebooksInDatabase(true)
			}else{
				setHavebooksInDatabase(false)
			}
		})
		setToken(Cookies.get('token'))
	}, [])

    function verPost(postId){
		navigate(`/post?q=${postId}`)
	}

    function deletarBook(postId){
        const URL = `${API_URL}/adm/books/${postId}`
        fetch(URL,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res)=>res.json()).then((json)=>{setRes(json.msg)})

		setIsOpen(false)
		setShowMsg(false)
    }

	function getIdBookToEditAndLastValues(id, autor, title, ano, editora, description){
		setFormPost(true)
		setPostToEdit(id)
		setAutor(autor)
		setTitle(title)
		setYear(ano)
		setEditora(editora)
		setDescription(description)
	}

	const handlerFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

    function editarBook(e){
		e.preventDefault()
        const URL = `${API_URL}/adm/books/${postToEdit}`

		const formData = new FormData()
		formData.append('autorName', autor);
		formData.append('title', title);
		formData.append('ano', year);
		formData.append('editora', editora);
		formData.append('description', description);
		formData.append('cover', selectedFile)

		fetch(URL, {
			method: 'PUT',
			body: formData,
			headers: {
				'Authorization': `Bearer ${token}`
			}
		}).then(res => res.json()).then(json => {
			if(json.status == 500 || json.status == 404 || json.status == 400 || json.status == 401){
				setIsAnErrorMessage(true)
				setRes(json.msg)
			}else{
				setShowMsg(true)
				setRes(json.msg)
				setFormPost(false)
				setIsAnErrorMessage(false)
			}
		})
    }

	const deleteBookBtn = (id) => {
		function handlerDelete(){
			setBookToDelete(id)
			setIsOpen(true)
		}
		return(
			<button onClick={() => handlerDelete()} className="btn btn-danger adm-options-btn">{<MdDelete size={20}/>}</button>
		)
	}

	const EditBookBtn = (book) => {
		return(
			<button onClick={()=>getIdBookToEditAndLastValues(book.id, book.autorName, book.title, book.ano, book.editora, book.description)}  className="btn btn-primary adm-options-btn" ><FaEdit size={20}/></button>
		)
	}

  	const DoPostBtn = ()=>{
		const [formPost, setFormPost] = useState(false)
		const [autor, setAutor] = useState('')
		const [title, setTitle] = useState('')
    	const [year, setYear] = useState("")
    	const [editora, setEditora] = useState("")
		const [description, setDescription] = useState('')
		const [selectedFile, setSelectedFile] = useState(null)
		const [res, setRes] = useState('')
		const [showMsg, setShowMsg] = useState(false)
		const [isAnerrorMessage, setIsAnErrorMessage] = useState(false)
		const [token, setToken] = useState('')
		const maxLength = 250;

		useEffect(()=>{
			setToken(Cookies.get('token'))
		}, [])

		const handlerFileChange = (e) => {
			setSelectedFile(e.target.files[0])
		}

		function publicar(e){
			e.preventDefault()
			const token = Cookies.get('token')
			const URL = `${API_URL}/adm/addBook`

			const formData = new FormData()
			formData.append('autorName', autor);
			formData.append('title', title);
			formData.append('ano', year);
			formData.append('editora', editora);
			formData.append('description', description);
			formData.append('cover', selectedFile)

			fetch(URL, {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(res => res.json()).then(json => {
				if(json.status == 500 || json.status == 400 || json.status == 401){
					setIsAnErrorMessage(true)
					setRes(json.msg)
				}else{
					setShowMsg(true)
					setRes(json.msg)
					setFormPost(false)
					setIsAnErrorMessage(false)
				}
			})
		}
		
		return(
			<div>
				<button onClick={()=>setFormPost(true)} className="btn dooPost-btn" ><MdAdd size='20'/></button>
				<Modal isOpen={formPost} setIsOpen={()=>setFormPost(!formPost)}>
					<form onSubmit={(e)=>publicar(e)} className="form-add-post-anexos" encType="multipart/form-data">
            			<h5>Poste um novo livro</h5>
						<input required onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor" className="form-add-post-input"/>
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do livro" className="form-add-post-input"/>
						<input required onChange={(e)=>setYear(e.target.value)} value={year} type="text" placeholder="Ano de publicação" className="form-add-post-input"/>
						<input required onChange={(e)=>setEditora(e.target.value)} value={editora} type="text" placeholder="Editora" className="form-add-post-input"/>
						<textarea maxLength={maxLength} required onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder={`Descrição (digite até ${maxLength} caracteres)` }className="form-add-post-input"/>
						<div className="charCounter">
							<p >{description.length}/{maxLength}</p>
						</div>
						<input type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png"/>
						<p style={{fontSize: "12px"}}>Obs: A capa deve ter no máximo 1MB (jpeg, png, jpg)</p>
						<button type="submit" className="btn btn-success add-post-btn">Publicar</button>
						<p className="error-message" style={{display: isAnerrorMessage ? "block" : "none"}}>{res}</p>
					</form>
				</Modal>
				
	
			<Msg isOpen={showMsg} setIsOpen={()=>{setShowMsg(!showMsg); document.location.reload()}}>
				<h4>{res}</h4>
			</Msg>
			</div>
		)
	}

    return(
        <section id="admPanel-section-anexos">
            <Navbar DoPostBtn={DoPostBtn()}/>
            <h4 style={{display: nomeAdm? 'flex': 'none', justifyContent: 'center', textTransform: "capitalize"}} className="text-center">{nomeAdm}</h4>
            <div id="posts-container" className="container">
				{
					havebooksInDatabase ? books.map(book => {
						return(
							<Card title={book.title} autor={book.autorName} editora={book.editora} ano={book.ano} img={book.cover} description={book.description} id={book.id} Delbtn={deleteBookBtn(book.id)} EdBtn={EditBookBtn(book)} token={token}/>
						)
					}) : <h4>Publique o seu primeiro livro!</h4> 
				}
			</div>
			<Modal isOpen={formPost} setIsOpen={()=>setFormPost(!formPost)}>
				<form onSubmit={(e)=>editarBook(e)} className="form-add-post-anexos" encType="multipart/form-data">
					<h5>Editar um novo livro</h5>
					<input required onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor" className="form-add-post-input"/>
					<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do livro" className="form-add-post-input"/>
					<input required onChange={(e)=>setYear(e.target.value)} value={year} type="text" placeholder="Ano de publicação" className="form-add-post-input"/>
					<input required onChange={(e)=>setEditora(e.target.value)} value={editora} type="text" placeholder="Editora" className="form-add-post-input"/>
					<textarea maxLength={maxLength}  required onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder={`Descrição (digite até ${maxLength} caracteres)`} className="form-add-post-input"/>
					<div className="charCounter">
						<p >{description.length}/{maxLength}</p>
					</div>
					<input type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png"/>
					<p style={{fontSize: "12px"}}>Obs: A capa deve ter no máximo 1MB (jpeg, png, jpg)</p>
					<button type="submit" className="btn btn-success add-post-btn">Editar</button>
					<p className="error-message" style={{display: isAnerrorMessage ? "block" : "none"}}>{res}</p>
				</form>
			</Modal>
			<Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
				<div id="delete-post-question-container">
					<h4>Deletar publicação?</h4>
					<button className="btn btn-success" onClick={() =>{ deletarBook(bookToDelete); document.location.reload()}}>Sim</button>
				</div>
			</Modal>
			<Msg isOpen={showMsg} setIsOpen={()=>{setShowMsg(!showMsg); document.location.reload()}}>
				<h4>{res}</h4>
			</Msg>
        </section>
    )
}
