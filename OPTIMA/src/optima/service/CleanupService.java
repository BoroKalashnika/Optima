package optima.service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import optima.model.Rutina;
import optima.repository.EjercicioRepository;
import optima.repository.RutinaRepository;

import java.util.Date;
import java.util.List;

@Service
public class CleanupService {

	@Autowired
	private RutinaRepository rutinaRepository;

	@Autowired
	private EjercicioRepository ejercicioRepository;

	@Autowired
	private CloudinaryService cloudinaryService;

	@Value("${app.rutina.key_nombre}")
	private String claveRutina;

	@Autowired
	public CleanupService(RutinaRepository rutinaRepository, EjercicioRepository ejercicioRepository) {
		this.rutinaRepository = rutinaRepository;
		this.ejercicioRepository = ejercicioRepository;
	}

	@Scheduled(cron = "0 * * * * *") // Segundo , minuto, dia ...
	public void cleanOrphanedExercises() {
		Instant expirationTime = Instant.now().minus(15, ChronoUnit.MINUTES);

		List<Rutina> orphanedRoutines = rutinaRepository.findAllByNombreRutina(claveRutina);
		orphanedRoutines.stream().filter(rutina -> isTimestampBeforeExpiration(rutina.getTimestamp(), expirationTime))
				.forEach(rutina -> {
					ejercicioRepository.findByIdRutina(rutina.getId()).forEach(ejercicio -> {
						cloudinaryService.deleteVideo(ejercicio.getVideo());
						ejercicioRepository.deleteById(ejercicio.getId());
					});
					rutinaRepository.deleteById(rutina.getId());
					System.out.println("Deleted exercises, videos, and routine: " + rutina.getId());
				});
	}

	private boolean isTimestampBeforeExpiration(String timestampString, Instant expirationTime) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy, HH:mm:ss");
			Date parsedDate = sdf.parse(timestampString);
			Instant timestamp = parsedDate.toInstant();

			return timestamp.isBefore(expirationTime);
		} catch (Exception e) {
			System.err.println("Invalid timestamp format: " + timestampString);
			return false;
		}
	}

}
