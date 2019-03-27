import React from 'react';
import CollectionSearchBar from '../components/CollectionSearchBar'
import ProjectCard from './ProjectCard';
import PlayCanvasModal from './PlayCanvasModal'; 
import '../PlayCanvasModal.css'

export default class Collection extends React.Component{

    constructor(props){
        super(props);
        this.state={
            filterSelectOption: "All",
            projects: this.props.projects,
            notes: this.props.notes,
            projectShow: [],
            rectanglesShow: [],
            showCanvasModal: false,
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.projects !== this.props.projects){
            this.setState({
                projects: this.props.projects,
                notes: this.props.notes
            })
        }
    }

    renderProjectCards = ()=>{
       const projectCards = this.props.projects.map((project, idx)=>{
            return <ProjectCard key={idx} 
                    project={project} 
                    onHandleViewProject={this.onHandleViewProject} 
                    onHandleLikeProject={this.props.onHandleLikeProject}/>
                }
            )
        return projectCards
    }

    onFilterSelectChange = (e) =>{
        this.setState({filterSelectOption: e.target.value})
    }

    

    onHandleViewProject = (e) =>{
        const projID= parseInt(e.target.parentElement.id)
        const uniqProject = this.props.projects.find(proj =>{return proj.id === projID})
        console.log(uniqProject.rectangles)
        this.setState({
            projectShow: uniqProject,
            rectanglesShow:  uniqProject.rectangles
        })
        return this.setState({showCanvasModal: true})
    }

    onHandleCloseProject = ()=>{this.setState({showCanvasModal: false})}

    render (){
        return(
        <div className={this.state.showCanvasModal ? "modal" : "good"}>
            Music creations
            <CollectionSearchBar 
                filterSelectOption={this.state.filterSelectOption} 
                onFilterSelectChange={this.onFilterSelectChange} 
                onFilterFormChange={this.props.onFilterFormChange}
                />
            <div className= 'CanvasList'>
            {this.renderProjectCards()}
            <PlayCanvasModal 
                showCanvas={this.state.showCanvasModal} 
                notes={this.state.notes} 
                projectShow={this.state.projectShow} 
                rectanglesShow={this.state.rectanglesShow}
                onHandleCloseProject={this.onHandleCloseProject}
                />
            </div>
        </div>
        )
    }
}