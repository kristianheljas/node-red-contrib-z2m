/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="select2"/>

declare namespace Select2 {
  type ObservableCallback = (...args: any[]) => void;

  type AnyData = Select2.DataFormat | Select2.GroupedDataFormat;
  type AnyDataArray = AnyData[];

  interface Observable {
    listeners: { [key: string]: ObservableCallback[] };
    on(event: string, listener: ObservableCallback): void;
    trigger(event: string, ...eventArgs: any[]): void;
    invoke(listeners: ObservableCallback[], params: any[]): void;
  }

  interface BaseAdapter extends Observable {
    current(callback: (data: Select2.DataFormat) => void): void;
    query(params: any, callback: (data: any) => void): void;
    bind(container: Select2.Select2, $container: JQuery): void;
    destroy(): void;
    generateResultId(container: Select2.Select2, data: Select2.DataFormat): string;
  }
  interface SelectAdapter extends BaseAdapter {
    select(data: Select2.DataFormat): void;
    unselect(data: Select2.DataFormat): void;
    addOptions($options: JQuery.htmlString | JQuery.TypeOrArray<JQuery.Node | JQuery<JQuery.Node>>): void;
    option(data: Select2.DataFormat): JQuery<HTMLOptionElement>;
    option(data: Select2.GroupedDataFormat): JQuery<HTMLOptGroupElement>;
    item($option: JQuery<HTMLOptionElement>): Select2.DataFormat;
    item($option: JQuery<HTMLOptGroupElement>): Select2.GroupedDataFormat;
    _normalizeItem(item: any): Select2.DataFormat;
    matches: Select2.Options['matcher'];
  }

  interface ArrayAdapter extends SelectAdapter {
    convertToOptions(data: AnyDataArray): Array<JQuery<HTMLOptionElement | HTMLOptGroupElement>>;
  }

  interface Select2 {
    $element: JQuery<HTMLSelectElement>;
    dataAdapter: BaseAdapter | SelectAdapter | ArrayAdapter;
  }
}
