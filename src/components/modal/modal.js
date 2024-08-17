import {useEffect} from "react";
import '../modal/modal.css'
import {MdClose} from 'react-icons/md'

export default function Modal({isOpen, setIsOpen, children}){
    useEffect(()=> {
        if(isOpen){
            document.body.classList.add('modal-open')
        }else{
            document.body.classList.remove('modal-open')
        }

        return () => {
            document.body.classList.remove('modal-open')
        }
    }, [isOpen])
    if(isOpen){
        return(
            <div id="modal-container">
                 <div id="modal-close-btn-container">
                    <button id="close-modal-btn" onClick={setIsOpen}>
                        <MdClose  className="close-icon"/>
                    </button>
                </div>
                <div id="modal-content" >
                    {children}
                </div>
            </div>
        )
    }
}