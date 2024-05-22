import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecommendationService } from './recommendor.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecommendationService]
    });
    service = TestBed.inject(RecommendationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch recommendations from the API', () => {
    const mockFeedback = { recommendations: [{ idx: 1, like: true }, { idx: 2, like: false }] };
    const mockResponse = [{ id: 1, title: 'Recommendation 1' }, { id: 2, title: 'Recommendation 2' }];

    service.getRecommendations(mockFeedback).subscribe(recommendations => {
      expect(recommendations).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFeedback);
    req.flush(mockResponse);
  });

  it('should handle error when fetching recommendations', () => {
    const mockFeedback = { recommendations: [{ idx: 1, like: true }, { idx: 2, like: false }] };
    const errorMessage = 'An error occurred while fetching recommendations';
  
    service.getRecommendations(mockFeedback).subscribe({
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
