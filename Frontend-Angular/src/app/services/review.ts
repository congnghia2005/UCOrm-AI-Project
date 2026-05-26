import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: string;
  placeId: string;
  authorName: string;
  rating: number;
  text: string;
  status: 'pending' | 'resolved'; // Đã giữ nguyên chữ thường theo đúng ý bạn
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
  // 🔑 ĐÃ SỬA: Đổi sang địa chỉ Render chạy thật cho API sinh lời giải AI
  private aiApiUrl = 'https://ucorm-backend.onrender.com/api/reviews/generate-reply';

  constructor(private http: HttpClient) {}

  generateAiReply(reviewContent: string): Observable<any> {
    return this.http.post<any>(this.aiApiUrl, { reviewContent });
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>('https://ucorm-backend.onrender.com/api/reviews');  
  }

  saveSelectedReply(reviewId: string, selectedReply: string): Observable<any> {
    const url = 'https://ucorm-backend.onrender.com/api/reviews/save-reply';
    return this.http.post<any>(url, { reviewId, selectedReply });
  }
  
  fetchReviewsByPlaceId(placeId: string): Observable<any> {
    const url = 'https://ucorm-backend.onrender.com/api/reviews/fetch';
    return this.http.post<any>(url, { placeId });
  }
}