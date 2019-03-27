import React from 'react';
import UserPage from './UserPage'


export default class Users extends React.Component {

    
    
    
    render() {
        return (
            <div>
            <UserPage 
                user={this.props.filterSignedUser} 
                projects={this.props.projects} 
                notes={this.props.notes} 
                onHandleDeleteProject={this.props.onHandleDeleteProject}
                renderEditPage={this.props.renderEditPage}
                />
          </div>
        )
    }
  }
