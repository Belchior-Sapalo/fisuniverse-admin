import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import Card from "../../components/card/card";
import Message from "../../components/message/message";
import Modal from "../../components/modal/modal";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/submitButton/submitButton";
import './booksManager.css';

export default function BooksManager(){
	const [resMsg, setResMsg] = useState('')
	const [token, setToken] = useState('')
	const [isOpenFormCreate, setIsOpenFormCreate] = useState(false)
	const [postToEdit, setPostToEdit] = useState('')
	const [autor, setAutor] = useState('')
	const [title, setTitle] = useState('')
	const [year, setYear] = useState("")
	const [editora, setEditora] = useState("")
	const [description, setDescription] = useState('')
	const [link, setLink] = useState("")
	const [selectedFile, setSelectedFile] = useState(null)
	const [showMsg, setShowMsg] = useState(false)
	const [havebooksInDatabase, setHavebooksInDatabase] = useState(false)
	const [isAnErrorMessage, setIsAnErrorMessage] = useState(false)
	const [booksList, setBooksList] = useState([])
	const [isAnError, setIsAnError] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const location = useLocation()
	const maxLength = 250;
	const API_URL = "http://localhost:8000"

	useEffect(()=>{
		handleShowMessageToUser()
		handleGetAllBooks()
		setToken(Cookies.get('token'))
	}, [])

	function handleGetAllBooks(){
		const URL = `${API_URL}/books`
		fetch(URL)
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status != 404){
				setBooksList(json.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
				setHavebooksInDatabase(true)
			}else{
				setHavebooksInDatabase(false)
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

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

    function handleUpdateBook(e){
		setIsLoading(true)
		e.preventDefault()
        const URL = `${API_URL}/admin/book/update/${postToEdit}`

		const formData = new FormData()
		formData.append('autor', autor);
		formData.append('title', title);
		formData.append('ano', year);
		formData.append('editora', editora);
		formData.append('description', description);
		formData.append('link', link);
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
				setIsLoading(false)
				setResMsg(json.msg)
			}else{
				setIsLoading(false)
				handleReloadWindow(false)
				localStorage.setItem('lastMsg', json.msg)
				utilHandleClearStates()
			}
		})
    }

	const UpdateBookButton = (book) => {
		return(
			<button onClick={()=>utilHandleGetIdBookToEditAndLastValues(book)} className="btn btn-primary admin-options-btn">Editar</button>
		)
	}
	
	function utilHandleGetIdBookToEditAndLastValues(book){
		setIsOpenFormCreate(true)
		setPostToEdit(book.id)
		setAutor(book.autor)
		setTitle(book.title)
		setYear(book.ano)
		setEditora(book.editora)
		setDescription(book.description)
		setLink(book.link)
	}

  	const CreateBookButton = ()=>{
		const [isOpenFormCreate, setIsOpenFormCreate] = useState(false)
		const [selectedFile, setSelectedFile] = useState(null)
		const [isAnErrorMessage, setIsAnErrorMessage] = useState(false)
		const [isLoading, setIsLoading] = useState(false)
		const maxLength = 250;

		const handleFileChange = (e) => {
			setSelectedFile(e.target.files[0])
		}

		function handleCreateBook(e){
			e.preventDefault()
			const id = Cookies.get("adminId")
			const token = Cookies.get('token')
			const URL = `${API_URL}/admin/book/create/${id}`

			const formData = new FormData()
			formData.append('autor', autor);
			formData.append('title', title);
			formData.append('ano', year);
			formData.append('editora', editora);
			formData.append('description', description);
			formData.append('link', link);
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
					setResMsg(json.msg)
				}else{
				 	handleReloadWindow(false)
					localStorage.setItem('lastMsg', json.msg)
					utilHandleClearStates()
				}
			})
		}
		
		return(
			<div>
				<button onClick={()=>setIsOpenFormCreate(true)} className="btn create-book-btn" ><MdAdd size='20'/></button>
				<Modal isOpen={isOpenFormCreate} setIsOpen={()=>{setIsOpenFormCreate(!isOpenFormCreate); utilHandleClearStates()}}>
					<form onSubmit={(e)=>handleCreateBook(e)} className="form-books-page" encType="multipart/form-data">
            			<h5>Poste um novo livro</h5>
						<input onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor(opcional)" className="form-books-page-input"/>
						<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do livro" className="form-books-page-input"/>
						<input required onChange={(e)=>setYear(e.target.value)} value={year} type="text" placeholder="Ano de publicação" className="form-books-page-input"/>
						<input required onChange={(e)=>setEditora(e.target.value)} value={editora} type="text" placeholder="Editora" className="form-books-page-input"/>
						<textarea maxLength={maxLength} required onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder={`Descrição (digite até ${maxLength} caracteres)` }className="form-books-page-input"/>
						<div className="charCounter">
							<p >{description.length}/{maxLength}</p>
						</div>
						<input required onChange={(e)=>setLink(e.target.value)} value={link} type="text" placeholder="Link para download" className="form-books-page-input"/>
						<div id="submit-btn-container">
							<div>
								<label id="choise-file-btn" className="btn btn-dark" for="profile-picture">
									<p>Capa do livro</p>
									<FaImage/>
								</label>
								<input type="file" onChange={handleFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
							</div>
							<Button isLoading={isLoading} value="Publicar"/>
						</div>
						<p className="error-message" style={{display: isAnErrorMessage ? "block" : "none"}}>{resMsg}</p>
					</form>
				</Modal>
			</div>
		)
	}

	function utilHandleClearStates(){
		setResMsg("")
		setAutor("")
		setTitle("")
		setYear('')
		setEditora('')
		setDescription('')
		setLink('')
	}

	function handleReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}

    return(
        <section id="admin-section-books">
            <Navbar CreatePostButton={CreateBookButton()}/>
            <div id="books-container" className="container-fluid">
				<Message isOpen={showMsg} isAnError={isAnError}>
					<h5>{resMsg}</h5>
				</Message>	
				{
					havebooksInDatabase ? booksList.map(book => {
						return(
							<Card title={book.title} autor={book.autor} editora={book.editora} ano={book.ano} description={book.description} id={book.id} EdBtn={UpdateBookButton(book)} token={token}/>
						)
					}) : <h4>Publique o seu primeiro livro!</h4> 
				}
			</div>
			<Modal isOpen={isOpenFormCreate} setIsOpen={()=>{setIsOpenFormCreate(!isOpenFormCreate); utilHandleClearStates()}}>
				<form onSubmit={(e)=>handleUpdateBook(e)} className="form-books-page" encType="multipart/form-data">
					<h5>Editar livro</h5>
					<input required onChange={(e)=>setAutor(e.target.value)} value={autor} type="text" placeholder="Nome do autor" className="form-books-page-input"/>
					<input required onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="Título do livro" className="form-books-page-input"/>
					<input required onChange={(e)=>setYear(e.target.value)} value={year} type="text" placeholder="Ano de publicação" className="form-books-page-input"/>
					<input required onChange={(e)=>setEditora(e.target.value)} value={editora} type="text" placeholder="Editora" className="form-books-page-input"/>
					<textarea maxLength={maxLength}  required onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder={`Descrição (digite até ${maxLength} caracteres)`} className="form-books-page-input"/>
					<div className="charCounter">
						<p >{description.length}/{maxLength}</p>
					</div>
					<input required onChange={(e)=>setLink(e.target.value)} value={link} type="text" placeholder="Link para download" className="form-books-page-input"/>
					<div id="submit-btn-container">
						<div>
							<label id="choise-file-btn" className="btn btn-dark" for="profile-picture">
								<p>Capa do livro</p>
								<FaImage/>
							</label>
							<input type="file" onChange={handleFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
						</div>
						<Button isLoading={isLoading} value="Editar"/>
						<p className="error-message" style={{display: isAnErrorMessage ? "block" : "none"}}>{resMsg}</p>
					</div>
				</form>
			</Modal>
        </section>
    )
}
