import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MisinformationService } from './misinformation.service';

describe('MisinformationService', () => {
  let service: MisinformationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MisinformationService]
    });
    service = TestBed.inject(MisinformationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect misinformation via API', () => {
    const mockFeedback = { text: 'Sample text for testing misinformation detection' };
    const mockResponse = { prediction: 'FAKE' };

    service.detectMisinformation(mockFeedback).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFeedback);
    req.flush(mockResponse);
  });

  it('should handle error when detecting misinformation', () => {
    const mockFeedback = { text: 'Sample text for testing misinformation detection' };
    const errorMessage = 'An error occurred while detecting misinformation';
  
    service.detectMisinformation(mockFeedback).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.error).toBeInstanceOf(ErrorEvent);
        expect(err.status).toBe(0);
        expect(err.statusText).toBe('Unknown Error');
        expect(err.url).toBe(service.apiUrl);
      }
    });
  
    const req = httpMock.expectOne(service.apiUrl);
    req.error(new ErrorEvent('Unknown Error'), { status: 0 });
  });
});

describe('MisinformationService Integration Tests', () => {
    let service: MisinformationService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [MisinformationService]
      });
      service = TestBed.inject(MisinformationService);
    });
  
    it('should detect misinformation via real API', (done) => {
      const feedback = { text: 'Sample text for testing misinformation detection' };
  
      service.detectMisinformation(feedback).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          expect(result.prediction).toBeDefined();
          done();
        },
        error: (error) => {
          fail('Expected successful API call, but got error: ' + error.message);
          done();
        }
      });
    });
  
    it('should handle error when detecting misinformation from real API', (done) => {
      service.apiUrl = 'http://invalid-url/api/detectMisinformation/';
  
      const feedback = { text: 'Sample text for testing misinformation detection' };
  
      service.detectMisinformation(feedback).subscribe({
        next: () => {
          fail('Expected an error, but got a successful response');
          done();
        },
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });
  

