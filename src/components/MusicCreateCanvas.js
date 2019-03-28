import React from 'react';
import CanvasCreateSubmit from './CanvasCreateSubmit';
import CanvasEditSubmit from './CanvasEditSubmit';
import playButton from '../canvas_imgs/music-play.png';
import pauseButton from '../canvas_imgs/music-pause.png';
import loopGreen from '../canvas_imgs/loop-green.png';
import loopGrey from '../canvas_imgs/loop-grey.png';
import stopGreen from '../canvas_imgs/music-stop-green.png';
import stopGrey from '../canvas_imgs/music-stop-grey.png';
import AddButton from '../canvas_imgs/music-add.png';
import RemoveButton from '../canvas_imgs/music-remove.png';
import SaveButton from '../canvas_imgs/music-save.png';
import VolumePng from '../canvas_imgs/music-volume.png';
import MetroPng from '../canvas_imgs/music-metronome.png';
import '../CanvasSubmit.css'
import '../musicCreate.css'

const audioContext = new window.AudioContext()   
var totalFrametime = 0
var bpmBar={posX: 0, move: false}
var newRectanglePosition = 50
export default class MusicCreateCanvas extends React.Component{

    constructor(props){
        super(props);
        this.MusicCanvas= React.createRef();
        this.state ={
            gridYNoteBoundariesArray: [],
            gridXTempoBoundiesArray: [],
            projectEdit: this.props.projectEdit,
            rectangles: this.props.projectEdit ? this.props.projectEdit.rectangles : [],
            notes: this.props.notes,
            clickedRectangle: null,
            tempo: this.props.projectEdit ? this.props.projectEdit.tempo : 120,
            soundVolume: 0.5,
            playPause: false,
            showSubmitModal: false,
            showEditModal: false,
            loop: false,
        }
    }


    componentWillUnmount(){
        cancelAnimationFrame(this.playBpmBar)
        bpmBar.move = false
        bpmBar.posX = 0
    }

    
    componentDidMount(){
        this.drawCanvas()
    }

    componentDidUpdate(prevProps){
        if(prevProps.notes !== this.props.notes){
            this.setState({
                notes: this.props.notes
            })
        }
    }

    handleSubmitClose = () =>{
        if(this.state.projectEdit){
            this.setState({showEditModal: false}) 
        }else{
            this.setState({showSubmitModal: false}) 
        }
    }

    //button functions
    onChangeBPMSlider = (e) =>{
        const canvas = this.MusicCanvas.current
        let rectList = this.state.rectangles
        this.setState({tempo: e.target.value})

        rectList.map(rect => this.onGridSnap(rect))
            this.setState({rectangles: rectList})
        this.drawCanvas()
        for(const rect of rectList){
            rect.width = canvas.width/(this.state.tempo/2)  
        }
    }

    onPlay = () =>{
        if(!this.state.showSubmitModal){
            bpmBar.move = true
            const rectangles  = this.state.rectangles
            this.drawBpmBar()
            this.playBpmBar(performance.now())
            this.setState({playPause: true})
            console.log(this.state.rectangles)
            return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
        }
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
        totalFrametime = 0;
        this.drawCanvas()
        if(this.state.playPause){
            this.setState({playPause: false})
        }
    }
    setLoop = () =>{this.setState({loop: !this.state.loop})}

    onAdd = () =>{
        if(!this.state.playPause && !this.state.showSubmitModal){
            const canvas = this.MusicCanvas.current
            const newRectangle ={posX: newRectanglePosition, posY: 100, width: (canvas.width/(this.state.tempo/2)), height: (canvas.height/16)}
            const rectList = this.state.rectangles.concat(newRectangle)
            this.setState({rectangles: rectList})
            this.drawRectangle(newRectangle.posX, newRectangle.posY, newRectangle.width, newRectangle.height)
            if(newRectanglePosition+200 > canvas.width){
                newRectanglePosition = 100
            }else{
                newRectanglePosition += 50

            }
        }
    }

    onRemove =() =>{
        if(!this.state.playPause && !this.state.showSubmitModal){
            this.setState({rectangles: this.state.rectangles.slice(0, -1)})
            requestAnimationFrame(this.drawCanvas)
        }
    }

    onChangeVolumeSlider = (e) =>{
        console.log(e.target.value)
        return this.setState({soundVolume: e.target.value})}

    onSaveProject = () =>{
        if(this.state.projectEdit){
            this.setState({showEditModal: true}) 
        }else{
            this.setState({showSubmitModal: true}) 
        }
    }

    onProjectSave = (name, desc) =>{
        const tempo = this.state.tempo
        this.state.rectangles.map(rect => this.onGridSnap(rect))
        const canvas = this.MusicCanvas.current
        const rectList = this.state.rectangles
        for(const rect of rectList){
            rect.width = canvas.width/(tempo/2)  
        }
        return this.props.newProjectFetch(name, "", desc, canvas.width, canvas.height, this.state.notes.length, this.state.tempo, rectList)
    }

    onProjectEditSave =(name, desc)=>{
        this.state.rectangles.map(rect => this.onGridSnap(rect))
        const canvas = this.MusicCanvas.current
        const rectList = this.state.rectangles
        for(const rect of rectList){
            rect.width = canvas.width/(this.state.tempo/2)  
        }
        this.setState({showEditModal: false})
        this.setState({projectEdit: []})
        return this.props.editProjectFetch(name, desc, canvas.width, canvas.height, this.state.notes.length, this.state.tempo, rectList)
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
    
    playBpmBar =(time) => {
        if(bpmBar.move){
            let rectList = this.state.rectangles
            const canvas = this.MusicCanvas.current
            const rectangles = this.state.rectangles
            bpmBar.posX += this.state.tempo/60
            totalFrametime += time
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
            if(bpmBar.posX >= rect.posX-3 && bpmBar.posX <= rect.posX + rect.width){ 
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
        osc.start();
        //Gradually descreases the sound, preventing the "click" sound affect
        masterGainNode.gain.setTargetAtTime(0, audio.currentTime+((width*0.016)), 0.1);

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

    drawRectangle = (x,y) =>{
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
            // if(uniqRect.posX > xBoundList[xBoundList.length - 1].xValue){
            //     uniqRect.posX = xBoundList[xBoundList.length - 2].xValue
            //     this.drawCanvas()
            // }else{
                uniqRect.posX = xRightBound.xValue
                this.drawCanvas()
            // }
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
        let rectList = this.state.rectangles
        let clickedRect = this.state.clickedRectangle
        if(clickedRect){
            for(const rect of rectList){
                if(rect.id === clickedRect.id){
                    rect = clickedRect
                }
            }
            rectList.map(rect => this.onGridSnap(rect))
            this.setState({rectangles: rectList})
            return this.setState({clickedRectangle: null})
        }
    }

    render (){
        return(
        <div className={this.state.showSubmitModal ||this.state.showEditModal ? "modal" : "good"}>
        <div>{totalFrametime}</div> 
            <div>
                <canvas ref={this.MusicCanvas} className="createCanvas" width="1200" height="400"  style ={{background: '#303942'}}
                onMouseDown={this.dragRectangleStart} onMouseMove={this.dragRectangle} onMouseUp={this.dragRectangleEnd} ></canvas>
            </div>
                <input className={this.state.showSubmitModal ? "buttonHide" : "good"} 
                    type="range" id="tempoCreate" min="25" max="220" 
                    value={this.state.tempo} 
                    onChange={this.onChangeBPMSlider}>
                </input>
                <div>
                    {
                        !this.state.playPause ?
                        <img src={playButton} alt="play" id='playCreate' width="32" height="32" onClick={this.onPlay}></img>
                        :
                        <img src={pauseButton} alt="pause" id='playCreate' width="32" height="32" onClick={this.onPause}></img>
                    }
                    {
                        !this.state.playPause ?
                        <img src={stopGrey} alt="stopGrey" id='stopCreate' width="32" height="32" onClick={this.onStop}></img>
                        :
                        <img src={stopGreen} alt="stopGreen" id='stopCreate' width="32" height="32" onClick={this.onStop}></img>
                    }
                    {
                        this.state.loop ? 
                        <img src={loopGreen} alt="play" id='loopCreate' width="32" height="32" onClick={this.setLoop}></img>
                        :
                        <img src={loopGrey} alt="pause" id='loopCreate' width="32" height="32" onClick={this.setLoop}></img>
                    }
                    <img src={AddButton} alt="add" id='addCreate' width="32" height="32" onClick={this.onAdd}></img>
                    <img src={RemoveButton} alt="remove" id='removeCreate' width="32" height="32" onClick={this.onRemove}></img>
                    <img src={SaveButton} alt="save" id='saveCreate' width="32" height="32" onClick={this.onSaveProject}></img>
                </div>
                <input  className={this.state.showSubmitModal ? "buttonHide" : "good"}
                    type="range" 
                    id='volumeCreate' min="0.0" max="1.0" step="0.01" 
                    value={this.state.soundVolume} 
                    onChange={this.onChangeVolumeSlider}>
                </input>
                    <img src={VolumePng} alt="volumeImg" id='volumeImg' width="32" height="32"></img>
                    <img src={MetroPng} alt="metroImg" id='metronome' width="32" height="32"></img>
            <div>
                <CanvasCreateSubmit 
                    show={this.state.showSubmitModal} 
                    rectangles={this.state.rectangles}
                    onProjectSave={this.onProjectSave}
                    handleSubmitClose={this.handleSubmitClose}
                    />
            </div>
            <div>
                <CanvasEditSubmit 
                    show={this.state.showEditModal} 
                    rectangles={this.state.rectangles}
                    projectEdit={this.state.projectEdit}
                    onProjectEditSave={this.onProjectEditSave}
                    handleSubmitClose={this.handleSubmitClose}
                    />
            </div>
        </div>
        )
    }
}