(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@angular/core"), require("@angular/forms"), require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["@angular/core", "@angular/forms", "quill"], factory);
	else if(typeof exports === 'object')
		exports["ngx-quill"] = factory(require("@angular/core"), require("@angular/forms"), require("quill"));
	else
		root["ngx-quill"] = factory(root["@angular/core"], root["@angular/forms"], root["quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__quill_editor_component__ = __webpack_require__(2);
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_quill_module__ = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "QuillModule", function() { return __WEBPACK_IMPORTED_MODULE_0__src_quill_module__["a"]; });



/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkMWNhMTFjNWI3ZGUwYzAyODZiZiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYW5ndWxhci9jb3JlXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1aWxsLm1vZHVsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAYW5ndWxhci9mb3Jtc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInF1aWxsXCIiLCJ3ZWJwYWNrOi8vLy4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBLCtDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0F5QztBQUV1QjtBQVVoRSxJQUFhLFdBQVc7SUFBeEI7SUFBMkIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQztBQUFmLFdBQVc7SUFSdkIsOEVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZ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O0lBQVQsNEVBQU0sRUFBRTs4QkFBbUIsMkRBQVk7OERBQTJCO0FBckN4RCxvQkFBb0I7SUFsQmhDLCtFQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QixRQUFRLEVBQUUsaUJBRVg7UUFDQyxTQUFTLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsaUVBQWlCO2dCQUMxQixXQUFXLEVBQUUsZ0ZBQVUsQ0FBQyxjQUFNLDZCQUFvQixFQUFwQixDQUFvQixDQUFDO2dCQUNuRCxLQUFLLEVBQUUsSUFBSTthQUNaLENBQUM7UUFDRixNQUFNLEVBQUUsQ0FBQyxvR0FLUixDQUFDO1FBQ0YsYUFBYSxFQUFFLGdFQUFpQixDQUFDLElBQUk7S0FDdEMsQ0FBQztxQ0EyQ2dDLHlEQUFVO0dBMUMvQixvQkFBb0IsQ0FpSGhDO0FBakhnQzs7Ozs7Ozs7QUNyQ2pDLCtDOzs7Ozs7QUNBQSxrQzs7Ozs7Ozs7OztBQ0FtQyIsImZpbGUiOiJuZ3gtcXVpbGwudW1kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiQGFuZ3VsYXIvY29yZVwiKSwgcmVxdWlyZShcIkBhbmd1bGFyL2Zvcm1zXCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiQGFuZ3VsYXIvY29yZVwiLCBcIkBhbmd1bGFyL2Zvcm1zXCIsIFwicXVpbGxcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibmd4LXF1aWxsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiQGFuZ3VsYXIvY29yZVwiKSwgcmVxdWlyZShcIkBhbmd1bGFyL2Zvcm1zXCIpLCByZXF1aXJlKFwicXVpbGxcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm5neC1xdWlsbFwiXSA9IGZhY3Rvcnkocm9vdFtcIkBhbmd1bGFyL2NvcmVcIl0sIHJvb3RbXCJAYW5ndWxhci9mb3Jtc1wiXSwgcm9vdFtcInF1aWxsXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMF9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzNfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV80X18pIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDFjYTExYzViN2RlMGMwMjg2YmYiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMF9fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiQGFuZ3VsYXIvY29yZVwiXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFF1aWxsRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9xdWlsbC1lZGl0b3IuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgUXVpbGxFZGl0b3JDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW10sXG4gIGV4cG9ydHM6IFtRdWlsbEVkaXRvckNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW11cbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxNb2R1bGUgeyB9XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvcXVpbGwubW9kdWxlLnRzIiwiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5jb25zdCBRdWlsbCA9IHJlcXVpcmUoJ3F1aWxsJyk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1aWxsLWVkaXRvcicsXG4gIHRlbXBsYXRlOiBgXG48ZGl2PjwvZGl2PlxuYCxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFF1aWxsRWRpdG9yQ29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxuICB9XSxcbiAgc3R5bGVzOiBbYFxuICAgIC5xbC1jb250YWluZXIgLnFsLWVkaXRvciB7XG4gICAgICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgICAgIHBhZGRpbmctYm90dG9tOiA1MHB4O1xuICAgIH1cbiAgYF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgUXVpbGxFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzIHtcblxuICBxdWlsbEVkaXRvcjogYW55O1xuICBlZGl0b3JFbGVtOiBIVE1MRWxlbWVudDtcbiAgZW1wdHlBcnJheTogYW55W10gPSBbXTtcbiAgY29udGVudDogYW55O1xuICBkZWZhdWx0TW9kdWxlcyA9IHtcbiAgICB0b29sYmFyOiBbXG4gICAgICBbJ2JvbGQnLCAnaXRhbGljJywgJ3VuZGVybGluZScsICdzdHJpa2UnXSwgICAgICAgIC8vIHRvZ2dsZWQgYnV0dG9uc1xuICAgICAgWydibG9ja3F1b3RlJywgJ2NvZGUtYmxvY2snXSxcblxuICAgICAgW3sgJ2hlYWRlcic6IDEgfSwgeyAnaGVhZGVyJzogMiB9XSwgICAgICAgICAgICAgICAvLyBjdXN0b20gYnV0dG9uIHZhbHVlc1xuICAgICAgW3sgJ2xpc3QnOiAnb3JkZXJlZCd9LCB7ICdsaXN0JzogJ2J1bGxldCcgfV0sXG4gICAgICBbeyAnc2NyaXB0JzogJ3N1Yid9LCB7ICdzY3JpcHQnOiAnc3VwZXInIH1dLCAgICAgIC8vIHN1cGVyc2NyaXB0L3N1YnNjcmlwdFxuICAgICAgW3sgJ2luZGVudCc6ICctMSd9LCB7ICdpbmRlbnQnOiAnKzEnIH1dLCAgICAgICAgICAvLyBvdXRkZW50L2luZGVudFxuICAgICAgW3sgJ2RpcmVjdGlvbic6ICdydGwnIH1dLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZXh0IGRpcmVjdGlvblxuXG4gICAgICBbeyAnc2l6ZSc6IFsnc21hbGwnLCBmYWxzZSwgJ2xhcmdlJywgJ2h1Z2UnXSB9XSwgIC8vIGN1c3RvbSBkcm9wZG93blxuICAgICAgW3sgJ2hlYWRlcic6IFsxLCAyLCAzLCA0LCA1LCA2LCBmYWxzZV0gfV0sXG5cbiAgICAgIFt7ICdjb2xvcic6IHRoaXMuZW1wdHlBcnJheS5zbGljZSgpIH0sIHsgJ2JhY2tncm91bmQnOiB0aGlzLmVtcHR5QXJyYXkuc2xpY2UoKSB9XSwgICAgICAgICAgLy8gZHJvcGRvd24gd2l0aCBkZWZhdWx0cyBmcm9tIHRoZW1lXG4gICAgICBbeyAnZm9udCc6IHRoaXMuZW1wdHlBcnJheS5zbGljZSgpIH1dLFxuICAgICAgW3sgJ2FsaWduJzogdGhpcy5lbXB0eUFycmF5LnNsaWNlKCkgfV0sXG5cbiAgICAgIFsnY2xlYW4nXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBmb3JtYXR0aW5nIGJ1dHRvblxuXG4gICAgICBbJ2xpbmsnLCAnaW1hZ2UnLCAndmlkZW8nXSAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsaW5rIGFuZCBpbWFnZSwgdmlkZW9cbiAgICBdXG4gIH07XG5cbiAgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQElucHV0KCkgbW9kdWxlczogT2JqZWN0O1xuICBASW5wdXQoKSByZWFkT25seTogYm9vbGVhbjtcbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCkgZm9ybWF0czogc3RyaW5nW107XG5cbiAgQE91dHB1dCgpIG9uRWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkNvbnRlbnRDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmVkaXRvckVsZW0gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcblxuICAgIHRoaXMucXVpbGxFZGl0b3IgPSBuZXcgUXVpbGwodGhpcy5lZGl0b3JFbGVtLCB7XG4gICAgICBtb2R1bGVzOiB0aGlzLm1vZHVsZXMgfHwgdGhpcy5kZWZhdWx0TW9kdWxlcyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyIHx8ICdJbnNlcnQgdGV4dCBoZXJlIC4uLicsXG4gICAgICByZWFkT25seTogdGhpcy5yZWFkT25seSB8fCBmYWxzZSxcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lIHx8ICdzbm93JyxcbiAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgIGJvdW5kYXJ5OiBkb2N1bWVudC5ib2R5XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50KSB7XG4gICAgICB0aGlzLnF1aWxsRWRpdG9yLnBhc3RlSFRNTCh0aGlzLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIHRoaXMub25FZGl0b3JDcmVhdGVkLmVtaXQodGhpcy5xdWlsbEVkaXRvcik7XG5cbiAgICAvLyBtYXJrIG1vZGVsIGFzIHRvdWNoZWQgaWYgZWRpdG9yIGxvc3QgZm9jdXNcbiAgICB0aGlzLnF1aWxsRWRpdG9yLm9uKCdzZWxlY3Rpb24tY2hhbmdlJywgKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gdXBkYXRlIG1vZGVsIGlmIHRleHQgY2hhbmdlc1xuICAgIHRoaXMucXVpbGxFZGl0b3Iub24oJ3RleHQtY2hhbmdlJywgKGRlbHRhOiBhbnksIG9sZERlbHRhOiBhbnkpID0+IHtcbiAgICAgIGxldCBodG1sID0gdGhpcy5lZGl0b3JFbGVtLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnF1aWxsRWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicpIHtcbiAgICAgICAgICBodG1sID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKGh0bWwpO1xuXG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZWQuZW1pdCh7XG4gICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbEVkaXRvcixcbiAgICAgICAgaHRtbDogaHRtbCxcbiAgICAgICAgdGV4dDogdGV4dFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3JlYWRPbmx5J10gJiYgdGhpcy5xdWlsbEVkaXRvcikge1xuICAgICAgdGhpcy5xdWlsbEVkaXRvci5lbmFibGUoIWNoYW5nZXNbJ3JlYWRPbmx5J10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKGN1cnJlbnRWYWx1ZTogYW55KSB7XG4gICAgdGhpcy5jb250ZW50ID0gY3VycmVudFZhbHVlO1xuXG4gICAgaWYgKHRoaXMucXVpbGxFZGl0b3IpIHtcbiAgICAgIGlmIChjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgdGhpcy5xdWlsbEVkaXRvci5wYXN0ZUhUTUwoY3VycmVudFZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5xdWlsbEVkaXRvci5zZXRUZXh0KCcnKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvcXVpbGwtZWRpdG9yLmNvbXBvbmVudC50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJAYW5ndWxhci9mb3Jtc1wiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInF1aWxsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicXVpbGxcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgKiBmcm9tICcuL3NyYy9xdWlsbC5tb2R1bGUnO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==