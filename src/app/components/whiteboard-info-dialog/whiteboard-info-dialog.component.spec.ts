import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardInfoDialogComponent } from './whiteboard-info-dialog.component';

describe('WhiteboardInfoDialogComponent', () => {
  let component: WhiteboardInfoDialogComponent;
  let fixture: ComponentFixture<WhiteboardInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhiteboardInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhiteboardInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
