import Command from '@ckeditor/ckeditor5-core/src/command';

import { getSelectedGapModelWidget } from './utils';

export class SetIsEmptyValueAllowedCommand extends Command {
    execute(options = {}) {
        const selection = model.document.selection;
        const selectedGap = getSelectedGapModelWidget(selection);
        const model = this.editor.model;

        model.change(writer => {
            
        });
    }
}