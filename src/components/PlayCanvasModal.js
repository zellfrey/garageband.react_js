import React from 'react';
import '../PlayCanvasModal.css'
import playButton from '../canvas_imgs/music-play.png';
import pauseButton from '../canvas_imgs/music-pause.png';
import loopGreen from '../canvas_imgs/loop-green.png';
import loopGrey from '../canvas_imgs/loop-grey.png';
import stopGreen from '../canvas_imgs/music-stop-green.png';
import stopGrey from '../canvas_imgs/music-stop-grey.png';
import VolumePng from '../canvas_imgs/music-volume.png';
import closeCanvas from '../canvas_imgs/close-canvas.png';


const audioContext = new window.AudioContext()
var bpmBar={posX: 0, move: false}
export default class PlayCanvasModal extends React.Component{
    
    constructor(props){
        super(props);
        this.MusicCanvas= React.createRef();
        this.state={
            user: '',
            project: [],
            rectangles: [],
            notes: this.props.notes,
            soundVolume: 0.2,
            gridYNoteBoundariesArray: [],
            gridXTempoBoundiesArray: [],
            tempo: 120,
            playPause: false,
            loop: false,
            playOnce: true,
        }
    }
    
    componentWillUnmount(){
        cancelAnimationFrame(this.playBpmBar)
        bpmBar.move = false
        bpmBar.posX = 0
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.projectShow !== this.props.projectShow && prevProps.rectanglesShow !== this.props.rectanglesShow){
            this.setState({
                project: this.props.projectShow,
                notes: this.props.notes,
                rectangles: this.props.rectanglesShow,
                tempo: this.props.projectShow.tempo
            })
            requestAnimationFrame(this.drawCanvas)
        }
        if(this.props.showCanvas && this.state.playOnce){
            requestAnimationFrame(this.drawCanvas)
            this.setState({playOnce: false})
        }

    }
    onChangeBPMSlider = (e) =>{
        let rectList = this.state.rectangles
        this.setState({tempo: e.target.value})

        rectList.map(rect => this.onGridSnap(rect))
            this.setState({rectangles: rectList})
        return this.drawCanvas()
    }

    onPlay = () =>{
        bpmBar.move = true
        const rectangles  = this.state.rectangles
        this.drawBpmBar()
        this.playBpmBar(new Date().valueOf())
        this.setState({playPause: true})
        return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
    }
    
    onPause = () =>{
        cancelAnimationFrame(this.playBpmBar)
        bpmBar.move = false
        this.setState({playPause: false})
    }

    onStop = () =>{
        this.setState({loop: false})
        cancelAnimationFrame(this.playBpmBar)
        bpmBar.move = false
        bpmBar.posX = 0;
        this.drawCanvas()
        if(this.state.playPause){
            this.setState({playPause: false})
        }
    }

    setLoop = () =>{this.setState({loop: !this.state.loop})}

    onChangeVolumeSlider = (e) =>{
        return this.setState({soundVolume: e.target.value})
    }

    handleCanvasCleanUp = () =>{
        this.onStop()
        this.props.onHandleCloseProject()
        return this.setState({playOnce: true})
    }

    drawBpmBar = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(bpmBar.posX, 0)
        ctx.lineTo(bpmBar.posX, canvas.height)
        ctx.strokeStyle = '#00A572' 
        ctx.stroke()
    }
    
    playBpmBar =() => {
        if(bpmBar.move){
            let rectList = this.state.rectangles
            const canvas = this.MusicCanvas.current
            const rectangles = this.state.rectangles
            bpmBar.posX += this.state.tempo/60
            if(bpmBar.posX > canvas.width+1){
                bpmBar.posX = 0
                if(this.state.loop){
                    bpmBar.posX += this.state.tempo/60
                    this.drawCanvas()
                    this.drawBpmBar()
                    rectList.map(rect => this.onGridSnap(rect))
                        this.setState({rectangles: rectList})
                    requestAnimationFrame(this.playBpmBar)
                }else{
                    cancelAnimationFrame(this.playBpmBar)
                    this.onStop() 
                    return null     
                }
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
            if(bpmBar.posX >= rect.posX && bpmBar.posX <= rect.posX + rect.width){ 
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
        masterGainNode.gain.setTargetAtTime(0, audio.currentTime+((width*0.016)), 0.1);
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
        ctx.fillRect(x, y, (canvas.width/(this.state.tempo/2)), height);
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
    render(){
        return (this.props.showCanvas ?
            <div className='canvasPlay-modal-content '>
            <img src={closeCanvas} alt="closeCanvas" id="closeCanvasButton" width="32" height="32" onClick={this.handleCanvasCleanUp}></img>
            <h3 style={{textAlign: 'center', top: '-5%', left: '10%', margin: '0px', padding: '0px', position: 'relative', width: '1000px'}}>{this.state.project.name}</h3>
            <div className="canvasModalView">
                <canvas  className='rcorners2' ref={this.MusicCanvas} id="music" width="1200" height="400"  style ={{background: '#303942'}}></canvas>
            </div>
            <div className="canvasModalButtons">
                {
                    this.state.loop ? 
                    <img src={loopGreen} alt="loopGreen" id="loop" width="32" height="32" onClick={this.setLoop}></img>
                    :
                    <img src={loopGrey} alt="loopGrey" id="loop" width="32" height="32" onClick={this.setLoop}></img> 
                }
                {
                    !this.state.playPause ?
                    <img src={playButton} alt="play" id="play" width="32" height="32" onClick={this.onPlay}></img>
                    :
                    <img src={pauseButton} alt="pause" id="play" width="32" height="32" onClick={this.onPause}></img>
                }
                {
                    !this.state.playPause ?
                    <img src={stopGrey} alt="stopGrey" id="stop" width="32" height="32" onClick={this.onStop}></img>
                    :
                    <img src={stopGreen} alt="stopGreen" id="stop" width="32" height="32" onClick={this.onStop}></img>
                }
                    <img src={VolumePng} alt="volumePNG" id="volumeImg" width="32" height="32"></img>
                <input type="range" 
                    id="volume" min="0.0" max="1.0" step="0.01" 
                    value={this.state.soundVolume} 
                    onChange={this.onChangeVolumeSlider}>
                </input>
                </div>
                {/* <p>{this.state.project.description}</p> */}
            </div> : null
        )
    }
}
