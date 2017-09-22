import { AfterViewInit, ElementRef, EventEmitter, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, Validator } from '@angular/forms';
export declare class QuillEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges, Validator {
    private elementRef;
    private doc;
    private renderer;
    quillEditor: any;
    editorElem: HTMLElement;
    emptyArray: any[];
    content: any;
    defaultModules: {
        toolbar: (string[] | {
            'header': number;
        }[] | {
            'list': string;
        }[] | {
            'script': string;
        }[] | {
            'indent': string;
        }[] | {
            'direction': string;
        }[] | {
            'size': (string | boolean)[];
        }[] | {
            'header': (number | boolean)[];
        }[] | ({
            'color': any[];
        } | {
            'background': any[];
        })[] | {
            'font': any[];
        }[] | {
            'align': any[];
        }[])[];
    };
    theme: string;
    modules: {
        [index: string]: Object;
    };
    readOnly: boolean;
    placeholder: string;
    maxLength: number;
    minLength: number;
    required: boolean;
    formats: string[];
    style: any;
    strict: boolean;
    scrollingContainer: HTMLElement | string;
    bounds: HTMLElement | string;
    onEditorCreated: EventEmitter<any>;
    onContentChanged: EventEmitter<any>;
    onSelectionChanged: EventEmitter<any>;
    onModelChange: Function;
    onModelTouched: Function;
    constructor(elementRef: ElementRef, doc: any, renderer: Renderer2);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(currentValue: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    validate(): {
        minLengthError?: {
            given: number;
            minLength: number;
        };
        maxLengthError?: {
            given: number;
            maxLength: number;
        };
        requiredError?: {
            empty: boolean;
        };
    };
}
