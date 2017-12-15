# ngx-quill [![Build Status](https://travis-ci.org/KillerCodeMonkey/ngx-quill.svg?branch=develop)](https://travis-ci.org/KillerCodeMonkey/ngx-quill)

Angular (>=2) component for rich text editor Quill

<img src="https://cloud.githubusercontent.com/assets/2264672/20601381/a51753d4-b258-11e6-92c2-1d79efa5bede.png" width="200px">

ngx-quill is the new angular (>=2) implementation of ngQuill.

## Examples
- [demo-page](https://killercodemonkey.github.io/ngx-quill-example)
- [example-repo](https://github.com/killerCodeMonkey/ngx-quill-example)


## Installation
- `npm install ngx-quill`
- for projects using Angular < v5.0.0 install `npm install ngx-quill@1.6.0`
- include theme stylings: bubble.css, snow.css of quilljs in your index.html

### For standard webpack and tsc builds
- import `QuillModule` from `ngx-quill`:
```
import { QuillModule } from 'ngx-quill'
```
- add `QuillModule` to the imports of your NgModule:
```
@NgModule({
  imports: [
    ...,

    QuillModule
  ],
  ...
})
class YourModule { ... }
```
- use `<quill-editor></quill-editor>` in your templates to add a default quill editor
- do not forget to include quill + theme css in your buildproess, module or index.html!

### For SystemJS builds (Config)
- add quill and ngx-quill to your `paths`:
```
paths: {
  ...
  'ngx-quill': 'node_modules/ngx-quill/bundles/ngx-quill.umd.js',
  'quill': 'node_modules/quill/dist/quill.js'
}
```
- set format and dependencies in `packages`:
```
packages: {
  'ngx-quill': {
    format: 'cjs',
    meta: {
      deps: ['quill']
    }
  },
  'quill': {
    format: 'cjs'
  }
}
```
- follow the steps of **For standard webpack and tsc builds**

## Config
- ngModel - set initial value or allow two-way databinding
- readOnly (true | false) if user can edit content
- formats - array of allowed formats/groupings
- modules - configure/disable quill modules, e.g toolbar or add custom toolbar via html element default is
```
{
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']                         // link and image, video
  ]
};
```
- theme - bubble/snow, default is `snow`
- style - set a style object, e.g. `[style]="{height: '250px'}"
- placeholder - placeholder text, default is `Insert text here ...`
- bounds - boundary of the editor, default `document.body`
- maxLength - add valdiation for maxlength - set model state to `invalid` and add `ng-invalid` class
- minLength - add valdiation for minlength - set model state to `invalid` and add `ng-invalid` class, only set invalid if editor text not empty --> if you want to check if text is required --> use the required attribute
- required - add validation as a required field - `[required]="true"` - default: false, boolean expected (no strings!)
- strict - default: true, sets editor in strict mode
- scrollingContainer - default '.ql-editor', allows to set scrolling container
- use custom-options for adding for example custom font sizes (see example in demo.html) --> this overwrites this options **globally** !!!
- possbility to create a custom toolbar via projection slot `[quill-editor-toolbar]`:
```
<quill-editor>
  <div quill-editor-toolbar>
    <span class="ql-formats">
      <button class="ql-bold" [title]="'Bold'"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-align" [title]="'Aligment'">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
      <select class="ql-align" [title]="'Aligment2'">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
    </span>
  </div>
</quill-editor>
```

## Outputs
- onEditorCreated - editor instance
```
editor
```
- onContentChanged - text is updated
```
{
  editor: editorInstance,
  html: html,
  text: text,
  delta: delta,
  oldDelta: oldDelta,
  source: source
}
```
- onSelectionChanged - selection is updated
```
{
  editor: editorInstance,
  range: range,
  oldRange: oldRange,
  source: source
}
```
