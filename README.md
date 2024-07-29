# ngx-quill ![Build Status](https://github.com/KillerCodeMonkey/ngx-quill/workflows/CI/badge.svg)
<img src="https://raw.githubusercontent.com/KillerCodeMonkey/ngx-quill/master/ngx-quill-logo-v2.png" width="200px">

ngx-quill is an angular (>=2) module for the [Quill Rich Text Editor](https://quilljs.com/) containing all components you need.

## Donate/Support

If you like my work, feel free to support it. Donations to the project are always welcomed :)

PayPal: [PayPal.Me/bengtler](http://paypal.me/bengtler)

## Compatibility to Angular Versions

<table>
  <thead>
    <tr>
      <th>Angular</th>
      <th>ngx-quill</th>
      <th>supported</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        v18
      </td>
      <td>
        >= 26.0.0 (quill v2)
      </td>
      <td>
        until Nov, 2025
      </td>
    </tr>
    <tr>
      <td>
        v17
      </td>
      <td>
        25.x (quill v2)
      </td>
      <td>
        until May, 2025
      </td>
    </tr>
    <tr>
      <td>
        v17
      </td>
      <td>
        24.x (quill v1)
      </td>
      <td>
        until May, 2025
      </td>
    </tr>
    <tr>
      <td>
        v16
      </td>
      <td>
        23.x (quill v1)
      </td>
      <td>
        until Nov, 2024
      </td>
    </tr>
  </tbody>
</table>


## Examples

- [Advanced Demo](https://github.com/killerCodeMonkey/ngx-quill-example)
  - custom word count module
  - custom toolbar with custom fonts and formats, toolbar position
  - show the differences between sanitizing and not sanitizing your content if your content format is html
  - usage of different content formats
  - template-driven and reactive forms
  - code + syntax highlighting
  - formulas
  - image resizing
  - custom key-bindings, e.g. shift + b for bold
  - dynamic styles and placeholder
  - toggle readonly
  - bubble toolbar
  - activate formats after editor initialisation, e.g. rtl direction
  - present quilljs content with the `quill-view` and `quill-view-html` component
- [Ionic Demo](https://github.com/KillerCodeMonkey/ngx-quill-ionic)
- [Angular Universal](https://github.com/KillerCodeMonkey/ngx-quill-universal-example)


## Installation

- `npm install ngx-quill`
- install `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, `quill` version `^2.0.0` and `rxjs` - peer dependencies of ngx-quill
- include theme styling: 	**bubble.css or snow.css of quilljs** in your index.html (you can find them in `node_modules/quill/dist`), or add them in your css/scss files  with `@import` statements, or add them external stylings in your build process.
- Example at the beginning of your style.(s)css:

```TS
@import '~quill/dist/quill.bubble.css';
// or
@import '~quill/dist/quill.snow.css';
```

### For standard webpack, angular-cli and tsc builds

- import `QuillModule` from `ngx-quill`:
```TS
import { QuillModule } from 'ngx-quill'
```
- add `QuillModule` to the imports of your NgModule:
```TS

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

## Global Config

It's possible to set custom default modules and Quill config options with the import of the `QuillConfigModule` from the `ngx-quill/config`. This module provides a global config, but eliminates the need to import the `ngx-quill` library into the vendor bundle:

```ts
import { QuillConfigModule } from 'ngx-quill/config';

@NgModule({
  imports: [
    ...,

    QuillConfigModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [...]
      }
    })
  ],
  ...
})
class AppModule {}
```

Registering the global configuration can be also done using the standalone function if you are bootstrapping an Angular application using standalone features:

```ts
import { provideQuillConfig } from 'ngx-quill/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideQuillConfig({
      modules: {
        syntax: true,
        toolbar: [...]
      }
    })
  ]
})
```

If you want to use the `syntax` module follow the [Syntax Highlight Module Guide](https://quilljs.com/docs/modules/syntax/#syntax-highlighter-module).

See [Quill Configuration](https://quilljs.com/docs/configuration/) for a full list of config options.

The `QuillModule` exports the `defaultModules` if you want to extend them :).

## Known issues

- IME/special characters can add some unwanted new line (https://github.com/KillerCodeMonkey/ngx-quill/issues/1821#issuecomment-2019331522) - possible solution: unpatch the `compositionend` event from zone.js (https://angular.io/guide/zone#setting-up-zonejs)
- formControl/model change is triggered on first rendering by quill (https://github.com/KillerCodeMonkey/ngx-quill/issues/1547), because validation can only be done after quill editor is initialise - possible solution: /

### Custom Modules and options/formats

- use customOptions for adding for example custom font sizes or other options/formats
- use customModules for adding and overwriting modules, e.g. image-resize or your own modules

### Suppress global register warnings

Per default when `Quill.register` is called and you are overwriting an already existing module, QuillJS logs a warning. If you pass `customOptions` or `customModules` ngx-quill is registering those modules/options/formats for you.

In e.g. an angular univeral project your `AppModule` and so `QuillModule.forRoot()` is executed twice (1x server side, 1x browser). QuillJS is running in a mocked env on server side, so it is intendet that every register runs twice.

To subpress those expected warnings you can turn them off by passing `suppressGlobalRegisterWarning: true`.

## QuillEditorComponent

### Hint

Ngx-quill updates the ngModel or formControl for every `user` change in the editor.
Checkout the [QuillJS Source](https://quilljs.com/docs/api/#events) parameter of the `text-change` event.

If you are using the editor reference to directly manipulate the editor content and want to update the model, pass `'user'` as the source parameter to the QuillJS api methods.

### Config

- ngModel - set initial value or allow two-way databinding for template driven forms
- formControl/formControlName - set initial value or allow two-way databinding for reactive forms
- readOnly (true | false) if user can edit content
- formats - array of allowed formats/groupings
- format - model format - default: `html`, values: `html | object | text | json`, sets the model value type - html = html string, object = quill operation object, json = quill operation json, text = plain text
- modules - configure/disable quill modules, e.g toolbar or add custom toolbar via html element default is
```TS
const modules = {
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
- sanitize - uses angulars DomSanitizer to sanitize html values - default: `false`, boolean (only for format="html")
- styles - set a styles object, e.g. `[styles]="{height: '250px'}"`
- placeholder - placeholder text, default is `Insert text here ...`
- bounds - boundary of the editor, default `document.body`, pass 'self' to attach the editor element
- maxLength - add validation for maxlength - set model state to `invalid` and add `ng-invalid` class
- minLength - add validation for minlength - set model state to `invalid` and add `ng-invalid` class, only set invalid if editor text not empty --> if you want to check if text is required --> use the required attribute
- trimOnValidation - trim trailing|leading newlines on validation run for required, min- and maxLength, default `false`
- required - add validation as a required field - `[required]="true"` - default: false, boolean expected (no strings!)
- registry - custom parchment registry to not change things globally
- beforeRender - a function, which is executed before the Quill editor is rendered, this might be useful for lazy-loading CSS. Given the following example:

```ts
// typings.d.ts
declare module '!!raw-loader!*.css' {
  const css: string;
  export default css;
}

// my.component.ts
const quillCSS$ = defer(() =>
  import('!!raw-loader!quill/dist/quill.core.css').then((m) => {
    const style = document.createElement('style');
    style.innerHTML = m.default;
    document.head.appendChild(style);
  })
).pipe(shareReplay({ bufferSize: 1, refCount: true }));

@Component({
  template: '<quill-editor [beforeRender]="beforeRender"></quill-editor>',
})
export class MyComponent {
  beforeRender = () => firstValueFrom(quillCSS$);
}
```
- use customOptions for adding for example custom font sizes - array of objects `{ import: string; whitelist: any[] }` --> this overwrites this options **globally** !!!
```TS
// Example with registering custom fonts
customOptions: [{
  import: 'formats/font',
  whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
}]
```
- use customModules for adding and overwriting modules - an array of objects `{ implementation: any; path: string }` --> this overwrites this modules **globally** !!!
```TS
// The `implementation` may be a custom module constructor or an Observable that resolves to
// a custom module constructor (in case you'd want to load your custom module lazily).
// For instance, these options are applicable:
// import BlotFormatter from 'quill-blot-formatter';
customModules = [
  { path: 'modules/blotFormatter', implementation: BlotFormatter }
]
// Or:
const BlotFormatter$ = defer(() => import('quill-blot-formatter').then(m => m.default))
customModules = [
  { path: 'modules/blotFormatter', implementation: BlotFormatter$ }
]
```
- checkout the demo repo about usage of `customOptions` and `customModules` [Demo Repo](https://github.com/KillerCodeMonkey/ngx-quill-example/blob/2e72dc75e6d9b423f67b57b17cc8fb527dd694e4/src/app/app.module.ts#L67)
- possibility to create a custom toolbar via projection slot `[quill-editor-toolbar]` and add content above `[above-quill-editor-toolbar]` and below `[below-quill-editor-toolbar]` the toolbar:

**Try to not use much angular magic here, like `(output)` listeners. Use native EventListeners**

```HTML
<quill-editor>
  <div above-quill-editor-toolbar>
    above
  </div>
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
  <div below-quill-editor-toolbar>
    below
  </div>
</quill-editor>
```

- customToolbarPosition - if you are working with a custom toolbar you can switch the position :). - default: `top`, possible values `top`, `bottom`
- debug - set log level `warn`, `error`, `log` or `false` to deactivate logging, default: `warn`
- trackChanges - check if only `user` (quill source user) or `all` content/selection changes should be trigger model update, default `user`. Using `all` is not recommended, it cause some unexpected sideeffects.
- classes - a space separated list of CSS classes that will be added onto the editor element
- linkPlaceholder - optional - set placeholder for the link tooltip
- debounceTime - optional - debounces `onContentChanged`, `onEditorChanged`, `ngModel` and form control value changes. Improves performance (especially when working with large, >2-3 MiB Deltas), as neither `editorChangeHandler`, nor `textChangeHandler` handler runs internally.
- defaultEmptyValue - optional - change the default value for an empty editor. Currently it is `null`, but you can set it e.g. to empty string

[Full Quill Toolbar HTML](https://github.com/quilljs/quill/blob/f75ff2973f068c3db44f949915eb8a74faf162a8/docs/_includes/full-toolbar.html)

### Outputs

- onEditorCreated - editor instance
- Use this output to get the editor instance and use it directly. After this output has called the component is stable and all listeners are binded
```
editor // Quill
```
- onContentChanged - text is updated
```TS
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
```TS
{
  editor: editorInstance, // Quill
  range: range, // Range
  oldRange: oldRange, // Range
  source: source // ('user', 'api', 'silent' , undefined)
}
```
- onEditorChanged - text or selection is updated - independent of the source
```TS
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

```TS
{
  editor: editorInstance, // Quill
  event: 'selection-change' // event type
  range: range, // Range
  oldRange: oldRange, // Range
  source: source // ('user', 'api', 'silent' , undefined)
}
```

- onFocus - editor is focused
```TS
{
  editor: editorInstance, // Quill
  source: source // ('user', 'api', 'silent' , undefined)
}
```
- onBlur - editor is blured
```TS
{
  editor: editorInstance, // Quill
  source: source // ('user', 'api', 'silent' , undefined)
}
```

- onNativeFocus - editor is focused, based on native focus event
```TS
{
  editor: editorInstance, // Quill
  source: source // ('dom')
}
```
- onNativeBlur - editor is blured, based on native blur event
```TS
{
  editor: editorInstance, // Quill
  source: source // ('dom')
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
- use customOptions for adding for example custom font sizes --> this overwrites this options **globally** !!!
- use customModules for adding and overwriting modules --> this overwrites this modules **globally** !!!
- sanitize - uses angulars DomSanitizer to sanitize html values - default: `false`, boolean (only for format="html")

### Outputs

- onEditorCreated - editor instance

```HTML
<quill-view [content]="content" format="text" theme="snow"></quill-view>
```

### QuillViewHTMLComponent - Using angular [innerHTML] (DEPRECATED with quill v2)

Most of you will use the `html` format (even it is not recommended). To render custom html with angular you should use the `[innerHTML]` attribute.

But there are some pitfalls:

1. You need to have the quill css files loaded, when using classes and not inline styling (https://quilljs.com/guides/how-to-customize-quill/#class-vs-inline)
2. When using classes use a `div`-tag that has the `innerHTML` attribute and add the `ql-editor` class. Wrap your div in another `div`-tag with css classes `ql-container` and your theme, e.g. `ql-snow`.:
3. With quill v2 ngx-quill is using `quill.getSemanticHTML()` to get html content. There some list tag information are stripped. (https://github.com/slab/quill/issues/4103) (https://github.com/KillerCodeMonkey/ngx-quill/issues/1888)

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

- content - html string to be presented
- theme - bubble/snow, default is `snow`
- sanitize - default: `false`, boolean (uses [DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer#bypasssecuritytrusthtml) to bypass angular html sanitation when set to false) 

## Security Hint

Angular templates provide some assurance against XSS in the form of client side sanitizing of all inputs https://angular.io/guide/security#xss.

Ngx-quill components provide the input paramter `sanitize` to sanitize html-strings passed as `ngModel` or `formControl` to the component.

It is **deactivated per default** to avoid stripping content or styling, which is not expected.

But it is **recommended** to activate this option, if you are working with html strings as model values.
