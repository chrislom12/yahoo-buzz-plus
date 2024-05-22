import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ArticleService } from './article.service';
import { RecommendationService } from './recommendor.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let articleServiceStub: Partial<ArticleService>;
  let recommendationServiceStub: Partial<RecommendationService>;

  beforeEach(() => {
    articleServiceStub = {
      getArticles: () => of([])
    };

    recommendationServiceStub = {
      getRecommendations: () => of([])  
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: ArticleService, useValue: articleServiceStub },
        { provide: RecommendationService, useValue: recommendationServiceStub }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

/*   it(`should have as title 'YahooBuzz+'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('YahooBuzz+');
  }); */

