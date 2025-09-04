const Persons = ({filter, onDelete}) => {
    return(
        <div>
            {filter.map(name => 
                {
                return (
                <div key={name.id}>
                    <p>{name.name}</p>
                    <p>{name.number}</p>
                    <button onClick={()=>onDelete(name.id)}>delete</button>
                </div> )
                }
            )}
        </div>
    )
}

export default Persons