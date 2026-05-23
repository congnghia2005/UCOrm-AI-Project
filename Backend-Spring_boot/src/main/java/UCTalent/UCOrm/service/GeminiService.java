package UCTalent.UCOrm.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

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

    public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateReply(String reviewContent) {
        try {
            return this.chatClient.prompt()
                    .system(SYSTEM_PROMPT) 
                    .user("Nội dung review của khách hàng: " + reviewContent) 
                    .call()
                    .content();
        } catch (Exception e) {
            return "{\"error\": \"Lỗi khi gọi Gemini AI: " + e.getMessage() + "\"}";
        }
    }
}