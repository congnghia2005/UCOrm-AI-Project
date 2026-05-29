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
  activeTab: 'standard' | 'friendly' | 'escalation' = 'standard';

  constructor(private reviewService: ReviewService) {}

  switchTab(tab: 'standard' | 'friendly' | 'escalation') {
    this.activeTab = tab;
  }

  applyReply(replyText: string) {
    if (!this.selectedReview || !this.selectedReview.id) {
      alert('Không tìm thấy thông tin review!');
      return;
    }

    this.reviewService.saveSelectedReply(this.selectedReview.id, replyText).subscribe({
      next: (res) => {
        // Chấp nhận cả trường hợp phản hồi trả về Object success hoặc chuỗi map thành công
        if (res && (res.success || res === true)) {
          alert('Đã lưu phản hồi lên Firebase thành công!');
          
          // 🔑 ĐỒNG BỘ LOCAL STATE: Ép giao diện hiển thị trạng thái mới ngay lập tức
          this.selectedReview.status = 'resolved';
          this.selectedReview.replyContent = replyText;
          
          // Bắn sự kiện thông báo để App Component cha đồng bộ lại mảng reviews tổng
          this.statusChanged.emit(); 
        } else {
          // Phòng hờ nếu backend trả ra cấu hình khác, vẫn kích hoạt reload danh sách
          this.statusChanged.emit();
        }
      },
      error: (err) => {
        console.error('Lỗi khi lưu phản hồi:', err);
        alert('Có lỗi xảy ra khi lưu phản hồi!');
      }
    });
  }
}