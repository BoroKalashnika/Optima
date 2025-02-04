package optima.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import optima.model.Usuario;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
	@Query("{'correo': ?0, 'contrasenya': ?1}")
	Optional<Usuario> comprobarLogin(String correo, String contrasenya);

	@Query("{'correo': ?0, 'nombre': ?1}")
	Optional<Usuario> comprobarRegistro(String correo, String nombre);

	@Query("{'token': ?0}")
	Optional<Usuario> comprobarToken(String token);

	Optional<Usuario> findByCorreo(String correo);

}
