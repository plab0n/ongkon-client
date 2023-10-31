import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardContainerComponent } from './whiteboard-container.component';

describe('WhiteboardContainerComponent', () => {
  let component: WhiteboardContainerComponent;
  let fixture: ComponentFixture<WhiteboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhiteboardContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhiteboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
