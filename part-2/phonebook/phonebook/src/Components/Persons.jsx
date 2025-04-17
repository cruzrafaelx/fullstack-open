const Persons = ({filter}) => {
    return(
        <div>
            {filter.map(name => 
                {
                return (
                <div key={name.id}>
                    <p>{name.name}</p>
                    <p>{name.number}</p>
                </div> )
                }
            )}
        </div>
    )
}

export default Persons