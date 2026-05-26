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
  private baseUrl = 'https://ucorm-ai-project-1.onrender.com/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.baseUrl);  
  }

  generateAiReply(reviewContent: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-reply`, { reviewContent });
  }

  saveSelectedReply(reviewId: string, selectedReply: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save-reply`, { reviewId, selectedReply });
  }
  
  fetchReviewsByPlaceId(placeId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/fetch`, { placeId });
  }
}