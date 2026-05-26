package UCTalent.UCOrm.config;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount = null;

            String firebaseConfigEnv = System.getenv("FIREBASE_CONFIG_JSON");

            if (firebaseConfigEnv != null && !firebaseConfigEnv.trim().isEmpty()) {
                System.out.println(">> Đang khởi tạo Firebase bằng biến môi trường (Production)...");
                serviceAccount = new ByteArrayInputStream(firebaseConfigEnv.getBytes(StandardCharsets.UTF_8));
            } else {
                // 2. Nếu không có biến môi trường (đang chạy ở local), tìm file serviceAccountKey.json mặc định
                System.out.println(">> Không tìm thấy biến môi trường. Đang tìm file serviceAccountKey.json ở local...");
                serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");
            }

            if (serviceAccount == null) {
                System.err.println(">> LỖI: Không tìm thấy nguồn cấu hình Firebase hợp lệ (Thiếu cả file lẫn biến môi trường)!");
                return;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("====== FIREBASE KẾT NỐI THÀNH CÔNG ======");
            }
        } catch (Exception e) {
            System.err.println(">> LỖI khi khởi tạo Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }
}