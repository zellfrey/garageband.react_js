import React from 'react';
import { Route, Link } from 'react-router-dom'
import UserPage from './UserPage'

export default class Users extends React.Component {

    renderSpecificUserPage =()=>{
        console.log("no u")
    }

render() {
        return (
          <div>
              {this.renderSpecificUserPage()}
          </div>
        )
    }
  }