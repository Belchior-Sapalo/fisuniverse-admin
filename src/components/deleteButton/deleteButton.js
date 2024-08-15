import React from 'react'
import {useState, useEffect} from 'react'
import { MdDelete, MdError } from "react-icons/md";
import Cookies from "js-cookie";

export default function DeleteBtn({endPoint}) {
    const [wasClikedAlready, setWasClikedAlready] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
	const [token, setToken] = useState('')
	const API_URL = "http://localhost:8000"
    
    useEffect(()=>{
        setToken(Cookies.get('token'))
	}, [])

    function handlerDeletePost(){
        if(wasClikedAlready){
            const URL = `${API_URL}/${endPoint}`
            setIsDeleting(true)
            fetch(URL, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res)=>res.json())
            .then((json)=>{
                if(json.status == 200){
                    handleReloadWindow(false)
                }else{
                    handleReloadWindow(true)
                }
                localStorage.setItem('lastMsg', json.msg)
            })
        }else{
            setWasClikedAlready(true)
            setTimeout(()=>{setWasClikedAlready(false)}, 3000)
        }
    }
    function handleReloadWindow(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}
    return(
        <button disabled={isDeleting} className="btn btn-danger post-adm-options-btn" onClick={()=>{handlerDeletePost()}}>{wasClikedAlready ? <MdError color="orange"/> : <MdDelete/>}</button>
    )
}
