import React from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";

// Constants
import { SCENARIO_TYPES } from '../../constants';

const ScenarioTypeSelector = ({ onScenarioTypeSelect, selectedValue }) => {
  const radioButtonList = SCENARIO_TYPES.map(({id, label}) => {
    return (
      <RadioButton key={id} value={id} iconSize={0.1} iconInnerSize={0.05} rootColor="#666666" pointColor="#0AA5EE" >
        {label}
      </RadioButton>
    );
  });

  return (
    <div>
      <RadioGroup onChange={onScenarioTypeSelect} value={selectedValue} horizontal>
        {radioButtonList}
      </RadioGroup>
    </div>
  );
};

export default ScenarioTypeSelector;