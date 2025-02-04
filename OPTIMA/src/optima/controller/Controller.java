package optima.controller;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import optima.model.Ejercicio;
import optima.model.Rutina;
import optima.model.Usuario;
import optima.repository.EjercicioRepository;
import optima.repository.RutinaRepository;
import optima.repository.UsuarioRepository;
import optima.service.EmailService;

@RestController
public class Controller {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private RutinaRepository rutinaRepository;
	
	@Autowired
	private EjercicioRepository ejercicioRepository;

	@Autowired
	private EmailService emailService;

	@GetMapping("/optima/verificar")
	public ResponseEntity<Object> verificarCorreo(@RequestParam String correo) {
		Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);
		if (usuario.isPresent()) {
			Usuario usuarioVerificado = usuario.get();
			usuarioVerificado.setVerificado(true);
			usuarioRepository.save(usuarioVerificado);
			return ResponseEntity.ok("Correo verificado correctamente");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	}

	@GetMapping("/optima/obtenerRutina")
	public ResponseEntity<Object> obtenerRutina(@RequestParam String nombreRutina) {
		Optional<Rutina> rutina = rutinaRepository.findByNombreRutina(nombreRutina);

		if (rutina.isPresent()) {
			return ResponseEntity.ok(rutina.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rutina no encontrada.");
		}
	}

	@DeleteMapping("/optima/eliminarRutina")
	public ResponseEntity<Object> eliminarRutina(@RequestParam String nombreRutina) {
		Optional<Rutina> rutina = rutinaRepository.findByNombreRutina(nombreRutina);

		if (rutina.isPresent()) {
			rutinaRepository.deleteByNombreRutina(nombreRutina);
			return ResponseEntity.ok("Rutina eliminada correctamente.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La rutina no existe.");
		}
	}

	@PostMapping("/optima/registrar")
	ResponseEntity<Object> registrar(@RequestBody Usuario nuevoUsuario)
			throws NoSuchAlgorithmException, MessagingException {
		if (usuarioRepository.comprobarRegistro(nuevoUsuario.getCorreo(), nuevoUsuario.getNombre()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("USUARIO YA REGISTRADO");
		} else {
			String contrasenyaGenerada = UUID.randomUUID().toString().substring(0, 8);
			nuevoUsuario.setContrasenya(nuevoUsuario.encriptacionContrasenya(contrasenyaGenerada));

			usuarioRepository.save(nuevoUsuario);

			String enlaceVerificacion = "http://localhost:8080/optima/verificar?correo=" + nuevoUsuario.getCorreo();
			emailService.enviarCorreoVerificacion(nuevoUsuario.getCorreo(), enlaceVerificacion, contrasenyaGenerada);

			return ResponseEntity.status(HttpStatus.CREATED)
					.body("Usuario registrado. Revisa tu correo para verificar tu cuenta.");
		}
	}

	@PostMapping("/optima/login")
	ResponseEntity<Object> login(@RequestBody Usuario usuarioAccede) throws NoSuchAlgorithmException {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.comprobarLogin(usuarioAccede.getCorreo(),
				usuarioAccede.encriptacionContrasenya(usuarioAccede.getContrasenya()));
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			String token = UUID.randomUUID().toString();
			usuario.setToken(token);
			usuarioRepository.save(usuario);
			return ResponseEntity.status(HttpStatus.OK).build();
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PostMapping("/optima/logout")
	ResponseEntity<Object> logout(@RequestBody Usuario usuarioActivo) throws NoSuchAlgorithmException {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.comprobarLogin(usuarioActivo.getCorreo(),
				usuarioActivo.encriptacionContrasenya(usuarioActivo.getContrasenya()));
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			usuario.setToken("");
			usuarioRepository.save(usuario);
			return ResponseEntity.status(HttpStatus.OK).build();
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PostMapping("/optima/crearRutina")
	ResponseEntity<Object> crearRutina(@RequestBody Rutina nuevaRutina)
			throws NoSuchAlgorithmException, MessagingException {
		if (rutinaRepository.findByNombreRutina(nuevaRutina.getNombreRutina()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("LA RUTINA YA EXISTE");
		} else {
			rutinaRepository.save(nuevaRutina);
			return ResponseEntity.status(HttpStatus.CREATED).body("Rutina creada correctamente.");
		}
	}
	
	@PostMapping("/optima/crearEjercicio")
	ResponseEntity<Object> crearRutina(@RequestBody Ejercicio nuevoEjercicio)
			throws NoSuchAlgorithmException, MessagingException {
		if (ejercicioRepository.findByNombreEjercicio(nuevoEjercicio.getNombreEjercicio()).isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("EL EJERCICIO YA EXISTE");
		} else {
			ejercicioRepository.save(nuevoEjercicio);
			return ResponseEntity.status(HttpStatus.CREATED).body("Ejercicio creado correctamente.");
		}
	}

}
