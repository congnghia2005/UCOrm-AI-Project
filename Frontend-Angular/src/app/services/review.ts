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
  private apiUrl = 'http://localhost:8080/api/reviews'; 

  constructor(private http: HttpClient) { }

    getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }
}