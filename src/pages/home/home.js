import React, { useState } from "react";
import '../home/home.css'
import {useNavigate} from 'react-router-dom'
import Cookies from "js-cookie";
import Loader from "../../components/loading/loader";
import Modal from "../../components/modal/modal";

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
	const [isOpen, setIsOpen] = useState(false)
	const [emailRecover, setEmailRecover] = useState('')
	const [isSent, setIsSent] = useState(false)
	const [recoverMsg, setRecoverMsg] = useState('')

	const navigate = useNavigate()

	function handlerLogin(e){
		e.preventDefault()
		setIsLoading(true)
		setAuth(null)
		const URL = `http://192.168.43.58:8000/adm/login_adm`

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
		const URL = `http://192.168.43.58:8000/adm/signin_adm`

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
		
		const dados = {
			to: emailRecover,
			subject: "Recuperação de senha",
			html: '<p>Olá, clique <a href="http://192.168.43.58:3000/recover-pass">aqui</a> para recuperar sua senha.</p>'
		}

		const URL = 'http://192.168.43.58:8000/user/verify_email'

		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then(res=> res.json()).then(json => {
			if(json.status == 200){
				setIsSent(true)
				setRecoverMsg(json.msg)
				setEmailRecover('')
				setTimeout(()=>setIsOpen(!isOpen), 3000)
			}else{
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


				<button 
					disabled={isLoading} 
					className="btn btn-success submit-btn" 
					style={{justifyContent: isLoading? "space-between": 'center'}}
				>
					<Loader isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)}/>
					<p className="login_signin_text">Entrar</p>
					<p></p>				
				</button>
				
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
				
				{auth && <p className="text-center" id="login-res">{auth.msg}</p>}
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

				<button 
					disabled={isLoading} 
					className="btn btn-success submit-btn"  
					style={{justifyContent: isLoading? "space-between": 'center'}}
				>
					<Loader isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)}/>
					<p className="login_signin_text">Criar conta</p>
					<p></p>				
				</button>
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

				{authSignin && <p className="text-center" id="login-res">{authSignin.msg}</p>}
			</form>

			<Modal isOpen={isOpen} setIsOpen={()=>setIsOpen(!isOpen)}>
				<form id="recover_pass_form" onSubmit={(e)=>handlerRecoverPass(e)}>
					<h4>Repor palavra passe</h4>
					<input 
						placeholder="Insira seu email" 
						type="email"
						className="recover_input"
						onChange={(e)=>setEmailRecover(e.target.value)}
						value={emailRecover}
						required
						autoFocus
					/>

					<button className="btn btn-primary mt-2">Enviar email de recuperação</button>

					{isSent? <p className="text-center" style={{color: "green"}}>{recoverMsg}</p>: <p className="text-center" style={{color: "red"}}>{recoverMsg}</p> }
				</form>
					
			</Modal>
		</section>
	)
}