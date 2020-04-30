import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import GapInsertCommand from "./gap-insert-command";

import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

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

        editor.commands.add('gapInsert', new GapInsertCommand(editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.is('gap'))
        );

        this._defineSchema()
        this._defineConverters()
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('gap', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: ['config']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['gap']
            },
            model: (viewElement, modelWriter) => {
                const config = {
                    variants: viewElement.getChild(0).data,
                    default: viewElement.getAttribute('default'),
                    allowEmpty: viewElement.hasAttribute('empty'),
                    isVariable: viewElement.hasAttribute('var'),
                };

                return modelWriter.createElement('gap', {
                    config: config
                });
            }
            // function createUpcastView(viewElement, modelWriter) {
            //     return modelWriter.createElement('gap', { });
            // }
            // model: (viewElement, modelWriter) => {
            //     console.log('XZZ', viewElement);
            //     console.log('UPCAST', viewElement);
            //     // Extract the "name" from "{name}".
            //     const defaultText = viewElement.getChild(0).data.slice(1, -1);

            //     return modelWriter.createElement('gap', { default: defaultText });
            // }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'gap',
            view: (modelItem, viewWriter) => createGapView(modelItem, viewWriter)
            // view: createDataDowncastView
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'gap',
            view: (modelItem, viewWriter) => {
                const widgetElement = createGapView(modelItem, viewWriter);
                return toWidget(widgetElement, viewWriter)
            }
        });

        function createGapView(modelItem, viewWriter) {
            const config = modelItem.getAttribute('config');

            const attributes = {
                ...(config.default) ? {default: config.default} : {},
                ...(config.allowEmpty) ? {empty: 'empty'} : {},
                ...(config.isVariable) ? {var: 'var'} : {}  
            }

            const gapView = viewWriter.createContainerElement('gap', attributes);

            const innerText = viewWriter.createText(config.variants);
            viewWriter.insert(viewWriter.createPositionAt(gapView, 0), innerText);

            return gapView;
        }

        // function createUpcastView(viewElement, modelWriter) {
        //     return modelWriter.createElement('gap', { });
        // }

        // Helper method for both downcast converters.
        function createEditingDowncastView(modelItem, viewWriter) {
            const defaultValue = modelItem.getAttribute('default');
            const isEmpty = modelItem.getAttribute('empty');
            const isVariable = modelItem.getAttribute('var');

            const gapView = viewWriter.createContainerElement('span', {
                class: ['gap'],
            });

            // Insert the placeholder name (as a text).
            // const innerText = viewWriter.createText(config.default + '(' + config.variants + ')');
            const innerText = viewWriter.createText(defaultValue);
            viewWriter.insert(viewWriter.createPositionAt(gapView, 0), innerText);

            return toWidget(gapView, viewWriter);
        }

        function createDataDowncastView(modelItem, viewWriter) {
            const defaultValue = modelItem.getAttribute('default');
            const isEmpty = modelItem.getAttribute('empty');
            const isVariable = modelItem.getAttribute('var');

            const attributes = {
                default: defaultValue,
            };

            if (!isEmpty) {
                attributes['empty'] = 'empty'
            }

            if (!isVariable) {
                attributes['var'] = 'var'
            }

            const gapView = viewWriter.createContainerElement('gap', attributes);

            // Insert the placeholder name (as a text).
            const innerText = viewWriter.createText(defaultValue);
            viewWriter.insert(viewWriter.createPositionAt(gapView, 0), innerText);

            return gapView;
        }
    }
}