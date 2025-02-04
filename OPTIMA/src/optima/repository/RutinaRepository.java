package optima.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.mongodb.repository.Query;

import optima.model.Rutina;

public interface RutinaRepository extends MongoRepository<Rutina, String> {

	Optional<Rutina> findByNombreRutina(String nombreRutina);

	void deleteByNombreRutina(String nombreRutina);

}