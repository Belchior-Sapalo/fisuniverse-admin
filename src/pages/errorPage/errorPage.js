import { FaArrowLeft } from 'react-icons/fa'
import { MdError, MdWarning } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/logo/logo'
import '../errorPage/errorPage.css'



import React from 'react'

export default function ErrorPage() {
  const navigate = useNavigate()
  function voltar(){
    navigate(-1)
  }

  function Header(){
		return(
			<nav id="header">
                <button id='back-btn' onClick={()=>voltar()}><FaArrowLeft/></button>
				<div id="logo-container">
					<Logo/>
				</div>
			</nav>
		)
	}
  
  return (
    <section id='error-page-section' className='container'>
      <div id='error-container'>
        <h4 id='error-code'>500</h4>
        <h5 id='error-info'>Erro no servidor</h5>
      </div>
      <div id='error-message-container'>
        <h4 id='error-title'></h4>
        <div id='error-recomentation'>
            Tente novamente mais tarde. Se o problema persistir contacte o pessoal responsável e relate o problema para a resolução imediata, obrigado!!
        </div>
      </div>
    </section>
  )
}
