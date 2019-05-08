import React from 'react';
import "./Button.css";

const Button = ({value, onPasswordInput, change}) =>{
    return <button onClick={()=> {onPasswordInput(value); change();}} className="keyboard__button">{value}</button>
};

export default Button;
