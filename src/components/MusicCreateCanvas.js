import React from 'react';
import {bpmBar} from '../dummyData';
import CanvasCreateSubmit from './CanvasCreateSubmit';
import '../CanvasSubmit.css'

const audioContext = new window.AudioContext()   
var totalFrametime = 0
export default class MusicCreateCanvas extends React.Component{

    constructor(props){
        super(props);
        this.MusicCanvas= React.createRef();
        this.state ={
            gridYNoteBoundariesArray: [],
            gridXTempoBoundiesArray: [],
            freeForm: true,
            animate: true,
            rectangles: [],
            notes: this.props.notes,
            clickedRectangle: null,
            tempo: 120,
            soundVolume: 0.5,
            play: false,
            showSubmitModal: false,
            stopBPM: false
        }
    }


    
    componentDidMount(){
        this.drawCanvas()
    }

    handleSubmitClose = () =>{
        this.setState({showSubmitModal: false})
    }

    //button functions
    onChangeBPMSlider = (e) =>{
        //console.log(e.target.value)
        this.setState({tempo: e.target.value})
        return this.drawCanvas()
    }

    onPlay = () =>{
        if(!this.state.showSubmitModal){
            this.setState({stopBPM: false})
            const rectangles  = this.state.rectangles
            this.drawBpmBar()
            
            this.playBpmBar(new Date().valueOf())
            return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
        }
    }
    
    onPause = () =>{
        cancelAnimationFrame(this.playBpmBar)
        this.setState({stopBPM: true})
        this.drawBpmBar()
        console.log(bpmBar.posX)
    }

    onStop = () =>{
        cancelAnimationFrame(this.playBpmBar)
        bpmBar.posX = 0;
        this.setState({stopBPM: true})
        console.log(bpmBar.posX)
    }

    onAdd = () =>{
        if(!this.state.playPause && !this.state.showSubmitModal){
            const canvas = this.MusicCanvas.current
            const newRectangle ={posX: 200, posY: 100, width: (canvas.width/(this.state.tempo/2)), height: (canvas.height/16)}
            this.setState({rectangles: this.state.rectangles.concat(newRectangle)})
            this.drawRectangle(newRectangle.posX, newRectangle.posY, newRectangle.width, newRectangle.height)
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
        return this.props.newProjectFetch(name, "", desc, canvas.width, canvas.height, this.state.notes.length, this.state.tempo, rectList)
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
    if(!this.state.stopBPM){
            const canvas = this.MusicCanvas.current
            const rectangles = this.state.rectangles
            bpmBar.posX += this.state.tempo/60
            totalFrametime += time
            if(bpmBar.posX > canvas.width+1){
                bpmBar.posX = 0
                cancelAnimationFrame(this.playBpmBar)
                this.setState({play: false}) 
                return null
            }else{
                this.drawCanvas()
                this.drawBpmBar()
                requestAnimationFrame(this.playBpmBar)
            }
            rectangles.map(rect => this.onRectangleAndBPMCollision(rect))
        }
    }

    onRectangleAndBPMCollision = (rect) => {
        if(rect.note_id != null){
            if(bpmBar.posX >= rect.posX-5 && bpmBar.posX <= rect.posX + rect.width){ 
                const note = this.state.notes.find(note =>note.id === rect.note_id)
                this.playSound(note.freq, audioContext,rect.width)
                rect.note_id = null       
            }   
        }   
    }

    playSound = (freq, audio,width) =>{
        const masterGainNode = audio.createGain();
        masterGainNode.connect(audio.destination);
        masterGainNode.gain.value = this.state.soundVolume;
        const osc = audio.createOscillator();
        osc.connect(masterGainNode);
        osc.type = 'sine';
        osc.frequency.value = freq;
        // debugger
        osc.start();
        //Gradually descreases the sound, preventing the "click" sound affect
        masterGainNode.gain.setTargetAtTime(0, audio.currentTime+((width*0.016)), 0.1);
        // debugger

        //Left to demonstrate the difference. This function below stops the wave propagantion immediately
        //creating a click. Causes sharp transitions in sound
        //osc.stop(audio.currentTime + this.state.tempo /120)
    }

    drawCanvas = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        const rectangles = this.state.rectangles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.drawGrid()
    return rectangles.map(rect => {return this.drawRectangle(rect.posX, rect.posY, rect.width, rect.height)})
    }

    drawGrid = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        let yIntersectArray = []
        let xIntersectArray = []
        ctx.beginPath()
        let noteID = 1
            for(let i = 0; i < canvas.height; i+=(canvas.height/16)){
                yIntersectArray.push({yValue: i, note_id: noteID})
                ctx.moveTo(0, i)
                ctx.lineTo(canvas.width, i)
                noteID ++
            }
        ctx.strokeStyle = 'grey' 
        ctx.stroke()
        ctx.moveTo(0, 0)
        ctx.beginPath()
            for(let i = 0; i < canvas.width; i+=(canvas.width/(this.state.tempo/2))){
                xIntersectArray.push({xValue: i})
                ctx.moveTo(i, 0)
                ctx.lineTo(i ,canvas.height)
            }
        ctx.strokeStyle = 'black' 
        ctx.stroke()
        return this.setState({
            gridYNoteBoundariesArray: yIntersectArray,
            gridXTempoBoundiesArray: xIntersectArray
        })
    }

    drawRectangle = (x,y,width, height) =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        ctx.fillStyle = `rgb(32,178,${y})`;
        ctx.fillRect(x, y, (canvas.width/(this.state.tempo/2)), (canvas.height/16));
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

        if(this.state.freeForm){
        //Xbound snap
            const xBoundaries = this.state.gridXTempoBoundiesArray
            const xBoundList = xBoundaries.filter(xCoord =>{return Math.abs(xCoord.xValue - uniqRect.posX) < (xBoundaries[1].xValue +1)})
            let xLeftBound = xBoundList[0]
            let xRightBound = xBoundList[1]
            if(Math.abs(uniqRect.posX - xLeftBound.xValue) < Math.abs(uniqRect.posX - xRightBound.xValue)){
                uniqRect.posX = xLeftBound.xValue
                this.drawCanvas()
            }
            else{
                uniqRect.posX = xRightBound.xValue
                this.drawCanvas()
            }
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
                <canvas ref={this.MusicCanvas} id="music" width="1200" height="400"  style ={{background: '#303942', position: 'fixed', left: '25%'}}
                onMouseDown={this.dragRectangleStart} onMouseMove={this.dragRectangle} onMouseUp={this.dragRectangleEnd} ></canvas>
            </div>
                <input className={this.state.showSubmitModal ? "buttonHide" : "good"} 
                    type="range" id="tempo range" min="25" max="220" 
                    value={this.state.tempo} 
                    onChange={this.onChangeBPMSlider}>
                </input>
                <button 
                    id="play" 
                    onClick={this.onPlay} 
                    >play
                </button>
                <button 
                    id="pause" 
                    onClick={this.onPause} 
                    >pause
                </button>
                <button 
                    id="stop" 
                    onClick={this.onStop} 
                    >stop
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
                {totalFrametime}
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