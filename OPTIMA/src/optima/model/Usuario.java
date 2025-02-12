package optima.model;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Usuarios")
public class Usuario {

	@Id
	private String id;
	private String nombre;
	private String contrasenya;
	private String correo;
	private String token;
	private String fotoPerfil;
	private List<String> rutinasGuardadas;
	private List<String> rutinasCreadas;
	private String rutinaActiva;
	private String nivel;
	private String peso;
	private String altura;
	private String imc;
	private String macros;
	private List<String> hiostorialMacros;
	private String puntuacion;
	private boolean verificado;
	private String codigo;
	private List<String> historialImc;

	public String getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public String getContrasenya() {
		return contrasenya;
	}

	public String getCorreo() {
		return correo;
	}

	public String getToken() {
		return token;
	}

	public String getFotoPerfil() {
		return fotoPerfil;
	}

	public List<String> getRutinasGuardadas() {
		return rutinasGuardadas;
	}

	public List<String> getRutinasCreadas() {
		return rutinasCreadas;
	}

	public String getNivel() {
		return nivel;
	}

	public String getPeso() {
		return peso;
	}

	public String getAltura() {
		return altura;
	}

	public String getImc() {
		return imc;
	}

	public String getMacros() {
		return macros;
	}

	public String getPuntuacion() {
		return puntuacion;
	}

	public boolean getVerificado() {
		return verificado;
	}

	public List<String> getHistorialImc() {
		return historialImc;
	}

	public String getCodigo() {
		return codigo;
	}

	public List<String> getHiostorialMacros() {
		return hiostorialMacros;
	}

	public void setHiostorialMacros(List<String> hiostorialMacros) {
		this.hiostorialMacros = hiostorialMacros;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public void setContrasenya(String contrasenya) {
		this.contrasenya = contrasenya;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void setFotoPerfil(String fotoPerfil) {
		this.fotoPerfil = fotoPerfil;
	}

	public void setRutinasGuardadas(List<String> rutinasGuardadas) {
		this.rutinasGuardadas = rutinasGuardadas;
	}

	public void setRutinasCreadas(List<String> rutinasCreadas) {
		this.rutinasCreadas = rutinasCreadas;
	}

	public void setNivel(String nivel) {
		this.nivel = nivel;
	}

	public void setPeso(String peso) {
		this.peso = peso;
	}

	public void setAltura(String altura) {
		this.altura = altura;
	}

	public void setImc(String imc) {
		this.imc = imc;
	}

	public void setMacros(String macros) {
		this.macros = macros;
	}

	public void setPuntuacion(String puntuacion) {
		this.puntuacion = puntuacion;
	}

	public void setVerificado(boolean verificado) {
		this.verificado = verificado;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public void setHistorialImc(List<String> historialImc) {
		this.historialImc = historialImc;
	}

	public String getRutinaActiva() {
		return rutinaActiva;
	}

	public void setRutinaActiva(String rutinaActiva) {
		this.rutinaActiva = rutinaActiva;
	}

	public String encriptacionContrasenya(String contrasenya) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		byte[] hashBytes = md.digest(contrasenya.getBytes());
		StringBuilder hexString = new StringBuilder();
		for (byte b : hashBytes) {
			String hex = Integer.toHexString(0xff & b);
			if (hex.length() == 1) {
				hexString.append('0');
			}
			hexString.append(hex);
		}
		return hexString.toString();
	}

}
