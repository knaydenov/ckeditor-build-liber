import { isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export function isGapWidget(viewElement) {
	return !!viewElement.getCustomProperty('gap') && isWidget(viewElement);
}

export function getSelectedGapWidget(selection) {
	const viewElement = selection.getSelectedElement();

	return viewElement;
}

export function getSelectedGapModelWidget(selection) {
	const selectedElement = selection.getSelectedElement();

	if (selectedElement && selectedElement.is('gap')) {
		return selectedElement;
	}

	return null;
}

export function findAncestor(parentName, positionOrElement) {
	let parent = positionOrElement.parent;

	while (parent) {
		if (parent.name === parentName) {
			return parent;
		}

		parent = parent.parent;
	}
}

export function getGapWidgetAncestor(selection) {
	const parentGap = findAncestor('gap', selection.getFirstPosition());

	if (parentGap && isGapWidget(parentGap.parent)) {
		return parentGap.parent;
	}

	return null;
}

export function insertGap(model, config, insertPosition) {
	model.change(writer => {
		const gapElement = writer.createElement('gap', {config: config});
		model.insertContent(gapElement, insertPosition);

		writer.setSelection(gapElement, 'on');
	});
}