package optima.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import optima.model.Rutina;

import java.util.List;
import java.util.Optional;

public interface RutinaRepository extends MongoRepository<Rutina, String> {

    Optional<Rutina> findById(String id);
    
    Optional<Rutina> findByNombreRutina(String nombreRutina);
    
    List<Rutina> findAllByNombreRutina(String nombreRutina);

    void deleteById(String id);
    
    List<Rutina> findByIdUsuario(String idUsuario);
    
    @Query("{ 'dificultad': ?0, 'grupoMuscular': ?1, 'ambito': ?2 }")
    List<Rutina> findByFilters(String dificultad, String grupoMuscular, String ambito);
}
