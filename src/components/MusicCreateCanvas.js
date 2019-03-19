import React from 'react';
import {bpmBar} from '../dummyData';

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
            soundVolume: 50,
            play: false
        }
    }

    
    componentDidMount(){
        this.drawCanvas()
    }

    //button functions
    onChangeBPMSlider = (e) =>{this.setState({bpm: e.target.value})}

    onPlay = () =>{
        this.setState({play: true})
        const rectangles  = this.state.rectangles
        this.playBpmBar()
        return (rectangles ? rectangles.map(rect => this.onGridSnap(rect)) : null)
    }

    onAdd = () =>{
        if(!this.state.play){
            const newRectangle ={posX: 200, posY: 100, width: 50, height: 50}
            this.setState({rectangles: this.state.rectangles.concat(newRectangle)})
            this.drawRectangle(200,100,50, 50)
        }
    }


    onChangeVolumeSlider = (e) =>{this.setState({soundVolume: e.target.value})}

    onSaveProject = () =>{
        this.state.rectangles.map(rect => this.onGridSnap(rect))
        const canvas = this.MusicCanvas.current
        const rectList = this.state.rectangles
        return this.props.newProjectFetch("test", "8k imaging", "", canvas.width, canvas.height, this.state.notes.length, rectList)
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
        const canvas = this.MusicCanvas.current
        const rectangles = this.state.rectangles
        bpmBar.posX += this.state.bpm / 120
        if(bpmBar.posX > canvas.width){
            bpmBar.posX = 0
            cancelAnimationFrame(this.playBpmBar)
            this.setState({play: false})
            return null
        }else{
            this.drawCanvas()
            this.drawBpmBar()
            requestAnimationFrame(this.playBpmBar)
            return(rectangles ? rectangles.map(rect => this.onRectangleAndBPMCollision(rect.posX, rect.width, rect.note_id)) : null)
        }
    }

    onRectangleAndBPMCollision = (x, width, note_id) => {
        if(bpmBar.posX >= x  && bpmBar.posX <= x + width){
            console.log(note_id)
        }
    }

    drawCanvas = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        const rectangles = this.state.rectangles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.drawGrid()
        return (rectangles ? rectangles.map(rect => {this.drawRectangle(rect.posX, rect.posY, rect.width, rect.height)}) : null)
    }

    drawGrid = () =>{
        const canvas = this.MusicCanvas.current
        const ctx = this.MusicCanvas.current.getContext('2d')
        let yIntersectArray = []
        ctx.beginPath()
        let j = 0
            for(let i = 0; i < canvas.height; i+=(canvas.height/this.state.notes.length)){
                yIntersectArray.push({yValue: i, note_id: j})
                ctx.moveTo(0, i)
                ctx.lineTo(canvas.width, i)
                j ++
            }
        ctx.strokeStyle = 'grey' 
        ctx.stroke()
        return this.setState({gridYNoteBoundariesArray: yIntersectArray})
    }

    drawRectangle = (x,y,width, height) =>{
        const ctx = this.MusicCanvas.current.getContext('2d')
        ctx.fillStyle = 'LightSeaGreen';
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
        <div>
        <h3>MusicCanvas</h3>
            <div>
                <canvas ref={this.MusicCanvas} id="music" width="1200" height="400"  style ={{background: '#303942'}}
                onMouseDown={this.dragRectangleStart} onMouseMove={this.dragRectangle} onMouseUp={this.dragRectangleEnd}></canvas>
            </div>
            <div>
                <input type="range" id="bpm range" min="100" max="400" value={this.state.bpm} onChange={this.onChangeBPMSlider}></input>
                <button id="play" onClick={this.onPlay} >play</button>
                <button id="add" onClick={this.onAdd} >add</button>
                <input type="range" id="volume" min="0" max="100" value={this.state.soundVolume} onChange={this.onChangeVolumeSlider}></input>
                <button id="save" onClick={this.onSaveProject} >save</button>
            </div>
        </div>
        )
    }
}