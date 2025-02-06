package optima.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FirestoreService {

	public String subirVideo(MultipartFile archivo) throws IOException {
		String nombreArchivo = UUID.randomUUID().toString() + "-" + archivo.getOriginalFilename();

		// Subir el archivo a Firebase Storage
		Bucket bucket = StorageClient.getInstance().bucket();
		Blob blob = bucket.create(nombreArchivo, archivo.getBytes(), archivo.getContentType());

		// Generar la URL de acceso al archivo
		return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/" + nombreArchivo + "?alt=media";
	}
}
