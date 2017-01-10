var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
System.register("quill-editor.component", ['@angular/core', '@angular/forms'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1, forms_1;
    var Quill, QuillEditorComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }],
        execute: function() {
            Quill = require('quill/dist/quill');
            QuillEditorComponent = (function () {
                function QuillEditorComponent(elementRef) {
                    this.elementRef = elementRef;
                    this.defaultModules = {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video'] // link and image, video
                        ]
                    };
                    this.onEditorCreated = new core_1.EventEmitter();
                    this.onContentChanged = new core_1.EventEmitter();
                    this.onModelChange = function () { };
                    this.onModelTouched = function () { };
                }
                QuillEditorComponent.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this.editorElem = this.elementRef.nativeElement.children[0];
                    this.quillEditor = new Quill(this.editorElem, {
                        modules: this.modules || this.defaultModules,
                        placeholder: this.placeholder || 'Insert text here ...',
                        readOnly: this.readOnly || false,
                        theme: this.theme || 'snow',
                        formats: this.formats,
                        boundary: document.body
                    });
                    if (this.content) {
                        this.quillEditor.pasteHTML(this.content);
                    }
                    this.onEditorCreated.emit(this.quillEditor);
                    // mark model as touched if editor lost focus
                    this.quillEditor.on('selection-change', function (range) {
                        if (!range) {
                            _this.onModelTouched();
                        }
                    });
                    // update model if text changes
                    this.quillEditor.on('text-change', function (delta, oldDelta, source) {
                        var html = _this.editorElem.children[0].innerHTML;
                        var text = _this.quillEditor.getText();
                        if (html === '<p><br></p>') {
                            html = null;
                        }
                        _this.onModelChange(html);
                        _this.onContentChanged.emit({
                            editor: _this.quillEditor,
                            html: html,
                            text: text
                        });
                    });
                };
                QuillEditorComponent.prototype.ngOnChanges = function (changes) {
                    if (changes['readOnly'] && this.quillEditor) {
                        this.quillEditor.enable(!changes['readOnly'].currentValue);
                    }
                };
                QuillEditorComponent.prototype.writeValue = function (currentValue) {
                    this.content = currentValue;
                    if (this.quillEditor) {
                        if (currentValue) {
                            this.quillEditor.pasteHTML(currentValue);
                            return;
                        }
                        this.quillEditor.setText('');
                    }
                };
                QuillEditorComponent.prototype.registerOnChange = function (fn) {
                    this.onModelChange = fn;
                };
                QuillEditorComponent.prototype.registerOnTouched = function (fn) {
                    this.onModelTouched = fn;
                };
                __decorate([
                    core_1.Input()
                ], QuillEditorComponent.prototype, "theme");
                __decorate([
                    core_1.Input()
                ], QuillEditorComponent.prototype, "modules");
                __decorate([
                    core_1.Input()
                ], QuillEditorComponent.prototype, "readOnly");
                __decorate([
                    core_1.Input()
                ], QuillEditorComponent.prototype, "placeholder");
                __decorate([
                    core_1.Input()
                ], QuillEditorComponent.prototype, "formats");
                __decorate([
                    core_1.Output()
                ], QuillEditorComponent.prototype, "onEditorCreated");
                __decorate([
                    core_1.Output()
                ], QuillEditorComponent.prototype, "onContentChanged");
                QuillEditorComponent = __decorate([
                    core_1.Component({
                        selector: 'quill-editor',
                        template: "\n<div></div>\n",
                        providers: [{
                                provide: forms_1.NG_VALUE_ACCESSOR,
                                useExisting: core_1.forwardRef(function () { return QuillEditorComponent; }),
                                multi: true
                            }],
                        styles: ["\n    .ql-container .ql-editor {\n      min-height: 200px;\n      padding-bottom: 50px;\n    }\n  "],
                        encapsulation: core_1.ViewEncapsulation.None
                    })
                ], QuillEditorComponent);
                return QuillEditorComponent;
            }());
            exports_1("QuillEditorComponent", QuillEditorComponent);
        }
    }
});
System.register("quill.module", ['@angular/core', "quill-editor.component"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_2, quill_editor_component_1;
    var QuillModule;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (quill_editor_component_1_1) {
                quill_editor_component_1 = quill_editor_component_1_1;
            }],
        execute: function() {
            QuillModule = (function () {
                function QuillModule() {
                }
                QuillModule = __decorate([
                    core_2.NgModule({
                        declarations: [
                            quill_editor_component_1.QuillEditorComponent
                        ],
                        imports: [],
                        exports: [quill_editor_component_1.QuillEditorComponent],
                        providers: []
                    })
                ], QuillModule);
                return QuillModule;
            }());
            exports_2("QuillModule", QuillModule);
        }
    }
});
