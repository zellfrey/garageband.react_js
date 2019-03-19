import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './components/Home'
import MusicCanvas from './components/MusicCanvas'
import Collection from './components/Collection'

const notesURL = 'http://localhost:3000/api/v1/notes'
const projectsURL = 'http://localhost:3000/api/v1/projects'
const rectanglesURL = 'http://localhost:3000/api/v1/rectangles'
const usersURL = 'http://localhost:3000/api/v1/users'

export default class App extends Component {
  constructor(){
    super();
    this.state={
      notes: null,
      projects: [],
      rectangles: null,
      users: null
    }
  }

  //Server stuff
  componentWillMount(){
    fetch(notesURL).then(resp => resp.json()).then(octave => this.setState({notes: octave}))
    fetch(projectsURL).then(resp => resp.json()).then(proj => this.setState({projects: proj}))
    fetch(rectanglesURL).then(resp => resp.json()).then(rect => this.setState({rectangles: rect}))
    fetch(usersURL).then(resp => resp.json()).then(people => this.setState({users: people}))
  }

  newProjectFetch =(name, img, desc, w, h, aON, rectangles) =>{
    const newProject = { user_id: 1, name: name, image: img, description: desc, width: w,height: h, amount_of_notes: aON}
    return fetch(projectsURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).then(resp => resp.json())
    .then(this.setState({projects: this.state.projects.concat(newProject)}))
    .then(resp => this.createEachRectangle(rectangles,resp.id))
  }


  createEachRectangle = (rectangle, proj_id)=>{
    for(const rect of rectangle){
      rect.project_id = proj_id
      this.newRectangleFetch(rect);  
    }
  }

  newRectangleFetch = (rectangle)=>{
    return fetch(rectanglesURL,{
      method:'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rectangle)
    }).then(resp => resp.json()).then(rects => console.log(rects))
  }



  render() {
    return (
      <Router>
        <div className="App">
        <NavBar/>
        <Route exact path="/" component={Home} />
        <Route exact path="/create"  render={
          routerProps => <MusicCanvas {...routerProps} 
          notes={this.state.notes} 
          newProjectFetch={this.newProjectFetch}
          createEachRectangle={this.createEachRectangle}/>
          }/>
        <Route exact path="/collection" render={routerProps => <Collection {...routerProps} projects={this.state.projects}/>} />
        </div>
      </Router>
    );
  }
}

