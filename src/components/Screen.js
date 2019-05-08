import React, { Component } from 'react';
import './Screen.css';

class Screen extends Component{

    render(){
        const {password, background, doorStatus, mainStatus} =this.props;
        return(
            <div className="screen" style={{background: background}}>
                <p className="screen__door-values">
                    {doorStatus}
                </p>
                <p className="screen__password">
                    {password}
                </p>
                <p className="screen__main-status">
                    {mainStatus}
                </p>
            </div>
        )
    }
}

export default Screen;