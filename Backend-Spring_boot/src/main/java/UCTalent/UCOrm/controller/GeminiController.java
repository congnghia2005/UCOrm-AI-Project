package UCTalent.UCOrm.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import UCTalent.UCOrm.service.GeminiService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") 
public class GeminiController {

    private final GeminiService geminiService;

        public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/generate-reply")
    public ResponseEntity<String> generateReply(@RequestBody Map<String, String> requestBody) {
        String reviewContent = requestBody.get("reviewContent");
        
        if (reviewContent == null || reviewContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Nội dung review không được để trống!\"}");
        }

        String aiResponse = geminiService.generateReply(reviewContent);
        
        return ResponseEntity.ok()
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(aiResponse);
    }
<<<<<<< HEAD

    // Thêm hàm này vào bên trong class GeminiController
    @PostMapping("/save-reply")
    public ResponseEntity<Map<String, Object>> saveReply(@RequestBody Map<String, String> requestBody) {
        String reviewId = requestBody.get("reviewId");
        String selectedReply = requestBody.get("selectedReply");

        if (reviewId == null || selectedReply == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Thiếu dữ liệu đầu vào!"));
        }

        boolean isSaved = geminiService.saveReplyToFirebase(reviewId, selectedReply);

        if (isSaved) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật Firebase thành công!"));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Lỗi khi cập nhật lỗi lên Firebase!"));
        }
    }
=======
>>>>>>> 9e90cb906988f055b6f5f46323394001a2dbfaa6
}