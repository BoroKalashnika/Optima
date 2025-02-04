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

//    public void enviarCorreoVerificacion(String destinatario, String enlaceVerificacion, String contrasenyaGenerada) throws MessagingException {
//        MimeMessage mensaje = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);
//
//        helper.setTo(destinatario);
//        helper.setSubject("Verifica tu cuenta");
//        helper.setText("<p>Gracias por registrarte. Para verificar tu cuenta, haz clic en el siguiente enlace:</p>"
//                + "<p><a href='" + enlaceVerificacion + "'>Verificar cuenta</a></p>"
//                + "<p>Tu contraseña generada es: <strong>" + contrasenyaGenerada + "</strong></p>",
//                true);
//
//        mailSender.send(mensaje);
//    }
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
