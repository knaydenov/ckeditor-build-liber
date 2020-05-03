import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';

export default class GapToolbar extends Plugin {
  static get requires() {
    return [WidgetToolbarRepository];
  }

  static get pluginName() {
    return 'GapToolbar';
  }

  afterInit() {
    const editor = this.editor;
    const t = editor.t;
    const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);

    // TODO: Add context menu
  }
}