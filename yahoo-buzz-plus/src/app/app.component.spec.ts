import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { ArticleService } from './article.service';
import { RecommendationService } from './recommendor.service';
import { MisinformationService } from './misinformation.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let articleService: ArticleService;
  let recommendationService: RecommendationService;
  let misinformationService: MisinformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule], 
      declarations: [AppComponent],
      providers: [ArticleService, RecommendationService, MisinformationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService);
    recommendationService = TestBed.inject(RecommendationService);
    misinformationService = TestBed.inject(MisinformationService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch articles on initialization', () => {
    const articles = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];
    spyOn(articleService, 'getArticles').and.returnValue(of(articles));
    component.ngOnInit();
    expect(component.allArticles).toEqual(articles);
  });

  it('should set article data', () => {
    const articles = [
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' },
    ];
    component.setArticleData(articles);
    expect(component.allArticles).toEqual(articles);
    expect(component.article).toEqual(articles[0]);
    expect(component.loading).toBeFalse();
  });

  it('should like an article', () => {
    const article = { id: 1, title: 'Article 1' };
    const article2 = { id: 2, title: 'Article 2' };

    component.article = article;
    component.allArticles = [article, article2];
    component.likeArticle();
    expect(component.preferences.length).toBe(1);
    expect(component.articleIndex).toBe(1);
    expect(component.articleProgress).toBe(2);
    expect(component.article).toEqual(article2);
    expect(component.misinformationStatus).toBe("Click here to detect misinformation")

  });

  it('should dislike an article', () => {
    const article = { id: 1, title: 'Article 1' };
    const article2 = { id: 2, title: 'Article 2' };

    component.article = article;
    component.allArticles = [article, article2];
    component.dislikeArticle();
    expect(component.preferences.length).toBe(1);
    expect(component.articleIndex).toBe(1);
    expect(component.articleProgress).toBe(2);
    expect(component.article).toEqual(article2);
    expect(component.misinformationStatus).toBe("Click here to detect misinformation")

  });

  it('should send feedback when article progress is greater than 9', () => {
    const article = { id: 1, title: 'Article 1' };
    const article2 = { id: 2, title: 'Article 2' };

    component.article = article;
    component.allArticles = [article, article2];
    component.articleProgress = 10;
    spyOn(component, 'sendFeedback');
    component.checkSend();
    expect(component.sendFeedback).toHaveBeenCalled();
  });

  it('should dislike an article and send feedback when progress is greater than 9', () => {
    spyOn(component, 'sendFeedback');

    for (let i = 0; i < 10; i++) {
      const article1 = { id: 1, title: 'Article 1' };
      const article2 = { id: 2, title: 'Article 2' };

      component.article = article1;
      component.allArticles = [article1, article2];
      component.likeArticle();
    }

    const article1 = { id: 1, title: 'Article 1' };
    const article2 = { id: 2, title: 'Article 2' };

    component.article = article1;
    component.allArticles = [article1, article2];

    component.dislikeArticle();
    expect(component.articleIndex).toBe(11);
    expect(component.articleProgress).toBe(12);
    expect(component.sendFeedback).toHaveBeenCalled();
  });

  it('should not send feedback when article progress is not greater than 9', () => {
    spyOn(component, 'sendFeedback');

    for (let i = 0; i < 8; i++) {
      const article1 = { id: 1, title: 'Article 1' };
      const article2 = { id: 2, title: 'Article 2' };

      component.article = article1;
      component.allArticles = [article1, article2];
      component.likeArticle();
    }

    const article1 = { id: 1, title: 'Article 1' };
    const article2 = { id: 2, title: 'Article 2' };

    component.article = article1;
    component.allArticles = [article1, article2];
    component.dislikeArticle();
    expect(component.articleIndex).toBe(9);
    expect(component.articleProgress).toBe(10);
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });

  it('should handle receiving recommendations', () => {
    const recommendations = [
      { id: 1, title: 'Recommendation 1' },
      { id: 2, title: 'Recommendation 2' },
    ];
    component.receiveRecommendations(recommendations);
    expect(component.recommendations).toEqual(recommendations);
    expect(component.view).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should close the view', () => {
    component.closeView();
    expect(component.view).toBe(2);
  });

  it('should navigate to the selected recommendation when read more button is clicked', () => {
    const recommendation = { id: 1, title: 'Recommendation 1' };
    component.recommendations = [recommendation];
    spyOn(console, 'log'); 
    component.readMore(0);
    expect(component.article).toEqual(recommendation);
    expect(component.view).toBe(3);
    expect(console.log).toHaveBeenCalledWith(
      'Read More button clicked for article index:',
      0
    );
  });

  it('should handle initialization when no articles are fetched', () => {
    spyOn(articleService, 'getArticles').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.allArticles).toEqual([]);
    expect(component.article).toBeUndefined();
    expect(component.loading).toBeTrue();
  });
  
  it('should handle initialization when articles are fetched but empty', () => {
    spyOn(articleService, 'getArticles').and.returnValue(of([]));
    component.ngOnInit();
    expect(component.allArticles).toEqual([]);
    expect(component.article).toBeUndefined();
    expect(component.loading).toBeTrue();
  });

  
  it('should handle reading more when there are no recommendations', () => {
    component.recommendations = [];
    component.readMore(0);
    expect(component.article).toBeUndefined();
    expect(component.view).toBe(3);
  });
  
  it('should handle closing the view when there are no recommendations', () => {
    component.recommendations = [];
    component.closeView();
    expect(component.view).toBe(2);
  });
  
  it('should handle sending feedback when there are no preferences', () => {
    component.preferences = [];
    spyOn(component, 'sendFeedback');
    component.checkSend();
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });
  
  it('should handle receiving recommendations when there are none', () => {
    component.receiveRecommendations([]);
    expect(component.recommendations).toEqual([]);
    expect(component.view).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle liking an article when article index exceeds the length of allArticles', () => {
    const article1 = { id: 1, title: 'Article 1' };
    component.article = article1;
    component.allArticles = [article1];
    spyOn(component, 'sendFeedback');
    component.likeArticle();
    expect(component.preferences.length).toBe(1);
    expect(component.articleIndex).toBe(1);
    expect(component.articleProgress).toBe(2);
    expect(component.article).toBeUndefined();
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });
  
  it('should handle disliking an article when article index exceeds the length of allArticles', () => {
    const article1 = { id: 1, title: 'Article 1' };
    component.article = article1;
    component.allArticles = [article1];
    spyOn(component, 'sendFeedback');
    component.dislikeArticle();
    expect(component.preferences.length).toBe(1);
    expect(component.articleIndex).toBe(1);
    expect(component.articleProgress).toBe(2);
    expect(component.article).toBeUndefined();
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });
  
  it('should not send feedback when there are no preferences', () => {
    spyOn(component, 'sendFeedback');
    component.checkSend();
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });
  
  it('should navigate to the selected recommendation when read more button is clicked', () => {
    const recommendation = { id: 1, title: 'Recommendation 1' };
    component.recommendations = [recommendation];
    spyOn(console, 'log'); 
    component.readMore(0);
    expect(component.article).toEqual(recommendation);
    expect(component.view).toBe(3);
    expect(console.log).toHaveBeenCalledWith('Read More button clicked for article index:', 0);
  });
  
  it('should handle sending feedback when article progress is greater than 9', () => {
    component.articleProgress = 10;
    spyOn(component, 'sendFeedback');
    component.checkSend();
    expect(component.sendFeedback).toHaveBeenCalled();
  });
  
  it('should not send feedback when article progress is not greater than 9', () => {
    component.articleProgress = 9;
    spyOn(component, 'sendFeedback');
    component.checkSend();
    expect(component.sendFeedback).not.toHaveBeenCalled();
  });

  it('should change view to recommendations when receiving recommendations', () => {
    const recommendations = [{ id: 1, title: 'Recommendation 1' }];
    component.receiveRecommendations(recommendations);
    expect(component.recommendations).toEqual(recommendations);
    expect(component.view).toBe(2);
    expect(component.loading).toBeFalse();
  });
  
  it('should change view to selected recommendation when read more button is clicked', () => {
    const recommendation = { id: 1, title: 'Recommendation 1' };
    component.recommendations = [recommendation];
    spyOn(console, 'log');
    component.readMore(0);
    expect(component.article).toEqual(recommendation);
    expect(component.view).toBe(3);
    expect(console.log).toHaveBeenCalledWith('Read More button clicked for article index:', 0);
  });
  
  it('should change view to recommendations when close view button is clicked', () => {
    component.view = 3;
    component.closeView();
    expect(component.view).toBe(2);
    expect(component.misinformationStatus).toBe("Click here to detect misinformation")
  });

  it('should update misinformation status when receiving misinformation prediction', () => {
    const mockData = { prediction: 'FAKE' };
    component.receiveMisinformation(mockData);
    expect(component.misinformationStatus).toBe('The article might be: FAKE');
  });
  
  it('should call detectMisinformation service method and update misinformation status on success', () => {
    const mockArticle = { id: 1, title: 'Article 1', text: 'Lorem ipsum dolor sit amet' };
    const mockContent = { text: 'Article 1Lorem ipsum dolor sit amet' };
    spyOn(misinformationService, 'detectMisinformation').and.returnValue(of({ prediction: 'FAKE' }));
    spyOn(component, 'receiveMisinformation');
    component.article = mockArticle;
    component.detectMisinformation();
    expect(misinformationService.detectMisinformation).toHaveBeenCalledWith(mockContent);
    expect(component.receiveMisinformation).toHaveBeenCalledWith({ prediction: 'FAKE' });
  });
  
  it('should log error when detectMisinformation service method fails', () => {
    const mockArticle = { id: 1, title: 'Article 1', text: 'Lorem ipsum dolor sit amet' };
    const mockContent = { text: 'Article 1Lorem ipsum dolor sit amet' };
    spyOn(misinformationService, 'detectMisinformation').and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    component.article = mockArticle;
    component.detectMisinformation();
    expect(console.error).toHaveBeenCalledWith('Error fetching misinformation detection result:', 'Error');
  });
});
