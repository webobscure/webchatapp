import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import './Join.css'
const options = [
    { value: 'F.R.I.E.N.D.S.', label: 'F.R.I.E.N.D.S.' },
    { value: 'American Horror Story', label: 'American Horror Story' },
    { value: 'The Big Bang Theory', label: 'The Big Bang Theory' },
    { value: 'Gravity Falls', label: 'Gravity Falls' },
    { value: 'The Simpsons', label: 'The Simpsons' },
  ];
export default class Join extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            room: '',
            selectedOption:null
        }
        this.inputPressed = this.inputPressed.bind(this)
        this.optionPressed = this.optionPressed.bind(this)
    }
    handleChange = (selectedOption) => {
        this.setState(
          { room: selectedOption.value },
          () => console.log(this.state.room)
        );
        this.setState(
            {selectedOption},
          () => console.log(`Option selected:`, this.state.selectedOption )

        )
       
       
    }
   
    inputPressed = (event) => {
        this.setState({name : event.target.value})
    }
    optionPressed = (event) => {
        let room = this.state.room
        this.setState({[room]: event.target.value})
        console.log(event.target.value);
        console.log(this.state.room);
    }
    render() {
        const { room, name,selectedOption } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="joinOuterContainer">
                    <div className="joinInnerContainer">
                        <h1 className="head">Join</h1>
                        <div><input placeholder="Your name" className="joinInput" type="text" onChange={this.inputPressed} value={name}/></div>
                        <div>
                        <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        className="mt-20"
      />
                        </div>
                        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                            <button className="button mt-20" type="submit" value="Submit">Sign in room</button>
                        </Link>
                        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chatweb?name=${name}&room=${room}`}>
                            <button className="button mt-20" type="submit" value="Submit">Sign in Camera Room</button>
                        </Link>
                    </div>
                </div>
            </form>
        )
    }
}
