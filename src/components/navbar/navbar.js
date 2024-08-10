import React, { useEffect } from "react";
import {useState} from 'react'
import '../navbar/navbar.css'
import Modal from "../modal/modal";
import Cookies from "js-cookie";
import { MdAdd, MdLogout, MdPostAdd, MdAddLink } from "react-icons/md";
import {FaBars} from 'react-icons/fa'
import Msg from "../msg/msg";
import SidebarItem from "../sidebaritem/sidebarItem";
import {Link, useNavigate} from 'react-router-dom'

export default function Navbar({DoPostBtn}){
	const [visible, setVisible] = useState(false)

	const LogoutBtn = ()=>{
		function logout(){
			Cookies.remove('token')
			window.location.replace('/')
		}
		return(
			<button className="btn logout-btn" onClick={()=>logout()}><MdLogout size='20'/></button>
		)
	}
	function OpenMenu(){
		setVisible(true)
	}

	function CloseMenu(){
		setVisible(false)
	}

	
	return(
		<div id="header">
				<nav id="nav-bar">
					<div id={visible ? "sidebar-visible": "sidebar-invisible"} >
						<Link onClick={()=>CloseMenu()} to="/painel-adm/posts" className="sidebarLink">
							<SidebarItem isVisible={visible} icon={<MdPostAdd size={25}/>} title="Publicações"/>
						</Link>
						<Link onClick={()=>CloseMenu()} to="/painel-adm/anexos" className="sidebarLink">
							<SidebarItem isVisible={visible} icon={<MdAddLink size={25}/>} title="Anexos"/>
						</Link>
					</div>
					<div className="logo-container">
						<FaBars id="toggleSidebarBtn" onClick={()=> setVisible(prevState => !prevState)}/>
						<h4 className="logo-link">Vic<span style={{color: "var(--color-3)"}}>Blog</span></h4>
					</div>
					<div id="adm-actions" className="d-flex gap-2">
						{DoPostBtn}
						{LogoutBtn()}
					</div>
				</nav>
		</div>
	)
}