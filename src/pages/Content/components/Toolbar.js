import React, { useState, useCallback, useEffect } from 'react';
import { Toggle, Select } from '@datorama/app-components';
import StorageSync from '../../../common/storage-sync';


const RuleSelect = () => {
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const { rules } = await StorageSync.get('rules');
			const options = rules.java.map(rule => ({ value: rule.callback, label: rule.name }));
			console.log('options: ', options);
			setOptions(options);
		}

		fetchData();
	}, []);

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
				display       : 'flex',
				flexDirection : 'column',
				justifyContent: 'space-around',
			}}
		>
			<Toggle onClick={toggleCheck} checked={checked} label="default" style={{ float: 'left' }}/>
			<RuleSelect disabled={checked} style={{ float: 'left' }}/>
		</div>
	);
};

export default Toolbar;
