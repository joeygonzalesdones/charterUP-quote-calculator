import React, { Component } from 'react';
import _get from "lodash.get";

// APIs
import maps from '../apis/maps';

// Components
import RadioButtonSelector from './RadioButtonSelector';
import UserInput from './UserInput';

// Constants
import { QUOTE_TYPES, SCENARIO_TYPES, TRIP_TYPES, MARGIN, FONT_SIZE } from '../constants';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appView: "enterParameters",
      quoteType: QUOTE_TYPES[0].id || "",
      scenarioType: SCENARIO_TYPES[0].id || "",
      useRoundTrip: true,
      origins: "",
      originText: "",
      destinations: "",
      destinationText: "",
      distance: -1,
      distanceText: "",
      duration: -1,
      durationText: "",
      passengerCount: -1,
      dayCount: 1,
      bookedPrice: -1
    };
  }

  // Helper method to convert units used by Google Distance Matrix API
  _metersToMiles = meters => {
    const feet = meters * 3.28084;
    const miles = feet / 5280.0;
    return miles;
  };

  // Helper method to convert units used by Google Distance Matrix API
  _secondsToHours = seconds => {
    const hours = seconds / 3600.0;
    return hours;
  }

  // ~~~~~~~~~~~~~~~~~~~~ Update state from user input ~~~~~~~~~~~~~~~~~~~~
  onSubmitOrigin = location => {
    this.setState({ origins: location });
  };

  onSubmitDestination = location => {
    this.setState({ destinations: location });
  };

  onSubmitPassengerCount = count => {
    this.setState({ passengerCount: parseInt(count) || 1 });
  }

  onSubmitDayCount = count => {
    this.setState({ dayCount: parseInt(count) || 1 });
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Use the Google Distance Matrix API to compute the distance and duration between an origin point and a destination point,
  // and parse the returned JSON object.
  onMapsQuerySubmit = async ({origins, destinations}) => {
    const response = await maps.get('/json', {
      params: {
        origins,
        destinations
      }
    });

    const { data } = response;
    const { status, origin_addresses, destination_addresses, rows } = data;

    if (status === "OK") { // The user supplied a valid origin and destination
      const elements = _get(rows[0], "elements");
      const distance = _get(elements[0], "distance") || { value: -1, text: "" };
      const duration = _get(elements[0], "duration") || { value: -1, text: "" };
      const originText = origin_addresses[0] || "";
      const destinationText = destination_addresses[0] || "";
      this.setState({
        appView: "chooseQuote",
        distance: this._metersToMiles(distance.value),
        distanceText: distance.text,
        duration: this._secondsToHours(duration.value),
        durationText: duration.text,
        originText,
        destinationText
      });   
    }
  };

  // ~~~~~~~~~~~~~~~~~~~~ Callbacks for user controls ~~~~~~~~~~~~~~~~~~~~
  onQuoteTypeSelect = quoteType => {
    this.setState({ quoteType });
  };

  onScenarioTypeSelect = scenarioType => {
    this.setState({ scenarioType });
  };

  onRoundTripSelect = value => {
    const useRoundTrip = (value === "roundTrip");
    this.setState({ useRoundTrip });
  };

  onGetQuoteClick = () => {
    const { origins, destinations } = this.state;
    this.onMapsQuerySubmit({ origins, destinations });
  };

  onBookItClick = bookedPrice => {
    this.setState({ 
      appView: "confirmation", 
      bookedPrice 
    });
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Compute the relevant prices for a quote
  computeQuote = () => {
    const { distance, duration, passengerCount, dayCount, useRoundTrip } = this.state;
    let byDistance = distance * 4.20; // $4.20 per mile
    let byHour = duration * 125; // $125 per hour
    let byDay = dayCount * 1100; // $1,100 per day
    let busCount = Math.ceil(passengerCount / 50); // 50 passengers per bus

    // Multiply by the number of buses
    byDistance = byDistance * busCount;
    byHour = byHour * busCount;
    byDay = byDay * busCount;

    // The distance and time are doubled for a round trip
    if (useRoundTrip) { 
      byDistance = byDistance * 2;
      byHour = byHour * 2;
    }

    // Choose the best price among the three options
    let minimum = Math.min(byDistance, byHour, byDay);
    let argmin = "";
    if (minimum === byDistance) {
      argmin = " (by mileage)";
    } else if (minimum === byHour) {
      argmin = " (by hour)";
    } else if (minimum === byDay) {
      argmin = " (by day)";
    }

    // Round the numbers to two decimal places
    byDistance = byDistance.toFixed(2);
    byHour = byHour.toFixed(2);
    byDay = byDay.toFixed(2);
    minimum = minimum.toFixed(2);

    return { argmin, busCount, byDistance, byHour, byDay, minimum };
  };

  //////////////////////////////////////////////////////////
  //                                                      //
  //                    Render methods                    //
  //                                                      //
  //////////////////////////////////////////////////////////

  renderInputFields = () => {
    // mileage: mileage based on start point -> end point
    // time: journey time based on start point -> end point
    // daily: number of days to reserve the buses

    switch (this.state.quoteType) {
      case "mileage": {
        return (
          // 1) Origin input box
          // 2) Destination input box
          // 3) Passenger count
          <div>
            <UserInput label="Origin City" onFormSubmit={this.onSubmitOrigin} />
            <UserInput label="Destination City" onFormSubmit={this.onSubmitDestination} />
            <UserInput label="Passenger Count" onFormSubmit={this.onSubmitPassengerCount} />
          </div>
        );
      }
      case "time": {
        return (
          // 1) Origin input box
          // 2) Destination input box
          // 3) Passenger count          
          <div>
            <UserInput label="Origin City" onFormSubmit={this.onSubmitOrigin} />
            <UserInput label="Destination City" onFormSubmit={this.onSubmitDestination} />
            <UserInput label="Passenger Count" onFormSubmit={this.onSubmitPassengerCount} />
          </div>
        );
      }
      case "daily": { // I really didn't understand how this case was supposed to work from the instructions
        return (
          <div>
            <UserInput label="Origin City" onFormSubmit={this.onSubmitOrigin} />
            <UserInput label="Destination City" onFormSubmit={this.onSubmitDestination} />
            <UserInput label="Passenger Count" onFormSubmit={this.onSubmitPassengerCount} />
            <UserInput label="Number of Days" onFormSubmit={this.onSubmitDayCount} />
          </div>
        );
      }
      default: { // same as mileage
        return (
          // 1) Origin input box
          // 2) Destination input box
          // 3) Passenger count
          <div>
            <UserInput label="Origin City" onFormSubmit={this.onSubmitOrigin} />
            <UserInput label="Destination City" onFormSubmit={this.onSubmitDestination} />
            <UserInput label="Passenger Count" onFormSubmit={this.onSubmitPassengerCount} />
          </div>
        );
      }
    };
  };

  renderRoundTripSelector = () => {
    return (
      <div>
        <div>
          Round trip?
        </div>
        <div className="roundTripSelector">
          <RadioButtonSelector dataArray={TRIP_TYPES} onSelectValue={this.onRoundTripSelect} />
        </div>
      </div>
    );
  };

  renderEnterParametersView = () => {
    return (
      <div>
        <div className="header" style={{ margin: MARGIN, fontSize: FONT_SIZE }}>
          Quote Calculator
        </div>

        <div className="description" style={{ margin: MARGIN }}>
          We thank you for using our bus reservation quote calculator! Please note that our rates are $4.20 per mile, $125.00 per hour, or $1,100.00 per day, 
          and each of our buses can accomodate up to 50 passengers.
        </div>

        <div className="quoteTypeSelector" style={{ margin: MARGIN }}>
          <RadioButtonSelector dataArray={QUOTE_TYPES} onSelectValue={this.onQuoteTypeSelect} />
        </div>

        <div className="inputFields" style={{ margin: MARGIN }}>
          {this.renderInputFields()}
        </div>

        <div className="roundTripSelector" style={{ margin: MARGIN }}>
          {this.renderRoundTripSelector()}
        </div>

        <div className="getQuoteButton" style={{ margin: MARGIN }}>
          <button className="ui primary button" onClick={this.onGetQuoteClick}>
            Get Quote
          </button>
        </div> 
      </div>
    );
  };

  renderChooseQuoteView = () => {
    const { argmin, busCount, byDistance, byHour, byDay, minimum } = this.computeQuote();
    const { originText, destinationText, distanceText, durationText, dayCount, useRoundTrip, scenarioType } = this.state;

    const busCountString = (busCount > 1 ? `${busCount} buses` : "1 bus");
    const dayCountString = (dayCount > 1 ? `${dayCount} days` : "1 day");

    let journeyOverviewString = "";
    let byDistanceString = "";
    let byHourString = "";
    let byDayString = "";
    let minimumString = `Minimum rate: $${minimum}${argmin}`;
    let price = -1;

    if (useRoundTrip) {
      journeyOverviewString = `Quote for round-trip journey from ${originText} to ${destinationText}`;
      byDistanceString = `By mileage: $4.20/mi * ${distanceText} * ${busCountString} * 2 = $${byDistance}`;
      byHourString = `By time: $125/hr * ${durationText} * ${busCountString} * 2 = $${byHour}`;
      byDayString = `By day: $1,100/day * ${dayCountString} * ${busCountString} = $${byDay}`;
    } else {
      journeyOverviewString = `Quote for one-way journey from ${originText} to ${destinationText}`;
      byDistanceString = `By mileage: $4.20/mi * ${distanceText} * ${busCountString} = $${byDistance}`;
      byHourString = `By time: $125/hr * ${durationText} * ${busCountString} = $${byHour}`;
      byDayString = `By day: $1,100/day * ${dayCountString} * ${busCountString} = $${byDay}`;
    }

    let quoteString = "";
    if (scenarioType === "best") {
      quoteString = minimumString;
      price = minimum;
    } else if (scenarioType === "daily2") {
      quoteString = byDayString;
      price = byDay;
    } else if (scenarioType === "hourly") {
      quoteString = byHourString;
      price = byHour;
    } else if (scenarioType === "mileage2") {
      quoteString = byDistanceString;
      price = byDistance;
    }

    return (
      <div>
        <div className="header" style={{ margin: MARGIN, fontSize: FONT_SIZE }}>
          Quote Calculator
        </div>

        <div className="description" style={{ margin: MARGIN }}>
          We thank you for using our bus reservation quote calculator! Please note that our rates are $4.20 per mile, $125.00 per hour, or $1,100.00 per day, 
          and each of our buses can accomodate up to 50 passengers.
        </div>

        <div className="scenarioTypeSelector" style={{ margin: MARGIN }}>
          <RadioButtonSelector dataArray={SCENARIO_TYPES} onSelectValue={this.onScenarioTypeSelect} />
        </div>

        <div className="quoteDisplay" style={{ margin: MARGIN, fontSize: FONT_SIZE }}>
          {journeyOverviewString}
        </div>

        <div className="quoteDisplay" style={{ margin: MARGIN, fontSize: FONT_SIZE }}>
          {quoteString}
        </div>

        <div className="bookItButton" style={{ margin: MARGIN }}>
          <button className="ui primary button" onClick={() => this.onBookItClick(price)}>
            Book It!
          </button>
        </div> 
      </div>
    );
  };

  renderConfirmationView = () => {
    const { bookedPrice } = this.state;
    return (
      <div>
        <div className="header" style={{ margin: MARGIN, fontSize: FONT_SIZE }}>
          Quote Calculator
        </div>

        <div className="confirmationMsg">
          {`You've successfully booked your journey for $${bookedPrice}. We can't wait until you ride with us!`}
        </div>
      </div>
    );
  };

  render() {
    switch (this.state.appView) {
      case "enterParameters":
        return this.renderEnterParametersView();
      case "chooseQuote":
        return this.renderChooseQuoteView();
      case "confirmation":
        return this.renderConfirmationView();
      default:
        return this.renderEnterParametersView();
    }
  }
}

export default App;