import React from "react";
import '../footer/footer.css'
import {FaFacebook, FaInstagram, FaTelegram} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import Logo from "../logo/logo";


export default function Footer(){
    return(
        <footer id="footer-container">
            <div id="content">
                <Logo/>
                <div className="navigate-area">
                        <Link className="internal-link" to='/admin/posts'>Publicações</Link> <p>.</p>
                        <Link className="internal-link" to='/admin/books'>Livros</Link>
                 </div>
                <div className="info-area">
                    <p> &copy; 2024 Belchior Cassumba Sapalo</p>
                    <p> Imagem por <a target="_blank" href="https://www.vecteezy.com">Vecteezy.com</a> </p>
                </div>
            </div>
        </footer>
    )
}