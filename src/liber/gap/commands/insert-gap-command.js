import Command from '@ckeditor/ckeditor5-core/src/command';

export class InsertGapCommand extends Command {
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild(selection.focus.parent, 'liberGap');
        this.isEnabled = isAllowed;
    }

    execute(options = {}) {
        const model = this.editor.model;
        const selection = model.document.selection;

        model.change(writer => {
            const gap = writer.createElement('liberGap', {
                'is-strict': true,
                'empty-allowed': false,
                'default': '',
                'variants': ''
            });

            editor.model.insertContent(gap);

            writer.setSelection(gap, 'on');
        });
    }
}