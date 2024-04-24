import {useSearchParams, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import {FaArrowLeft, FaEdit} from 'react-icons/fa'
import '../post/OnePost.css'
import Navbar from '../../components/navbar/navbar'
import ComentForm from '../../components/postComentForm/comentForm'
import Cookies from 'js-cookie'
import { MdDelete } from 'react-icons/md'
// import Msg from '../../components/msg/msg'

export default function(){
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [post, setPost] = useState({})
    const [token, setToken] = useState(null)
    const [res, setRes] = useState('')
    const [showMsg, setShowMsg] = useState(false)
    const [coments, setComents] = useState([])
    const q = searchParams.get('q')

    function voltar(){
        navigate(-1)
    }

    useEffect(()=>{
        const URL = `http://localhost:8000/post/${q}`

        fetch(URL)
        .then((res)=>res.json())
        .then((json)=>{setPost(json); setComents(json.coments)})

        setToken(Cookies.get('token'))
    },[])

    function deletarComent(autorEmail){
      const URL = `http://localhost:8000/adm/apagar_coment/${autorEmail}`

      fetch(URL, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res)=>res.json()).then((json)=>{setRes(json.msg)})

      document.location.reload()
    }

    function formatarData(data){
		const dateToFormat = new Date(data)
		const dateFormated = dateToFormat.toLocaleString()

		return dateFormated;
	}
    return(
        <div className="post">
            <div id='back-btn-container'>
                <button id='back-btn' onClick={()=>voltar()}><FaArrowLeft/></button>
            </div>
            <h3 className="post-title">
                {post.title}
            </h3>

            <h5 className="post-autor">
                {post.autor}
            </h5>
            <p className="post-data-create">
                {formatarData(post.createdAt)}
            </p>
            <div className="post-content">
                {post.content}
            </div>
            <ComentForm postId={q}/>
            {
                coments.length == 0? <p>Sem comentários</p>: coments.map(coment => {
                return(
                    <div className="coment">
                        <div className='coment-header'>
                            <div className='coment_info'>
                                <h5 className="coment-autor">{coment.autorName}</h5>
                                <p className="coment-data">{formatarData(coment.createdAt)}</p>
                            </div>
                            <button className="btn btn-danger coment-adm-options-btn" onClick={()=>deletarComent(coment.autorEmail)}><MdDelete/></button>
                        </div>
                        <div className='coment-content-container'>
                            <p className="coment-email">{coment.autorEmail}</p>
                            <p className="coment-content">{coment.content}</p>
                        </div>
                    </div>
                )
                })
            }

            {/* <Msg isOpen={showMsg} setIsOpen={()=>{setShowMsg(!showMsg); document.location.reload()}}>
                <h4>{res}</h4>
            </Msg> */}
        </div>
    )
}