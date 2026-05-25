package UCTalent.UCOrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import UCTalent.UCOrm.model.Review;
import UCTalent.UCOrm.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") // RẤT QUAN TRỌNG: Ngăn lỗi chặn CORS khi Angular gọi sang
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<Review> getReviews() {
        try {
            return reviewService.getAllReviews();
        } catch (Exception e) {
            e.printStackTrace();
            return null; 
        }
    }
}