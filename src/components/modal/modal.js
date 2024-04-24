import React from "react";
import '../modal/modal.css'
import {MdClose} from 'react-icons/md'

export default function Modal({isOpen, setIsOpen, children}){
    if(isOpen){
        return(
            <div id="modal-container">
                
                <div id="modal-content">
                    <button id="close-modal-btn" onClick={setIsOpen}>
                        <MdClose size='30' className="close-icon"/>
                    </button>
                    {children}
                </div>
            </div>
        )
    }
}