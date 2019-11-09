const rules = {
  java: [
    {
      name    : 'Hide files only with import changes',
      callback: ({ el, changes }) => {
        const importChangesOnly = changes
          .map(node => node.text)
          .reduce((acc, text) => acc && (text.startsWith('import ') || text === ''), true);

        if (importChangesOnly) {
          let viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

          if (!viewedCheckbox.checked) {
            viewedCheckbox.click();
          }
        }
      },
    },
    {
      name    : 'Hide files only with package name changes',
      callback: ({ el, changes }) => {
        const packageChangesOnly = changes
          .map(node => node.text)
          .reduce((acc, text) => acc && (text.startsWith('package ') || text === ''), true);

        if (packageChangesOnly) {
          let viewedCheckbox = el.querySelector('.js-reviewed-checkbox');

          if (!viewedCheckbox.checked) {
            viewedCheckbox.click();
          }
        }
      },
    },
  ],
};

export default rules;
