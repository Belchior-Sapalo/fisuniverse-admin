import "./submitButton.css"
import Loader from "../loader/loader"
 function Button({isLoading, value, isBlue}){
    return(
        <button 
            disabled={isLoading} 
            className={isBlue ? 'btn btn-primary submit-btn' : 'btn btn-dark submit-btn'}  
        >
            { 
                isLoading ? <Loader isLoading={isLoading} isBlue={isBlue}/> :
                <p className="value">{value}</p>
            }
        </button>
    )
}

export default Button;
