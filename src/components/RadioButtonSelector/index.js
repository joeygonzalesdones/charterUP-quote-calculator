import React, { Component } from "react";

class RadioButtonSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: this.props.dataArray[0].id
    };
  }

  renderButtonList = () => {
    const { dataArray, onSelectValue } = this.props;
    const buttonList = dataArray.map(({id, label}) => {
      // Only allow the currently selected button to have the Primary class
      const name = (id === this.state.selectedValue ? "ui button primary" : "ui button");
      return (
        <button className={name} key={id} onClick={() => {
          this.setState({ selectedValue: id });
          onSelectValue(id);
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

export default RadioButtonSelector;