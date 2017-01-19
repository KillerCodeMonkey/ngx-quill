import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<h3>Default editor</h3>
<quill-editor></quill-editor>

<h3>Bubble editor</h3>
<quill-editor theme="bubble"></quill-editor>

<h3>Editor without toolbar + required and ngModule</h3>
<button (click)="toggleReadOnly()">Toggle ReadOnly</button>
{{isReadOnly}}
{{title}}
<quill-editor [(ngModel)]="title" [maxLength]="5" [minLength]="3" required="true" [readOnly]="isReadOnly" [modules]="{toolbar: false}" (onContentChanged)="logChange($event);"></quill-editor>
`
})
export class AppComponent {
  title = 'Quill works!';
  isReadOnly = false;

  toggleReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

  logChange($event: any) {
    console.log($event);
  }
}
