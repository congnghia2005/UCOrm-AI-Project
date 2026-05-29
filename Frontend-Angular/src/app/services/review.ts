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
  // 🔑 ĐÃ SỬA: Cập nhật các thuộc tính văn phong AI đồng bộ 100% với file Backend Java
  aiResponses?: {
    professional: string; 
    friendly: string;
    crisis: string;      
  };
  selectedResponse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  // 🔑 ĐÃ SỬA: Trỏ trực tiếp từ localhost sang địa chỉ Production chính thức trên Cloud Render
  private baseUrl = 'https://backend-springboot-em81.onrender.com/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(placeId?: string): Observable<Review[]> {
    const url = placeId ? `${this.baseUrl}?placeId=${placeId}` : this.baseUrl;
    return this.http.get<Review[]>(url);  
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