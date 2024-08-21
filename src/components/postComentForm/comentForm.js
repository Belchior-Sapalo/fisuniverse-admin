import '../postComentForm/comentForm.css'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { API_URL } from '../globalVarables/variaveis'

export default function ComentForm({commentId, token}){
	const [response, setResponse] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

    function hanldeResponseComment(e){
		setIsLoading(true)
		e.preventDefault()
		const URL = `${API_URL}/admin/post/comment/response/${commentId}`

		const dados = {
			'response': response
		}

		fetch(URL, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-type': 'application/json'
			},
			body: JSON.stringify(dados)
		}).then((res)=>{
			if(res.status === 500){
				throw new Error('Falha no servidor')
			}

			return res.json()
		}).then(json => {
			if(json.updated){
				window.location.reload()
				setIsLoading(false)
			}
		}).catch(error => {
			navigate("/error")
		})
	}

    return(
        <form id="coment-form" onSubmit={(e)=>hanldeResponseComment(e)}>
            <input  required placeholder="Comentário" onChange={e=>setResponse(e.target.value)} value={response} className="coment-form-input"/>
            <button disabled={isLoading || (response.length === 0)} type="submit" className="btn btn-dark" id='coment-btn'>{ isLoading ? 'Aguarde...' : 'Responder' }</button>
        </form>
    )
}