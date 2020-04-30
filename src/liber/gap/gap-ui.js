import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import GapInsertView from './ui/gap-form-view';
import GapEditing from './gap-editing'
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

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

        editor.ui.componentFactory.add('gapInsert', locale => {
            const options = [
                {
                    type: 'switchbutton',
                    model: {
                        commandName: 'gapInsert',
                        label: t('Header column'),
                        bindIsOn: true
                    }
                },
                { type: 'separator' },
                {
                    type: 'button',
                    model: {
                        commandName: 'gapInsert',
                        label: t('Insert column left')
                    }
                },
            ];

            return this._prepareDropdown(t('Gap'), imageIcon, options, locale);
        });
    }

    _prepareDropdown(label, icon, options, locale) {
        const editor = this.editor;

        const dropdownView = createDropdown(locale);
        const commands = [];

        // Prepare dropdown list items for list dropdown.
        const itemDefinitions = new Collection();

        for (const option of options) {
            addListOption(option, editor, commands, itemDefinitions);
        }

        addListToDropdown(dropdownView, itemDefinitions, editor.ui.componentFactory);

        // Decorate dropdown's button.
        dropdownView.buttonView.set({
            label,
            icon,
            tooltip: true
        });

        // Make dropdown button disabled when all options are disabled.
        dropdownView.bind('isEnabled').toMany(commands, 'isEnabled', (...areEnabled) => {
            return areEnabled.some(isEnabled => isEnabled);
        });

        this.listenTo(dropdownView, 'execute', evt => {
            editor.execute(evt.source.commandName);
            editor.editing.view.focus();
        });

        return dropdownView;
    }

    // init() {
    //     const editor = this.editor;
    //     const command = editor.commands.get('gapInsert');

    //     this.form = new GapInsertView(getFormValidators(editor.t), editor.locale);

    //     editor.ui.componentFactory.add('gapInsert', locale => {
    //         const command = editor.commands.get('gapInsert');
    //         const dropdown = createDropdown(locale);

    //         this._setUpDropdown(dropdown, this.form, command, editor);
    //         this._setUpForm(this.form, dropdown, command);

    //         return dropdown;
    //     });
    // }

    // _setUpDropdown(dropdown, form, command) {
    //     const editor = this.editor;
    //     const t = editor.t;
    //     const button = dropdown.buttonView;

    //     dropdown.bind('isEnabled').to(command);
    //     dropdown.panelView.children.add(form);

    //     button.set({
    //         label: t('Insert gap'),
    //         icon: imageIcon,
    //         tooltip: true
    //     });

    //     button.on('open', () => {
    //         // form.url = command.value || '';
    //         // form.urlInputView.select();
    //         form.focus();
    //     }, { priority: 'low' });

    //     dropdown.on('submit', () => {
    //         if (form.isValid()) {
    //             editor.execute('gapInsert', form.config);
    //             closeUI();
    //         }
    //     });

    //     dropdown.on('change:isOpen', () => form.resetFormStatus());
    //     dropdown.on('cancel', () => closeUI());

    //     function closeUI() {
    //         editor.editing.view.focus();
    //         dropdown.isOpen = false;
    //     }
    // }

    // _setUpForm(form, dropdown, command) {
    //     form.delegate('submit', 'cancel').to(dropdown);
    //     // form.variantsInputView.bind('value').to(command, 'value'); // ??
    //     command.bind('isEmptyAllowed').to(form.allowEmptySwitchButtonView, 'isOn');
    //     // form.allowEmptySwitchButtonView.bind('isOn').to(command, 'value', value => { console.log(value); return true;});
    //     // form.allowEmptySwitchButtonView.bind('isOn').to(command, 'isEmptyValueAllowed');
    //     // command.bind('isEmptyValueAllowed').to(form.allowEmptySwitchButtonView, 'isOn');
    //     // command.bind('isVariableValueAllowed').to(form.allowEmptySwitchButtonView, 'isOn');

    //     form.allowEmptySwitchButtonView.bind('isOn').to(command, 'isEmptyValueAllowed');
    //     form.isVariableSwitchButtonView.bind('isOn').to(command, 'isVariableValueAllowed');

    //     // form.variantsInputView.bind('isReadOnly').to(command, 'isEnabled', value => !value);
    //     form.saveButtonView.bind('isEnabled').to(command);
    // }
}

function addListOption( option, editor, commands, itemDefinitions ) {
	const model = option.model = new Model( option.model );
	const { commandName, bindIsOn } = option.model;

	if ( option.type === 'button' || option.type === 'switchbutton' ) {
		const command = editor.commands.get( commandName );

		commands.push( command );

		model.set( { commandName } );

		model.bind( 'isEnabled' ).to( command );

		if ( bindIsOn ) {
			model.bind( 'isOn' ).to( command, 'value' );
		}
	}

	model.set( {
		withText: true
	} );

	itemDefinitions.add( option );
}

function getFormValidators(t) {
    return [
        form => {
            // if (!form.variants.length) {
            //     return t('The URL must not be empty.');
            // }
        },
    ];
}