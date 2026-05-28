import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewService, Review } from './services/review'; 
import { ReviewResponseComponent } from './components/review-response/review-response';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule,ReviewResponseComponent], 
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class App implements OnInit {
  reviews: Review[] = [];
  selectedReview: Review | null = null; 

  
  isLoading: boolean = false; 
  aiReplies: any = null;
  currentReplyText: string = ''; 

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getReviews().subscribe({
      next: (data: Review[]) => { 
        this.reviews = data;
        if (data.length > 0) {
          this.selectedReview = data[0]; 
        }
      },
      error: (err: any) => console.error('Lỗi gọi API Backend:', err)
    });
  }

  selectReview(review: Review): void {
  this.selectedReview = review;
  this.aiReplies = null;        
  this.currentReplyText = '';   
}

  onGenerateAiReply(reviewText: string): void {
    if (!reviewText) return;

    this.isLoading = true;
    this.aiReplies = null; // Làm sạch dữ liệu cũ khi tạo request mới

    this.reviewService.generateAiReply(reviewText).subscribe({
      next: (response) => {
        // Nếu Server trả về String dạng chuỗi JSON thô, thực hiện ép kiểu parse an toàn
        let parsedResponse = response;
        if (typeof response === 'string') {
          try {
            parsedResponse = JSON.parse(response);
          } catch (e) {
            console.error('Lỗi định dạng chuỗi JSON:', e);
          }
        }

        this.aiReplies = parsedResponse; 
        
        // 🔑 ĐÃ SỬA: Gán văn phong mặc định ban đầu là chuyên nghiệp (professional)
        this.currentReplyText = parsedResponse.professional || ''; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi gọi Gemini API:', err);
        alert('Không thể kết nối với trợ lý AI. Vui lòng kiểm tra lại Backend!');
        this.isLoading = false;
      }
    }); 
  }

  // 🔑 ĐÃ SỬA: Đồng bộ phương thức đổi tab của App Root
  onTabChange(style: 'professional' | 'friendly' | 'crisis'): void {
    if (this.aiReplies) {
      this.currentReplyText = this.aiReplies[style];
    }
  }

  reloadReviewsList(): void {
    this.reviewService.getReviews().subscribe({
      next: (data: Review[]) => {
        this.reviews = data;
        
        if (this.selectedReview) {
          const updatedReview = data.find(r => r.id === this.selectedReview?.id);
          if (updatedReview) {
            this.selectedReview = updatedReview;
          }
        }
      },
      error: (err: any) => console.error('Lỗi nạp lại danh sách:', err)
    });
  }

  inputPlaceId: string = '';
  isFetching: boolean = false;

  onFetchReviews(): void {
    if (!this.inputPlaceId.trim()) {
      alert('Vui lòng nhập Place ID trước khi bấm Fetch!');
      return;
    }

    this.isFetching = true;

    this.reviewService.fetchReviewsByPlaceId(this.inputPlaceId).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(res.message);
          this.inputPlaceId = '';
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