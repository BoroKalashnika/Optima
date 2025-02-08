package optima.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import optima.model.Rutina;

public interface RutinaRepository extends MongoRepository<Rutina, String> {

	Optional<Rutina> findById(String id);
	
	Rutina findByNombreRutina(String nombreRutina);

	void deleteById(String id);
	
	List<Rutina> findByIdUsuario(String idUsuario);
}