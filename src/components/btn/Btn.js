import "./Btn.css"
import Loader from "../loading/loader"
 function Btn({isLoading, setIsLoading, value}){
    return(
        <button 
            disabled={isLoading} 
            className="btn btn-dark submit-btn"  
            style={{justifyContent: isLoading? "space-between": 'center'}}
        >
            <Loader isLoading={isLoading} setIsLoading={setIsLoading}/>
            <p className="value">{value}</p>
            <p></p>				
        </button>
    )
}

export default Btn;
