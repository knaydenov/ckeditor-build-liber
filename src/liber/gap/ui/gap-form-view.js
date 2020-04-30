import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import ListSeparatorView from '@ckeditor/ckeditor5-ui/src/list/listseparatorview';

import { createLabeledDropdown, createLabeledInputText } from '@ckeditor/ckeditor5-ui/src/labeledview/utils';
import { addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import '../theme/gap-form.scss';

export default class GapFormView extends View {
    constructor(validators, locale) {
        super(locale);

        const t = locale.t;

        this.focusTracker = new FocusTracker();

        this.keystrokes = new KeystrokeHandler();

        const bind = this.bindTemplate;

        this.variantsInputView = this._createInputView('Variants', 'Put varians separated by "|"', 'Example: Hello|World');
        this.defaultInputView = this._createInputView('Default', 'Default value to be shown', 'Example: Hello');
        this.allowEmptySwitchButtonView = this._createSwitchButtonView('Allow empty');
        this.isVariableSwitchButtonView = this._createSwitchButtonView('Variable');

        this.saveButtonView = this._createButton(t('Save'), checkIcon, 'ck-button-save');
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton(t('Cancel'), cancelIcon, 'ck-button-cancel', 'cancel');

        this._focusables = new ViewCollection();

        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'shift + tab',
                focusNext: 'tab'
            }
        });

        this._validators = validators

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-gap-form'],
                tabindex: '-1'
            },
            children: [
                this.variantsInputView,
                this.defaultInputView,
                this._createSeparator(),
                this.allowEmptySwitchButtonView,
                this._createSeparator(),
                this.isVariableSwitchButtonView,
                this._createSeparator(),
                this.saveButtonView,
                this.cancelButtonView
            ]
        });
    }

    render() {
        super.render();

        submitHandler({
            view: this
        });
    }

    resetFormStatus() {
        this.variantsInputView.errorText = null;
    }

    isValid() {
        this.resetFormStatus();

        for (const validator of this._validators) {
            const errorText = validator(this);

            // One error per field is enough.
            if (errorText) {
                // Apply updated error.
                this.variantsInputView.errorText = errorText;

                return false;
            }
        }

        return true;
    }

    focus() {
        this._focusCycler.focusFirst();
    }

    get variants() {
        return this.variantsInputView.inputView.element.value.trim();
    }

    set variants(options) {
        this.variantsInputView.inputView.element.value = options.trim();
    }

    get config() {
        return {
            variants: this.variantsInputView.inputView.element.value.trim(),
            default: this.defaultInputView.inputView.element.value.trim(),
            allowEmpty: true,
            isVariable: false,
        }
    }

    _createInputView(label, infotext, placeholder) {
        const t = this.locale.t;

        const labeledInput = new LabeledInputView(this.locale, InputTextView);
        const inputView = labeledInput.inputView;

        labeledInput.label = t(label);
        labeledInput.infoText = t(infotext);
        inputView.placeholder = placeholder;

        return labeledInput;
    }

    _createSwitchButtonView(label) {
        const switchButton = new SwitchButtonView(this.locale);

        switchButton.set({
            withText: true,
            isToggleable: true,
            label: label
        });
        
        return switchButton;
    }

    _createButton(label, icon, className, eventName) {
        const button = new ButtonView(this.locale);

        button.set({
            label,
            icon,
            tooltip: true
        });

        button.extendTemplate({
            attributes: {
                class: className
            }
        });

        if (eventName) {
            button.delegate('execute').to(this, eventName);
        }

        return button;
    }

    _createSeparator() {
        return new ListSeparatorView(this.locale);
    }
}