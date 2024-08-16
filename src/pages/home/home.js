import Cookies from "js-cookie";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { MdAttachEmail, MdError } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Modal from "../../components/modal/modal";
import Button from '../../components/submitButton/submitButton';
import Logo from '../../components/logo/logo'
import '../home/home.css';

export default function Home(){
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [resMsg, setResMsg] = useState('')
	const [nome, setNome] = useState('')
	const [selectedFile, setSelectedFile] = useState(null)
	const [isOpenAuthForm, setIsOpenAuthForm] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingEmailCheck, setIsLoadingEmailCheck] = useState(false)
	const [isOpenModalChekEmail, setIsOpenModalChekEmail] = useState(false)
	const [isOpenRecoverForm, setIsOpenRecoverForm] = useState(false)
	const [seePass, setSeePass] = useState(false)
	const [recoverQuestion, setRecoverQuestion] = useState("")
	const [recoverAnswer, setRecoverAnswer] = useState("")
	const [wasChcked, setWasChcked] = useState(false)
	const API_URL = "http://localhost:8000"

	function utilHandleChangeAuthForm(){
		utilHandleClearAuthStates()
		setIsOpenAuthForm(!isOpenAuthForm); 
		setIsLoading(false)
		setSeePass(false)
	}

	function utilHandleCloseModal(){
		if(isOpenModalChekEmail || isOpenRecoverForm){
			setIsOpenModalChekEmail(false)
			setIsOpenRecoverForm(false)
			utilHandleClearAuthStates()
		}
	}

	const handlerFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

	const navigate = useNavigate()

	
	function handleSignin(e){
		e.preventDefault()
		setIsLoading(true)
		const URL = `${API_URL}/admin/auth/create`

		const formData = new FormData()
		formData.append('nome', nome);
		formData.append('email', email);
		formData.append('question', recoverQuestion)
		formData.append('answer', recoverAnswer)
		formData.append('senha', senha);
		formData.append('photo', selectedFile)

		fetch(URL, {
			method: 'POST',
			body: formData
		})
		.then((res)=>res.json())
		.then((json)=>{
			if(json.status == 200){
				setIsLoading(false)
				utilHandleClearAuthStates()
				setIsOpenAuthForm(!isOpenAuthForm)
			}else{
				setResMsg(json.msg)
				setIsLoading(false)
			}
		})
	}

	function handleLogin(e){
		e.preventDefault()
		setIsLoading(true)
		const URL = `${API_URL}/admin/auth/login`
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
				utilHandleSaveAdmin(json)
				window.location.replace('/admin/posts')
			}else{
				setResMsg(json.msg)
			}
			setIsLoading(false)
		})
	}

	function utilHandleSaveAdmin(response){
		Cookies.set('token', response.token)
		Cookies.set('adminId', response.admin.id)
		Cookies.set('adminName', response.admin.nome)
		Cookies.set('adminEmail', response.admin.email)
		Cookies.set('adminDate', response.admin.createdAt)
	}

	function utilHandleClearAuthStates(){
		setEmail("")
		setSenha("")
		setNome("")
		setResMsg("")
		setRecoverQuestion('')
		setRecoverAnswer('')
	}

	function handleVerifyEmail(e){
		e.preventDefault();
		setIsLoadingEmailCheck(true)
		const URL =`${API_URL}/admin/auth/email-check`
		const dados = {
			email: email
		}

		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then(res=> res.json()).then(json => {
			if(json.isVerifyed){
				setIsLoadingEmailCheck(false)
				setWasChcked(true)
				setResMsg(json.msg)
				setRecoverQuestion(json.question)
				setTimeout(() =>  setResMsg(''), 2000)
				setIsOpenModalChekEmail(false)
				setIsOpenRecoverForm(true)
			}else{
				setWasChcked(false)
				setResMsg(json.msg)
				setIsLoadingEmailCheck(false)
				setTimeout(() =>  setResMsg(''), 2000)
			}
		})

	}

	function handleVerifyrecoverAnswer(e){
		e.preventDefault();
		setIsLoadingEmailCheck(true)
		const dados = {
			answer: recoverAnswer
		}

		const URL = `${API_URL}/admin/auth/answer-check/${email}`

		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then(res=> res.json()).then(json => {
			if(json.auth){
				setWasChcked(true)
				navigate(`/admin/auth/recover?q=${email}`)
			}else{
				setIsLoadingEmailCheck(false)
				setResMsg(json.msg)
				setWasChcked(false)
				setTimeout(() => setResMsg(""), 3000)
			}
		})
	}

	
	return(
		<section className="sec" id="login_sigin_sec">
			<form
				id="login_form"
				onSubmit={(e)=>handleLogin(e)}
				style={{display: isOpenAuthForm? "flex": "none"}}
			>
				<input
					required
					type="email"
					placeholder="Email"
					onChange={(e)=>setEmail(e.target.value)}
					value={email}
					className="adm-input"
				/>
				<div id="pass-input-container">
					<input
						required
						type={seePass ? "text" : "password"}
						placeholder="Senha"
						onChange={(e)=>setSenha(e.target.value)}
						value={senha}
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn">
						{
							seePass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/>
						}
					</button>
				</div>
			
				<Button isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)} value="Iniciar sessão"/>
				{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
				<p
					className="signin_login_option"
					onClick={()=>{utilHandleChangeAuthForm()}}
				>
					Não tem uma conta? <span style={{color: "blue"}}>Criar conta</span>
				</p>
				<p
					className="repor_pass_link"
					onClick={()=>{setIsOpenModalChekEmail(!isOpenModalChekEmail); utilHandleClearAuthStates()}}
				>
					Esqueceu a palavra passe? <span style={{color: "red"}}>Recuperar conta</span>
				</p>
			</form>

			<form 
				id="sigin_form" 
				onSubmit={(e)=>handleSignin(e)} 
				style={{display: !isOpenAuthForm? "flex": "none"}}
			>
				
				<input 
					required
					type="text" 
					placeholder="Nome" 
					onChange={(e)=>setNome(e.target.value)} 
					value={nome} 
					className="adm-input"
				/>

				<input 
					required
					type="email" 
					placeholder="Email" 
					onChange={(e)=>setEmail(e.target.value)} 
					value={email} 
					className="adm-input"
				/>

				<div id="pass-input-container">
					<input 
						required
						type={seePass ? "text" : "password"} 
						placeholder="Senha"
						onChange={(e)=>setSenha(e.target.value)} 
						value={senha} 
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn">
						{
							seePass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/> 
						}
					</button>
				</div>

				<input 
					required
					type="text" 
					placeholder="Pergunta de recuperação de conta" 
					onChange={(e)=>setRecoverQuestion(e.target.value)} 
					value={recoverQuestion} 
					className="adm-input"
				/>

				<input 
					required
					type="text" 
					placeholder="Resposta (a resposta é usada para recuperar a conta!)" 
					onChange={(e)=>setRecoverAnswer(e.target.value)} 
					value={recoverAnswer} 
					className="adm-input"
				/>

				<div>
					<label id="choise-file-btn" className="btn btn-dark" for="profile-picture">
						<p>Foto de perfil</p>
						<FaUserCircle/>
					</label>
					<input type="file" onChange={handlerFileChange} accept=".jpeg, .jpg, .png" id="profile-picture"/>
				</div>

				<Button isLoading={isLoading} value="Criar conta"/>
				{resMsg && <p className="text-center auth-res"><MdError size={20} color="red"/> {resMsg}</p>}
				<p 
					className="signin_login_option"  
					onClick={()=>{utilHandleChangeAuthForm()}}
						
					>Já tem uma conta? <span style={{color: "blue"}}>Iniciar sessão</span>
				</p>
			</form>

			<Modal isOpen={isOpenModalChekEmail} setIsOpen={() => utilHandleCloseModal()}>
				<form id="recover_pass_form" onSubmit={(e)=>handleVerifyEmail(e)}>
					<div id="form-recover-header">
						<h4>Repor palavra passe <span><MdAttachEmail/></span></h4>
					</div>
					<input 
						placeholder="Insira seu email" 
						type="email"
						className="recover_input"
						onChange={(e)=>setEmail(e.target.value)}
						value={email}
						required
						autoFocus
					/>

					<Button isLoading={isLoadingEmailCheck} value="Verificar email"/>

					{wasChcked? <p className="text-center" style={{color: "green"}}>{resMsg}</p>: <p className="text-center" style={{color: "red"}}>{resMsg}</p> }
				</form>
			</Modal>

			<Modal isOpen={isOpenRecoverForm} setIsOpen={() => utilHandleCloseModal()}>
				<form id="recover_pass_form" onSubmit={(e)=>handleVerifyrecoverAnswer(e)}>
					<div id="form-recover-header">
						<h4>Repor palavra passe <span><MdAttachEmail/></span></h4>
					</div>
					<div id="recoverQuestion-container">
						{recoverQuestion}
					</div>
					<input 
						placeholder="Resposta" 
						type="text"
						className="recover_input"
						onChange={(e)=>setRecoverAnswer(e.target.value)}
						value={recoverAnswer}
						required
						autoFocus
					/>

					<Button isLoading={isLoadingEmailCheck}  value="Enviar"/>
					{wasChcked ? <p className="text-center" style={{color: "green"}}>{resMsg}</p>: <p className="text-center" style={{color: "red"}}>{resMsg}</p> }
				</form>
			</Modal>
	</section>
	)
}