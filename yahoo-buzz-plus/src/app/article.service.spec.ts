import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService]
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch articles from the API', () => {
    const mockArticles = [{ id: 1, title: 'Article 1' }, { id: 2, title: 'Article 2' }];
    service.getArticles().subscribe(articles => {
      expect(articles).toEqual(mockArticles);
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });

  it('should handle error when fetching articles', () => {
    const errorMessage = 'An error occurred while fetching articles';
    service.getArticles().subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.error).toBeInstanceOf(ErrorEvent);
        expect(err.status).toBe(0);
        expect(err.statusText).toBe('Unknown Error');
        expect(err.url).toBe(service.apiUrl);
        // Add more specific expectations as needed
      }
    });
  
    const req = httpMock.expectOne(service.apiUrl);
    req.error(new ErrorEvent('Unknown Error'), { status: 0 });
  });
});
