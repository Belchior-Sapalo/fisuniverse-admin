import React, { useState } from "react";
import '../home/home.css'
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import Modal from "../../components/modal/modal";
import Btn from '../../components/btn/Btn';
import { MdAttachEmail, MdError } from "react-icons/md";
import {FaEye} from "react-icons/fa"

export default function Home(){
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [auth, setAuth] = useState(null)
	const [nomeSignIn, setNomeSignIn] = useState('')
	const [emailSignIn, setEmailSignIn] = useState('')
	const [senhaSignIn, setSenhaSignIn] = useState('')
	const [authSignin, setAuthSignin] = useState(null)
	const [isOpenLoginForm, setIsOpenLoginForm] = useState(true)
	const [isOpenSignInForm, setIsOpenSignInForm] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMailSend, setIsLoadingMailSend] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [emailRecover, setEmailRecover] = useState('')
	const [isSent, setIsSent] = useState(false)
	const [selectedFile, setSelectedFile] = useState(null)
	const [recoverMsg, setRecoverMsg] = useState('')
	const API_URL = "http://192.168.56.1:8000"
	const [seePass, setSeePass] = useState(false)

	const handlerFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

	const navigate = useNavigate()

	function handlerLogin(e){
		e.preventDefault()
		setIsLoading(true)
		setAuth(null)
		const URL = `${API_URL}/adm/login_adm`

		const dados = {
			'email': email,
			'senha': senha
		}

		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		})
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status == 200){
				Cookies.set('token', json.token)
				Cookies.set('adminId', json.admin.id)
				Cookies.set('adminName', json.admin.nome)
				Cookies.set('adminEmail', json.admin.email)
				Cookies.set('adminDate', json.admin.createdAt)

				navigate(`/painel-adm/posts`)
				setIsLoading(false)
			}else{
				setAuth(json)
				setIsLoading(false)
			}
		})

	}

	function handlerSignin(e){
		e.preventDefault()
		setAuthSignin(null)
		setIsLoading(true)
		const URL = `${API_URL}/adm/signin_adm`

		const formData = new FormData()
		formData.append('nome', nomeSignIn);
		formData.append('email', emailSignIn);
		formData.append('senha', senhaSignIn);
		formData.append('photo', selectedFile)

		fetch(URL, {
			method: 'POST',
			body: formData
		})
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status == 200){
				setNomeSignIn('')
				setEmailSignIn('')
				setSenhaSignIn('')
				setAuthSignin('')
				setIsOpenSignInForm(!isOpenSignInForm)
				setIsOpenLoginForm(!isOpenLoginForm)
				setIsLoading(false)
			}else{
				setIsLoading(false)
				setAuthSignin(json)
			}
		})
	}


	function handlerRecoverPass(e){
		e.preventDefault();
		setIsLoadingMailSend(true)
		const dados = {
			to: emailRecover,
			subject: "Recuperação de senha",
		}

		const URL = `${API_URL}/adm/verify_email`

		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then(res=> res.json()).then(json => {
			if(json.status == 200){
				setIsLoadingMailSend(false)
				setIsSent(true)
				setRecoverMsg(json.msg)
				setEmailRecover('')
		
				setTimeout(()=>{setIsOpen(!isOpen); setRecoverMsg("")}, 3000)
			}else{
				setIsLoadingMailSend(false)
				setRecoverMsg(json.msg)
				setIsSent(false)
			}
		})
	}

	return(
		<section className="sec" id="login_sigin_sec">
			<form 
				id="login_sigin_form" 
				onSubmit={(e)=>handlerLogin(e)} 
				style={{display: isOpenLoginForm? "flex": "none"}}
			>
				<h1>Bem vindo</h1>
				<input 
					type="email" 
					placeholder="Email" 
					onChange={(e)=>setEmail(e.target.value)} 
					value={email} 
					className="adm-input"
				/>

				<div id="pass-input-container">
					<input 
						type={seePass ? "text" : "password"} 
						placeholder="Senha"
						onChange={(e)=>setSenha(e.target.value)} 
						value={senha} 
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn"><FaEye id="see-pass-icon"/></button>
				</div>
				
				<Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)} value="Iniciar sessão"/>
				{auth && <p className="text-center auth-res"><MdError size={20} color="red"/> {auth.msg}</p>}
				<p 
					className="signin_login_option" 
					onClick={()=>{
						setAuth("")
						setIsOpenLoginForm(!isOpenLoginForm); 
						setIsOpenSignInForm(!isOpenSignInForm); 
						setIsLoading(false)
						setSeePass(false)
						setSenha("")
					}}>
					Não tem uma conta? <span style={{color: "blue"}}>Criar conta</span>
				</p>
				<p className="repor_pass_link" onClick={()=>setIsOpen(!isOpen)}>
					Esqueceu a palavra passe? <span style={{color: "red"}}>Recuperar conta</span>
				</p>
			</form>

			<form 
				id="login_sigin_form" 
				onSubmit={(e)=>handlerSignin(e)} 
				style={{display: isOpenSignInForm? "flex": "none"}}
			>
				<h4>Crie sua conta administrativa</h4>
				
				<input 
					type="text" 
					placeholder="Nome" 
					onChange={(e)=>setNomeSignIn(e.target.value)} 
					value={nomeSignIn} 
					className="adm-input"
				/>

				<input 
					type="email" 
					placeholder="Email" 
					onChange={(e)=>setEmailSignIn(e.target.value)} 
					value={emailSignIn} 
					className="adm-input"
				/>

				<div id="pass-input-container">
					<input 
						type={seePass ? "text" : "password"} 
						placeholder="Senha"
						onChange={(e)=>setSenha(e.target.value)} 
						value={senha} 
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn"><FaEye id="see-pass-icon"/></button>
				</div>

				<input required type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png"/>
				<p style={{fontSize: "12px"}}>Obs: A foto deve ter no máximo 1MB (jpeg, png, jpg)</p>

				<Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(isLoading)} value="Criar conta"/>
				{authSignin && <p className="text-center auth-res"><MdError size={20} color="red"/> {authSignin.msg}</p>}
				<p 
					className="signin_login_option"  
					onClick={()=>{
						setAuthSignin(''); 
						setIsOpenLoginForm(!isOpenLoginForm); 
						setIsOpenSignInForm(!isOpenSignInForm); 
						setIsLoading(false); 
						setAuth('')
						setSenha("")
						setSeePass(false)}
					}
						
					>Já tem uma conta? <span style={{color: "blue"}}>Iniciar sessão</span>
				</p>
			</form>

			<Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
				<form id="recover_pass_form" onSubmit={(e)=>handlerRecoverPass(e)}>
					<div id="form-recover-header">
						<h4>Repor palavra passe <span><MdAttachEmail/></span></h4>
					</div>
					<input 
						placeholder="Insira seu email" 
						type="email"
						className="recover_input"
						onChange={(e)=>setEmailRecover(e.target.value)}
						value={emailRecover}
						required
						autoFocus
					/>

					<Btn isLoading={isLoadingMailSend} setIsLoading={()=>setIsLoadingMailSend(!isLoadingMailSend)} value="Enviar email de recuperação"/>

					{isSent? <p className="text-center" style={{color: "green"}}>{recoverMsg}</p>: <p className="text-center" style={{color: "red"}}>{recoverMsg}</p> }
				</form>
			</Modal>
		</section>
	)
}