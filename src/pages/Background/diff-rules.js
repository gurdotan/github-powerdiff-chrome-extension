const rules = {
	java: [
		{
			name    : 'Hide files only with import changes',
			callback:( ({ el, changes }) => {
				const importChangesOnly = changes
					.map(node => node.text)
					.reduce((acc, text) => acc && (text.startsWith('import ') || text === ''), true);

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
		},
		{
			name    : 'Hide files only with package name changes',
			callback: (({ el, changes }) => {
				const packageChangesOnly = changes
					.map(node => node.text)
					.reduce((acc, text) => acc && (text.startsWith('package ') || text === ''), true);

				if (packageChangesOnly) {
					const viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

					//
					// viewedCheckbox exists only in PR pages, not commit pages
					//
					if (viewedCheckbox && !viewedCheckbox.checked) {
						viewedCheckbox.click();
					}
				}
			}).toString(),
		},
	],
};

export default rules;
