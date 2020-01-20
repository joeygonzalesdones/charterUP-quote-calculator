import React, { Component } from "react";

class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.DEBOUNCE_RATE = 100;
    this.THROTTLE_RATE = 1000;

    this._debouncedOnFormSubmit = this._debounce(this.props.onFormSubmit, this.DEBOUNCE_RATE);
    this._debouncedOnFormSubmit = this._throttle(this.props.onFormSubmit, this.THROTTLE_RATE);
  }

  // Debounce and throttle implementations by Jhey Tompkins, 2015
  // Taken from https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  // and from https://codepen.io/jh3y/pen/mGVGvm

  /**
   * debounce function
   * use inDebounce to maintain internal reference of timeout to clear
   */
  _debounce = (func, delay) => {
    // delay unit is milliseconds
    // Use a closure to give the returned function persistent state (the inDebounce variable)
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
  }


  /**
   * throttle function that catches and triggers last invocation
   * use time to see if there is a last invocation
   */
  _throttle = (func, limit) => {
    // limit unit is milliseconds
    // Use a closure to give the returned function persistent state (the lastFunc and lastRan variables)
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  onInputChange = event => {
    this.setState({ value: event.target.value }, () => {
        this._debouncedOnFormSubmit(this.state.value);
    });
}; 

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onFormSubmit(this.state.value);
  };

  render() {
    return (
      <div className="search-bar ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <div className="field">
            <label>{this.props.label}</label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.onInputChange}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default UserInput;