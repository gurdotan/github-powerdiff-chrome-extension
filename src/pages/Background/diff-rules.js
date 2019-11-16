const rules = {
	java: [
		{
			name    : 'Hide files only with import/package changes',
			callback:( ({ el, changes }) => {
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
			}).toString(),
		}
	],
};

export default rules;
