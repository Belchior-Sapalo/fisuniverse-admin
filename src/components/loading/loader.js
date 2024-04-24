import { useState } from "react";
import "../loading/loader.css"

export default function Loader({isLoading, setIsLoading}){
    return(
        <span style={{display: isLoading? "block": "none"}} className="loader"></span>
    )
}