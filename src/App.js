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

class App extends Component {
  constructor(){
    super();
    this.state={
      notes: [],
      projects: [],
      rectangles: [],
      users: []
    }
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
    const newProject = { user_id: 2, name: name, image: img, description: desc, width: w,height: h, amount_of_notes: aON, tempo: tempo}
    return fetch(projectsURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).then(resp => resp.json())
    .then(this.setState({projects: this.state.projects.concat(newProject)}))
    .then(resp => this.createEachRectangle(rectangles,resp.id))
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
  createEachRectangle = (rectangle, proj_id)=>{
    for(const rect of rectangle){
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
    }).then(resp => resp.json()).then(rect => this.setState({rectangles: this.state.rectangles.concat(rect)}));
  }

  deleteRectangleFetch = (rectID) =>{
    return fetch(`http://localhost:3000/api/v1/rectangles/${rectID}`,
      {method:'Delete'}).then(resp => resp.json())
  }


  render() {
    return (
      <div className="App">
        <NavBar/>
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
            projects={this.state.projects}
            notes={this.state.notes}
            onHandleDeleteProject={this.onHandleDeleteProject}
              />
            } />
            <Route exact path="/users/:id" render={ routerProps => <Users {...routerProps} users={this.state.users}/>}/>
            <Route component={UnknownPage}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);