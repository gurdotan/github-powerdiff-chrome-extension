// import minify from '@node-minify/core';

const rules = [
	{
		name    : 'Hide files only with import/package changes',
		ext     : ['java'],
		apply: ({ el, changes }) => {
			const importChangesOnly = changes
				.map(node => node.text)
				.reduce((acc, text) => acc && (text.startsWith('import ') || text.startsWith('package ') || text === ''), true);

			if (importChangesOnly) {
				const viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

				//
				// viewedCheckbox exists only in PR pages, not commit pages
				//
				if (viewedCheckbox && !viewedCheckbox.checked) {
					viewedCheckbox.click();
				}
			}
		},
		clear: () => {
			console.log("cleared: " + 'Hide files only with import/package changes');
		}
	},
	{
		name    : 'Hide import changes',
		ext     : ['java'],
		apply: ({ changes }) => {
			changes
				.filter(node => node.text.startsWith('import '))
				.map(node => node.row)
				.forEach(row => {
					// row.dataset.hideImportChanges = true;
					row.style.display = 'none';
						// row.removeProperty('display');
					// row.dataset.hideImportChanges = row.dataset.hideImportChanges !== 'true';
					// if (row.dataset.hideImportChanges) {
					// 	row.style.display = 'none';
					// } else {
					// 	row.removeProperty('display');
					// }
				});
		},
		clear: ({ changes }) => {
			changes
				.filter(node => node.text.startsWith('import '))
				.map(node => node.row)
				.forEach(row => {
					// row.dataset.hideImportChanges = true;
					// row.style.display = 'none';
					row.style.removeProperty('display');
				});
		}
	},
	{
		name    : 'Collapse files with no more visible changes',
		ext     : ['java'],
		apply: ({ el, changes }) => {
			const hidden = changes
				.map(node => node.row.style.display)
				.every(display => display === 'none');

			if (hidden) {
				const viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

				//
				// viewedCheckbox exists only in PR pages, not commit pages
				//
				if (viewedCheckbox && !viewedCheckbox.checked) {
					viewedCheckbox.click();
				}
			}
		},
		clear: ({ el, changes }) => {
			const viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

			//
			// viewedCheckbox exists only in PR pages, not commit pages
			//
			if (viewedCheckbox && viewedCheckbox.checked) {

				const hidden = changes
					.map(node => node.row.style.display)
					.every(display => display === 'none');

				if (hidden) {
					viewedCheckbox.click();
				}
			}
		}
	},
	// {
	// 	name    : 'Hide line-break changes',
	// 	ext     : 'ts',
	// 	apply: ({ el, changes, groupedChanges }) => {
	// 		console.log('el: ', el);
	// 		console.log('changes: ', changes);
	// 		console.log('groupedChanges: ', groupedChanges);
	//
	// 		groupedChanges.forEach(group => {
	// 			const deletion = group.deletion.map(change => change.text).join('');
	// 			const addition = group.addition.map(change => change.text).join('');
	//
	//
	// 			minify({
	// 				content: addition
	// 			}).then(function(addition) {
	// 				console.log('addition min:', addition);
	// 			});
	//
	// 			minify({
	// 				content: deletion
	// 			}).then(function(deletion) {
	// 				console.log('deletion min: ', deletion);
	// 			});
	//
	//
	// 		});
	// 	}
	// }
].map(rule => (
	{
		...rule,
		apply: rule.apply.toString(),
		clear: rule.clear.toString()
	})
);

export default rules;
