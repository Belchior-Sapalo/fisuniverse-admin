import { useEffect, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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
	const API_URL = "http://localhost:8000"
    
    useEffect(()=>{
        setEmail(searchParams.get('q'))
    }, [])

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
        }).then((res)=>res.json()).then((json)=>{
            if(json.status == 200){
                setResMsg(json.msg)
                setIsLoading(false)
                setWasRecovered(true)
            }else{  
                setResMsg(json.msg)
                setIsLoading(false)
                setTimeout(()=> setResMsg(''), 3000)
            }

        })
    }
    return(
        <section id='recover-pass-sec'>
            <form onSubmit={(e)=>handlerRecoverPass(e)} id='recover-pass-form'>
                <input 
                    placeholder='Email'
                    required
                    type='email'
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
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

                <Button isLoading={isLoading} value="Redefinir senha"/>
                
                {
                    wasRecovered ? 
                    <p onClick={()=>window.location.replace('/')} style={{color: "green", cursor: "pointer"}}>{resMsg}! Iniciar sessão</p>: 
                    <p onClick={()=>window.location.replace('/')} style={{color: 'red', cursor: "pointer"}}>{resMsg}</p>
                }
            </form>
        </section>
    )
}