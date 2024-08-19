import '../errorPage/errorPage.css'

import React from 'react'

export default function ErrorPage() {
  
  return (
    <section id='error-page-section' className='container'>
      <div id='error-container'>
        <h4 id='error-code'>500</h4>
        <h5 id='error-info'>Erro no servidor</h5>
      </div>
      <div id='error-message-container'>
        <div id='error-recomentation'>
            Tente novamente mais tarde. Se o problema persistir contacte o pessoal responsável e relate o problema para a resolução imediata, obrigado!!
        </div>
      </div>
    </section>
  )
}
