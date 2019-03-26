import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './components/Home'
import MusicCreateCanvas from './components/MusicCreateCanvas'
import Collection from './components/Collection'
import UserPage from './components/UserPage'
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
      loggedUser: 2,
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
      }else if(proj.user.name.toLowerCase().includes(search) === true){
        return proj
      }
    })
    return filterProjects
  }

  filterSignedUser = ()=>{
    const uniqUser = this.state.users.find(user => {return user.id ===this.state.loggedUser})
    return uniqUser
  }

  //Server stuff
  componentWillMount(){
    fetch(notesURL).then(resp => resp.json()).then(octave => this.setState({notes: octave}))
    fetch(projectsURL).then(resp => resp.json()).then(proj => this.setState({projects: proj}))
    fetch(rectanglesURL).then(resp => resp.json()).then(rect => this.setState({rectangles: rect}))
    fetch(usersURL).then(resp => resp.json()).then(people => this.setState({users: people}))
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
      this.createEachRectangle(rectangles,resp.id)
      this.setState({projects: this.state.projects.concat(resp)})})
  }


  onHandleDeleteProject = (e) =>{
    const id = parseInt(e.target.id)
    const selectedProj = this.state.projects.find(proj =>proj.id === id)
    debugger
    selectedProj.rectangles.map(rect => this.deleteRectangleFetch(rect.id))
    return fetch(`http://localhost:3000/api/v1/projects/${e.target.id}`,
      {method:'Delete'}).then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        this.setState({projects: this.state.projects.filter(proj => {return proj.id !== resp.id})})
    })
  }

  //Rectangle CRUD server fetch requests
  createEachRectangle = (rectangles, proj_id)=>{
    for(const rect of rectangles){
      rect.project_id = proj_id
      this.newRectangleFetch(rect);  
    }
    this.props.history.push('/');
  }
  newRectangleFetch = (rectangle)=>{
    return fetch(rectanglesURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rectangle)
    }).then(resp => {
      resp.json()})
    .then(rect => {
      this.setState({rectangles: this.state.rectangles.concat(rect)})});
  }

  deleteRectangleFetch = (rectID) =>{
    return fetch(`http://localhost:3000/api/v1/rectangles/${rectID}`,
      {method:'Delete'}).then(resp => resp.json())
  }

 
  onHandleLikeProject = (e) =>{
    const likeOBJ = {admirer_id: 4, project_id: parseInt(e.target.id)}
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
    .then(resp => resp.json()).then(resp => console.log(resp))
  }

  deleteLikeFetch = (likeID) =>{
    return fetch(`http://localhost:3000/api/v1/likes/${likeID}`,
      {method:'Delete'}).then(resp => resp.json())
  }

  render() {
    return (
      <div className="App">
        <NavBar loggedUser={this.state.loggedUser}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/create"  render={
            routerProps => <MusicCreateCanvas {...routerProps} 
            notes={this.state.notes} 
            newProjectFetch={this.newProjectFetch}
            createEachRectangle={this.createEachRectangle}
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
            <Route exact path={`/users/${this.state.loggedUser}`} render={ 
              routerProps => <Users {...routerProps} 
              filterSignedUser={this.filterSignedUser()} 
              projects={this.state.projects}
              notes={this.state.notes}
              onHandleDeleteProject={this.onHandleDeleteProject}
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