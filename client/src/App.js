import React, { Component } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
 import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

// const styles = {
//   textInput: {
//     marginRight: '10px',
//     color: "blue",
//     // #F3C677
//   },
//   textInputInput: {
//     color: "red",
//     // #F3C677
//   },
// };

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});


class App extends Component {

  s
  // initialize our state
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

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    //this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (message, password) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message,
      password: password
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { classes } = this.props;
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.id}>
                  <span style={{ color: "gray" }}> OID: </span> {dat._id} <br />
                  <span style={{ color: "gray" }}> Date: </span> {dat.updatedAt} <br />
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> Message: </span> {dat.message.split("\n")
                  .map((item, i) => {return <p key={i}>{item}</p>})}<br />
                  <span style={{ color: "gray" }}> Password: </span> {dat.password} <br />
                  
                </li>
              ))}
        </ul>
        <div style={{ padding: "10px" }}>
          {/* <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          /> */}

          {/*@material-ui  multiline */}

          <TextField
            id="filled-with-placeholder"
            label="Input password"
            placeholder="Placeholder"
            className={classes.textField}
            helperText="Required when delete"
            margin="normal"
            variant="filled"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <TextField
            id="filled-textarea"
            label="Write what you want"
            placeholder="You can write multiline"
            multiline={true}
            className={classes.textField}
            margin="normal"
            variant="filled"
            style = {{width: 800}}
            onChange={(e)=>this.setState({message: e.target.value })}
          />
          <div class="mdc-text-field mdc-text-field--textarea">
            <textarea id="textarea" class="mdc-text-field__input" rows="8" cols="40"
              onChange={(e)=>this.setState({message: e.target.value })}
            ></textarea><br/>
            <label for="textarea" class="mdc-floating-label">Wrtie everything that you want to say!</label>
          </div>

          {/* <input
            type="text"
            style={{ width: "200px" }}
            multiline={true} 
            numberOfLines={10}
            onChange={e => this.setState({ password: e.target.value })}
            placeholder="put new password"
          /> */}

          {/* <TextField
            rows={2}
            hintText="notes"
            multiLine={true}
            style={styles.textInput}
            textareaStyle={styles.textInputInput}
            onChange={(e)=>this.setState({message: e.target.value })}
            // rows={2}
             /> */}
          <button onClick={() => this.putDataToDB(this.state.message, this.state.password)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (App);