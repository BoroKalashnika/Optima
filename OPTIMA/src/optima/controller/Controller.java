package optima.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
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

import jakarta.mail.MessagingException;
import optima.model.Ejercicio;
import optima.model.Rutina;
import optima.model.Usuario;
import optima.repository.EjercicioRepository;
import optima.repository.RutinaRepository;
import optima.repository.UsuarioRepository;
import optima.service.CloudinaryService;
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

	@Autowired
	private CloudinaryService cloudinaryService;

	// USUARIOS LOGIN / LOGOUT / VERIFICAR / REGISTRAR
	@GetMapping("/optima/tokenUsuario")
	public ResponseEntity<Object> obtenerToken(@RequestParam(value = "token") String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(usuarioBaseDatos.get());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/optima/obtenerUsuario")
	public ResponseEntity<Object> obtenerUsuario(@RequestParam(value = "token") String token,
			@RequestParam(value = "correo") String correo) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);
			return ResponseEntity.status(HttpStatus.OK).body(usuario.get());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/optima/verificar")
	public ResponseEntity<Object> verificarCorreo(@RequestParam(value = "correo") String correo) {
		Optional<Usuario> usuario = usuarioRepository.findByCorreo(correo);
		if (usuario.isPresent()) {
			Usuario usuarioVerificado = usuario.get();
			usuarioVerificado.setVerificado(true);
			usuarioRepository.save(usuarioVerificado);
			return ResponseEntity.ok("Correo verificado correctamente");
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@GetMapping("/optima/codigo")
	public ResponseEntity<Object> verificarCodigo(@RequestParam(value = "codigo") String codigo) {
		Optional<Usuario> usuarioRequest = usuarioRepository.findByCodigo(codigo);
		JSONObject response = new JSONObject();
		if (usuarioRequest.isPresent()) {
			response.put("message", "");
			return ResponseEntity.ok(response.toString());
		}
		response.put("message", "No se ha encrontrado ningun usuario con este codigo.");
		return ResponseEntity.ok(response.toString());
	}

	@GetMapping("/optima/obtenerHistorialMacros")
	public ResponseEntity<Object> obtenerHistorialMacros(@RequestParam(value = "token") String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(usuarioBaseDatos.get().getHistorialMacros());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/optima/obtenerHistorilaImc")
	public ResponseEntity<Object> obtenerHistorialImc(@RequestParam(value = "token") String token) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(usuarioBaseDatos.get().getHistorialImc());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PostMapping("/optima/restablecerContrasenya")
	public ResponseEntity<Object> restablecerContrasenya(@RequestBody Usuario usuarioRequest)
			throws NoSuchAlgorithmException, MessagingException {
		Optional<Usuario> usuarioOptional = usuarioRepository.findByCorreo(usuarioRequest.getCorreo());
		JSONObject response = new JSONObject();

		if (usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

			String codigo = UUID.randomUUID().toString().substring(0, 8);

			usuario.setCodigo(codigo);
			usuarioRepository.save(usuario);

			emailService.enviarCorreoRestablecerContrasenya(usuario.getCorreo(), codigo);

			response.put("message", "Se ha enviado un código de recuperación a tu correo");
			return ResponseEntity.status(HttpStatus.OK).body(response.toString());
		} else {
			response.put("message", "USUARIO NO REGISTRADO");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.toString());
		}
	}

	@PostMapping("/optima/cambiarContrasenya")
	public ResponseEntity<Object> cambiarContrasenya(@RequestBody Usuario request) throws NoSuchAlgorithmException {
		JSONObject response = new JSONObject();
		Optional<Usuario> usuarioOptional = usuarioRepository.findByCorreo(request.getCorreo());

		if (usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

			if (!usuario.getCodigo().isEmpty() && usuario.getCodigo().equals(request.getCodigo())) {
				usuario.setContrasenya(usuario.encriptacionContrasenya(request.getContrasenya()));
				usuario.setCodigo("");
				usuarioRepository.save(usuario);
				response.put("message", "Contraseña actualizada correctamente.");
				return ResponseEntity.status(HttpStatus.OK).body(response.toString());
			} else {
				response.put("message", "Código incorrecto o expirado.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.toString());
			}
		} else {
			response.put("message", "Usuario no encontrado.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.toString());
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

	@PostMapping("/optima/registrarImc")
	ResponseEntity<Object> registrarImc(@RequestBody String requestBody) {
		JSONObject jsonObject = new JSONObject(requestBody);
		JSONObject response = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(jsonObject.getString("token"));
		jsonObject.remove("token");
		if (usuarioBaseDatos.isPresent()) {			
			Usuario usuario = usuarioBaseDatos.get();
			usuario.setImc(jsonObject.getString("imc"));
			usuario.getHistorialImc().add(jsonObject.getString(requestBody));
			usuarioRepository.save(usuario);
			response.put("message", "IMC registrado");
			return ResponseEntity.status(HttpStatus.OK).body(response.toString());
		} else {
			response.put("message", "");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		}
	}

	@PostMapping("/optima/registrarMacros")
	ResponseEntity<Object> registrarMacros(@RequestBody String requestBody) {
		JSONObject jsonObject = new JSONObject(requestBody);
		JSONObject response = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(jsonObject.getString("token"));
		jsonObject.remove("token");
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			usuario.setMacros(jsonObject.getString("macros"));
			usuario.getHistorialMacros().add(jsonObject.getString(requestBody));
			usuarioRepository.save(usuario);
			response.put("message", "Macros registrados");
			return ResponseEntity.status(HttpStatus.OK).body(response.toString());
		} else {
			response.put("message", "");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		}
	}

	// ACCIONES RUITNAS
	@GetMapping("/optima/obtenerRutinas")
	public ResponseEntity<Object> obtenerRutinas(@RequestParam(value = "token") String token,
			@RequestParam(value = "index") int index, @RequestParam(value = "offset") int offset) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		JSONObject response = new JSONObject();

		if (usuarioBaseDatos.isEmpty()) {
			response.put("error", "Token inválido");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
		}

		List<Rutina> rutinas = rutinaRepository.findAll();
		int contador = 0;
		for (int i = 0; i < rutinas.size(); i++) {
			if (!rutinas.get(i).getNombreRutina().equals("$$crea$$")) {
				contador++;
			}
		}

		int end = Math.min(index + offset, rutinas.size());
		if (index < 0 || index >= rutinas.size()) {
			response.put("error", "Rango de índices inválido");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.toString());
		}

		List<Rutina> rutinasIndex = new ArrayList<>(rutinas.subList(index, end));

		response.put("count", contador);
		response.put("rutinas", rutinasIndex);

		return ResponseEntity.ok(response.toString());
	}

	@GetMapping("/optima/obtenerRutinasCreadas")
	public ResponseEntity<Object> obtenerRutinasCreadas(@RequestParam(value = "token") String token,
			@RequestParam(value = "idUsuario") String idUsuario) {
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
	public ResponseEntity<Object> obtenerRutina(@RequestParam(value = "token") String token,
			@RequestParam(value = "id") String id) {
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
	public ResponseEntity<Object> eliminarRutina(@RequestParam(value = "token") String token,
			@RequestParam(value = "id") String id) {
		Optional<Rutina> rutina = rutinaRepository.findById(id);
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);

		if (usuarioBaseDatos.isPresent()) {
			if (rutina.isPresent()) {
				for (String ejercicio : rutina.get().getEjercicios()) {
					Optional<Ejercicio> ej = ejercicioRepository.findById(ejercicio);
					cloudinaryService.deleteVideo(ej.get().getVideo());
					ejercicioRepository.deleteById(ejercicio);
				}
				rutinaRepository.deleteById(id);
				return ResponseEntity.ok("Rutina eliminada correctamente.");
			}
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@PostMapping("/optima/valorarRutina")
	ResponseEntity<Object> valorarRutina(@RequestBody String requestBody)
			throws NoSuchAlgorithmException, MessagingException {
		JSONObject jsonObject = new JSONObject(requestBody);
		String idRutina = jsonObject.getString("idRutina");
		String token = jsonObject.getString("token");
		JSONObject response = new JSONObject();
		Optional<Rutina> rutinaBd = rutinaRepository.findById(idRutina);
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			if (rutinaBd.isPresent()) {
				Rutina rutina = rutinaBd.get();
				Optional<Usuario> creadorRutina = usuarioRepository.findByCorreo(rutina.getCreador());
				Usuario usuario = creadorRutina.get();

				int puntuacionActual = Integer.parseInt(rutina.getValoracion());
				int valoracion = jsonObject.getInt("valoracion");

				int puntuacionUsu = Integer.valueOf(usuario.getPuntuacion()) + valoracion;
				usuario.setPuntuacion(puntuacionUsu + "");

				if (puntuacionActual != 0) {
					int nuevaPuntuacion = Math.round((puntuacionActual + valoracion) / 2.0f);
					rutina.setValoracion(String.valueOf(nuevaPuntuacion));
				} else {
					rutina.setValoracion(String.valueOf(valoracion));
				}

				usuarioRepository.save(usuario);
				rutinaRepository.save(rutina);
				return ResponseEntity.ok(response.toString());
			}
			response.put("message", "La rutina no existe!");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.toString());
		}
		response.put("message", "Token expirado!");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
	}

	@PostMapping("/optima/crearRutina")
	ResponseEntity<Object> crearRutina(@RequestBody Rutina nuevaRutina)
			throws NoSuchAlgorithmException, MessagingException {
		JSONObject respuesta = new JSONObject();
		try {
			Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(nuevaRutina.getToken());
			if (usuarioBaseDatos.isPresent()) {
				nuevaRutina.setToken(null);
				if (nuevaRutina.getNombreRutina().equals("$$crea$$")) {
					Rutina rutinaGuardada = rutinaRepository.save(nuevaRutina);
					Usuario usuario = usuarioBaseDatos.get();
					usuario.getRutinasCreadas().add(rutinaGuardada.getId());
					usuarioRepository.save(usuario);
					respuesta.put("idRutina", rutinaGuardada.getId());
					return ResponseEntity.status(HttpStatus.CREATED).body(respuesta.toString());
				} else {
					Usuario usuario = usuarioBaseDatos.get();
					boolean rutinaEncontrada = false;
					for (String rutinaId : usuario.getRutinasCreadas()) {
						Optional<Rutina> rutinaListaUsuario = rutinaRepository.findById(rutinaId);
						if (rutinaListaUsuario.isPresent()) {
							Rutina rutinaFinalizar = rutinaListaUsuario.get();
							if (rutinaFinalizar.getNombreRutina().equals("$$crea$$")) {
								rutinaFinalizar.setNombreRutina(nuevaRutina.getNombreRutina());
								rutinaFinalizar.setValoracion(nuevaRutina.getValoracion());
								rutinaFinalizar.setDificultad(nuevaRutina.getDificultad());
								rutinaFinalizar.setGrupoMuscular(nuevaRutina.getGrupoMuscular());
								rutinaFinalizar.setEjercicios(nuevaRutina.getEjercicios());
								rutinaFinalizar.setDieta(nuevaRutina.getDieta());
								rutinaFinalizar.setVistaPrevia(nuevaRutina.getVistaPrevia());
								rutinaFinalizar.setAmbito(nuevaRutina.getAmbito());
								rutinaRepository.save(rutinaFinalizar);
								respuesta.put("message", "Rutina creada con éxito");
								rutinaEncontrada = true;
								return ResponseEntity.status(HttpStatus.CREATED).body(respuesta.toString());
							}
						}
					}
					if (!rutinaEncontrada) {
						respuesta.put("message", "Rutina no encontrada para actualizar");
						return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta.toString());
					}
				}
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			e.printStackTrace();
			respuesta.put("message", "Error interno del servidor");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta.toString());
		}
	}

	@PostMapping("/optima/favoritoRutina")
	ResponseEntity<Object> favoritoRutina(@RequestBody Rutina rutinaFavorita)
			throws NoSuchAlgorithmException, MessagingException {
		JSONObject respusta = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(rutinaFavorita.getToken());
		if (usuarioBaseDatos.isPresent()) {
			rutinaFavorita.setToken(null);
			Usuario usuario = usuarioBaseDatos.get();
			usuario.getRutinasGuardadas().add(rutinaFavorita.getId());
			usuarioRepository.save(usuario);
			respusta.put("message", "Rutina añadida a favoritos con exito");
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(respusta.toString());
		}
		respusta.put("message", "La rutina no se ha podido añadir a favoritos");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respusta.toString());
	}

	@DeleteMapping("/optima/deleteFavoritoRutina")
	ResponseEntity<Object> deleteFavoritoRutina(@RequestParam(value = "token") String token,
			@RequestParam(value = "id") String id) throws NoSuchAlgorithmException, MessagingException {
		JSONObject respusta = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			Usuario usuario = usuarioBaseDatos.get();
			for (int i = 0; i < usuario.getRutinasGuardadas().size(); i++) {
				if (usuario.getRutinasGuardadas().get(i).equals(id)) {
					usuario.getRutinasGuardadas().remove(i);
					usuarioRepository.save(usuario);
					respusta.put("message", "Rutina eliminada de favoritos con exito");
					return ResponseEntity.status(HttpStatus.OK).body(respusta.toString());
				}
			}
			respusta.put("message", "Error rutina no encontrada en favoritos");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respusta.toString());

		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

	}

	@PostMapping("/optima/rutinaActiva")
	ResponseEntity<Object> rutinaActiva(@RequestBody Rutina rutinaActiva)
			throws NoSuchAlgorithmException, MessagingException {
		JSONObject respusta = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(rutinaActiva.getToken());
		if (usuarioBaseDatos.isPresent()) {
			rutinaActiva.setToken(null);
			Usuario usuario = usuarioBaseDatos.get();
			usuario.setRutinaActiva(rutinaActiva.getId());
			usuarioRepository.save(usuario);
			respusta.put("message", "Rutina activa añadida");
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(respusta.toString());
		}
		respusta.put("message", "La rutina no se ha podido añadir a rutina activa");
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respusta.toString());
	}

	// ACCIONES EJERCICIOS
	@GetMapping("/optima/obtenerEjercicio")
	public ResponseEntity<Object> obtenerEjercicio(@RequestParam(value = "token") String token,
			@RequestParam(value = "id") String id) {
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			Optional<Ejercicio> ejercicio = ejercicioRepository.findById(id);

			return ResponseEntity.ok(ejercicio.get().toString());
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@GetMapping("/optima/obtenerEjercicios")
	public ResponseEntity<Object> obtenerEjercicios(@RequestParam(value = "token") String token,
			@RequestParam(value = "idRutina") String idRutina) {
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

	@PostMapping("/optima/crearEjercicio")
	public ResponseEntity<Object> crearEjercicio(@RequestBody Ejercicio nuevoEjercicio)
			throws NoSuchAlgorithmException, MessagingException {
		JSONObject response = new JSONObject();

		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(nuevoEjercicio.getToken());
		if (usuarioBaseDatos.isPresent()) {
			nuevoEjercicio.setToken(null);
			Ejercicio ejercicio = ejercicioRepository.save(nuevoEjercicio);

			response.put("message", ejercicio.getId());

			return ResponseEntity.status(HttpStatus.CREATED).body(response.toString());
		}
		response.put("message", "Token expirado.");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response.toString());
	}

	@DeleteMapping("/optima/eliminarEjercicio")
	public ResponseEntity<Object> eliminarEjercicio(@RequestParam(value = "token") String token,
			@RequestParam(value = "id") String id) {
		JSONObject json = new JSONObject();
		Optional<Usuario> usuarioBaseDatos = usuarioRepository.findByToken(token);
		if (usuarioBaseDatos.isPresent()) {
			ejercicioRepository.findById(id);
			Optional<Ejercicio> ej = ejercicioRepository.findById(id);
			cloudinaryService.deleteVideo(ej.get().getVideo());
			ejercicioRepository.deleteById(id);
			json.put("message", "Ejercicio eliminado.");
			return ResponseEntity.ok(json.toString());
		}
		json.put("message", "Token expirado.");
		return ResponseEntity.ok(json.toString());
	}

	// API
	public String ipAPI() throws IOException {
		String api;
		InputStream inputStream = getClass().getClassLoader().getResourceAsStream("IP_API.txt");
		BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
		api = br.readLine();
		br.close();
		return api;
	}
}
