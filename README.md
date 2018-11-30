# ngx-quill [![Build Status](https://travis-ci.org/KillerCodeMonkey/ngx-quill.svg?branch=develop)](https://travis-ci.org/KillerCodeMonkey/ngx-quill)

<img src="https://cloud.githubusercontent.com/assets/2264672/20601381/a51753d4-b258-11e6-92c2-1d79efa5bede.png" width="200px">

ngx-quill is the new angular (>=2) implementation of ngQuill.

## Donate/Support

If you like my work, feel free to support it. Donations to the project are always welcomed :)

PayPal: [PayPal.Me/bengtler](PayPal.Me/bengtler)

BTC Wallet Address:
`3QVyr2tpRLBCw1kBQ59sTDraV6DTswq8Li`

ETH Wallet Address:
`0x394d44f3b6e3a4f7b4d44991e7654b0cab4af68f`

LTC Wallet Address:
`MFif769WSZ1g7ReAzzDE7TJVqtkFpmoTyT`

XRP Wallet Address:
`rXieaAC3nevTKgVu2SYoShjTCS2Tfczqx?dt=159046833`

## Examples

- [Webpack Demo](https://github.com/killerCodeMonkey/ngx-quill-example)
- [Angular CLI Demo](https://github.com/KillerCodeMonkey/ngx-quill-angular-cli)
- [Ionic v3 Demo](https://github.com/KillerCodeMonkey/ngx-quill-ionic-v3)

## Compatibility to Angular Versions

<table>
  <thead>
    <tr>
      <th>Angular</th>
      <th>ngx-quill</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        v4
      </td>
      <td>
        <= 1.6.0
      </td>
    </tr>
    <tr>
      <td>
        v5
      </td>
      <td>
        > 1.6.0
      </td>
    </tr>
    <tr>
      <td>
        v6
      </td>
      <td>
        >= 3.0.0
      </td>
    </tr>
    <tr>
      <td>
        v7
      </td>
      <td>
        >= 4.0.0
      </td>
    </tr>
  </tbody>
</table>

## Installation

- `npm install ngx-quill`
- for projects using Angular < v5.0.0 install `npm install ngx-quill@1.6.0`
- install `@angular/core`, `@angular/forms`, `quill` and `rxjs` - peer dependencies of ngx-quill
- include theme stylings: bubble.css, snow.css of quilljs in your index.html, or add them in your css/scss files with `@import` statements, or add them external stylings in your build process.

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
- do not forget to include quill + theme css in your buildprocess, module or index.html!

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
- for builds with angular-cli >=6 only add quilljs to your scripts!

## Config

- ngModel - set initial value or allow two-way databinding
- readOnly (true | false) if user can edit content
- formats - array of allowed formats/groupings
- format - model format - default: `html`, values: `html | object | text | json`, sets the model value type - html = html string, object = quill operation object, json = quill operation json, text = plain text
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
- sanitize - uses angulars DomSanitizer to santize html values - default: `true`, boolean (only for format="html")
- style - set a style object, e.g. `[style]="{height: '250px'}"`
- placeholder - placeholder text, default is `Insert text here ...`
- bounds - boundary of the editor, default `document.body`, pass 'self' to attach the editor element
- maxLength - add validation for maxlength - set model state to `invalid` and add `ng-invalid` class
- minLength - add validation for minlength - set model state to `invalid` and add `ng-invalid` class, only set invalid if editor text not empty --> if you want to check if text is required --> use the required attribute
- required - add validation as a required field - `[required]="true"` - default: false, boolean expected (no strings!)
- strict - default: true, sets editor in strict mode
- scrollingContainer - default '.ql-editor', allows to set scrolling container
- use custom-options for adding for example custom font sizes --> this overwrites this options **globally** !!!
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

## Global Config

It is possible to set custom default toolbar modules with the import of the `QuillModule`.

```
@NgModule({
  imports: [
    ...,

    QuillModule.forRoot({
      modules: {
        toolbar: [...]
      }
    })
  ],
  ...
})
class YourModule { ... }

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
  content: content,
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

## Security Hint

Angular templates provide some assurance against XSS in the form of client side sanitizing of all inputs https://angular.io/guide/security#xss.

Ngx-quill providers the config paramter `sanitize` to sanitize html-strings passed as `ngModel` or `formControl` to the component.

It is **deactivated per default** to avoid stripping content or styling, which is not expected.

But it is **recommended** to activate this option, if you are working with html strings as model values.

