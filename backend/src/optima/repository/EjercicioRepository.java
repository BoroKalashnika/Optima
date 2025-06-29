package optima.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import optima.model.Ejercicio;

public interface EjercicioRepository extends MongoRepository<Ejercicio, String> {

	Optional<Ejercicio> findByNombreEjercicio(String nombreEjercicio);

	Optional<Ejercicio> findById(String id);

	void deleteByNombreEjercicio(String nombreEjercicio);

	List<Ejercicio> findByIdRutina(String idRutina);

	void deleteByIdRutina(String idRutina);

	void deleteById(String id);

}
