
const Notification = ({ success, error }) => {

    if(success){
        return <div className='notif success'>{success}</div>
    } 
    
    else{
        return <div className='notif error'>{error}</div>
    }
}

export default Notification