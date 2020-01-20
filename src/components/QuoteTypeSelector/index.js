import React, { Component } from "react";

// Constants
import { QUOTE_TYPES } from '../../constants';

class QuoteTypeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: this.props.selectedValue
    };
  }

  renderButtonList = () => {
    const buttonList = QUOTE_TYPES.map(({id, label}) => {
      const name = (id === this.state.selectedValue ? "ui button primary" : "ui button");
      return (
        <button className={name} key={id} onClick={() => {
          this.setState({ selectedValue: id });
          this.props.onQuoteTypeSelect(id);
        }}>
          {label}
        </button>
      );
    });

    return buttonList;
  }

  render() {
    return (
      <div className="ui buttons">
        {this.renderButtonList()}
      </div>
    );
  }
}

export default QuoteTypeSelector;