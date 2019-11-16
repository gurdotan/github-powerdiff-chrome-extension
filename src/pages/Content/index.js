import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './components/toolbar';
import { AppTheme, lightTheme } from '@datorama/app-components';
import { ThemeProvider } from 'styled-components';
import StorageSync from '../../common/storage-sync';

const EXTENSION_ROOT = 'github-powerdiff-extension-root';
const CODE_ADDITION = '.blob-code-addition';
const CODE_DELETION = '.blob-code-deletion';

const App = () => (
	<AppTheme theme={lightTheme} provider={ThemeProvider}>
		<Toolbar/>
	</AppTheme>
);




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

const applyDiffRules = () => {
	console.log('--- applyDiffRules');
	StorageSync.get('rules').then(({ rules }) => {

		[...document.querySelectorAll('.file')]
			.map(parseToFileList)
			.filter(onlyFilesWithChanges)
			.filter(file => !!rules[file.ext])
			.forEach(file => {
				rules[file.ext].forEach(rule => eval(`(${rule.callback})`)(file));
			});
	});

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
