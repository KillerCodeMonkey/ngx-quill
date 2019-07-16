# ngx-quill [![Build Status](https://travis-ci.org/KillerCodeMonkey/ngx-quill.svg?branch=develop)](https://travis-ci.org/KillerCodeMonkey/ngx-quill)

<img src="https://cloud.githubusercontent.com/assets/2264672/20601381/a51753d4-b258-11e6-92c2-1d79efa5bede.png" width="200px">

ngx-quill is an angular (>=2) module for the [Quill Rich Text Editor](https://quilljs.com/) containing all components you need.

## Donate/Support

If you like my work, feel free to support it. Donations to the project are always welcomed :)

<a href="https://www.buymeacoffee.com/bengtler" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

PayPal: [PayPal.Me/bengtler](http://paypal.me/bengtler)

BTC Wallet Address:
`3QVyr2tpRLBCw1kBQ59sTDraV6DTswq8Li`

ETH Wallet Address:
`0x394d44f3b6e3a4f7b4d44991e7654b0cab4af68f`

LTC Wallet Address:
`MFif769WSZ1g7ReAzzDE7TJVqtkFpmoTyT`

XRP Wallet Address:
`rXieaAC3nevTKgVu2SYoShjTCS2Tfczqx?dt=159046833`

## Examples

- [Advanced Demo](https://github.com/killerCodeMonkey/ngx-quill-example)
  - integration of [quill-emoji](https://github.com/contentco/quill-emoji)
  - integration of [quill-mention](https://github.com/afconsult/quill-mention)
  - integration of [quill-image-resize](https://github.com/kensnyder/quill-image-resize-module)
  - custom word count module
  - custom toolbar with custom fonts and formats, toolbar position
  - show the differences between sanitizing and not sanitizing your content if your content format is html
  - usage of different content formats
  - template-driven and reactive forms
  - code + syntax highlighting
  - formulas
  - custom key-bindings, e.g. shift + b for bold
  - dynamic styles and placeholder
  - toggle readonly
  - bubble toolbar
  - activate formats after editor initialisation, e.g. rtl direction
  - present quilljs content with the `quill-view` and `quill-view-html` component
- [Ionic v3 Demo](https://github.com/KillerCodeMonkey/ngx-quill-ionic-v3)
- [Ionic v4 Demo](https://github.com/KillerCodeMonkey/ngx-quill-ionic-v4)

## Compatibility to Angular Versions

<table>
  <thead>
    <tr>
      <th>Angular</th>
      <th>ngx-quill</th>
      <th>supported/maintained</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        v8
      </td>
      <td>
        >= 5.2.0
      </td>
      <td>
        until Nov 22, 2020
      </td>
    </tr>
    <tr>
      <td>
        v7
      </td>
      <td>
        >= 4.0.0
      </td>
      <td>
        until Apr 18, 2020
      </td>
    </tr>
    <tr>
      <td>
        v6
      </td>
      <td>
        >= 3.0.0
      </td>
      <td>
        until Nov 3, 2019
      </td>
    </tr>
    <tr>
      <td>
        v5
      </td>
      <td>
        > 1.6.0
      </td>
      <td>
        no
      </td>
    </tr>
    <tr>
      <td>
        v4
      </td>
      <td>
        < 1.6.0
      </td>
      <td>no</td>
    </tr>
  </tbody>
</table>

## Installation

- `npm install ngx-quill`
- for projects using Angular < v5.0.0 install `npm install ngx-quill@1.6.0`
- install `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, `quill` and `rxjs` - peer dependencies of ngx-quill
- include theme stylings: bubble.css, snow.css of quilljs in your index.html, or add them in your css/scss files with `@import` statements, or add them external stylings in your build process.

### For standard webpack, angular-cli and tsc builds

- import `QuillModule` from `ngx-quill`:
```
import { QuillModule } from 'ngx-quill'
```
- add `QuillModule` to the imports of your NgModule:
```
@NgModule({
  imports: [
    ...,

    QuillModule.forRoot()
  ],
  ...
})
class YourModule { ... }
```
- use `<quill-editor></quill-editor>` in your templates to add a default quill editor
- do not forget to include quill + theme css in your buildprocess, module or index.html!
- for builds with angular-cli >=6 only add quilljs to your scripts or scripts section of angular.json, if you need it as a global :)!

**HINT:** *If you are using lazy loading modules, you have to add `QuillModule.forRoot()` to your imports in your root module to make sure the `Config` services is registered.*

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

## Global Config

It is possible to set custom default modules and Quill config options with the import of the `QuillModule.forRoot()`.

```
@NgModule({
  imports: [
    ...,

    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [...]
      }
    })
  ],
  ...
})
class YourModule { ... }

```

If you want to use the `syntax` module follow the [Syntax Highlight Module Guide](https://quilljs.com/docs/modules/syntax/#syntax-highlighter-module).

See [Quill Configuration](https://quilljs.com/docs/configuration/) for a full list of config options.

The `QuillModule` exports the `defaultModules` if you want to extend them :).

## QuillEditorComponent

### Hint

Ngx-quill updates the ngModel or formControl for every `user` change in the editor.
Checkout the [QuillJS Source](https://quilljs.com/docs/api/#events) parameter of the `text-change` event.

If you are using the editor reference to directly manipulate the editor content and want to update the model, pass `'user'` as the source parameter to the QuillJS api methods.

### Config

- ngModel - set initial value or allow two-way databinding for template driven forms
- formControl/formControlName - set initial value or allow two-way databinding for reactive forms
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
- styles - set a styles object, e.g. `[styles]="{height: '250px'}"`
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
- customToolbarPosition - if you are working with a custom toolbar you can switch the position :). - default: `top`, possible values `top`, `bottom`
- debug - set log level `warn`, `error`, `log` or `false` to deactivate logging, default: `warn`
- trackChanges - check if only `user` (quill source user) or `all` change should be trigger model update, default `user`. Using `all` is not recommended, it cause some unexpected sideeffects.
- preserveWhitespace - default: false - possbility to use a pre-tag instead of a div-tag for the contenteditable area to preserve duplicated whitespaces | caution if used with syntax plugin [Related issue](https://github.com/quilljs/quill/issues/1751)

[Full Quill Toolbar HTML](https://github.com/quilljs/quill/blob/f75ff2973f068c3db44f949915eb8a74faf162a8/docs/_includes/full-toolbar.html)

### Outputs

- onEditorCreated - editor instance
- Use this output to get the editor instance and use it directly. After this output has called the component is stable and all listeners are binded
```
editor // Quill
```
- onContentChanged - text is updated
```
{
  editor: editorInstance, // Quill
  html: html, // html string
  text: text, // plain text string
  content: content, // Content - operatins representation
  delta: delta, // Delta
  oldDelta: oldDelta, // Delta
  source: source // ('user', 'api', 'silent' , undefined)
}
```
- onSelectionChanged - selection is updated, also triggered for onBlur and onFocus, because the selection changed
```
{
  editor: editorInstance, // Quill
  range: range, // Range
  oldRange: oldRange, // Range
  source: source // ('user', 'api', 'silent' , undefined)
}
```
- onEditorChanged - text or selection is updated - independent of the source
```
{
  editor: editorInstance, // Quill
  event: 'text-change' // event type
  html: html, // html string
  text: text, // plain text string
  content: content, // Content - operatins representation
  delta: delta, // Delta
  oldDelta: oldDelta, // Delta
  source: source // ('user', 'api', 'silent' , undefined)
}
```

or

```
{
  editor: editorInstance, // Quill
  event: 'selection-change' // event type
  range: range, // Range
  oldRange: oldRange, // Range
  source: source // ('user', 'api', 'silent' , undefined)
}
```

- onFocus - editor is focused
```
{
  editor: editorInstance, // Quill
  source: source // ('user', 'api', 'silent' , undefined)
}
```
- onBlur - editor is blured
```
{
  editor: editorInstance, // Quill
  source: source // ('user', 'api', 'silent' , undefined)
}
```

## QuillViewComponent, QuillViewHTMLComponent & How to present the editor content

In most cases a wysiwyg editor is used in backoffice to store the content to the database. On the other side this value should be used, to show the content to the enduser.

In most cases the `html` format is used, but it is not recommended by QuillJS, because it has the intention to be a solid, easy to maintain editor. Because of that it uses blots and object representations of the content and operation.

This content object is easy to store and to maintain, because there is no html syntax parsing necessary. So you even switching to another editor is very easy when you can work with that.

`ngx-quill` provides some helper components, to present quilljs content.

### QuillViewComponent - Using QuillJS to render content

In general QuillJS recommends to use a QuillJS instance to present your content.
Just create a quill editor without a toolbar and in readonly mode. With some simple css lines you can remove the default border around the content.

As a helper `ngx-quill` provides a component where you can pass many options of the `quill-editor` like modules, format, formats, customOptions, but renders only the content as readonly and without a toolbar. Import is the `content` input, where you can pass the editor content you want to present.

#### Config

- content - the content to be presented
- formats - array of allowed formats/groupings
- format - model format - default: `html`, values: `html | object | text | json`, sets the model value type - html = html string, object = quill operation object, json = quill operation json, text = plain text
- modules - configure/disable quill modules
- theme - bubble/snow, default is `snow`
- debug - set log level `warn`, `error`, `log` or `false` to deactivate logging, default: `warn`
- use custom-options for adding for example custom font sizes --> this overwrites this options **globally** !!!
- strict - default: true, sets editor in strict mode
- preserveWhitespace - default: false - possbility to use a pre-tag instead of a div-tag for the contenteditable area to preserve duplicated whitespaces | caution if used with syntax plugin [Related issue](https://github.com/quilljs/quill/issues/1751)

```HTML
<quill-view [content]="content" format="text" theme="snow"></quill-view>
```

### QuillViewHTMLComponent - Using angular [innerHTML]

Most of you will use the `html` format (even it is not recommended). To render custom html with angular you should use the `[innerHTML]` attribute.

But there are some pitfalls:

1. You need to have the quill css files loaded, when using classes and not inline styling (https://quilljs.com/guides/how-to-customize-quill/#class-vs-inline)
2. When using classes use a `div`-tag that has the `innerHTML` attribute and add the `ql-editor` class. Wrap your div in another `div`-tag with css classes `ql-container` and your theme, e.g. `ql-snow`.:

```HTML
<div class="ql-container ql-snow" style="border-width: 0;">
  <div class="ql-editor" [innerHTML]="byPassedHTMLString">
  </div>
</div>
```

3. Angular has html sanitation, so it will strip unkown or not trusted parts of your HTML - just mark your html as trusted ([DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer))

After that your content should look like what you expected.

If you store html in your database, checkout your backend code, sometimes backends are stripping unwanted tags as well ;).

As a helper `ngx-quill` provides a component where you can simply pass your html string and the component does everything for you to render it:

- add necessary css classes
- bypass html sanitation

```HTML
<quill-view-html [content]="htmlstring" theme="snow"></quill-view-html>
```

#### Config

As inputs you can set the `content` and optional the `theme` (default is `snow`).

- content - html string to be presented
- theme - bubble/snow, default is `snow`

## Security Hint

Angular templates provide some assurance against XSS in the form of client side sanitizing of all inputs https://angular.io/guide/security#xss.

Ngx-quill provides the config paramter `sanitize` to sanitize html-strings passed as `ngModel` or `formControl` to the component.

It is **deactivated per default** to avoid stripping content or styling, which is not expected.

But it is **recommended** to activate this option, if you are working with html strings as model values.
