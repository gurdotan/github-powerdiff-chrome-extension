import React, { useState, useCallback, useEffect } from 'react';
import { Toggle, Select } from '@datorama/app-components';
import StorageSync from '../../../common/storage-sync';
import {applyDiffRules, clearDiffRules} from '../index';


const RuleSelect = () => {
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState([]);
	const [mappedRules, setMappedRules] = useState({});

	useEffect(() => {
		async function fetchData() {
			const { rules } = await StorageSync.get('rules');

			const mapping = rules.map((rule, i) => ({...rule, id: i}))
				.reduce((obj, rule) => ({
					...obj,
					[rule.id]: rule
				}), {});
			setMappedRules(mapping);
			console.log('mapping: ', mapping);


			// const mapping = Object.keys(rules)
			// 	.map(ext => rules[ext].map((rule, i) => ({...rule, ext, id: `${ext}-${i}`})))
			// 	.flat()
			// 	.reduce((obj, item) => ({
			// 		...obj,
			// 		[item.id]: item
			// 	}), {});
			// setMappedRules(mapping);
			//
			// console.log('mapping: ', mapping);

			const options = Object.keys(mapping).map(key => ({ value: mapping[key].id, label: mapping[key].name }));
			setOptions(options);
		}

		fetchData();
	}, []);

	const selectRules = (rules) => {
		// console.log('rules: ', rules);
		// console.log('mappedRules: ', mappedRules);
		// console.log('mapped rules: ', rules.map(rule => mappedRules[rule.value]));

		setSelected(rules);

		const rulesToApply = rules.filter(rule => !selected.includes(rule));
		const rulesToClear = selected.filter(rule => !rules.includes(rule));

		if (rulesToApply.length) {
			applyDiffRules(rulesToApply.map(rule => mappedRules[rule.value]));
		}
		if (rulesToClear.length) {
			clearDiffRules(rulesToClear.map(rule => mappedRules[rule.value]));
		}
	};

	return (
		<Select
			placeholder="select members"
			searchable
			inlineSearch
			multi
			maxTags={2}
			values={selected}
			options={options}
			onChange={selectRules}
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
