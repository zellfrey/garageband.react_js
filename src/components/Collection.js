import React from 'react';
import CollectionSearchBar from '../components/CollectionSearchBar'
import CanvasCard from './CanvasCard';

export default class Collection extends React.Component{

    constructor(props){
        super(props);
        this.state={
            filterSelectOption: "All",
            projects: this.props.projects
        }
    }

    onFilterSelectChange = (e) =>{
        this.setState({filterSelectOption: e.target.value})
    }

    render (){
        return(
        <div>
            Music creations
            <CollectionSearchBar filterSelectOption={this.state.filterSelectOption} onFilterSelectChange={this.onFilterSelectChange}/>
            <div className= 'CanvasList'>
            {
            this.state.projects.map((project, idx)=>{return <CanvasCard key={idx} project={project} onHandleDeleteProject={this.props.onHandleDeleteProject}/>})
            }
            </div>
        </div>
        )
    }
}