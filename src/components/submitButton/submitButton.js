import "./submitButton.css"
import Loader from "../loader/loader"
 function Button({isLoading, value}){
    return(
        <button 
            disabled={isLoading} 
            className="btn btn-dark submit-btn"  
            style={{justifyContent: isLoading? "space-between": 'center'}}
        >
            <Loader isLoading={isLoading}/>
            <p className="value">{value}</p>
        </button>
    )
}

export default Button;
