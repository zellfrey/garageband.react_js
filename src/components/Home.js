import React from 'react';
import masterAudio from '../canvas_imgs/audio-mastering-home.jpg'
import guitarGrey from '../canvas_imgs/guitar-greyscale-home.jpg'

export default class Home extends React.Component{
    render (){
        return(
        <div>
            Home
            <div>
            <img src={guitarGrey} alt="view" width="50%" height="500"></img>
            </div>
        </div>
        )
    }
}