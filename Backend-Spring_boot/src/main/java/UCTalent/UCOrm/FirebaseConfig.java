package UCTalent.UCOrm;

import java.io.InputStream;

import jakarta.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");

            if (serviceAccount == null) {
                System.err.println(">> LỖI: Không tìm thấy file serviceAccountKey.json trong resources!");
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