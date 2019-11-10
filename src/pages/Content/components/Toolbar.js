import React, { PropTypes, useState, useCallback } from 'react';
import { Toggle, Select } from '@datorama/app-components';
import rules from '../diff-rules';


const RuleSelect = () => {
  const [selected, setSelected] = useState([]);
  // const options = [
  //   { value: '1', label: 'orange' },
  //   { value: '2', label: 'purple' },
  //   { value: '3', label: 'black' },
  //   { value: '4', label: 'green' },
  //   { value: '5', label: 'yellow' },
  //   { value: '6', label: 'white' }
  // ];
  // const options = Object.keys(rules)
  //   .map(key => rules[key])

  const options = rules.java.map(rule => ({value: rule.callback, label: rule.name}));
  console.log('options: ', options);

  return (
    <Select
      placeholder="select members"
      searchable
      inlineSearch
      multi
      maxTags={2}
      values={selected}
      options={options}
      onChange={setSelected}
    />
  );
};

const Toolbar = () => {

  const [checked, setCheck] = useState(true);
  const toggleCheck = useCallback(() => setCheck(!checked), [checked]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <Toggle onClick={toggleCheck} checked={checked} label="default" style={{float: 'left'}} />
      <RuleSelect disabled={checked} style={{float: 'left'}}/>
    </div>
  );
};

// Toolbar.propTypes = {};
//
// Toolbar.defaultProps = {};

export default Toolbar;
