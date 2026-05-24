import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: string;
  placeId: string;
  authorName: string;
  rating: number;
  text: string;
  status: 'pending' | 'resolved';
  aiResponses?: {
    standard: string;
    friendly: string;
    escalation: string;
  };
  selectedResponse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private aiApiUrl = 'http://localhost:8080/api/reviews/generate-reply';

  constructor(private http: HttpClient) {}
  generateAiReply(reviewContent: string): Observable<any> {
    return this.http.post<any>(this.aiApiUrl, { reviewContent });
  }
  getReviews(): Observable<Review[]> {
  return this.http.get<Review[]>('http://localhost:8080/api/reviews');
}
}