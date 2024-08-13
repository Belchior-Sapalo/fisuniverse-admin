import React from 'react'
import {useState, useEffect} from 'react'
import { MdDelete, MdError } from "react-icons/md";
import Cookies from "js-cookie";

export default function DeleteBtn({id, icon}) {
    const [wasClikedAlready, setWasClikedAlready] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
	const [token, setToken] = useState('')
	const API_URL = "http://192.168.56.1:8000"
    
    useEffect(()=>{
        setToken(Cookies.get('token'))
	}, [])

    function handlerDeletePost(postId){
        const URL = `${API_URL}/adm/apagar_post/${postId}`
        if(wasClikedAlready){
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
                    reload(false)
                }else{
                    reload(true)
                }
                localStorage.setItem('lastMsg', json.msg)

            })
        }else{
            setWasClikedAlready(true)
            setTimeout(()=>{setWasClikedAlready(false)}, 3000)
        }
    }
    function reload(isAnError){
		localStorage.setItem('reloaded', 'true')
        localStorage.setItem('isAnError', isAnError)
		document.location.reload()
	}
    return(
        <button disabled={isDeleting} className="btn btn-danger post-adm-options-btn" onClick={()=>{handlerDeletePost(id)}}>{wasClikedAlready ? <MdError color="orange"/> : <MdDelete/>}</button>
    )
}
