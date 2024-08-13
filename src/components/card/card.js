import "../card/card.css"
import React from 'react'
import {useState} from 'react'

export default function Card({title, autor, ano, editora, description, img, id, EdBtn, token}) {
    const [moreOptionsMsg, setMoreOptionsMsg] = useState("Eliminar")
	const [wasClikedAlready, setWasClikedAlready] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const API_URL = "http://localhost:8000"
    
    function handlerDeleteBook(){
		if(wasClikedAlready){
			setIsDeleting(true)
			setMoreOptionsMsg("Eliminando...")
        	const URL = `${API_URL}/adm/books/${id}`

			fetch(URL, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then((res)=>res.json())
			.then((json)=>{
				if(json.status == 200){
					reload(false)
				}else{
					reload(true)
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
			<button disabled={isDeleting} onClick={() => handlerDeleteBook()} className="btn btn-danger adm-options-btn">{moreOptionsMsg}</button>
		)
	}

    function reload(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}
  return (
    <div id="card-container" className="col-12">
        <div id="post-cover-container">
            <img className="boo-cover" src={img} alt={title}/>
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
