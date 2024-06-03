import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteGeneratorComponent } from './sprite-generator.component';

describe('SpriteGeneratorComponent', () => {
  let component: SpriteGeneratorComponent;
  let fixture: ComponentFixture<SpriteGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpriteGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpriteGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
