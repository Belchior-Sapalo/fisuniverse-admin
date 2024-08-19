import React, { useState } from 'react'
import "../card/card.css"
import { API_URL } from "../globalVarables/variaveis"

export default function Card({title, autor, ano, editora, description, id, EdBtn, token}) {
    const [moreOptionsMsg, setMoreOptionsMsg] = useState("Eliminar")
	const [wasClikedAlready, setWasClikedAlready] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
    
    function handlerDeleteBook(){
		if(wasClikedAlready){
			setIsDeleting(true)
			setMoreOptionsMsg("Eliminando...")
        	const URL = `${API_URL}/admin/book/delete/${id}`

			fetch(URL, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then((res)=>{
				if(res.status == 500){
					throw new Error('Falha no servidor')
				}

				return res.json()
			}).then((json)=>{
				if(json.deleted){
					handleReloadWindow(false)
				}else{
					handleReloadWindow(true)
				}
				localStorage.setItem('lastMsg', json.msg)
			})
		}else{
			setWasClikedAlready(true)
			setMoreOptionsMsg("Certeza?")
			setTimeout(()=>{setWasClikedAlready(false); setMoreOptionsMsg("Eliminar")}, 4000)
		}
	}

    const deleteBookBtn = () => {
		return(
			<button disabled={isDeleting} onClick={() => handlerDeleteBook()} className="btn btn-danger admin-options-btn">{moreOptionsMsg}</button>
		)
	}

    function handleReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}
  return (
    <div id="card-container" className="col-12">
        <div id="post-cover-container">
            <img className="boo-cover" src={`${API_URL}/book/${id}`} alt={title}/>
        </div>
        <div id="text-container">
            <div id="text-about-book">
                <div id="post-infor-container">
                    <h6>{title}</h6>
                </div>
                <div id="post-desc-container">
                    <p>{description}</p>
                </div>
                <div id="post-more-infor-container">
                    <h6>{autor}</h6>
                    <h6>{ano}</h6>
                    <h6>{editora}</h6>
                </div>
            </div>
            
            <div id="options-container" style={{display: token ? "flex" : "none"}}>
                <div>
                    {EdBtn}
                </div>
                <div>
                    {deleteBookBtn()}
                </div>
            </div>
        </div>
    </div>
  )
}
