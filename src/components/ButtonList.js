import React from 'react';
import Button from './Button';
import './ButtonList.css'

const ButtonList = ({onPasswordInput, change})=>{
    const arr =[7,8,9,4,5,6,1,2,3,'*',0,'L'];
    const buttons = arr.map(button=>{
        return <Button key={button} change={change} onPasswordInput={onPasswordInput} value={button}/>
    });
    return(
        <ul className="keyboard">
            {buttons}
        </ul>
    )
};
export default ButtonList;