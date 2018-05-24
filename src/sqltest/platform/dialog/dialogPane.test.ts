/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { Mock, It, Times, GlobalMock } from 'typemoq';
import { Dialog, DialogTab } from 'sql/platform/dialog/dialogTypes';
import { DialogPane } from 'sql/platform/dialog/dialogPane';
import { DialogComponentParams } from 'sql/platform/dialog/dialogContainer.component';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';

'use strict';

suite('Dialog Pane Tests', () => {
	let dialog: Dialog;
	let mockInstantiationService: Mock<IInstantiationService>;
	let container: HTMLElement;

	setup(() => {
		dialog = new Dialog('test_dialog');
		mockInstantiationService = Mock.ofInstance({
			invokeFunction: () => undefined
		} as any);
		mockInstantiationService.setup(x => x.invokeFunction(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny(), undefined, It.isAny()));
		container = document.createElement('div');
	});

	test('Creating a pane from content without tabs initializes the model view content correctly', () => {
		// If I fill in a dialog's content with the ID of a specific model view provider and then render the dialog
		let modelViewId = 'test_content';
		dialog.content = modelViewId;
		let dialogPane = new DialogPane(dialog.title, dialog.content, () => undefined, mockInstantiationService.object);
		dialogPane.createBody(container);
	});

	test('Creating a pane from content with a single tab initializes without showing tabs', () => {
		// If I fill in a dialog's content with a single tab and then render the dialog
		let modelViewId = 'test_content';
		dialog.content = [new DialogTab('', modelViewId)];
		let dialogPane = new DialogPane(dialog.title, dialog.content, () => undefined, mockInstantiationService.object);
		dialogPane.createBody(container);
	});

	test('Creating a pane from content with multiple tabs initializes multiple model view tabs', () => {
		// If I fill in a dialog's content with a single tab and then render the dialog
		let modelViewId1 = 'test_content_1';
		let modelViewId2 = 'test_content_2';
		dialog.content = [new DialogTab('tab1', modelViewId1), new DialogTab('tab2', modelViewId2)];
		let dialogPane = new DialogPane(dialog.title, dialog.content, () => undefined, mockInstantiationService.object);
		dialogPane.createBody(container);
	});

	test('Dialog validation gets set based on the validity of the model view content', () => {
		// Set up the mock bootstrap service to intercept validation callbacks
		let validationCallbacks: ((valid: boolean) => void)[] = [];
		mockInstantiationService.reset();
		mockInstantiationService.setup(x => x.invokeFunction(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny(), undefined, It.isAny())).callback(
			(collection, moduleType, container, selectorString, params: DialogComponentParams, input, callbackSetModule) => {
				validationCallbacks.push(params.validityChangedCallback);
			});

		let modelViewId1 = 'test_content_1';
		let modelViewId2 = 'test_content_2';
		dialog.content = [new DialogTab('tab1', modelViewId1), new DialogTab('tab2', modelViewId2)];
		let dialogPane = new DialogPane(dialog.title, dialog.content, valid => dialog.notifyValidityChanged(valid), mockInstantiationService.object);
		dialogPane.createBody(container);
	});
});