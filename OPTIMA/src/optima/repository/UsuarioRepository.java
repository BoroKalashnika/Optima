package optima.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import optima.model.Usuario;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
	@Query("{'correo': ?0, 'contrasenya': ?1}")
	Optional<Usuario> comprobarLogin(String correo, String contrasenya);

	Optional<Usuario> findByToken(String token);

	Optional<Usuario> findByCorreo(String correo);

	Optional<Usuario> findByCodigo(String codigo);
}
