# Ng2quill

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.19-3.

## Installation
- install QuillJS 1.1.5
- include bubble.css, snow.css in your index.html
- add QuillModule to your own NgModule
- use `<quill-editor></quill-editor>` in your templates to add a default quill editor

## Config
- ngModel - set initial value or allow two-way databinding
- readOnly (true | false) if user can edit content
- formats - array of allowed formats/groupings
- toolbarConfig - configure/disable toolbar
- theme - bubble/snow
- placeholder - placeholder text

## Outputs
- onEditorCreated - editor instance
- onContentChanged - text is updated
```
{
  editor: this.quillEditor,
  html: html,
  text: text
}
```

