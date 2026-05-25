import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewService, Review } from './services/review'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], 
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
}