package optima.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CloudinaryService {

	private final Cloudinary cloudinary;

	public CloudinaryService(@Value("${cloudinary.cloud_name}") String cloudName,
			@Value("${cloudinary.api_key}") String apiKey, @Value("${cloudinary.api_secret}") String apiSecret) {

		this.cloudinary = new Cloudinary(
				ObjectUtils.asMap("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));
	}

	public void deleteVideo(String videoUrl) {
		try {
			String publicId = extractPublicId(videoUrl);
			if (publicId != null) {
				@SuppressWarnings("rawtypes")
				Map result = cloudinary.uploader().destroy(publicId,
						ObjectUtils.asMap("resource_type", "video", "invalidate", true));
				System.out.println("Video deleted: " + result);
			}
		} catch (Exception e) {
			System.err.println("Error deleting video: " + e.getMessage());
		}
	}

	private String extractPublicId(String videoUrl) {
		if (videoUrl == null || !videoUrl.contains("/"))
			return null;
		String[] parts = videoUrl.split("/");
		String fileName = parts[parts.length - 1];
		return fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
	}
}
