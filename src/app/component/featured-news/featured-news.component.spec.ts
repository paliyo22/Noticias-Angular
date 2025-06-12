import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedNewsComponent } from './featured-news.component';

describe('FeaturedNewsComponent', () => {
  let component: FeaturedNewsComponent;
  let fixture: ComponentFixture<FeaturedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
