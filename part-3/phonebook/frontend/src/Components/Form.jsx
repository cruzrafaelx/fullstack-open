const Form = ({onSubmit, onChangeName, onChangeNum, valueName, valueNum}) => {
    return(
    <form onSubmit={onSubmit}>
        <div>
        name: <input onChange={onChangeName} value={valueName}/>
        </div>
        <div>
        number: <input onChange={onChangeNum} value={valueNum}/>
        </div>
        <div>
        <button type="submit">add</button>
        </div>
    </form>
    )
}

export default Form