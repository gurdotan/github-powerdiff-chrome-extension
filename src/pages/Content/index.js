import { printLine } from './modules/print';
import React from 'react';
import ReactDOM from 'react-dom';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine('Using a function from the Print Module');


function findCodeChangeNodes(file) {
  return [...file.querySelectorAll('.blob-code.blob-code-addition, .blob-code.blob-code-deletion')]
    .filter(el => el);  // Filters (null, undefined, 0, -0, NaN, "", false, document.all)
}

//
// Create a code change object from each file node
//
function toCodeChangeList(fileNodes) {
  return fileNodes.map(el => ({
    type      : el.classList.contains('blob-code-addition') ? 'addition' : 'deletion',
    lineNumber: Number(el.previousElementSibling.dataset.lineNumber),
    text      : el.innerText.trim(),
    el,
  }));
}

setTimeout(() => {
  // const container = document.querySelector('.pr-review-tools');
  // const anchor = document.createElement('div');
  // anchor.id = 'extension-root';
  // container.insertBefore(anchor, container.childNodes[0]);
  // ReactDOM.render(<Newtab/>, anchor);

  [...document.querySelectorAll('.file')]
    .filter(el => !!el.querySelector('.blob-code.blob-code-addition, .blob-code.blob-code-deletion'))
    .map(findCodeChangeNodes)
    .map(toCodeChangeList)
    .forEach(codeChanges => {

      console.log(codeChanges);

      const allImports = codeChanges
        .map(node => node.text)
        .reduce((acc, text) => acc && (text.startsWith('import ') || text === ''), true);

      if (allImports) {
        let viewedCheckbox = codeChanges[0].el.closest('.file').querySelector('.js-reviewed-checkbox');

        if (!viewedCheckbox.checked) {
          viewedCheckbox.click();
        }
      }


      // const fileName = file.querySelector('.file-header').dataset.path;
      // console.log(`allImports is ${allImports}:  ${fileName}`);
    });

}, 5000);
