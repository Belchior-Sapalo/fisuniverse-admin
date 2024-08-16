import '../postComentForm/comentForm.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function ComentForm({postId}){
	const [email, setEmail] = useState('')
	const [coment, setComent] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const API_URL = "http://localhost:8000"

    function hanldeCreateComment(e){
		setIsLoading(true)
		e.preventDefault()
		const URL = `${API_URL}/post/comments/create/${postId}`

		const dados = {
			'email': email,
			'content': coment
		}
		fetch(URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then(res => res.json()).then(json => {
			if(json.status == 201){
				window.location.reload()
				setIsLoading(false)
			}else{
				alert(json.msg)
			}
		})

	}
    return(
        <form id="coment-form" onSubmit={(e)=>hanldeCreateComment(e)}>
            <input required type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} value={email} className="coment-form-input"/>
            <input required placeholder="Comentário" onChange={e=>setComent(e.target.value)} value={coment} className="coment-form-input"/>
            <button disabled={isLoading} type="submit" className="btn btn-dark" id='coment-btn'>Comentar</button>
        </form>
    )
}