import React from 'react';
import masterAudio from '../canvas_imgs/audio-mastering-home.jpg'
import guitarGrey from '../canvas_imgs/guitar-greyscale-home.jpg'
import '../home.css'

export default class Home extends React.Component{
    render (){
        return(
        <div>
            <h1 style={{textAlign: 'center'}}>GarageBand.react</h1>
            <div>
            <img src={guitarGrey} alt="view" id="imgDisplay" width="50%" height="500"></img>
            </div>
            <div className="IntroContainer">
                
            </div>
        </div>
        )
    }
}