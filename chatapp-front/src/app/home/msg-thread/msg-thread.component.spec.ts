import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgThreadComponent } from './msg-thread.component';

describe('MsgThreadComponent', () => {
  let component: MsgThreadComponent;
  let fixture: ComponentFixture<MsgThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
