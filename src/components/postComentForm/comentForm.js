import '../postComentForm/comentForm.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function ComentForm({postId}){
    const [nome, setNome] = useState('')
	const [email, setEmail] = useState('')
	const [coment, setComent] = useState('')
	const navigate = useNavigate()

    function comentar(e){
		e.preventDefault()
		const URL = `http://localhost:8000/criarComent/${postId}`

		const dados = {
			'autorName': nome,
			'autorEmail': email,
			'content': coment
		}
		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		})
		window.location.reload()

	}
    return(
        <form id="coment-form" onSubmit={(e)=>comentar(e)}>
            <input required placeholder="Nome" onChange={e=>setNome(e.target.value)} value={nome} className="coment-form-input"/>
            <input required type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} value={email} className="coment-form-input"/>
            <input required placeholder="Comentário" onChange={e=>setComent(e.target.value)} value={coment} className="coment-form-input"/>
            <button type="submit" className="btn btn-primary" id='coment-btn'>Comentar</button>
        </form>
    )
}