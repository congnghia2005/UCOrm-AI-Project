package UCTalent.UCOrm.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

        public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }


    public String generateReply(String prompt) {
        try {
            return this.chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Lỗi khi gọi Gemini AI: " + e.getMessage();
        }
    }
}