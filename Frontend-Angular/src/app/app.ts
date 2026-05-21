import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService ,Review} from './services/review'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './app.html', // Bạn kiểm tra xem tên file là 'app.html' hay 'app.component.html' nhé, trong ảnh tôi thấy là app.html
  styleUrl: './app.css'      // Trong ảnh tôi thấy tên file là app.css luôn
})
export class AppComponent implements OnInit {
  reviews: Review[] = [];
  selectedReview: Review | null = null; 

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getReviews().subscribe({
      next: (data: Review[]) => { // Thêm định nghĩa kiểu dữ liệu tường minh
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
}