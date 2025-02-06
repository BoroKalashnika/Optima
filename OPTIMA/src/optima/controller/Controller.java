package optima.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import optima.model.Ejercicio;
import optima.model.Rutina;
import optima.model.Usuario;
import optima.repository.EjercicioRepository;
import optima.repository.RutinaRepository;
import optima.repository.UsuarioRepository;
import optima.service.EmailService;
import optima.service.FirestoreService;

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

//	@Autowired
//	private S3Service s3Service;

	@Autowired
	private FirestoreService firestoreService;

	// USUARIOS LOGIN / LOGOUT / VERIFICAR / REGISTRAR
	@GetMapping("/optima/verificar")
	public ResponseEntity<Object> verificarCorreo(@RequestParam String correo) {
		Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);
		if (usuario.isPresent()) {
			Usuario usuarioVerificado = usuario.get();
			usuarioVerificado.setVerificado(true);
			usuarioRepository.save(usuarioVerificado);
			return ResponseEntity.ok("Correo verificado correctamente");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@PostMapping("/optima/restablecerContrasenya")
	public ResponseEntity<Object> restablecerContrasenya(@RequestBody Usuario usuarioRequest)
			throws NoSuchAlgorithmException, MessagingException {
		Optional<Usuario> usuarioOptional = usuarioRepository.findByCorreo(usuarioRequest.getCorreo());

		if (usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

			String codigo = UUID.randomUUID().toString().substring(0, 8);

			usuario.setCodigo(codigo);
			usuarioRepository.save(usuario);

			emailService.enviarCorreoRestablecerContrasenya(usuario.getCorreo(), codigo);

			return ResponseEntity.ok("Se ha enviado un código de recuperación a tu correo.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("USUARIO NO REGISTRADO");
		}
	}

	@PostMapping("/optima/cambiarContrasenya")
	public ResponseEntity<Object> cambiarContrasenya(@RequestBody Usuario request) throws NoSuchAlgorithmException {

		Optional<Usuario> usuarioOptional = usuarioRepository.findByCorreo(request.getCorreo());

		if (usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

			if (!usuario.getCodigo().isEmpty() && usuario.getCodigo().equals(request.getCodigo())) {
				usuario.setContrasenya(usuario.encriptacionContrasenya(request.getContrasenya()));
				usuario.setCodigo("");
				usuarioRepository.save(usuario);

				return ResponseEntity.ok("Contraseña actualizada correctamente.");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código incorrecto o expirado.");
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
		}
	}

	@PostMapping("/optima/registrar")
	ResponseEntity<Object> registrar(@RequestBody Usuario nuevoUsuario)
			throws NoSuchAlgorithmException, MessagingException, IOException {
		JSONObject response = new JSONObject();
		if (usuarioRepository.comprobarRegistro(nuevoUsuario.getCorreo(), nuevoUsuario.getNombre()).isPresent()) {
			response.put("message", "USUARIO YA REGISTRADO");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.toString());
		} else {
			nuevoUsuario.setContrasenya(nuevoUsuario.encriptacionContrasenya(nuevoUsuario.getContrasenya()));
			usuarioRepository.save(nuevoUsuario);
			String enlaceVerificacion = "http://" + ipAPI() + ":8080/optima/verificar?correo="
					+ nuevoUsuario.getCorreo();
			emailService.enviarCorreoVerificacion(nuevoUsuario.getCorreo(), enlaceVerificacion);
			response.put("message", "Accede al correo para verificar cuenta");
			return ResponseEntity.status(HttpStatus.CREATED).body(response.toString());
		}
	}

	@PostMapping("/optima/login")
	ResponseEntity<Object> login(@RequestBody Usuario usuarioAccede) throws NoSuchAlgorithmException {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.comprobarLogin(usuarioAccede.getCorreo(),
				usuarioAccede.encriptacionContrasenya(usuarioAccede.getContrasenya()));
		JSONObject response = new JSONObject();
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			if (usuario.getVerificado()) {
				String token = UUID.randomUUID().toString();
				usuario.setToken(token);
				usuarioRepository.save(usuario);
				response.put("token", token);
				return ResponseEntity.status(HttpStatus.OK).body(response.toString());
			}
			response.put("message", "USUARIO NO VERIFICADO");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		} else {
			response.put("message", "USUARIO NO SE ENCUENTRA REGISTRADO");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		}
	}

	@PostMapping("/optima/logout")
	ResponseEntity<Object> logout(@RequestBody String requestBody) {
		JSONObject jsonObject = new JSONObject(requestBody);
		JSONObject response = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(jsonObject.getString("token"));
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			usuario.setToken("");
			usuarioRepository.save(usuario);
			response.put("message", "");
			return ResponseEntity.status(HttpStatus.OK).body(response.toString());
		} else {
			response.put("message", "");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		}
	}

	@GetMapping("/optima/tokenUsuario")
	public ResponseEntity<Object> obtenerToken(@RequestParam(value = "token") String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(usuarioBaseDatos.get());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	// ACCIONES RUITNAS
	@GetMapping("/optima/obtenerRutinas")
	public ResponseEntity<Object> obtenerRutinas(@RequestParam String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		JSONObject response = new JSONObject();
		if (usuarioBaseDatos.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token inválido"));
		}

		List<Rutina> rutinas = rutinaRepository.findAll();
		response.put("count", rutinas.size());
		response.put("rutinas", rutinas);

		return ResponseEntity.ok(response.toString());
	}

	@GetMapping("/optima/obtenerRutinasCreadas")
	public ResponseEntity<Object> obtenerRutinasCreadas(@RequestParam String idUsuario, @RequestParam String token) {
		JSONObject response = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			List<Rutina> rutinas = rutinaRepository.findByIdUsuario(idUsuario);
			response.put("count", rutinas.size());
			response.put("rutinas", rutinas);

			return ResponseEntity.ok(response.toString());
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/optima/obtenerRutina")
	public ResponseEntity<Object> obtenerRutina(@RequestParam String id, @RequestParam String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			Optional<Rutina> rutina = rutinaRepository.findById(id);
			if (rutina.isPresent()) {
				return ResponseEntity.ok(rutina.get());
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@DeleteMapping("/optima/eliminarRutina")
	public ResponseEntity<Object> eliminarRutina(@RequestParam String id) {
		Optional<Rutina> rutina = rutinaRepository.findById(id);

		if (rutina.isPresent()) {
			rutinaRepository.deleteById(id);
			return ResponseEntity.ok("Rutina eliminada correctamente.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PostMapping("/optima/crearRutina")
	ResponseEntity<Object> crearRutina(@RequestBody Rutina nuevaRutina)
			throws NoSuchAlgorithmException, MessagingException {
		rutinaRepository.save(nuevaRutina);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// ACCIONES EJERCICIOS
	@GetMapping("/optima/obtenerEjercicios")
	public ResponseEntity<Object> obtenerEjercicios(@RequestParam String idRutina, @RequestParam String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			JSONObject ejerciciosJson = new JSONObject();
			List<Ejercicio> ejercicios = ejercicioRepository.findByIdRutina(idRutina);
			ejerciciosJson.put("count", ejercicios.size());
			ejerciciosJson.put("ejercicios", ejercicios);
			return ResponseEntity.ok(ejerciciosJson.toString());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

//	@PostMapping("/optima/crearEjercicio")
//	public ResponseEntity<Object> crearEjercicio(@RequestParam("nombreEjercicio") String nombreEjercicio,
//			@RequestParam("grupoMuscular") String grupoMuscular, @RequestParam("dificultad") String dificultad,
//			@RequestParam("explicacion") String explicacion, @RequestParam("idRutina") String idRutina,
//			@RequestParam("usuario") String usuario, @RequestParam("archivo") MultipartFile archivo) {
//		try {
//			if (ejercicioRepository.findByNombreEjercicio(nombreEjercicio).isPresent()) {
//				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El ejercicio ya existe.");
//			}
//
//			String enlaceVideo = s3Service.subirVideo(archivo);
//
//			Ejercicio nuevoEjercicio = new Ejercicio();
//			nuevoEjercicio.setNombreEjercicio(nombreEjercicio);
//			nuevoEjercicio.setGrupoMuscular(grupoMuscular);
//			nuevoEjercicio.setDificultad(dificultad);
//			nuevoEjercicio.setExplicacion(explicacion);
//			nuevoEjercicio.setIdRutina(idRutina);
//			nuevoEjercicio.setUsuario(usuario);
//			nuevoEjercicio.setVideo(enlaceVideo);
//
//			ejercicioRepository.save(nuevoEjercicio);
//
//			return ResponseEntity.status(HttpStatus.CREATED).body("Ejercicio creado correctamente.");
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el ejercicio.");
//		}
//	}

	@PostMapping("/optima/crearEjercicio")
	public ResponseEntity<Object> crearEjercicio(@RequestParam("nombreEjercicio") String nombreEjercicio,
			@RequestParam("grupoMuscular") String grupoMuscular, @RequestParam("archivo") MultipartFile archivo) {
		try {
			// 1️⃣ Subir video a Firebase Storage
			String enlaceVideo = firestoreService.subirVideo(archivo);

			// 2️⃣ Guardar el enlace del video en MongoDB
			Ejercicio nuevoEjercicio = new Ejercicio();
			nuevoEjercicio.setNombreEjercicio(nombreEjercicio);
			nuevoEjercicio.setGrupoMuscular(grupoMuscular);
			nuevoEjercicio.setVideo(enlaceVideo);

			ejercicioRepository.save(nuevoEjercicio);

			return ResponseEntity.status(HttpStatus.CREATED)
					.body("Ejercicio creado correctamente con ID: " + nuevoEjercicio.getId());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el ejercicio.");
		}
	}

	public String ipAPI() throws IOException {
		String api;
		InputStream inputStream = getClass().getClassLoader().getResourceAsStream("IP_API.txt");
		BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
		api = br.readLine();
		br.close();
		return api;
	}
}
