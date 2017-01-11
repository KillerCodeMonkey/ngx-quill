(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@angular/core"), require("@angular/forms"), require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["@angular/core", "@angular/forms", "quill"], factory);
	else if(typeof exports === 'object')
		exports["ngx-quill"] = factory(require("@angular/core"), require("@angular/forms"), require("quill"));
	else
		root["ngx-quill"] = factory(root["@angular/core"], root["@angular/forms"], root["quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__angular_forms__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return QuillEditorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Quill = __webpack_require__(4);
var QuillEditorComponent = QuillEditorComponent_1 = (function () {
    function QuillEditorComponent(elementRef) {
        this.elementRef = elementRef;
        this.emptyArray = [];
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
                [{ 'color': this.emptyArray.slice() }, { 'background': this.emptyArray.slice() }],
                [{ 'font': this.emptyArray.slice() }],
                [{ 'align': this.emptyArray.slice() }],
                ['clean'],
                ['link', 'image', 'video'] // link and image, video
            ]
        };
        this.onEditorCreated = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onContentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
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
        this.quillEditor.on('text-change', function (delta, oldDelta) {
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
    return QuillEditorComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], QuillEditorComponent.prototype, "theme", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], QuillEditorComponent.prototype, "modules", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Boolean)
], QuillEditorComponent.prototype, "readOnly", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], QuillEditorComponent.prototype, "placeholder", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], QuillEditorComponent.prototype, "formats", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], QuillEditorComponent.prototype, "onEditorCreated", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"])
], QuillEditorComponent.prototype, "onContentChanged", void 0);
QuillEditorComponent = QuillEditorComponent_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'quill-editor',
        template: "\n<div></div>\n",
        providers: [{
                provide: __WEBPACK_IMPORTED_MODULE_1__angular_forms__["NG_VALUE_ACCESSOR"],
                useExisting: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return QuillEditorComponent_1; }),
                multi: true
            }],
        styles: ["\n    .ql-container .ql-editor {\n      min-height: 200px;\n      padding-bottom: 50px;\n    }\n  "],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewEncapsulation"].None
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
], QuillEditorComponent);

var QuillEditorComponent_1;


/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__quill_editor_component__ = __webpack_require__(0);
/* harmony namespace reexport (by used) */ __webpack_require__.d(exports, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__quill_editor_component__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return QuillModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QuillModule = (function () {
    function QuillModule() {
    }
    return QuillModule;
}());
QuillModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1__quill_editor_component__["a" /* QuillEditorComponent */]
        ],
        imports: [],
        exports: [__WEBPACK_IMPORTED_MODULE_1__quill_editor_component__["a" /* QuillEditorComponent */]],
        providers: []
    }),
    __metadata("design:paramtypes", [])
], QuillModule);



/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = require("quill");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_quill_module__ = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "QuillModule", function() { return __WEBPACK_IMPORTED_MODULE_0__src_quill_module__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "QuillEditorComponent", function() { return __WEBPACK_IMPORTED_MODULE_0__src_quill_module__["b"]; });



/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjMjFhYTgwMThhOWYxZTg1ZDc4OCIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYW5ndWxhci9jb3JlXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWxsLm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYW5ndWxhci9mb3Jtc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInF1aWxsXCIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckR1QjtBQUlDO0FBRXhCLElBQU0sS0FBSyxHQUFHLG1CQUFPLENBQUMsQ0FBTyxDQUFDLENBQUM7QUFvQi9CLElBQWEsb0JBQW9CO0lBMEMvQiw4QkFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FB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LG9HQUtSLENBQUM7UUFDRixhQUFhLEVBQUUsZ0VBQWlCLENBQUMsSUFBSTtLQUN0QyxDQUFDO3FDQTJDZ0MseURBQVU7R0ExQy9CLG9CQUFvQixDQWlIaEM7QUFqSGdDOzs7Ozs7OztBQ3JDakMsK0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0F5QztBQUV1QjtBQUV2QjtBQVV6QyxJQUFhLFdBQVc7SUFBeEI7SUFBMkIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQztBQUFmLFdBQVc7SUFSdkIsOEVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLHFGQUFvQjtTQUNyQjtRQUNELE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFLENBQUMscUZBQW9CLENBQUM7UUFDL0IsU0FBUyxFQUFFLEVBQUU7S0FDZCxDQUFDOztHQUNXLFdBQVcsQ0FBSTtBQUFKOzs7Ozs7O0FDZHhCLCtDOzs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBbUMiLCJmaWxlIjoibmd4LXF1aWxsLnVtZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIkBhbmd1bGFyL2NvcmVcIiksIHJlcXVpcmUoXCJAYW5ndWxhci9mb3Jtc1wiKSwgcmVxdWlyZShcInF1aWxsXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcIkBhbmd1bGFyL2NvcmVcIiwgXCJAYW5ndWxhci9mb3Jtc1wiLCBcInF1aWxsXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm5neC1xdWlsbFwiXSA9IGZhY3RvcnkocmVxdWlyZShcIkBhbmd1bGFyL2NvcmVcIiksIHJlcXVpcmUoXCJAYW5ndWxhci9mb3Jtc1wiKSwgcmVxdWlyZShcInF1aWxsXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJuZ3gtcXVpbGxcIl0gPSBmYWN0b3J5KHJvb3RbXCJAYW5ndWxhci9jb3JlXCJdLCByb290W1wiQGFuZ3VsYXIvZm9ybXNcIl0sIHJvb3RbXCJxdWlsbFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfNF9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGMyMWFhODAxOGE5ZjFlODVkNzg4IiwiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5jb25zdCBRdWlsbCA9IHJlcXVpcmUoJ3F1aWxsJyk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1aWxsLWVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG48ZGl2PjwvZGl2PlxuYCxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFF1aWxsRWRpdG9yQ29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxuICB9XSxcbiAgc3R5bGVzOiBbYFxuICAgIC5xbC1jb250YWluZXIgLnFsLWVkaXRvciB7XG4gICAgICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgICAgIHBhZGRpbmctYm90dG9tOiA1MHB4O1xuICAgIH1cbiAgYF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzIHtcblxuICBxdWlsbEVkaXRvcjogYW55O1xuICBlZGl0b3JFbGVtOiBIVE1MRWxlbWVudDtcbiAgZW1wdHlBcnJheTogYW55W10gPSBbXTtcbiAgY29udGVudDogYW55O1xuICBkZWZhdWx0TW9kdWxlcyA9IHtcbiAgICB0b29sYmFyOiBbXG4gICAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2UnXSwgICAgICAgIC8vIHRvZ2dsZWQgYnV0dG9uc1xuICAgICAgWydibG9ja3F1b3RlJywgJ2NvZGUtYmxvY2snXSxcblxuICAgICAgW3sgJ2hlYWRlcic6IDEgfSwgeyAnaGVhZGVyJzogMiB9XSwgICAgICAgICAgICAgICAvLyBjdXN0b20gYnV0dG9uIHZhbHVlc1xuICAgICAgW3sgJ2xpc3QnOiAnb3JkZXJlZCd9LCB7ICdsaXN0JzogJ2J1bGxldCcgfV0sXG4gICAgICBbeyAnc2NyaXB0JzogJ3N1Yid9LCB7ICdzY3JpcHQnOiAnc3VwZXInIH1dLCAgICAgIC8vIHN1cGVyc2NyaXB0L3N1YnNjcmlwdFxuICAgICAgW3sgJ2luZGVudCc6ICctMSd9LCB7ICdpbmRlbnQnOiAnKzEnIH1dLCAgICAgICAgICAvLyBvdXRkZW50L2luZGVudFxuICAgICAgW3sgJ2RpcmVjdGlvbic6ICdydGwnIH1dLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZXh0IGRpcmVjdGlvblxuXG4gICAgICBbeyAnc2l6ZSc6IFsnc21hbGwnLCBmYWxzZSwgJ2xhcmdlJywgJ2h1Z2UnXSB9XSwgIC8vIGN1c3RvbSBkcm9wZG93blxuICAgICAgW3sgJ2hlYWRlcic6IFsxLCAyLCAzLCA0LCA1LCA2LCBmYWxzZV0gfV0sXG5cbiAgICAgIFt7ICdjb2xvcic6IHRoaXMuZW1wdHlBcnJheS5zbGljZSgpIH0sIHsgJ2JhY2tncm91bmQnOiB0aGlzLmVtcHR5QXJyYXkuc2xpY2UoKSB9XSwgICAgICAgICAgLy8gZHJvcGRvd24gd2l0aCBkZWZhdWx0cyBmcm9tIHRoZW1lXG4gICAgICBbeyAnZm9udCc6IHRoaXMuZW1wdHlBcnJheS5zbGljZSgpIH1dLFxuICAgICAgW3sgJ2FsaWduJzogdGhpcy5lbXB0eUFycmF5LnNsaWNlKCkgfV0sXG5cbiAgICAgIFsnY2xlYW4nXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBmb3JtYXR0aW5nIGJ1dHRvblxuXG4gICAgICBbJ2xpbmsnLCAnaW1hZ2UnLCAndmlkZW8nXSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsaW5rIGFuZCBpbWFnZSwgdmlkZW9cbiAgICBdXG4gIH07XG5cbiAgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQElucHV0KCkgbW9kdWxlczogT2JqZWN0O1xuICBASW5wdXQoKSByZWFkT25seTogYm9vbGVhbjtcbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW107XG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkNvbnRlbnRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcblxuICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICBtb2R1bGVzOiB0aGlzLm1vZHVsZXMgfHwgdGhpcy5kZWZhdWx0TW9kdWxlcyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyIHx8ICdJbnNlcnQgdGV4dCBoZXJlIC4uLicsXG4gICAgICByZWFkT25seTogdGhpcy5yZWFkT25seSB8fCBmYWxzZSxcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lIHx8ICdzbm93JyxcbiAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgIGJvdW5kYXJ5OiBkb2N1bWVudC5ib2R5XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLnBhc3RlSFRNTCh0aGlzLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmVtaXQodGhpcy5xdWlsbEVkaXRvcik7XG5cbiAgICAvLyBtYXJrIG1vZGVsIGFzIHRvdWNoZWQgaWYgZWRpdG9yIGxvc3QgZm9jdXNcbiAgICB0aGlzLnF1aWxsRWRpdG9yLm9uKCdzZWxlY3Rpb24tY2hhbmdlJywgKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIG1vZGVsIGlmIHRleHQgY2hhbmdlc1xuICAgIHRoaXMucXVpbGxFZGl0b3Iub24oJ3RleHQtY2hhbmdlJywgKGRlbHRhOiBhbnksIG9sZERlbHRhOiBhbnkpID0+IHtcbiAgICAgIGxldCBodG1sID0gdGhpcy5lZGl0b3JFbGVtLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicpIHtcbiAgICAgICAgICBodG1sID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKGh0bWwpO1xuXG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZWQuZW1pdCh7XG4gICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgaHRtbDogaHRtbCxcbiAgICAgICAgdGV4dDogdGV4dFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3JlYWRPbmx5J10gJiYgdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoIWNoYW5nZXNbJ3JlYWRPbmx5J10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKGN1cnJlbnRWYWx1ZTogYW55KSB7XG4gICAgdGhpcy5jb250ZW50ID0gY3VycmVudFZhbHVlO1xuXG4gICAgaWYgKHRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5wYXN0ZUhUTUwoY3VycmVudFZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJAYW5ndWxhci9jb3JlXCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUXVpbGxFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL3F1aWxsLWVkaXRvci5jb21wb25lbnQnO1xuXG5leHBvcnQgKiBmcm9tICcuL3F1aWxsLWVkaXRvci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBRdWlsbEVkaXRvckNvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXSxcbiAgZXhwb3J0czogW1F1aWxsRWRpdG9yQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBRdWlsbE1vZHVsZSB7IH1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9xdWlsbC5tb2R1bGUudHMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiQGFuZ3VsYXIvZm9ybXNcIlxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJxdWlsbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInF1aWxsXCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0ICogZnJvbSAnLi9zcmMvcXVpbGwubW9kdWxlJztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=