import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import GapUI from './gap-ui'
import GapEditing from './gap-editing';

export default class Gap extends Plugin {
    static get requires() {
		return [GapEditing, GapUI, Widget];
	}

	static get pluginName() {
		return 'Gap';
	}
}