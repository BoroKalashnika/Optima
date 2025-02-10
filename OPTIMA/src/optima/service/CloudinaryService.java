package optima.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CloudinaryService {

	private final Cloudinary cloudinary;

	public CloudinaryService() {
		cloudinary = new Cloudinary(ObjectUtils.asMap("cloud_name", "dhfvnvuox", "api_key", "742673386693573",
				"api_secret", "nNRecTieVNYeG49SBpYiZUX-4pI"));
	}

	public void deleteVideo(String videoUrl) {
		try {
			String publicId = extractPublicId(videoUrl);
			if (publicId != null) {
				@SuppressWarnings("rawtypes")
				Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "video", "invalidate", true));
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
