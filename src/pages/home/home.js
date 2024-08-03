import React, { useState } from "react";
import '../home/home.css'
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import Loader from "../../components/loading/loader";
import Modal from "../../components/modal/modal";
import Btn from '../../components/btn/Btn';
import { MdAttachEmail, MdError } from "react-icons/md";

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
	const [recoverMsg, setRecoverMsg] = useState('')
	const API_URL = "http://localhost:8000"

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
				navigate(`/painel-adm`, {state: {nomeAdm: json.nome}})
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

		const dados = {
			'nome': nomeSignIn,
			'email': emailSignIn,
			'senha': senhaSignIn
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

				setTimeout(()=>setIsOpen(!isOpen), 3000)
			}else{
				setIsLoadingMailSend(false)
				setRecoverMsg(json.msg)
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

				<input 
					type='password' 
					placeholder="Senha"
					 onChange={(e)=>setSenha(e.target.value)} 
					 minLength={4} 
					 value={senha} 
					 className="adm-input"
				/>
				
				<Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)} value="Iniciar sessão"/>
				{auth && <p className="text-center auth-res"><MdError size={20} color="red"/> {auth.msg}</p>}
				<p 
					className="signin_login_option" 
					onClick={()=>{
						setAuth("")
						setIsOpenLoginForm(!isOpenLoginForm); 
						setIsOpenSignInForm(!isOpenSignInForm); 
						setIsLoading(false)
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

				<input 
					type='password' 
					placeholder="Senha" 
					onChange={(e)=>setSenhaSignIn(e.target.value)} 
					minLength={4} 
					value={senhaSignIn} 
					className="adm-input"
				/>

				<Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(isLoading)} value="Criar conta"/>
				{authSignin && <p className="text-center auth-res"><MdError size={20} color="red"/> {authSignin.msg}</p>}
				<p 
					className="signin_login_option"  
					onClick={()=>{
						setAuthSignin(''); 
						setIsOpenLoginForm(!isOpenLoginForm); 
						setIsOpenSignInForm(!isOpenSignInForm); 
						setIsLoading(false); 
						setAuth('')}}
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

					{isSent? <p style={{color: "green"}}>{recoverMsg}</p>: <p className="text-center" style={{color: "red"}}>{recoverMsg}</p> }
				</form>
			</Modal>
		</section>
	)
}