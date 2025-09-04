const Notification = ({ error, success }) => {

    if (!error && !success) {
        return null
    }

    return(
        <div className={success ? "success" : "error"}>
            {success || error}
        </div> 
    )
}

export default Notification

