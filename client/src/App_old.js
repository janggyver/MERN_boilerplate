import React, { Component } from 'react';
import axios from 'axios';


class App extends Component {

  //initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    password: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  //when component mounts, first thing it does is fetch all exisitng data in our db
  //then we incorporate a polling logic so that we can easily see if our db has
  //changed and implement thouse changes into our UI
  componentDidMount(){

    this.getDataFromDB();
    if(!this.state.intervalIsSet){
      let interval = setInterval(this.getDataFromDB, 1000);
    }
  }

  //never let a process live forever
  //always kill a process everytime we are done using it
  componentWillMount(){
    if(this.state.intervalIsSet){
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet: null});
    }
  }

  //in the front end, we use the id key of our data object
  //in order to identify which we want to update or delete.
  //for our backend, we use the object id assigned by MongoDB to modify
  // data base entries

  //our first get method that uses our backend api to
  //fetch data from our data base
  getDataFromDB = () => {
    fetch("api/getData")
    .then(data => data.json())
    .then(res => this.setState({data: res.data}));
  };

  //our put method that uses our backend api
  //to create new query into our database
  putDataToDB = (message, password) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while(currentIds.includes(idToBeAdded)){
      ++idToBeAdded;
    }
    axios.post("api/putData", {
      id: idToBeAdded,
      message: message,
      password: password,

    })
  }

  //our delete method that uses our backend api
  // to remove exisiting database information
  deleteFromDB = idToDelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if(dat.id === idToDelete){
        objIdToDelete = dat._id;
      }
    });
    console.log(idToDelete);
    console.log(objIdToDelete);
    axios.delete("api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  //our update method that uses our backend api
  //to overwirte existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if(dat.id == idToUpdate){
        console.log(dat.id+ " dat.id");
        console.log(dat._id+ " dat._id");
        objIdToUpdate = dat._id;
        console.log(dat._id+ " dat._id");
        console.log(dat.id + " dat.id");
        console.log(objIdToUpdate + " objIDToUpdate");
      }
    });
 

    axios.post("api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply}
    });
  };


  //here is our UI

  render() {
    const {data} = this.state;
    data.sort( (a, b) => b.id - a.id);
    return (
      <div >
        <ul>
          {data.length <= 0
          ? "No DB entries yet"
          : data.map(dat => (
            <li style={{padding: "10px"}} key={data.message}>
              <span style={{color: "gray"}}> Date: </span> {dat.updatedAt} <br />
              <span style={{color: "gray"}}> OId: </span> {dat._id} <br />
              <span style={{color: "gray"}}> id: </span> {dat.id} <br />
              <span style={{color: "gray"}}> Messgae: </span> {dat.message} <br />
              <span style={{color: "gray"}}> password: </span> {dat.password}
            </li>
            ))
           }
        </ul>
        <div style={{padding: "10px"}}>
           <input
            type = "text"
            onChange = {e => this.setState({message: e.target.value})}
            placeholder = "add something in the database"
            style = {{width: "200px"}}
           />
           <input
            type = "text"
            onChange = {e => this.setState({password: e.target.value})}
            placeholder ="type password"
            style = {{width: "200px"}}
           />
           <button onClick = {() => { 
              this.putDataToDB(this.state.message, this.state.password);
              }}>
            ADD
           </button>
        </div>
        <div style={{padding: "10px"}}>
           <input
            type = "text"
            style = {{width: "200px"}}
            onChange = {(e => {
              e.preventDefault();
              this.setState({idToDelete: e.target.value});
            }) }
            placeholer = "put id of item to delete here"
           />
           <button onClick = {() => this.deleteFromDB(this.state.idToDelete)}>
           DELETE
           </button>
        </div>
        <div style={{padding: "10px"}}>
           <input
            type = "text"
            style ={{width: "200px"}}
            onChange = {(e => {
              e.preventDefault();
              this.setState({idToUpdate: e.target.value});
            } )}
            placeholder = "id of item to update here"
           />
           <input
            type= "text"
            style = {{width: "200px"}}
            onChange = { (e => {
              e.preventDefault();
              this.setState({updateToApply: e.target.value})}
              )
            }
            placeholder = "put new value of the item here"
           />
           <button
            onClick = { () => {
              this.updateDB(this.state.idToUpdate, this.state.updateToApply);
              console.log(this.state.idToUpdate + "최초 id 보내는 값");
              console.log(this.state.updateToApply);
            }}
           >
           UPDATE
           </button>
        </div>

      </div>
    );
  }
}

export default App;
