import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review';

@Component({
  selector: 'app-review-response',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-response.html',
  styleUrls: ['./review-response.css']
})
export class ReviewResponseComponent {
  @Input() selectedReview: any; 
  @Input() aiResponses: any;    
  @Output() statusChanged = new EventEmitter<void>(); 
  
  activeTab: 'professional' | 'friendly' | 'crisis' = 'professional';

  constructor(private reviewService: ReviewService) {}

  switchTab(tab: 'professional' | 'friendly' | 'crisis') {
    this.activeTab = tab;
  }

  applyReply(replyText: string) {
    if (!this.selectedReview || !this.selectedReview.id) {
      alert('Không tìm thấy thông tin review!');
      return;
    }

    this.reviewService.saveSelectedReply(this.selectedReview.id, replyText).subscribe({
      next: (res) => {
        if (res === true || res?.success || res?.status === 'Resolved') {
          alert('Đã lưu phản hồi lên Firebase thành công!');
          this.selectedReview.status = 'Resolved';
          this.selectedReview.replyContent = replyText;
          this.statusChanged.emit(); 
        } else {
          this.statusChanged.emit();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi lưu phản hồi!');
      }
    });
  }
}