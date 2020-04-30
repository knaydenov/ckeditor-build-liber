import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
import { getSelectedGapModelWidget, insertGap } from './utils';

export default class GapInsertCommand extends Command {
    constructor(editor) {
        super(editor);

        this.set('isEmptyValueAllowed', false);
        this.set('isVariableValueAllowed', false);
    }
    
    refresh() {
        // console.log("REFRE")
        // const model = this.editor.model;
        // const selection = model.document.selection;
        // const schema = model.schema;
        // const position = selection.getFirstPosition();
        // const selectedGap = getSelectedGapModelWidget(selection);

        // let parent = position.parent;

        // if (parent != parent.root) {
        //     parent = parent.parent;
        // }

        // this.value = selectedGap ? selectedGap.getAttribute('url') : null;
        // this.isEnabled = schema.checkChild(parent, 'media');
        
        this.isEnabled = true
    }

    execute(options = {}) {
        console.log(this.isVariableValueAllowed);
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedGap = getSelectedGapModelWidget(selection);

        const config = options.config || this._defaultConfig();

        if (selectedGap) {
            model.change(writer => {
                writer.setAttribute('variants', config.variants, selectedGap);
                writer.setAttribute('default', config.default, selectedGap);
                writer.setAttribute('empty', config.allowEmpty, selectedGap);
                writer.setAttribute('var', config.isVariable, selectedGap);
            });
        } else {
            // const insertPosition = findOptimalInsertionPosition(selection, model);
            const insertPosition = selection.getFirstPosition();

            insertGap(model, config, insertPosition);
        }
    }

    _defaultConfig() {
        return {
            variants: '',
            default: '',
            allowEmpty: false,
            isVariable: true,
        }
    }
}

