import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { QuillEditorComponent } from '../src/quill-editor.component';

@Component({
    template: `
<quill-editor [(ngModel)]="title" [required]="required" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event);" (onSelectionChanged)="handleSelection($event);"></quill-editor>
`
})
class TestComponent {
    title = 'Hallo';
    isReadOnly = false;
    required = false;
    minLength = 0;
    maxLength = 0;

    changed: any;
    selected: any;

    handleEditorCreated(event: any) {}

    handleChange(event: any) {
        this.changed = event;
    }

    handleSelection(event: any) {
        this.selected = event;
    }
}

@Component({
    template: `
<quill-editor [(ngModel)]="title" [required]="true" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event);">
    <div quill-editor-toolbar="true">
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
            <select class="ql-align">
                <option selected></option>
                <option value="center"></option>
                <option value="right"></option>
                <option value="justify"></option>
            </select>
        </span>
    </div>
</quill-editor>
`
})
class TestToolbarComponent {
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
            declarations: [QuillEditorComponent, TestComponent, TestToolbarComponent],
            imports: [FormsModule]
        }).compileComponents();

        this.fixture = TestBed.createComponent(TestComponent) as ComponentFixture<TestComponent>;
    });

    it('should set editor settings', async(() => {
        this.fixture.detectChanges();
        const editorElem = this.fixture.debugElement.children[0];
        const editorCmp = this.fixture.debugElement.children[0].componentInstance;

        expect(editorCmp.readOnly).toBe(false);

        this.fixture.componentInstance.isReadOnly = true;
        this.fixture.detectChanges();

        this.fixture.whenStable().then(() => {
            expect(editorCmp.readOnly).toBe(true);
            expect(editorElem.nativeElement.querySelectorAll('div.ql-container.ql-disabled').length).toBe(1);
        });
    }));

    it('should set touched state correctly', async(() => {
        this.fixture.detectChanges();

        const editorFixture = this.fixture.debugElement.children[0];

        editorFixture.componentInstance.quillEditor.focus();
        editorFixture.componentInstance.quillEditor.blur();
        this.fixture.detectChanges();

        expect(editorFixture.nativeElement.className).toMatch('ng-touched');
    }));

    it('should set required state correctly', async(() => {
        // get editor component
        const editorElement = this.fixture.debugElement.children[0].nativeElement;

        this.fixture.componentInstance.title = '';
        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            expect(editorElement.className).toMatch('ng-valid');
        });
    }));

    it('should emit onEditorCreated with editor instance', async(() => {
        spyOn(this.fixture.componentInstance, 'handleEditorCreated');
        this.fixture.detectChanges();
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        expect(this.fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(editorComponent.quillEditor);
    }));

    it('should emit onContentChanged when content of editor changed', async(() => {
        spyOn(this.fixture.componentInstance, 'handleChange').and.callThrough();
        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            this.fixture.componentInstance.title = '1234';
            return this.fixture.detectChanges();
        }).then(() => {
            expect(this.fixture.componentInstance.handleChange).toHaveBeenCalledWith(this.fixture.componentInstance.changed);
        });
    }));

    it('should emit onSelectionChanged when selection changed', async(() => {
        spyOn(this.fixture.componentInstance, 'handleSelection').and.callThrough();
        this.fixture.detectChanges();

        const editorFixture = this.fixture.debugElement.children[0];

        editorFixture.componentInstance.quillEditor.focus();
        editorFixture.componentInstance.quillEditor.blur();
        this.fixture.detectChanges();

        expect(this.fixture.componentInstance.handleSelection).toHaveBeenCalledWith(this.fixture.componentInstance.selected);
    }));

    it('should validate minlength', async(() => {
        // get editor component
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        const editorElement = this.fixture.debugElement.children[0].nativeElement;

        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            expect(editorElement.className).toMatch('ng-valid');

            // set minlength
            this.fixture.componentInstance.minLength = 8;
            this.fixture.componentInstance.title = 'Hallo1';

            this.fixture.detectChanges();

            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();
            expect(editorComponent.minLength).toBe(8);
            expect(editorElement.className).toMatch('ng-invalid');
        });
    }));

    it('should set valid minlength if model is empty', async(() => {
        // get editor component
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        const editorElement = this.fixture.debugElement.children[0].nativeElement;

        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            // set min length
            editorComponent.minLength = 2;
            // change text
            editorComponent.quillEditor.setText('');

            this.fixture.detectChanges();
            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();
            expect(editorElement.className).toMatch('ng-valid');
        });
    }));

    it('should validate maxlength', async(() => {
        // get editor component
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        const editorElement = this.fixture.debugElement.children[0].nativeElement;

        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

            this.fixture.componentInstance.maxLength = 3;
            this.fixture.componentInstance.title = '1234';
            this.fixture.detectChanges();

            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();

            expect(editorComponent.maxLength).toBe(3);
            expect(editorElement.className).toMatch('ng-invalid');
        });
    }));

    it('should validate maxlength and minlength', async(() => {
        // get editor component
        const editorElement = this.fixture.debugElement.children[0].nativeElement;

        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

            this.fixture.componentInstance.minLength = 3;
            this.fixture.componentInstance.maxLength = 5;
            this.fixture.componentInstance.title = '123456';

            this.fixture.detectChanges();
            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();
            expect(editorElement.className).toMatch('ng-invalid');

            this.fixture.componentInstance.title = '1234';

            this.fixture.detectChanges();
            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();
            expect(editorElement.className).toMatch('ng-valid');
        });
    }));

    it('should validate required', async(() => {
        // get editor component
        const editorElement = this.fixture.debugElement.children[0].nativeElement;
        const editorComponent = this.fixture.debugElement.children[0].componentInstance;

        this.fixture.detectChanges();
        this.fixture.whenStable().then(() => {
            expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');
            expect(editorComponent.required).toBeFalsy();

            this.fixture.componentInstance.required = true;
            this.fixture.componentInstance.title = '';

            this.fixture.detectChanges();
            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();

            expect(editorComponent.required).toBeTruthy();
            expect(editorElement.className).toMatch('ng-invalid');

            this.fixture.componentInstance.title = '1';

            this.fixture.detectChanges();
            return this.fixture.whenStable();
        }).then(() => {
            this.fixture.detectChanges();
            expect(editorElement.className).toMatch('ng-valid');
        });
    }));

    it('should add custom toolbar', async(() => {
        // get editor component
        this.fixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>;

        this.fixture.detectChanges();
        expect(this.fixture.nativeElement.querySelector('[quill-editor-toolbar]').querySelector('span[title=Alignment]')).toBeDefined();

        const editorComponent = this.fixture.debugElement.children[0].componentInstance;
        expect(editorComponent.required).toBe(true);
    }));
});
