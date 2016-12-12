import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quill works!';
  isReadOnly = false;

  toggleReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

  logChange($event) {
    console.log($event);
  }
}
