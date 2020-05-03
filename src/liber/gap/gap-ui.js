import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import GapEditing from './gap-editing'

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import gapIcon from './theme/icons/gap.svg';

export default class GapUI extends Plugin {
    static get requires() {
        return [GapEditing];
    }

    static get pluginName() {
        return 'GapUI';
    }

    init() {
        const editor = this.editor;
        const t = this.editor.t;

        editor.ui.componentFactory.add('insertGap', locale => {
            const command = editor.commands.get('insertGap');
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t('Insert gap'),
                icon: gapIcon,
                keystroke: 'CTRL+G',
                tooltip: true,
            });

            buttonView.bind('isEnabled').to(command, 'isEnabled');

            this.listenTo(buttonView, 'execute', () => {
                editor.execute('insertGap', {});
                editor.editing.view.focus();
            });

            return buttonView;
        });
    }
}
