import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { QuillEditorComponent } from './quill-editor.component';

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  imports: [],
  exports: [QuillEditorComponent],
  providers: []
})
export class QuillModule { }
