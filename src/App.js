import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './components/Home'
import MusicCreateCanvas from './components/MusicCreateCanvas'
import Collection from './components/Collection'
import Users from './components/Users'
import UnknownPage from './components/UnknownPage'

const notesURL = 'http://localhost:3000/api/v1/notes'
const projectsURL = 'http://localhost:3000/api/v1/projects'
const rectanglesURL = 'http://localhost:3000/api/v1/rectangles'
const usersURL = 'http://localhost:3000/api/v1/users'
const likesURL = 'http://localhost:3000/api/v1/likes/'

class App extends Component {
  constructor(){
    super();
    this.state={
      notes: [],
      projects: [],
      rectangles: [],
      users: [],
      searchInput: '',
      loggedUser: null,
      projectIdEdit: null,
      projectEdit: []
    }
  }

  onFilterFormChange = (e) =>{
    this.setState({searchInput: e.target.value})
  }

  filteredProjects = () =>{
    const search = this.state.searchInput.toLowerCase()

    const filterProjects = this.state.projects.filter(proj =>{
      if(proj.name.toLowerCase().includes(search) === true){

        return proj
      }else if(proj.author.name.toLowerCase().includes(search) === true){
        return proj
      }
    })
    return filterProjects
  }

  filterSignedUser = ()=>{
    const uniqUser = this.state.users.find(user => {return user.id ===this.state.loggedUser})
    return uniqUser
  }

  renderEditPage =(id, project) =>{
    this.setState({
      projectIdEdit: id,
      projectEdit: project
    })
    this.props.history.push(`/edit/${id}`);
  }

  // renderUserPage =() =>{
  //   console.log("user page")
  //   this.props.history.push(`/users/${this.state.loggedUser}`);
  // }

  //Server stuff
  componentWillMount(){
    fetch(notesURL).then(resp => resp.json()).then(octave => this.setState({notes: octave}))
    fetch(projectsURL).then(resp => resp.json()).then(proj => this.setState({projects: proj}))
    fetch(rectanglesURL).then(resp => resp.json()).then(rect => this.setState({rectangles: rect}))
    fetch(usersURL).then(resp => resp.json()).then(people => this.setState({users: people}))
    this.setState({loggedUser: 2})
  }

  //Project CRUD server fetch requests

  newProjectFetch =(name, img, desc, w, h, aON, tempo, rectangles) =>{
    const newProject = {author_id: 2, name: name, image: img, description: desc, width: w,height: h, amount_of_notes: aON, tempo: tempo}
    return fetch(projectsURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).then(resp => resp.json())
    .then(resp => {
      this.setState({projects: this.state.projects.concat(resp)})
      this.createEachRectangle(rectangles,resp.id)
    })
  }

  editProjectFetch = (name, desc, w, h, aON, tempo, rectangles)=>{
    console.log(name, desc,w, h, aON, tempo, rectangles )
      //delete object.keyname;
      const editedProject ={name: name, description: desc, width: w, height: h, tempo: tempo, amount_of_notes: aON}

     return fetch(`http://localhost:3000/api/v1/projects/${this.state.projectEdit.id}`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProject)
        }).then(resp => resp.json())
          .then( updatedProject => {
            const updatedProjects = this.state.projects.map( p => p.id === updatedProject.id ? updatedProject : p)
            this.setState({ projects: updatedProjects })
            this.EditEachRectangle(rectangles, updatedProject.id)
        })
    }


  onHandleDeleteProject = (e) =>{
    const id = parseInt(e.target.parentElement.id)
    const selectedProj = this.state.projects.find(proj =>proj.id === id)
    selectedProj.rectangles.map(rect => this.deleteRectangleFetch(rect.id))
    return fetch(`http://localhost:3000/api/v1/projects/${selectedProj.id}`,
      {method:'Delete'}).then(resp => resp.json())
      .then(resp => {
        this.setState({projects: this.state.projects.filter(proj => {return proj.id !== resp.id})})
    })
  }

  //Rectangle CRUD server fetch requests

  createEachRectangle = (rects, proj_id)=>{
    console.log(rects)
    for(const rect of rects){
      rect.project_id = proj_id
      this.newRectangleFetch(rect);  
    }
    let projIndex =  this.state.projects.findIndex(p => p.id ===proj_id)
    let projectsCopy = JSON.parse(JSON.stringify(this.state.projects))

    projectsCopy[projIndex].rectangles = rects
   this.setState({
      projects:projectsCopy 
    }) 
    this.props.history.push('/collection');
  }
  newRectangleFetch = (rectangle)=>{
    return fetch(rectanglesURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rectangle)
    }).then(resp => resp.json())
    .then(rect => {
      this.setState({rectangles: this.state.rectangles.concat(rect)})});
  }

  EditEachRectangle= (rectangles, proj_id)=>{
    for(const rect of rectangles){
      if(rect.id === undefined){
        rect.project_id = proj_id
        this.newRectangleFetch(rect);
        console.log("new rectangle")
      }else{
        console.log("edited rectangle")
        this.EditRectangleFetch(rect);  
        }
      }
    this.props.history.push('/collection');        
  }

  EditRectangleFetch = (rect)=>{
     const editedRect = {
          id: rect.id,
          project_id: rect.project_id, 
          note_id: rect.note_id,
          posX: rect.posX, 
          posY: rect.posY, 
          width: rect.width, 
          height: rect.height
        }
     return fetch(`http://localhost:3000/api/v1/rectangles/${rect.id}`,{
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRect)
        }).then(resp => resp.json())
          .then( updatedRectangle => {
            const updatedRectangles = this.state.rectangles.map( r => r.id === updatedRectangle.id ? updatedRectangle : r)
            this.setState({ rectangles: updatedRectangles })
        })
    }



  deleteRectangleFetch = (rectID) =>{
    return fetch(`http://localhost:3000/api/v1/rectangles/${rectID}`,
      {method:'Delete'}).then(resp => resp.json())
  }

 //Like CRUD server fetch requests
  onHandleLikeProject = (e) =>{
    const likeOBJ = {admirer_id: this.state.loggedUser, project_id: parseInt(e.target.parentElement.id)}
    const project = this.state.projects.find(proj => {return proj.id === likeOBJ.project_id })
    const liked = project.likes.find(like =>{return like.admirer_id === likeOBJ.admirer_id})
    
    return (liked ? this.deleteLikeFetch(liked.id) : this.newLikeFetch(likeOBJ))
  }

  newLikeFetch =(like)=>{
    return fetch(likesURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like)
    })
    .then(resp => resp.json())
    .then(addedLike => this.updateProjectLikes(addedLike))
  }

  updateProjectLikes = (addlike) =>{
    const projects = this.state.projects
    const uniqProject = projects.find(p => {return p.id === addlike.project_id})
    const updatedProjects= []
    for(const proj of projects){
        if(proj.id === uniqProject.id){
            proj.likes.push(addlike)
            updatedProjects.push(proj) 
        }else{
          updatedProjects.push(proj)  
        }
    }
    return this.setState({projects: updatedProjects})
  }

  deleteLikeFetch = (likeID) =>{
    return fetch(`http://localhost:3000/api/v1/likes/${likeID}`,
      {method:'Delete'})
      .then(resp => resp.json())
      .then(deletedLike => this.updateDeleteProjectLikes(deletedLike))
  }

  updateDeleteProjectLikes = (deletelike) =>{
    const projects = this.state.projects
    const uniqProject = projects.find(p => {return p.id === deletelike.project_id})
    const updatedProjects= []
    for(const proj of projects){
        if(proj.id === uniqProject.id){
            let likesFilter = proj.likes.filter(like => {return like.id !== deletelike.id})
            proj.likes = likesFilter
            updatedProjects.push(proj) 
        }else{
          updatedProjects.push(proj)  
        }
    }
    return this.setState({projects: updatedProjects})
  }

  render() {
    return (
      <div className="App">
        <NavBar loggedUser={this.state.loggedUser}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/create"  render={
            routerProps => <MusicCreateCanvas {...routerProps} 
            editProjectFetch={this.editProjectFetch}
            notes={this.state.notes} 
            newProjectFetch={this.newProjectFetch}
              />
            }/>
          <Route exact path="/collection" render={
            routerProps => <Collection {...routerProps}
            projects={this.filteredProjects()}
            notes={this.state.notes}
            onFilterFormChange={this.onFilterFormChange}
            onHandleLikeProject={this.onHandleLikeProject}
              />
            } />
            <Route path={`/users/${this.state.loggedUser}`} render={ 
              routerProps => <Users {...routerProps} 
              filterSignedUser={this.filterSignedUser()} 
              projects={this.state.projects}
              notes={this.state.notes}
              onHandleDeleteProject={this.onHandleDeleteProject}
              renderEditPage={this.renderEditPage}
              /> 
            }/>
            <Route path={`/edit/${this.state.projectIdEdit}`}  render={
            routerProps => <MusicCreateCanvas {...routerProps} 
            notes={this.state.notes}
            projectEdit={this.state.projectEdit}
            newProjectFetch={this.newProjectFetch}
            editProjectFetch={this.editProjectFetch}
              />
            }/>
            <Route component={UnknownPage}/>
        </Switch>
        {/* <div>Icons made by <a href="https://www.freepik.com/" 
          title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 
          title="Flaticon">www.flaticon.com</a> is licensed by
           <a href="http://creativecommons.org/licenses/by/3.0/" 
           title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
        </div> */}
      </div>
    );
  }
}

export default withRouter(App);