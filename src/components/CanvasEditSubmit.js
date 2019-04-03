import React from 'react';
import '../CanvasSubmitModal.css'

export default class CanvasEditSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state={
            rectangles: [],
            projectEditName: this.props.projectEdit ? this.props.projectEdit.name : '',
            projectEditDesc: this.props.projectEdit ? this.props.projectEdit.description : '',
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.rectangles !== this.props.rectangles){
            this.setState({rectangles: this.props.rectangles})
        }
    }

    handleNameChange = (e) =>{
       const name = e.target.value
       return this.setState({projectEditName: name})
    }

    handleDescriptionChange = (e) =>{
        const description = e.target.value
        return this.setState({projectEditDesc: description})
    }

    handleProjectSubmit =(e) =>{
        const name = this.state.projectEditName
        const description = this.state.projectEditDesc
        e.preventDefault()
        if(name.length <= 3){
            window.confirm("You cannot save without a title");
            return null
        }
        if(description.length <= 5){
            window.confirm("You cannot save without a description");
            return null
        }
        return this.props.onProjectEditSave(name, description)
    }

    handleCleanUp = () =>{
        this.setState({
            projectEditName: this.props.projectEdit.name,
            projectEditDesc: this.props.projectEdit.description,
        })
        return this.props.handleSubmitClose()
    }

    render(){
        return(this.props.show ?
            <div className='submit-modal-content'>
                <form onSubmit={this.handleProjectSubmit}>
                    <input  id='canvasSubmitName' placeholder={this.props.projectEdit.name} type="text" 
                        value={this.state.projectEditName}
                        onChange={this.handleNameChange}/>
                    <textarea  id='canvasSubmitDesc' placeholder={this.props.projectEdit.description} 
                        value={this.state.projectEditDesc} 
                        onChange={this.handleDescriptionChange}/>
                    <button id='canvasSubmitSave' type="submit" value="Save Edit" >Save</button>
                <button id='canvasSubmitCancel' onClick={this.handleCleanUp}>Cancel</button>
                </form>
            </div> : null
        )
    }
}