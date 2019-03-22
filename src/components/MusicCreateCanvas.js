import React from 'react';
import {bpmBar} from '../dummyData';
import CanvasCreateSubmit from './CanvasCreateSubmit';
import { BrowserRouter as Link } from "react-router-dom";
import '../CanvasSubmit.css'


const audioContext = new window.AudioContext()
var frameTime;     
var lastFrameTime= new Date().valueOf;;  
var eventTime;      
var timeInterval = 1000;
export default class MusicCreateCanvas extends React.Component{

    constructor(props){
        super(props);
        this.MusicCanvas= React.createRef();
        this.state ={
            gridYNoteBoundariesArray: [],
            rectangles: [],
            notes: this.props.notes,
            clickedRectangle: null,
            bpm: 300,
            soundVolume: 0.5,
            play: false,
            showSubmitModal: false,
        }
    }


    
    componentDidMount(){
        this.drawCanvas()
    }

    handleSubmitClose = () =>{
        this.setState({showSubmitModal: false})
    }

    //button functions
    onChangeBPMSlider = (e) =>{this.setState({bpm: e.target.value})}

    onPlay = () =>{
        if(!this.state.showSubmitModal){
            this.setState({play: true})
            const rectangles  = this.state.rectangles
            this.playBpmBar(new Date().valueOf())
             
            return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
        }     
    }

    onAdd = () =>{
        if(!this.state.play && !this.state.showSubmitModal){

            const newRectangle ={posX: 200, posY: 100, width: 50, height: 50}
            this.setState({rectangles: this.state.rectangles.concat(newRectangle)})
            this.drawRectangle(200,100,50, 50)
        }
    }

    


    onChangeVolumeSlider = (e) =>{
        console.log(e.target.value)
        return this.setState({soundVolume: e.target.value})}

    onSaveProject = () =>{
        this.setState({showSubmitModal: true}) 
    }

    onProjectSave = (name, desc) =>{
        this.state.rectangles.map(rect => this.onGridSnap(rect))
        const canvas = this.MusicCanvas.current
        const rectList = this.state.rectangles
        return this.props.newProjectFetch(name, "", desc, canvas.width, canvas.height, this.state.notes.length, rectList)
    }

    drawBpmBar = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(bpmBar.posX, 0)
        ctx.lineTo(bpmBar.posX, canvas.height)
        ctx.strokeStyle = '#aacaca' 
        ctx.stroke()
    }
    
    playBpmBar =(time) => {
        frameTime = time - lastFrameTime
        const canvas = this.MusicCanvas.current
        const rectangles = this.state.rectangles
        let timeSinceEvent = time-eventTime; // get the time since the event started
        let timeSinceLastSync = timeSinceEvent % timeInterval;
        bpmBar.posX += this.state.bpm / 120
        if(bpmBar.posX > canvas.width){
            bpmBar.posX = 0
            cancelAnimationFrame(this.playBpmBar)
            this.setState({play: false})
            lastFrameTime = time
            return null
        }else{
            this.drawCanvas()
            this.drawBpmBar()
            requestAnimationFrame(this.playBpmBar)
            lastFrameTime = time;
        }
        rectangles.map(rect => this.onRectangleAndBPMCollision(rect))
    }

    onRectangleAndBPMCollision = (rect) => {
        if(bpmBar.posX >= rect.posX  && bpmBar.posX <= rect.posX + rect.width){ 
            const note = this.state.notes.find(note =>note.id === rect.note_id)
            this.playSound(note.freq, audioContext)       
        }   
    }

    playSound = (freq, audio) =>{
        const masterGainNode = audio.createGain();
        masterGainNode.connect(audio.destination);
        masterGainNode.gain.value = this.state.soundVolume;
        const osc = audio.createOscillator();
        osc.connect(masterGainNode);
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.start();
        eventTime = new Date().valueOf()
        osc.stop(audio.currentTime + 0.16)
    }

    drawCanvas = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        const rectangles = this.state.rectangles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.drawGrid()
    return rectangles.map(rect => {this.drawRectangle(rect.posX, rect.posY, rect.width, rect.height)})
    }

    drawGrid = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        let yIntersectArray = []
        ctx.beginPath()
        let noteID = 1
            for(let i = 0; i < canvas.height; i+=(canvas.height/this.state.notes.length)){
                yIntersectArray.push({yValue: i, note_id: noteID})
                ctx.moveTo(0, i)
                ctx.lineTo(canvas.width, i)
                noteID ++
            }
        ctx.strokeStyle = 'grey' 
        ctx.stroke()
        return this.setState({gridYNoteBoundariesArray: yIntersectArray})
    }

    drawRectangle = (x,y,width, height) =>{
        const ctx = this.MusicCanvas.current.getContext('2d')
        ctx.fillStyle = `rgb(32,178,${y})`;
        ctx.fillRect(x, y, width, height);
    }

    onGridSnap = (rectangle) =>{
        let uniqRect = rectangle
        const yBoundaries = this.state.gridYNoteBoundariesArray
        const yBoundList = yBoundaries.filter(yCoord =>{return Math.abs(yCoord.yValue - uniqRect.posY) < (yBoundaries[1].yValue +1)})
        let yLowerBound = yBoundList[0]
        let yUpperBound = yBoundList[1]
        
        if(Math.abs(uniqRect.posY - yLowerBound.yValue) < Math.abs(uniqRect.posY - yUpperBound.yValue)){
            uniqRect.posY = yLowerBound.yValue
            uniqRect.note_id = yLowerBound.note_id
            this.drawCanvas()
        }
        else{
            uniqRect.posY = yUpperBound.yValue
            uniqRect.note_id = yUpperBound.note_id
            this.drawCanvas()
        }
    }

    dragRectangleStart = (e) =>{
        const canvas = this.MusicCanvas.current
        let relativePosY = e.pageY - canvas.offsetTop
        let relativePosX = e.pageX - canvas.offsetLeft
        
       let clickedRect = this.state.rectangles.find(rect => {
            if((rect.posX < relativePosX && rect.posY < relativePosY) && 
                (rect.posX+rect.width > relativePosX && rect.posY+rect.height > relativePosY)){ 
                return rect
                }
            }
        )
        return this.setState({clickedRectangle: clickedRect})
    }

    dragRectangle = (e) =>{
        let clickedRect = this.state.clickedRectangle
        const canvas = this.MusicCanvas.current
        let relativePosY = e.pageY - canvas.offsetTop
        let relativePosX = e.pageX - canvas.offsetLeft
        if(clickedRect){
            clickedRect.posX = relativePosX- clickedRect.width/2
            clickedRect.posY = relativePosY - clickedRect.height/2
            this.drawCanvas()
            //max X-axis collision
            if((clickedRect.posX + clickedRect.width) >= canvas.width){
                clickedRect.posX = canvas.width - clickedRect.width
                this.drawCanvas()
            }
            //min X-axis collision
            else if (clickedRect.posX <= 0){
                clickedRect.posX = 0
                this.drawCanvas()
            }
            //max Y-axis collision
            if((clickedRect.posY + clickedRect.height) >= canvas.height){
                clickedRect.posY = canvas.height - clickedRect.height
                this.drawCanvas()
            }
            //min Y-axis collision
            else if (clickedRect.posY <= 0){
                clickedRect.posY = 0
                this.drawCanvas()
            }
        }
    }

    dragRectangleEnd = () =>{
        let clickedRect = this.state.clickedRectangle
        if(clickedRect){
            this.onGridSnap(clickedRect)
            return this.setState({clickedRectangle: null})
        }
    }

    render (){
        return(
        <div className={this.state.showSubmitModal ? "modal" : "good"}>
        <h3>MusicCanvas</h3>
            <div>
                <canvas ref={this.MusicCanvas} id="music" width="1200" height="400"  style ={{background: '#303942'}}
                onMouseDown={this.dragRectangleStart} onMouseMove={this.dragRectangle} onMouseUp={this.dragRectangleEnd}></canvas>
            </div>
                <input className={this.state.showSubmitModal ? "buttonHide" : "good"} 
                    type="range" id="bpm range" min="100" max="400" 
                    value={this.state.bpm} 
                    onChange={this.onChangeBPMSlider}>
                </input>
                <button className={this.state.showSubmitModal ? "buttonHide" : "good"} 
                    id="play" 
                    onClick={this.onPlay} 
                    >play
                </button>
                <button  className={this.state.showSubmitModal ? "buttonHide" : "good"}
                    id="add" 
                    onClick={this.onAdd} 
                    >add
                </button>
                <input  className={this.state.showSubmitModal ? "buttonHide" : "good"}
                    type="range" 
                    id="volume" min="0.0" max="1.0" step="0.01" 
                    value={this.state.soundVolume} 
                    onChange={this.onChangeVolumeSlider}>
                </input>
                <button  className={this.state.showSubmitModal ? "buttonHide" : "good"}
                    id="save" 
                    onClick={this.onSaveProject} 
                    >save
                </button>
            <div>
                <CanvasCreateSubmit 
                    show={this.state.showSubmitModal} 
                    rectangles={this.state.rectangles}
                    onProjectSave={this.onProjectSave}
                    handleSubmitClose={this.handleSubmitClose}
                    />
            </div>
        </div>
        )
    }
}

// 1553121286524
// 1553121286539
// 1553121286555
// 1553121286573
// 1553121286589
// 1553121286606
// 1553121286625
// 1553121286640
// 1553121286657
// 1553121286674
// 1553121286689
// 1553121286705
// 1553121286722
// 1553121286741
// 1553121286757
// 1553121286774
// 1553121286791
// 1553121286807
// 1553121286824
// 1553121286840
// 1553121286856