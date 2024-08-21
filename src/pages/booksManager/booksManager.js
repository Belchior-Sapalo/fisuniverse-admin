import Cookies from "js-cookie";
import React, { useEffect, useState, useCallback } from "react";
import { FaImage } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Card from "../../components/card/card";
import { API_URL } from "../../components/globalVarables/variaveis";
import Message from "../../components/message/message";
import Modal from "../../components/modal/modal";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/submitButton/submitButton";
import './booksManager.css';
import ScrollTop from "../../components/scrollTop/scrollTop";

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
	const [currentAutor, setCurrentAutor] = useState('')
	const [currentTitle, setCurrentTitle] = useState('')
	const [currentYear, setCurrentYear] = useState("")
	const [currentEditora, setCurrentEditora] = useState("")
	const [currentDescription, setCurrentDescription] = useState('')
	const [currentLink, setCurrentLink] = useState("")
	const [selectedFile, setSelectedFile] = useState(null)
	const [showMsg, setShowMsg] = useState(false)
	const [havebooksInDatabase, setHavebooksInDatabase] = useState(false)
	const [isAnErrorMessage, setIsAnErrorMessage] = useState(false)
	const [booksList, setBooksList] = useState([])
	const [isAnError, setIsAnError] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingBooks, setIsLoadingBooks] = useState(false)
	const navigate = useNavigate()
	const maxLength = 250;

	const handleGetAllBooks = useCallback(() => {
		setIsLoadingBooks(true)
		const URL = `${API_URL}/books`
		fetch(URL)
		.then((res)=>{
			if(res.status === 500){
                throw new Error('Falha no servidor')
            }

            return res.json()
		})
		.then((json)=>{
			if(json.founded){
				setBooksList(json.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
				setHavebooksInDatabase(true)
				setIsLoadingBooks(false)
			}else{
				setHavebooksInDatabase(false)
				setIsLoadingBooks(false)
			}
		}).catch(error => {
			navigate('/error')
		})
	}, [navigate])

	useEffect(()=>{
		handleShowMessageToUser()
		handleGetAllBooks()
		setToken(Cookies.get('token'))
	}, [handleGetAllBooks])

	function handleShowMessageToUser(){
		if(localStorage.getItem("reloaded") === 'true'){
			if(localStorage.getItem("isAnError") === 'true'){
				setIsAnError(true)
			}else{
				setIsAnError(false)
			}
			setResMsg(localStorage.getItem("lastMsg"))
			setShowMsg(true)
            setTimeout(()=>{setShowMsg(false)}, 2000)
			localStorage.removeItem("reloaded")
			localStorage.removeItem('lastMsg')
			localStorage.removeItem("isAnError")
		}
	}

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

	const UpdateBookButton = (book) => {
		return(
			<button onClick={()=>utilHandleGetIdBookToEditAndLastValues(book)} className="btn btn-primary admin-options-btn">Editar</button>
		)
	}

    function handleUpdateBook(e){
		e.preventDefault()
        if(!utilThereWasNoChange()){
		    setIsLoading(true)
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
			}).then((res)=>{
				if(res.status === 500){
					throw new Error('Falha no servidor')
				}
				return res.json()
			}).then(json => {
				if(json.updated){
					setIsLoading(false)
					handleReloadWindow(false)
					localStorage.setItem('lastMsg', json.msg)
					utilHandleClearStates()
				}else{
					handleReloadWindow(true)
				}
			}).catch(error => {
				navigate('/error')
			})
		}else{
			setIsAnErrorMessage(true)
			setResMsg('Precisa atualizar alguma informação')
		}
    }

	function utilHandleGetIdBookToEditAndLastValues(book){
		setIsOpenFormCreate(true)
		setPostToEdit(book.id)
		setAutor(book.autor)
		setCurrentAutor(book.autor)
		setTitle(book.title)
		setCurrentTitle(book.title)
		setYear(book.ano)
		setCurrentYear(book.ano)
		setEditora(book.editora)
		setCurrentEditora(book.editora)
		setDescription(book.description)
		setCurrentDescription(book.description)
		setLink(book.link)
		setCurrentLink(book.link)
	}

	function utilThereWasNoChange(){
		return (autor === currentAutor) && (title === currentTitle) && (year === currentYear) && (editora === currentEditora) && (description === currentDescription) && (link === currentLink) && (selectedFile === null)
	}

  	const CreateBookButton = ()=>{
		const [isOpenFormCreate, setIsOpenFormCreate] = useState(false)
		const [selectedFile, setSelectedFile] = useState(null)
	    const [previwUrl, setPreviwUrl] = useState(null)
		const [isAnErrorMessage, setIsAnErrorMessage] = useState(false)
		const [isLoading, setIsLoading] = useState(false)
		const maxLength = 250;

		function hanldeClearForm(){
			setAutor("")
			setTitle("")
			setYear("")
			setResMsg("")
			setDescription('')
			setEditora('')
			setSelectedFile(null)
			setPreviwUrl(null)
			URL.revokeObjectURL(previwUrl)
		}

		const handleFileChange = (e) => {
			const file = e.target.files[0]
			if(file){
			setSelectedFile(file)
			const url = URL.createObjectURL(file)
			setPreviwUrl(url)
			}
		}

		function handleCreateBook(e){
			setIsLoading(true)
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
			}).then((res)=>{
				if(res.status === 500){
					throw new Error('Falha no servidor')
				}

				return res.json()
			}).then(json => {
				if(json.created){
					setIsLoading(false)
					localStorage.setItem('lastMsg', json.msg)
					handleReloadWindow(false)
					utilHandleClearStates()
				}else{
					setIsLoading(false)
					setIsAnErrorMessage(true)
					setResMsg(json.msg)
					setTimeout(()=>{setResMsg("")}, 3000)
				}
			}).catch(error => {
				navigate('/error')
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
						{
						    previwUrl && <img src={previwUrl} alt="pré-visualização" width='150'/> 
					    }
						<div id="submit-btn-container">
							<div>
								<label id="choise-file-btn" className="btn btn-dark" for="profile-picture">
									<p>Capa do livro</p>
									<FaImage color={selectedFile ? '#04D939' : ''}/>
								</label>
								<input type="file" onChange={handleFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
							</div>
							<Button isLoading={isLoading} value="Publicar"/>
						</div>
					    <button onClick={()=>hanldeClearForm()} id="clear-form-btn" className="btn" style={{color: 'black'}}>Limpar</button>
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
		setSelectedFile(null)
		
	}

	function handleReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}

    return(
        <section id="admin-section-books">
			<ScrollTop/>
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
					}) : isLoadingBooks ? <h4 className="p-4 text-center">Buscando livros...</h4>  : <h5 className="p-4 text-center">Publique o seu primeiro livro!</h5> 
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
								<FaImage color={selectedFile ? '#04D939' : ''}/>
							</label>
							<input type="file" onChange={handleFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
						</div>
						<Button thereWasNoChange={utilThereWasNoChange()} isLoading={isLoading} value="Editar"/>
					</div>
					<p className="error-message" style={{display: isAnErrorMessage ? "block" : "none"}}>{resMsg}</p>
				</form>
			</Modal>
        </section>
    )
}
