package UCTalent.UCOrm.service;

import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    @Autowired
    private GoogleGenAiChatModel chatModel;

    private static final String SYSTEM_PROMPT = """
        You are an expert Customer Relations Manager for an e-commerce platform.
        Your task is to analyze the customer's review and generate exactly 3 types of replies in Vietnamese.
        
        CRITICAL: You must return the output strictly as a raw JSON object, without any markdown formatting, wrappers, or ```json blocks. The JSON must exactly match this structure:
        {
          "standard": "A professional, polite, and well-structured response.",
          "friendly": "A warm, enthusiastic, and friendly response using empathetic language.",
          "escalation": "An appropriate response focused on apology, conflict resolution, or compensation if the review is negative (1-3 stars), or an extra appreciative closing if positive."
        }
        
        Guidelines for replies:
        - Always use polite and natural Vietnamese ("Cảm ơn quý khách", "Dạ", "Rất tiếc về trải nghiệm này").
        - Keep responses concise, targeted, and appropriate to the review sentiment.
        - Do not invent external details not implied in the review.
        """;

    public String generateReply(String reviewContent) {
        try {
            // Gộp prompt hệ thống và review thật của khách hàng
            String finalPrompt = SYSTEM_PROMPT + "\nNội dung review của khách hàng: " + reviewContent;

            // Gọi trực tiếp sang Google GenAI Model (Tốc độ xử lý của mô hình Flash cực kỳ nhanh < 3s)
            String response = chatModel.call(finalPrompt);

            if (response == null) {
                return "{\"error\":\"Gemini không trả dữ liệu\"}";
            }

            // Gọt dũa chuỗi JSON phòng trường hợp AI trả về ký tự markdown thừa
            response = response.trim();
            if (response.startsWith("```")) {
                response = response.replaceAll("(?i)^```json", "").replaceAll("(?i)^```", "").replaceAll("```$", "").trim();
            }

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Lỗi khi gọi Gemini AI: " + e.getMessage() + "\"}";
        }
    }

    // Hàm fetchAndSaveMockReviews sinh 13 dữ liệu mẫu của chúng ta ở câu trước nằm ở đây...
}