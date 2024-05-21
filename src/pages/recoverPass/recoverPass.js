import './recoverPass.css'
import {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import Btn from '../../components/btn/Btn'


export default function RecoverPass(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [res, setRes] = useState('')
    
    useEffect(()=>{
        const queryString = window.location.search;
        const URLparams = new URLSearchParams(queryString);
        const token = URLparams.get('q')
        setToken(token)
    }, [])

    async function handlerRecoverPass(e){
        setIsLoading(true)
        e.preventDefault()
        const URL = `http://localhost:8000/adm/redefinir-senha?q=${token}`
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
        }).then((res)=>res.json()).then((json)=>{setRes(json); setIsLoading(false)})
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
                <input 
                    placeholder='Nova senha'
                    required
                    type='password'
                    onChange={(e)=>setNewPass(e.target.value)}
                    value={newPass}
                    minLength={4}
                />
                <input 
                    placeholder='Confirmar senha'
                    required
                    type='password'
                    onChange={(e)=>setConfirmPass(e.target.value)}
                    value={confirmPass}
                    minLength={4}
                />

                <Btn isLoading={isLoading} setIsLoading={()=>setIsLoading(!isLoading)} value="Redefinir senha"/>
                
                {res.status == 200? <p onClick={()=>window.location.replace('/')} style={{color: "green", cursor: "pointer"}}>{res.msg}! Iniciar sessão</p>: <p onClick={()=>window.location.replace('/')} style={{color: 'red', cursor: "pointer"}}>{res.msg}</p>}
            </form>
        </section>
    )
}