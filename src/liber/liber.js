import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import GapToolbar from "./gap/gap-toolbar";
import Gap from "./gap/gap";


export default class Liber extends Plugin {
    static get requires() {
		return [Gap, GapToolbar];
	}

	static get pluginName() {
		return 'Liber';
	}
}