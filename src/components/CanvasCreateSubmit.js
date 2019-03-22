import React from 'react';
import '../CanvasSubmit.css'

export default class CanvasCreateSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state={
            rectangles: [],
            projectName: "",
            projectDesc: "",
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.rectangles !== this.props.rectangles){
            this.setState({rectangles: this.props.rectangles})
        }
    }

    handleNameChange = (e) =>{
       const name = e.target.value
       return this.setState({projectName: name})
    }

    handleDescriptionChange = (e) =>{
        const description = e.target.value
        return this.setState({projectDesc: description})
    }

    handleProjectSubmit =(e) =>{
        const name = this.state.projectName
        const description = this.state.projectDesc
        e.preventDefault()
        if(name.length <= 3){
            window.confirm("You cannot save without a title");
            return null
        }
        if(description.length <= 5){
            window.confirm("You cannot save without a description");
            return null
        }
        if(this.state.rectangles.length === 0){
            let check = window.confirm("You currently have no notes. Are you sure you want to continue?")
            if(check){
                console.log("go ahead")
                this.props.onProjectSave(name, description)
            }
            else{
                console.log("cancel submit")
                return this.handleCleanUp()
            }
        }
        return this.props.onProjectSave(name, description)
    }

    handleCleanUp = () =>{
        this.setState({
            projectName: "",
            projectDesc: ""
        })
        return this.props.handleSubmitClose()
    }

    render(){
        return(this.props.show ?
            <div className='submit-modal-content'>
                <form onSubmit={this.handleProjectSubmit}>
                    <input placeholder="Project title" type="text" 
                        value={this.state.projectName}
                        onChange={this.handleNameChange}/>
                    <textarea placeholder="Project description"
                        value={this.state.projectDesc} 
                        onChange={this.handleDescriptionChange}/>
                    <input type="submit" value="Save" />
                <button onClick={this.handleCleanUp}>Cancel</button>
                </form>
            </div> : null
        )
    }
}