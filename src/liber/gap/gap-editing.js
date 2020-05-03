import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import { InsertGapCommand } from './commands/insert-gap-command';

import './theme/gap.scss';

export default class GapEditing extends Plugin {

    static get pluginName() {
        return 'GapEditing';
    }

    constructor(editor) {
        super(editor)
    }

    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;

        this._defineSchema();
        this._defineConverters();

        editor.commands.add('insertGap', new InsertGapCommand(editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('ck-gap'))
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('liberGap', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: ['is-strict', 'allow-empty', 'default', 'variants']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: 'gap',
            model: (viewElement, modelWriter) => {
                const isStrict = !viewElement.hasAttribute('var');
                const allowEmpty = viewElement.hasAttribute('empty');
                const defaultValue = viewElement.getAttribute('default');
                const variants = viewElement.getChild(0).data;

                return modelWriter.createElement('liberGap', {
                    'is-strict': isStrict,
                    'allow-empty': allowEmpty,
                    'default': defaultValue,
                    'variants': variants
                });
            },
            converterPriority: 'highest'
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'liberGap',
            view: (modelItem, viewWriter) => {
                const isStrict = modelItem.getAttribute('is-strict');
                const allowEmpty = modelItem.getAttribute('allow-empty');
                const defaultValue = (modelItem.getAttribute('default')) ? modelItem.getAttribute('default') : ' '.repeat(5);
                const variants = (modelItem.getAttribute('variants')) ? modelItem.getAttribute('variants') : '';
                
                const classes = ['ck-gap'];
                
                if (isStrict) {
                    classes.push('ck-gap--strict')
                }

                if (allowEmpty) {
                    classes.push('ck-gap--allow-empty')
                }

                const gapView = viewWriter.createContainerElement('gap', {
                    'class': classes.join(' '),
                    'title': variants,
                });
                // wavy
                const innerText = viewWriter.createText(defaultValue);
                viewWriter.insert(viewWriter.createPositionAt(gapView, 0), innerText);


                return toWidget(gapView, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'liberGap',
            view: (modelItem, viewWriter) => {
                const isStrict = modelItem.getAttribute('is-strict');
                const allowEmpty = modelItem.getAttribute('allow-empty');
                const defaultValue = modelItem.getAttribute('default');
                const variants = (modelItem.hasAttribute('variants')) ? modelItem.getAttribute('variants') : '';

                const gapView = viewWriter.createContainerElement('gap', {
                    ...{ 'var': (!isStrict) ? 'var' : null },
                    ...{ 'empty': (allowEmpty) ? 'empty' : null },
                    ...{ 'default': (defaultValue) ? defaultValue : null },
                });

                const innerText = viewWriter.createText(variants);
                viewWriter.insert(viewWriter.createPositionAt(gapView, 0), innerText);

                return gapView;
            }
        });
    }
}
