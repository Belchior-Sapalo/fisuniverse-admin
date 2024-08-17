import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaBars, FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import { MdAddLink, MdError, MdClose, MdLogout, MdPostAdd } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import Modal from "../../components/modal/modal";
import Button from "../../components/submitButton/submitButton";
import '../navbar/navbar.css';
import SidebarItem from "../sidebaritem/sidebarItem";
import Logo from '../logo/logo'
const API_URL = "http://192.168.56.1:8000"

export default function Navbar({CreatePostButton}){
	const [visible, setVisible] = useState(false)
	const [adminId, setAdminId] = useState("")
	const [adminNome, setAdminNome] = useState("")
	const [adminEmail, setAdminEmail] = useState("")
	const [adminDate, setAdminDate] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [updateModalVisible, setUpdateModalVisible] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [openProfile, setOpenProfile] = useState(false)
	const [prevSenha, setPrevSenha] = useState("")
	const [newSenha, setNewSenha] = useState("")
	const [moreOptionsMsg, setMoreOptionsMsg] = useState("Eliminar")
	const [wasClikedAlready, setWasClikedAlready] = useState(false)
	const [seePass, setSeePass] = useState(false)
	const [seeNewPass, setSeeNewPass] = useState(false)
	const [resMsg, setResMsg] = useState('')
	const [token, setToken] = useState("")
	const navigate = useNavigate()

	useEffect(()=>{
		setAdminId(Cookies.get('adminId'))
		setAdminNome(Cookies.get('adminName'))
		setAdminEmail(Cookies.get('adminEmail'))
		setAdminDate(Cookies.get('adminDate'))
		setToken(Cookies.get("token"))
	}, [])

	
	const handlerFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

	function handleUpdateProfile(e){
		e.preventDefault()
		setResMsg(null)
		setIsLoading(true)
		const URL = `${API_URL}/admin/auth/update/${adminId}`

		const formData = new FormData()
		formData.append('nome', adminNome);
		formData.append('email', adminEmail);
		formData.append('photo', selectedFile)
		formData.append('senhaActual', prevSenha)
		formData.append('senhaNova', newSenha)

		fetch(URL, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		})
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status == 200){
				Cookies.set('adminName', adminNome)
				Cookies.set('adminEmail', adminEmail)
				localStorage.setItem('lastMsg', json.msg)
				handleReloadWindow(false)
			}else{
				setIsLoading(false)
				setResMsg(json.msg)
				setTimeout(()=>{setResMsg("")}, 5000)
			}
		})
	}

	function handlerDeleteProfile(){
		if(wasClikedAlready){
			setIsLoading(true)
			setMoreOptionsMsg("Eliminando...")
			const URL = `${API_URL}/admin/auth/delete/${adminId}`

			fetch(URL, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then((res)=>res.json())
			.then((json)=>{
				if(json.status == 200){
					utilDeleteAllCookies()
					setIsLoading(false)
					window.location.replace('/')
				}else{
					setIsLoading(false)
					setResMsg(json.msg)
				}
			})
		}else{
			setWasClikedAlready(true)
			setMoreOptionsMsg("Certeza?")
			setTimeout(()=>{setWasClikedAlready(false); setMoreOptionsMsg("Eliminar")}, 4000)
		}
	}

	function utilDeleteAllCookies(){
		Cookies.remove('token')
		Cookies.remove('adminName')
		Cookies.remove("adminEmail")
		Cookies.remove("adminDate")
		Cookies.remove('adminId')
	}

	const LogoutButton = ()=>{
		function handleLogoutAdmin(){
			Cookies.remove('token')
			window.location.replace('/')
		}
		return(
			<button className="btn btn-dark" onClick={()=>handleLogoutAdmin()}>Terminar sessão</button>
		)
	}

	function CloseMenu(){
		setVisible(false)
	}

	function formatarData(createdAt){
		const date = new Date(createdAt)
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()

		return `${day}-${month}-${year}`
	}

	function closeModalUpdate(){
		setUpdateModalVisible(false)
		setNewSenha("")
		setPrevSenha("")
		setWasClikedAlready(false)
		setMoreOptionsMsg("Eliminar")
		setResMsg('')
		setSeeNewPass(false)
		setSeePass(false)
		setSelectedFile(null)
	}

	function utilHandleCloseProfile(){
		setOpenProfile(false)
		setWasClikedAlready(false)
		setMoreOptionsMsg("Eliminar perfil")
		setIsLoading(false)
		setResMsg('')
	}

	function handleReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}

	return(
		<div id="header">
				<nav id="nav-bar">
					<div id={visible ? "sidebar-visible": "sidebar-invisible"} >
						<NavLink
							onClick={()=>CloseMenu()} 
							to="/admin/posts" 
							className="sidebar-link"
							style={({isActive}) => ({
								color: isActive ? "rgb(251, 94, 94)": "whitesmoke"
							})}
						>
							<SidebarItem title="Publicações"/>
						</NavLink>

						<NavLink 
							onClick={()=>CloseMenu()} 
							to="/admin/books" 
							className="sidebar-link"
							style={({isActive}) => ({
								color: isActive ? "rgb(251, 94, 94)": "whitesmoke"
							})}
						>
							<SidebarItem title="Livros"/>
						</NavLink>

					</div>
					<div className="logo-container-and-btn-toggle">
						<div id="toggle-sidebar-container">
							{
								visible ?
								<MdClose size={25} color="red" id="toggleSidebarBtn" onClick={()=> setVisible(prevState => !prevState)}/> :
								<FaBars color="red" id="toggleSidebarBtn" onClick={()=> setVisible(prevState => !prevState)}/>
							}
						</div>
						<Logo/>
					</div>
					<div id="adm-actions" className="d-flex gap-2">
						{CreatePostButton}
					</div>
					<div id="go-to-profile-container">
						<img onClick={() => setOpenProfile(prev => !prev)} id="go-to-profile-btn" style={{width: "45px", height: '45px'}} src={`${API_URL}/admin/get-picture/${adminId}`}>
						</img>
					</div>
					<Modal isOpen={openProfile} setIsOpen={()=>{utilHandleCloseProfile()}}>
						<div id="profile-container">
							<img onClick={() => setOpenProfile(prev => !prev)} id="profile-photo" src={`${API_URL}/admin/get-picture/${adminId}`}>
							</img>
							{LogoutButton()}
							<div id="profile-more-info">
								<h4>Nome: {adminNome}</h4>
								<h4>Email: {adminEmail}</h4>
								<h4>Criada em: {formatarData(adminDate)}</h4>
							</div>

							<div id="more-options">
								<button onClick={()=>{
									setOpenProfile(false); setUpdateModalVisible(true)
								}} className="btn btn-success">Editar</button>

								<button disabled={isLoading} onClick={()=>handlerDeleteProfile()} className="btn btn-danger">{moreOptionsMsg}</button>
							</div>

							{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
						</div>
					</Modal>
					<Modal isOpen={updateModalVisible} setIsOpen={()=>{closeModalUpdate()}}>
						<form 
							id="update-profile-form" 
							onSubmit={(e)=>handleUpdateProfile(e)} 
						>
							<h4>Atualizar conta administrativa</h4>
							
							<input 
								type="text" 
								placeholder="Nome" 
								onChange={(e)=>setAdminNome(e.target.value)} 
								value={adminNome} 
								className="adm-input-update"
							/>

							<input 
								type="email" 
								placeholder="Email" 
								onChange={(e)=>setAdminEmail(e.target.value)} 
								value={adminEmail} 
								className="adm-input-update"
							/>

							<div className="pass-input-container">
								<input 
									type={seePass ? "text" : "password"} 
									placeholder="Senha actual"
									onChange={(e)=>setPrevSenha(e.target.value)} 
									value={prevSenha} 
									className="adm-input-update"
									id="prev"
								/>
								<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn">
									{
										seePass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/> 
									}
								</button>
							</div>

							<div className="pass-input-container">
								<input 
									type={seeNewPass ? "text" : "password"} 
									placeholder="Nova senha"
									onChange={(e)=>setNewSenha(e.target.value)} 
									value={newSenha} 
									className="adm-input-update"
									id="new"
								/>
								<button type="button" onClick={() => setSeeNewPass(prev => !prev)} className="btn">
									{
										seeNewPass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/> 
									}
								</button>
							</div>
							<div id="submit-btn-container">
								<div>
									<label id="choise-file-btn" className="btn btn-dark" for="profile-picture">
										<p>Foto de perfil</p>
										<FaUserCircle/>
									</label>
									<input type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
								</div>
								<Button isLoading={isLoading} value="Atualizar"/>
							</div>
							{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/>{resMsg}</p>}
						</form>
					</Modal>
				</nav>
		</div>
	)
}