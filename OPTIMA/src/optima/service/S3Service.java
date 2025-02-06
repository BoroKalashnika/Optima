package optima.service;

import software.amazon.awssdk.auth.credentials.AnonymousCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

	@Value("${aws.region}")
	private String region;

	@Value("${aws.s3.bucketName}")
	private String bucketName;

	private final S3Client s3Client = S3Client.builder().region(Region.of("us-east-1"))
			.credentialsProvider(AnonymousCredentialsProvider.create()).build();

	public String subirVideo(MultipartFile archivo) throws IOException {
		String nombreArchivo = UUID.randomUUID().toString() + "-" + archivo.getOriginalFilename();

		s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(nombreArchivo).acl("public-read").build(),
				RequestBody.fromInputStream(archivo.getInputStream(), archivo.getSize()));

		return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + nombreArchivo;
	}
}
