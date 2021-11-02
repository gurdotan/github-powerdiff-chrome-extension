import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './components/toolbar';
import { AppTheme, lightTheme } from '@datorama/app-components';
import { ThemeProvider } from 'styled-components';
import StorageSync from '../../common/storage-sync';

const EXTENSION_ROOT = 'github-powerdiff-extension-root';
const CODE_ADDITION = 'blob-code-addition';
const CODE_DELETION = 'blob-code-deletion';

const App = () => (
	<AppTheme theme={lightTheme} provider={ThemeProvider}>
		<Toolbar/>
	</AppTheme>
);




function findCodeChangeNodes(file) {
	return [...file.querySelectorAll(`.${CODE_ADDITION}, .${CODE_DELETION}`)]
		.filter(el => el);  // Filters (null, undefined, 0, -0, NaN, "", false, document.all)
}

function getLineNumber(el) {
	const type = document.querySelector('meta[name="diff-view"]').content;
	let lineNumberEl;

	switch (type) {
		case 'unified':

			//
			// In unified diff view, the HTML elements holding the line numbers
			// are different for code additions and code deletions
			//
			lineNumberEl = el.classList.contains(CODE_ADDITION) ?
				el.previousElementSibling :
				el.previousElementSibling.previousElementSibling;
			break;
		case 'split':
			lineNumberEl = el.previousElementSibling;
			break;
		default:
			throw new Error("Can't recognize diff type - unified or split.");
	}

	return Number(lineNumberEl.dataset.lineNumber);
}

//
// Create a code change object from each file node
//
function parseToFileList(file) {

	const changes = findCodeChangeNodes(file).map(el => ({
		type      : el.classList.contains(CODE_ADDITION) ? 'addition' : 'deletion',
		lineNumber: getLineNumber(el),
		text      : el.innerText.trim(),
		el,
		row: el.parentNode
	}));

	const type = document.querySelector('meta[name="diff-view"]').content;
	let groupedChanges = [];

	//
	// Figure out change groups in 'unified' diff view
	//
	if (type === 'unified') {

		let i = 0;
		let tmpArray = [];

		while (i < changes.length) {
			if (i === 0 || (changes[i].el.parentElement.previousElementSibling === changes[i - 1].el.parentElement)) {
				tmpArray.push(changes[i]);
			} else {
				groupedChanges.push(tmpArray);
				tmpArray = [];
				tmpArray.push(changes[i]);
			}
			i++;
		}

		groupedChanges = groupedChanges.map(group => {
			return group.reduce((obj, change) => {
				obj[change.type] || (obj[change.type] = []);
				obj[change.type].push(change);
				return obj;
			}, {});
		})
	}

	return {
		el : file,
		ext: file.dataset.fileType.slice(1),
		changes,
		groupedChanges
	};
}

const onlyFilesWithChanges = file => file.changes.length;
let rendered = false;

const powerDiff = () => {
	console.log('--- in powerDiff');
	observe();


	if (!document.querySelector(`#${EXTENSION_ROOT}`)) {
		const container = document.querySelector('.pr-review-tools');
		const anchor = document.createElement('div');
		anchor.style.cssFloat = 'left';
		anchor.id = EXTENSION_ROOT;
		container.insertBefore(anchor, container.childNodes[0]);
		ReactDOM.render(<App/>, anchor);
		rendered = true;
		console.log('--- rendered: ', rendered);
	}
	applyDiffRules()
};

const executeDiffRules = (rules, type = 'apply') => {
	[...document.querySelectorAll('.file')]
		.map(parseToFileList)
		.filter(onlyFilesWithChanges)
		.filter(file => !!(rules.map(rule => rule.ext).flat()).includes(file.ext))
		.forEach(file => {
			rules.filter(rule => rule.ext.includes(file.ext))
				.forEach(rule => {
					eval(`(${rule[type]})`)(file)
				});
		});
};

export const applyDiffRules = (rules) => {
	console.log('--- applyDiffRules: ', rules);
	if (!rules) return;
	// StorageSync.get('rules').then(({ rules }) => {

	executeDiffRules(rules, 'apply');
};

export const clearDiffRules = (rules) => {
	console.log('--- clearDiffRules: ', rules);
	if (!rules) return;
	// StorageSync.get('rules').then(({ rules }) => {

	executeDiffRules(rules, 'clear');
};


const { document, MutationObserver } = window;

let observer;
let fileObserver;

const mainObserver = mutations => {
	// console.log('mutations: ', mutations);
	const $els = mutations.map(mutationRecord => mutationRecord.target);

	const $diffProgressiveContainers = $els
		.filter(el => el.className === 'js-diff-progressive-container');
	const $distinctDiffProgressiveContainers = [...new Set($diffProgressiveContainers)];

	const $diffLoadContainers = mutations
		.filter(el => el.className === 'js-diff-load-container');
	const $distinctDiffLoadContainer = [...new Set($diffLoadContainers)];

	if ($distinctDiffProgressiveContainers.length || $distinctDiffLoadContainer.length) {
		console.log('--- reapplying diff rule');
		applyDiffRules();
	}
};

const observe = () => {
	console.log('--- in observe');
	observer && observer.disconnect();
	const $pjaxContainer = document.querySelector('[data-pjax-container]');
	if ($pjaxContainer) {
		observer = new MutationObserver(powerDiff);
		observer.observe($pjaxContainer, { childList: true });
	}

	//
	// This part is relevant only in pages with a diff (#files container)
	//
	const $files = document.querySelector('#files');
	if ($files) {
		fileObserver && fileObserver.disconnect();
		fileObserver = new MutationObserver(mainObserver);
		fileObserver.observe($files, {childList: true, subtree: true})
	}
};


//
// Kickstart PowerDiff only if we're in a page that contains diffs
// This didn't work properly when trying from the manifest.json file
//
if (window.location.pathname.match(".+pull.+(files|commits\/)")) {
	powerDiff();
}
