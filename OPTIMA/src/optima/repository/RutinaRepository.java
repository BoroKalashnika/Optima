package optima.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import optima.model.Rutina;

import java.util.List;
import java.util.Optional;

public interface RutinaRepository extends MongoRepository<Rutina, String> {

    Optional<Rutina> findById(String id);
    
    Rutina findByNombreRutina(String nombreRutina);
    
    List<Rutina> findAllByNombreRutina(String nombreRutina);

    void deleteById(String id);
    
    List<Rutina> findByIdUsuario(String idUsuario);
}
