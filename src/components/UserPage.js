import React from 'react';
import { withRouter } from 'react-router-dom';
import UserProjectCard from './UserProjectCard'
import PlayCanvasModal from './PlayCanvasModal'; 
import '../PlayCanvasModal.css'
import userplaceholderImg from '../canvas_imgs/user-placeholder.jpg'

class UserPage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            signedUser:this.props.user,
            userProjects:this.props.projects,
            notes: this.props.notes,
            projectShow: [],
            rectanglesShow: [],
            showCanvasModal: false,
        }
    }


    renderProjectCard = () =>{
        const signedUser = this.props.user
        const projects = this.props.projects.filter((proj) =>{return proj.author.id === signedUser.id})


        return projects.map((proj, idx) =>{
            return <UserProjectCard 
                    key={idx} 
                    project={proj} 
                    onHandleDeleteProject={this.props.onHandleDeleteProject}
                    onHandleViewProject={this.onHandleViewProject} 
                    onHandleEditProject={this.onHandleEditProject}
                    />
            })
    }

    onHandleViewProject = (e) =>{
        const projID= parseInt(e.target.parentElement.id)
        const uniqProject = this.state.userProjects.find(proj =>{return proj.id === projID})
        console.log(uniqProject.rectangles)
        this.setState({
            projectShow: uniqProject,
            rectanglesShow:  uniqProject.rectangles
        })
        return this.setState({showCanvasModal: true})
    }

    onHandleEditProject = (e) =>{
        console.log(e.target.parentElement.id)
        const projID= parseInt(e.target.parentElement.id)
        const uniqProject = this.state.userProjects.find(proj =>{return proj.id === projID})
        
        this.props.renderEditPage(projID, uniqProject)
    }

    onHandleCloseProject = ()=>{this.setState({showCanvasModal: false})}

    render (){
        return(
        <div>
            <div>
                <h3>{this.props.user.name}</h3>
                <h3>{this.props.user.email}</h3>
                <img src={userplaceholderImg} alt="oopsie whoopsie"width="200" height="150"></img>
            </div>
                {this.renderProjectCard()}

                <PlayCanvasModal 
                showCanvas={this.state.showCanvasModal} 
                notes={this.state.notes} 
                projectShow={this.state.projectShow} 
                rectanglesShow={this.state.rectanglesShow}
                onHandleCloseProject={this.onHandleCloseProject}
                />
        </div>
        )
    }
}
export default withRouter(UserPage);