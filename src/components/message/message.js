import "../message/message.css"
import React from 'react'
import { MdError, MdCheck} from 'react-icons/md'

export default function Message({isOpen, children, isAnError}) {
    
    if(true){
        return(
            <div id="message-container">
                {
                    isAnError ? 
                    <div 
                        id="message-content" 
                        className={ isOpen ? "message-content-visible-error": "message-content-invisible" } 
                    >
                        <div id="error-icon-container">
                            <MdError id="error"/>
                        </div>
                        <h4 className="message">{children}</h4>
                    </div> : 
                    <div 
                        id="message-content" 
                        className={ isOpen ? "message-content-visible-success": "message-content-invisible" } 
                    >
                        <div id="success-icon-container">
                            <MdCheck id="success"/>
                        </div>
                        <h4 className="message">{children}</h4>
                    </div>
                }
            </div>
        )
    }
}
