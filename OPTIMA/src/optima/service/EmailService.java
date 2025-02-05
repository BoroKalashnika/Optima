package optima.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoRestablecerContrasenya(String destinatario, String codigo) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setTo(destinatario);
        helper.setSubject("Restablecimiento de Contraseña");
        helper.setText("<p>Has solicitado restablecer tu contraseña.</p>"
                + "<p>Tu código de recuperación es: <strong>" + codigo + "</strong></p>"
                + "<p>Ingresa este código en la aplicación para establecer una nueva contraseña.</p>",
                true);

        mailSender.send(mensaje);
    }

    
    public void enviarCorreoVerificacion(String destinatario, String enlaceVerificacion) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setTo(destinatario);
        helper.setSubject("Verifica tu cuenta");
        helper.setText("<p>Gracias por registrarte. Para verificar tu cuenta, haz clic en el siguiente enlace:</p>"
                + "<p><a href='" + enlaceVerificacion + "'>Verificar cuenta</a></p>",
                true);

        mailSender.send(mensaje);
    }
}
