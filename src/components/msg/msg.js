import React, { useState } from "react";
import '../msg/msg.css'
import {MdCheck, MdClear, MdClose} from 'react-icons/md'
import Loader from "../loading/loader";

export default function Msg({isOpen, setIsOpen, children}){
    const [isLoading, setIsLoading] = useState(true)
    if(isOpen){
        return(
            <div id="msg-container">
                
                <div id="msg-content">
                    <MdCheck className="chek-icon" size='20'/>
                    {children}
                    <button id="close-msg-btn" className="btn btn-success" onClick={setIsOpen}>
                        Ok
                    </button>
                </div>
            </div>
        )
    }
}