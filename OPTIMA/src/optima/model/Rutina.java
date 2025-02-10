package optima.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Rutinas")
public class Rutina {

	@Id
	private String id;
	private String nombreRutina;
	private String valoracion;
	private String dificultad;
	private String grupoMuscular;
	private String creador;
	private List<String> ejercicios;
	private String dieta;
	private String vistaPrevia;
	private String ambito;
	private String idUsuario;
	private String token;
	private String timestamp;

	public String getIdUsuario() {
		return idUsuario;
	}

	public String getId() {
		return id;
	}

	public String getNombreRutina() {
		return nombreRutina;
	}

	public String getValoracion() {
		return valoracion;
	}

	public String getDificultad() {
		return dificultad;
	}

	public String getGrupoMuscular() {
		return grupoMuscular;
	}

	public String getCreador() {
		return creador;
	}

	public List<String> getEjercicios() {
		return ejercicios;
	}

	public String getDieta() {
		return dieta;
	}

	public String getVistaPrevia() {
		return vistaPrevia;
	}

	public String getAmbito() {
		return ambito;
	}

	public String getToken() {
		return token;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setNombreRutina(String nombreRutina) {
		this.nombreRutina = nombreRutina;
	}

	public void setValoracion(String valoracion) {
		this.valoracion = valoracion;
	}

	public void setDificultad(String dificultad) {
		this.dificultad = dificultad;
	}

	public void setGrupoMuscular(String tipo) {
		this.grupoMuscular = tipo;
	}

	public void setCreador(String creador) {
		this.creador = creador;
	}

	public void setEjercicios(List<String> ejercicios) {
		this.ejercicios = ejercicios;
	}

	public void setDieta(String dieta) {
		this.dieta = dieta;
	}

	public void setVistaPrevia(String vistaPrevia) {
		this.vistaPrevia = vistaPrevia;
	}

	public void setAmbito(String ambito) {
		this.ambito = ambito;
	}

	public void setIdUsuario(String idUsuario) {
		this.idUsuario = idUsuario;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
}
