import React, { useEffect } from "react";
import {useState} from 'react'
import '../navbar/navbar.css'
import Cookies from "js-cookie";
import { MdError, MdLogout, MdPostAdd, MdAddLink } from "react-icons/md";
import {FaBars} from 'react-icons/fa'
import SidebarItem from "../sidebaritem/sidebarItem";
import {Link, useNavigate} from 'react-router-dom'
import {FaEye} from "react-icons/fa"
import Modal from "../../components/modal/modal"
import Btn from "../../components/btn/Btn"
const API_URL = "http://192.168.56.1:8000"

export default function Navbar({DoPostBtn}){
	const [visible, setVisible] = useState(false)
	const [adminId, setAdminId] = useState("")
	const [adminNome, setAdminNome] = useState("")
	const [adminEmail, setAdminEmail] = useState("")
	const [adminDate, setAdminDate] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [updateRes, setUpdateRes] = useState(null)
	const [updateModalVisible, setUpdateModalVisible] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [openProfile, setOpenProfile] = useState(false)
	const [prevSenha, setPrevSenha] = useState("")
	const [newSenha, setNewSenha] = useState("")
	const [moreOptionsMsg, setMoreOptionsMsg] = useState("Eliminar perfil")
	const [wasClikedAlready, setWasClikedAlready] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [seePass, setSeePass] = useState(false)
	const [seeNewPass, setSeeNewPass] = useState(false)
	const [deleteRes, setDeleteRes] = useState(null)

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

	function handlerUpdate(e){
		e.preventDefault()
		setUpdateRes(null)
		setIsLoading(true)
		const URL = `${API_URL}/adm/atualizar_perfil/${adminId}`

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
				reload(false)
			}else{
				setIsLoading(false)
				setUpdateRes(json)
				setTimeout(()=>{setUpdateRes("")}, 5000)
			}
		})
	}

	function handlerDeleteProfile(){
		if(wasClikedAlready){
			setIsDeleting(true)
			setMoreOptionsMsg("Eliminando perfil...")
			const URL = `${API_URL}/adm/eliminar_perfil/${adminId}`

			fetch(URL, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then((res)=>res.json())
			.then((json)=>{
				if(json.status == 200){
					deleteAllCookies()
					setIsDeleting(false)
					window.location.replace('/')
				}else{
					setIsLoading(false)
					setUpdateRes(json)
					setIsDeleting(false)
				}
			})
		}else{
			setWasClikedAlready(true)
			setMoreOptionsMsg("Certeza?")
			setTimeout(()=>{setWasClikedAlready(false); setMoreOptionsMsg("Eliminar perfil")}, 4000)
		}
	}

	function deleteAllCookies(){
		Cookies.remove('token')
		Cookies.remove('adminName')
		Cookies.remove("adminEmail")
		Cookies.remove("adminDate")
		Cookies.remove('adminId')
	}

	const LogoutBtn = ()=>{
		function logout(){
			Cookies.remove('token')
			window.location.replace('/')
		}
		return(
			<button className="btn logout-btn" onClick={()=>logout()}><MdLogout size='20'/></button>
		)
	}
	function OpenMenu(){
		setVisible(true)
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
		setMoreOptionsMsg("Eliminar perfil")
		setUpdateRes("")
		setSeeNewPass(false)
		setSeePass(false)
	}

	function closeProfile(){
		setOpenProfile(false)
		setWasClikedAlready(false)
		setMoreOptionsMsg("Eliminar perfil")
		setIsDeleting(false)
	}
	function reload(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}
	return(
		<div id="header">
				<nav id="nav-bar">
					<div id={visible ? "sidebar-visible": "sidebar-invisible"} >
						<Link onClick={()=>CloseMenu()} to="/painel-adm/posts" className="sidebarLink">
							<SidebarItem isVisible={visible} icon={<MdPostAdd size={25}/>} title="Publicações"/>
						</Link>
						<Link onClick={()=>CloseMenu()} to="/painel-adm/anexos" className="sidebarLink">
							<SidebarItem isVisible={visible} icon={<MdAddLink size={25}/>} title="Anexos"/>
						</Link>
					</div>
					<div className="logo-container">
						<FaBars id="toggleSidebarBtn" onClick={()=> setVisible(prevState => !prevState)}/>
						<h4 className="logo-link">Vic<span style={{color: "var(--color-3)"}}>Blog</span></h4>
					</div>
					<div id="adm-actions" className="d-flex gap-2">
						{DoPostBtn}
						{LogoutBtn()}
						
					</div>
					<img onClick={() => setOpenProfile(prev => !prev)} id="go-to-profile" style={{width: "50px", height: '50px'}} src={`http://192.168.56.1:8000/adm/get_profile_picture/${adminId}`}>
					</img>
					<Modal isOpen={openProfile} setIsOpen={()=>closeProfile()}>
						<div id="profile-container">
							<img onClick={() => setOpenProfile(prev => !prev)} id="profile-photo" src={`http://192.168.56.1:8000/adm/get_profile_picture/${adminId}`}>
							</img>

							<div id="profile-more-info">
								<h4>Nome: {adminNome}</h4>
								<h4>Email: {adminEmail}</h4>
								<h4>Criada em: {formatarData(adminDate)}</h4>
							</div>

							<div id="more-options">
								<button onClick={()=>{
									setOpenProfile(false); setUpdateModalVisible(true)
								}} className="btn btn-success">Editar perfil</button>

								<button disabled={isDeleting} onClick={()=>handlerDeleteProfile()} className="btn btn-danger">{moreOptionsMsg}</button>
							</div>

							{deleteRes && <p className="text-center auth-res"><MdError size={20} color="red"/> {deleteRes.msg}</p>}
						</div>
					</Modal>
					<Modal isOpen={updateModalVisible} setIsOpen={()=>{closeModalUpdate()}}>
						<form 
							id="update-profile-form" 
							onSubmit={(e)=>handlerUpdate(e)} 
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
								<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn"><FaEye id="see-pass-icon"/></button>
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
								<button type="button" onClick={() => setSeeNewPass(prev => !prev)} className="btn"><FaEye id="see-pass-icon"/></button>
							</div>

							<input type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png"/>
							<p style={{fontSize: "12px"}}>Obs: A foto deve ter no máximo 1MB (jpeg, png, jpg)</p>

							<Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(isLoading)} value="Atualizar"/>
							{updateRes && <p className="text-center auth-res"><MdError size={20} color="red"/> {updateRes.msg}</p>}
						</form>
					</Modal>
				</nav>
		</div>
	)
}