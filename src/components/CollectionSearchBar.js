import React from 'react';
import '../Collection.css'

export default class CollectionSearchBar extends React.Component{



    render (){
        return(
            <div className= 'searchOptions'>
            <input 
                onChange={event => this.props.onFilterFormChange(event)}
                placeholder='search projects'
                />
            {/* <select value={this.props.filterSelectOption} onChange={this.props.onFilterSelectChange}>
                <option value="all">All</option>
                <option value="Latest">Latest</option>
                <option value="Highest Rating">Highest Rating</option>
                <option value="Lowest Rating">Lowest Rating</option>
            </select> */}
            </div>
        )
    }
}