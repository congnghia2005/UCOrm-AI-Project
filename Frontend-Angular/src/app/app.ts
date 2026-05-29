import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewService, Review } from './services/review'; 
import { ReviewResponseComponent } from './components/review-response/review-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewResponseComponent], 
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class App implements OnInit {
  reviews: Review[] = [];
  selectedReview: Review | null = null; 
  isLoading: boolean = false; 
  aiReplies: any = null;
  currentReplyText: string = ''; 
  inputPlaceId: string = '';
  isFetching: boolean = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    // 🔑 Mới vào ứng dụng: inputPlaceId trống -> tự động hiển thị màn hình trống trơn
    this.reloadReviewsList();
  }

  selectReview(review: Review): void {
    this.selectedReview = review;
    this.aiReplies = null;        
    this.currentReplyText = '';   
  }

  onGenerateAiReply(reviewText: string): void {
    if (!reviewText) return;
    this.isLoading = true;

    this.reviewService.generateAiReply(reviewText).subscribe({
      next: (response) => {
        this.aiReplies = response; 
        this.currentReplyText = response.standard; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi gọi Gemini API:', err);
        alert('Không thể kết nối với trợ lý AI. Vui lòng kiểm tra lại Backend!');
        this.isLoading = false;
      }
    }); 
  }

  onTabChange(style: 'standard' | 'friendly' | 'escalation'): void {
    if (this.aiReplies) {
      this.currentReplyText = this.aiReplies[style];
    }
  }

  // 🔑 ĐÃ SỬA: Luôn lọc danh sách review theo nội dung ô Input hiện tại
  reloadReviewsList(): void {
    this.reviewService.getReviews(this.inputPlaceId.trim()).subscribe({
      next: (data: Review[]) => {
        this.reviews = data;
        
        if (this.selectedReview) {
          const updatedReview = data.find(r => r.id === this.selectedReview?.id);
          if (updatedReview) {
            this.selectedReview = updatedReview;
          } else {
            this.selectedReview = data.length > 0 ? data[0] : null;
          }
        } else if (data.length > 0) {
          this.selectedReview = data[0];
        } else {
          this.selectedReview = null;
        }
      },
      error: (err: any) => console.error('Lỗi nạp lại danh sách:', err)
    });
  }

  onFetchReviews(): void {
    if (!this.inputPlaceId.trim()) {
      alert('Vui lòng nhập Place ID trước khi bấm Fetch!');
      return;
    }

    this.isFetching = true;
    
    // 🔑 GIẢI PHÁP: Reset sạch giao diện chi tiết và kịch bản AI cũ trước khi nạp ID mới
    this.selectedReview = null;
    this.aiReplies = null;
    this.reviews = [];

    this.reviewService.fetchReviewsByPlaceId(this.inputPlaceId.trim()).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(res.message);
          this.reloadReviewsList();
        }
        this.isFetching = false;
      },
      error: (err: any) => {
        console.error(err);
        alert('Có lỗi xảy ra khi fetch dữ liệu từ hệ thống!');
        this.isFetching = false;
      }
    });
  }
}