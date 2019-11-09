import React from 'react';
import ReactDOM from 'react-dom';
import rules from './diff-rules';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const CODE_ADDITION = '.blob-code-addition';
const CODE_DELETION = '.blob-code-deletion';


function findCodeChangeNodes(file) {
  return [...file.querySelectorAll(`${CODE_ADDITION}, ${CODE_DELETION}`)]
    .filter(el => el);  // Filters (null, undefined, 0, -0, NaN, "", false, document.all)
}

//
// Create a code change object from each file node
//
function parseToFileList(file) {

  const changes = findCodeChangeNodes(file).map(el => ({
    type      : el.classList.contains(CODE_ADDITION) ? 'addition' : 'deletion',
    lineNumber: Number(el.previousElementSibling.dataset.lineNumber),
    text      : el.innerText.trim(),
    el,
  }));

  return {
    el : file,
    ext: file.dataset.fileType.slice(1),
    changes,
  };
}

const onlyFilesWithChanges = file => file.changes.length;

const powerDiff = () => {
  // const container = document.querySelector('.pr-review-tools');
  // const anchor = document.createElement('div');
  // anchor.id = 'extension-root';
  // container.insertBefore(anchor, container.childNodes[0]);
  // ReactDOM.render(<Newtab/>, anchor);

  [...document.querySelectorAll('.file')]
    .map(parseToFileList)
    .filter(onlyFilesWithChanges)
    .forEach(file => {
      if (rules[file.ext]) {
        rules[file.ext].forEach(rule => rule.callback(file));
      }
    });
};


const { document, MutationObserver } = window;

let observer;
const observe = () => {
  observer && observer.disconnect();
  // const pjaxContainer = document.querySelector('[data-pjax-container]');
  const pjaxContainer = document.querySelector('body');
  observer = new MutationObserver(start);
  observer.observe(pjaxContainer, { childList: true });
};


const start = () => {
  observe();
  powerDiff();
};

// observe();

// Didn't work properly without a setTimeout for some reason
setTimeout(start, 10000);


