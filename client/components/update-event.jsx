import React from 'react';

export default class UpdateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resortId: '',
      description: '',
      startDate: '',
      endDate: '',
      profileId: '',
      resortName: ''

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  handleSubmit(object) {
    event.preventDefault();
    const requestOption = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/event/${this.props.params.event.eventId}`, requestOption)
      .then(() => {
        this.props.setView('main');
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.setState({
      resortName: this.props.params.event.resortName,
      resortId: this.props.params.event.resortId,
      startDate: this.props.params.event.start.split('').slice(0, 10).join(''),
      endDate: this.props.params.event.end.split('').slice(0, 10).join(''),
      profileId: this.props.params.event.profileId,
      description: this.props.params.event.eventDescription
    });
  }

  handleChange(events) {
    const input = event.target.name;
    const value = event.target.value;
    const newState = {};

    newState[input] = value;
    this.setState(newState);
    // console.log(this.state.resortName);
    // if (this.state.resortName = 'Mammoth Mountain') {
    //   this.setState({
    //     resortId: 1
    //   });
    // } else if (this.state.resortName = 'Bear Mountain') {
    //   this.setState({
    //     resortId: 2
    //   });
    // } else if (this.state.resortName = 'Mountain High') {
    //   this.setState({
    //     resortId: 3
    //   });
    // }

  }

  // handleClick(event) {

  //   event.preventDefault();
  //   this.props.createEvent(this.state);
  //   this.props.isAttending(this.state);
  //   if (this.props.event) {

  //     this.props.setView('host');

  //   }
  // }

  render() {
    // console.log(this.state);
    return (
      <div className="add-event">
        <form className="mx-3">
          <div className="form-group col-md-9 mx-auto">
            <label htmlFor="exampleFormControlInput1">
              <h3 className="mt-2">Update Event</h3>
            </label>
            <input type="text"
              name="resortName"
              value={this.state.resortName}
              onChange={this.handleChange}
              id="" />
            {/* <input onChange={this.handleChange} value={this.props.params.resortId}>{this.props.params.resortId}</input> */}
            {/* <select
              className="ml-4"
              onChange={this.handleChange}
              id={this.state.resortId}
              name="resortId" >
              <option> select mountain</option>
              <option value="1">mammoth</option>
              <option value="2">bear mountain</option>
              <option value="3">mountain high</option>
            </select> */}
          </div>
          <div className="d-flex col-md-9 mx-auto">
            <div className="form-group">
              <label>start date</label>
              <input
                onChange={this.handleChange}
                value={this.state.startDate}
                name="startDate" type="date"
                className="form-control start-input"
                id="start-id" />
            </div>
            <div className="form-group">
              <label>end date</label>
              <input
                onChange={this.handleChange}
                value={this.state.endDate}
                name="endDate" type="date"
                className="form-control end-input"
                id="end-id" />
            </div>
          </div>
          {/* <div className="form-group mt-2 col-md-9 mx-auto">
            <label htmlFor="exampleFormControlSelect1">how many shredders</label>
            <select
              onChange={this.handleChange}
              value="" name="profileId"
              className="form-control"
              id="exampleFormControlSelect1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </div> */}
          <div className="form-group col-md-9 mx-auto">
            <label htmlFor="exampleFormControlTextarea1">event details</label>
            <textarea
              onChange={this.handleChange}
              value={this.state.description}
              name="description"
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="5"></textarea>
          </div>
          <div className="text-center">
            <button
              onClick={this.handleSubmit}
              className="btn-detail m-auto">update event</button>
          </div>
        </form>
      </div>
    );
  }
}
