import React from 'react';
import {bpmBar} from '../dummyData';
import '../PlayCanvasModal.css'


const audioContext = new window.AudioContext()
export default class PlayCanvasModal extends React.Component{
    
    constructor(props){
        super(props);
        this.MusicCanvas= React.createRef();
        this.state={
            user: '',
            project: [],
            rectangles: [],
            notes: this.props.notes,
            soundVolume: 0.5,
            gridYNoteBoundariesArray: [],
            gridXTempoBoundiesArray: [],
            tempo: 120,
            stopBPM: false
        }
    }


    componentDidUpdate(prevProps){
        if(prevProps.projectShow !== this.props.projectShow && prevProps.rectanglesShow !== this.props.rectanglesShow){
            this.setState({
                project: this.props.projectShow,
                rectangles: this.props.rectanglesShow,
                stopBPM: false
            }) 
            this.drawCanvas()
        }
    }
    onChangeBPMSlider = (e) =>{
        console.log(e.target.value)
        this.setState({tempo: e.target.value})
        return this.drawCanvas()
    }

    onPlay = () =>{
            const rectangles  = this.state.rectangles
            this.playBpmBar(new Date().valueOf())
            return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
    }     

    onChangeVolumeSlider = (e) =>{
        console.log(e.target.value)
        return this.setState({soundVolume: e.target.value})
    }

    handleCanvasCleanUp = () =>{
        this.setState({stopBPM: true})
        bpmBar.posX = 0;
        // this.setState({
        //     project: [],
        //     rectangles: []
        // })
        return this.props.onHandleCloseProject()
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
    
    playBpmBar =() => {
        if(!this.state.stopBPM){
            const canvas = this.MusicCanvas.current
            const rectangles = this.state.rectangles
            bpmBar.posX += this.state.tempo / 60
            if(bpmBar.posX > canvas.width){
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

    playSound = (freq, audio, width) =>{
        const masterGainNode = audio.createGain();
        masterGainNode.connect(audio.destination);
        masterGainNode.gain.value = this.state.soundVolume;
        const osc = audio.createOscillator();
        osc.connect(masterGainNode);
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.start();
        masterGainNode.gain.setTargetAtTime(0, audio.currentTime+0.3, 0.1);
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
        let xIntersectArray = []
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
        ctx.moveTo(0, 0)
        ctx.beginPath()
            for(let i = 0; i < canvas.width; i+=(canvas.width/(this.state.tempo/3))){
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
    render(){
        return (this.props.showCanvas ?
            <div className='canvasPlay-modal-content '>
            <h3 style={{textAlign: 'center'}}>{this.state.project.name}</h3>
            <div>
                <canvas ref={this.MusicCanvas} id="music" width="1200" height="400"  style ={{background: '#303942'}}></canvas>
            </div>
                <input type="range" id="tempo range" min="25" max="220"  
                    value={this.state.tempo} 
                    onChange={this.onChangeBPMSlider}>
                </input>
                <button 
                    id="play" 
                    onClick={this.onPlay} 
                    >play
                </button>
                <input type="range" 
                    id="volume" min="0.0" max="1.0" step="0.01" 
                    value={this.state.soundVolume} 
                    onChange={this.onChangeVolumeSlider}>
                </input>
                <button 
                    id="close" 
                    onClick={this.handleCanvasCleanUp} 
                    >close
                </button>
            </div> : null
        )
    }
}
