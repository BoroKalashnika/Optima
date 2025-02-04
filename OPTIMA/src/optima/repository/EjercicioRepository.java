package optima.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import optima.model.Ejercicio;

public interface EjercicioRepository extends MongoRepository<Ejercicio, String> {

	Optional<Ejercicio> findByNombreEjercicio(String nombreEjercicio);

	void deleteByNombreEjercicio(String nombreEjercicio);

}