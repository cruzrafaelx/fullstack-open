import { useState, useImperativeHandle } from 'react'

<<<<<<< HEAD
const Toggleable = ({  buttonLabel, children, ref }) =>{
=======
const Toggleable = ({ buttonLabel, children, ref }) =>{
>>>>>>> 8994dac (Save recent changes before rebase)

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : ''}
    const showWhenVisible = { display: visible ? '' : 'none'}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

<<<<<<< HEAD
    useImperativeHandle(ref, () => {
        return {toggleVisibility}
=======
    //Exports toggleVisibility to reference component which is App.jsx
    useImperativeHandle(ref,() =>{
        return { toggleVisibility }
>>>>>>> 8994dac (Save recent changes before rebase)
    })

    return(
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
}

export default Toggleable