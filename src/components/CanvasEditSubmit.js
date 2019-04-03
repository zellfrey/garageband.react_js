import React from 'react';
import '../CanvasEdit.css'

export default class CanvasEditSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state={
            rectangles: [],
            projectEditName: '',
            projectEditDesc: '',
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.rectangles !== this.props.rectangles){
            this.setState({rectangles: this.props.rectangles})
        }
        if(prevProps.projectEdit !== this.props.projectEdit){
            this.setState({
                projectEditName: this.props.projectEdit.name,
                projectEditDesc: this.props.projectEdit.description,
            })
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
            projectEditName: "",
            projectEditDesc: ""
        })
        return this.props.handleSubmitClose()
    }

    render(){
        return(this.props.show ?
            <div className='edit-modal-content'>
                <form onSubmit={this.handleProjectSubmit}>
                    <input placeholder={this.props.projectEdit.name} type="text" 
                        value={this.state.projectEditName}
                        onChange={this.handleNameChange}/>
                    <textarea placeholder={this.props.projectEdit.description} 
                        value={this.state.projectEditDesc} 
                        onChange={this.handleDescriptionChange}/>
                    <input type="submit" value="Save Edit" />
                <button onClick={this.handleCleanUp}>Cancel</button>
                </form>
            </div> : null
        )
    }
}