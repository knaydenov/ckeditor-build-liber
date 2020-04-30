import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { getSelectedGapWidget, getGapWidgetAncestor } from './utils';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';

export default class GapToolbar extends Plugin {
    static get requires() {
		return [ WidgetToolbarRepository ];
    }
    
    static get pluginName() {
		return 'GapToolbar';
    }

    afterInit() {
        const editor = this.editor;
        const t = editor.t;

        const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);

        const gapContentToolbarItems = editor.config.get('gap.contentToolbar');

        const gapToolbarItems = editor.config.get('gap.gapToolbar');
        
        if (gapContentToolbarItems) {
			widgetToolbarRepository.register('gapContent', {
				ariaLabel: t('Gap toolbar'),
				items: gapContentToolbarItems,
				getRelatedElement: getGapWidgetAncestor
			} );
        }
        
        if (gapToolbarItems) {
			widgetToolbarRepository.register( 'liber', {
				ariaLabel: t('Gap toolbar'),
				items: gapToolbarItems,
				getRelatedElement: getSelectedGapWidget
			} );
		}
    }
}