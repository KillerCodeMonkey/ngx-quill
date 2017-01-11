import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'src/app.component.html',
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
