import { TestBed, async, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuillEditorComponent } from '../src/quill-editor.component';

@Component({
    template: `
<quill-editor [(ngModel)]="title" required="true" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event);"></quill-editor>
`
})
class TestComponent {
    title = 'Hallo';
    isReadOnly = false;
    minLength = 0;
    maxLength = 0;

    handleEditorCreated(event: any) {}  

    handleChange(event: any) {}
}


describe('Basic QuillEditorComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QuillEditorComponent]
        });

        this.fixture = TestBed.createComponent(QuillEditorComponent) as ComponentFixture<QuillEditorComponent>;
    });

    it('should render toolbar', async(() => {
        const element = this.fixture.nativeElement;
        this.fixture.detectChanges();
        expect(element.querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1);
        expect(this.fixture.componentInstance.quillEditor).toBeDefined();
    }));

    it('should render text div', async(() => {
        const element = this.fixture.nativeElement;
        this.fixture.detectChanges();
        expect(element.querySelectorAll('div.ql-container.ql-snow').length).toBe(1);
        expect(this.fixture.componentInstance.quillEditor).toBeDefined();
    }));
});

describe('Advanced QuillEditorComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QuillEditorComponent, TestComponent],
            imports: [FormsModule]
        }).compileComponents();

        this.fixture = TestBed.createComponent(TestComponent)  as ComponentFixture<TestComponent>;
    });

    it('should set editor settings', fakeAsync(() => {
        this.fixture.detectChanges();
        const editorElem = this.fixture.debugElement.children[0];
        const editorCmp = this.fixture.debugElement.children[0].componentInstance;

        expect(editorCmp.readOnly).toBe(false);

        this.fixture.componentInstance.isReadOnly = true;
        this.fixture.detectChanges();
        tick();

        expect(editorCmp.readOnly).toBe(true);
        expect(editorElem.nativeElement.querySelectorAll('div.ql-container.ql-disabled').length).toBe(1);
    }));

    it('should set touched state correctly', async(() => {
        this.fixture.detectChanges();

        const editorFixture = this.fixture.debugElement.children[0];

        editorFixture.componentInstance.quillEditor.focus();
        editorFixture.componentInstance.quillEditor.blur();
        this.fixture.detectChanges();
    
        expect(editorFixture.nativeElement.className).toMatch('ng-touched');
    }));

    it('should set required state correctly', fakeAsync(() => {
        this.fixture.componentInstance.title = '';

        this.fixture.detectChanges();
        tick();

        const editorFixture = this.fixture.debugElement.children[0];
        expect(editorFixture.nativeElement.className).toMatch('ng-invalid');
    }));

    it('should emit onEditorCreated with editor instance', async(() => {
        spyOn(this.fixture.componentInstance, 'handleEditorCreated');
        this.fixture.detectChanges();
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        expect(this.fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(editorComponent.quillEditor);
    }));

    it('should emit onContentChanged when content of editor changed', fakeAsync(() => {
        spyOn(this.fixture.componentInstance, 'handleChange');
        this.fixture.detectChanges();

        this.fixture.componentInstance.title = '1234';

        this.fixture.detectChanges();
        tick();

        const editorFixture = this.fixture.debugElement.children[0];
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;

        expect(this.fixture.componentInstance.handleChange).toHaveBeenCalledWith({
            editor: editorComponent.quillEditor,
            html: editorFixture.nativeElement.querySelector('div.ql-editor').innerHTML,
            text: `1234
`
        });
    }));

    it('should validate minlength', async(() => {
        // get editor component
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;

        this.fixture.detectChanges();

        // change text
        editorComponent.quillEditor.setText('Blume');
        this.fixture.detectChanges();

        // should be valid
        expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

        // set minlength
        this.fixture.componentInstance.minLength = 6;
        this.fixture.detectChanges();
        
        // should be invalid
        this.fixture.whenStable(() => {
            expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-invalid');
        });
    }));

    it('should validate maxlength', async(() => {
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;

        this.fixture.detectChanges();

        editorComponent.quillEditor.setText('Blume');
        this.fixture.detectChanges();

        expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

        this.fixture.componentInstance.maxLength = 3;
        this.fixture.detectChanges();

        this.fixture.whenStable(() => {
            expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-invalid');
        });
    }));
});
