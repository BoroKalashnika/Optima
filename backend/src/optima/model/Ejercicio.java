package optima.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Ejercicios")
public class Ejercicio {

	@Id
	private String id;
	private String nombreEjercicio;
	private String grupoMuscular;
	private String dificultad;
	private String video;
	private String explicacion;
	private String idRutina;
	private String usuario;
	private String vistaPrevia;
	private String token;

	public String getId() {
		return id;
	}

	public String getNombreEjercicio() {
		return nombreEjercicio;
	}

	public String getGrupoMuscular() {
		return grupoMuscular;
	}

	public String getDificultad() {
		return dificultad;
	}

	public String getVideo() {
		return video;
	}

	public String getExplicacion() {
		return explicacion;
	}

	public String getIdRutina() {
		return idRutina;
	}

	public String getUsuario() {
		return usuario;
	}

	public String getVistaPrevia() {
		return vistaPrevia;
	}

	public String getToken() {
		return token;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setNombreEjercicio(String nombreEjercicio) {
		this.nombreEjercicio = nombreEjercicio;
	}

	public void setGrupoMuscular(String tipo) {
		this.grupoMuscular = tipo;
	}

	public void setDificultad(String dificultad) {
		this.dificultad = dificultad;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public void setExplicacion(String explicacion) {
		this.explicacion = explicacion;
	}

	public void setIdRutina(String idRutina) {
		this.idRutina = idRutina;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public void setVistaPrevia(String vistaPrevia) {
		this.vistaPrevia = vistaPrevia;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
