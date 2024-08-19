import { useEffect, useState } from "react"
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_URL } from "../../components/globalVarables/variaveis"
import Logo from '../../components/logo/logo'
import Button from '../../components/submitButton/submitButton'
import './recoverPass.css'

export default function RecoverPass(){
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
	const [seePass, setSeePass] = useState(false)
	const [seeConfirmPass, setSeeConfirmPass] = useState(false)
    const [resMsg, setResMsg] = useState('')
    const [wasRecovered, setWasRecovered] = useState(false)
    
    function voltar(){
        window.location.replace('/')
    }

    useEffect(()=>{
        setEmail(searchParams.get('q'))
    }, [searchParams])

    async function handlerRecoverPass(e){
        setIsLoading(true)
        e.preventDefault()
        const URL = `${API_URL}/admin/auth/recover-pass`
        const dados = {
            'email': email,
            'senha': newPass,
            'confirmSenha': confirmPass
        }

        fetch(URL,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dados)
        }).then((res)=>{
			if(res.status === 500){
                throw new Error('Falha no servidor')
            }

            return res.json()
		}).then((json)=>{
            if(json.recovered){
                setResMsg(json.msg)
                setIsLoading(false)
                setWasRecovered(true)
            }else{  
                setResMsg(json.msg)
                setIsLoading(false)
                setTimeout(()=> setResMsg(''), 3000)
            }
        }).catch(error => {
            navigate('/error')
        })
    }

    function Header(){
		return(
			<nav id="home-header">
                <button id='back-btn' onClick={()=>voltar()}><FaArrowLeft/></button>
				<div id="logo-container">
					<Logo/>
				</div>
			</nav>
		)
	}

    return(
        <section id='recover-pass-sec'>
            <Header/>
            <form onSubmit={(e)=>handlerRecoverPass(e)} id='recover-pass-form'>
                <input 
                    placeholder='Email'
                    required
                    type='email'
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
					className="adm-input"
                    autoFocus
                />
                <div id="pass-input-container">
					<input 
                        required
						type={seePass ? "text" : "password"} 
						placeholder="Nova senha"
						onChange={(e)=>setNewPass(e.target.value)} 
						value={newPass} 
                        minLength={6}
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeePass(prev => !prev)} className="btn">{
						seePass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/> 
						}
                    </button>
				</div>
                <div id="pass-input-container">
					<input 
                        required
						type={seeConfirmPass ? "text" : "password"} 
						placeholder="Confirme a senha"
						onChange={(e)=>setConfirmPass(e.target.value)} 
						value={confirmPass} 
						className="adm-input"
						id="pass"
					/>
					<button type="button" onClick={() => setSeeConfirmPass(prev => !prev)} className="btn">
                        {
                            seeConfirmPass ? <FaEyeSlash id="see-pass-icon"/>: <FaEye id="see-pass-icon"/>
                        }
                    </button>
				</div>

                <Button isLoading={isLoading} value="Redefinir" isBlue={true}/>
                
                {
                    wasRecovered ? 
                    <p onClick={()=>window.location.replace('/')} style={{color: "green", cursor: "pointer"}}>{resMsg}! Iniciar sessão</p>: 
                    <p onClick={()=>window.location.replace('/')} style={{color: 'red', cursor: "pointer"}}>{resMsg}</p>
                }
            </form>
        </section>
    )
}