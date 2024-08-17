import "./loader.css";

export default function Loader({isLoading, isBlue}){
    return(
        <span style={{display: isLoading? "block": "none", borderBottomColor: isBlue ? 'rgb(0, 217, 255)' : 'rgb(251, 94, 94)'}} className="loader"></span>
    )
}