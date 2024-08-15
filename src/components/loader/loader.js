import "./loader.css";

export default function Loader({isLoading}){
    return(
        <span style={{display: isLoading? "block": "none"}} className="loader"></span>
    )
}