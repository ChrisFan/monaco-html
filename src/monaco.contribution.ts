/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as mode from './htmlMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

declare var require: <T>(moduleId: [string], callback: (module: T) => void) => void;

// --- HTML configuration and defaults ---------

export class LanguageServiceDefaultsImpl implements monaco.languages.html.LanguageServiceDefaults {

	private _onDidChange = new Emitter<monaco.languages.html.LanguageServiceDefaults>();
	private _options: monaco.languages.html.Options;
	private _languageId: string;

	constructor(languageId: string, options: monaco.languages.html.Options) {
		this._languageId = languageId;
		this.setOptions(options);
	}

	get onDidChange(): IEvent<monaco.languages.html.LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get options(): monaco.languages.html.Options {
		return this._options;
	}

	setOptions(options: monaco.languages.html.Options): void {
		this._options = options || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const formatDefaults: monaco.languages.html.HTMLFormatConfiguration = {
	tabSize: 4,
	insertSpaces: false,
	wrapLineLength: 120,
	unformatted: 'a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, script, select, small, span, strong, sub, sup, textarea, tt, var',
	indentInnerHtml: false,
	preserveNewLines: true,
	maxPreserveNewLines: null,
	indentHandlebars: false,
	endWithNewline: false,
	extraLiners: 'head, body, /html'
};

const htmlOptionsDefault: monaco.languages.html.Options = {
	format: formatDefaults,
	suggest: { html5: true, angular1: true, ionic: true }
}

const handlebarOptionsDefault: monaco.languages.html.Options = {
	format: formatDefaults,
	suggest: { html5: true }
}

const razorOptionsDefault: monaco.languages.html.Options = {
	format: formatDefaults,
	suggest: { html5: true, razor: true }
}

const htmlLanguageId = 'html';
const handlebarsLanguageId = 'handlebars';
const razorLanguageId = 'razor';

const htmlDefaults = new LanguageServiceDefaultsImpl(htmlLanguageId, htmlOptionsDefault);
const handlebarDefaults = new LanguageServiceDefaultsImpl(handlebarsLanguageId, handlebarOptionsDefault);
const razorDefaults = new LanguageServiceDefaultsImpl(razorLanguageId, razorOptionsDefault);

// Export API
function createAPI(): typeof monaco.languages.html {
	return {
		htmlDefaults: htmlDefaults,
		razorDefaults: handlebarDefaults,
		handlebarDefaults: razorDefaults
	}
}
monaco.languages.html = createAPI();

// --- Registration to monaco editor ---

function withMode(callback: (module: typeof mode) => void): void {
	require<typeof mode>(['vs/language/html/htmlMode'], callback);
}

monaco.languages.onLanguage(htmlLanguageId, () => {
	withMode(mode => mode.setupMode(htmlDefaults));
});
monaco.languages.onLanguage(handlebarsLanguageId, () => {
	withMode(mode => mode.setupMode(handlebarDefaults));
});
monaco.languages.onLanguage(razorLanguageId, () => {
	withMode(mode => mode.setupMode(razorDefaults));
});
