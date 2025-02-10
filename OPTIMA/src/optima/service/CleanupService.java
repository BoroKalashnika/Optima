package optima.service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;
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
	public CleanupService(RutinaRepository rutinaRepository, EjercicioRepository ejercicioRepository) {
		this.rutinaRepository = rutinaRepository;
		this.ejercicioRepository = ejercicioRepository;
	}

	@Scheduled(cron = "0 * * * * *") // Segundo , minuto, dia ...
	public void cleanOrphanedExercises() {
		Instant expirationTime = Instant.now().minus(5, ChronoUnit.MINUTES); // despues de 5 minutos lo borramos

		List<Rutina> orphanedRoutines = rutinaRepository.findAllByNombreRutina("$$crea$$");

		orphanedRoutines.stream().filter(rutina -> isTimestampBeforeExpiration(rutina.getTimestamp(), expirationTime))
				.forEach(rutina -> {
					ejercicioRepository.deleteByIdRutina(rutina.getId());

					rutinaRepository.deleteById(rutina.getId());

					System.out.println("Deleted exercises and routine: " + rutina.getId());
				});
	}

	private boolean isTimestampBeforeExpiration(String timestampString, Instant expirationTime) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'Z");
			Date parsedDate = sdf.parse(timestampString);
			Instant timestamp = parsedDate.toInstant();
			return timestamp.isBefore(expirationTime);
		} catch (Exception e) {
			System.err.println("Invalid timestamp format: " + timestampString);
			return false;
		}
	}
}
