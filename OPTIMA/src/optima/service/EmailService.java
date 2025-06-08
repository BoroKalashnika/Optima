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
        helper.setSubject("Password Reset");
        helper.setText("<p>You have requested to reset your password.</p>"
                + "<p>Your recovery code is: <strong>" + codigo + "</strong></p>"
                + "<p>Enter this code in the app to set a new password.</p>",
                true);

        mailSender.send(mensaje);
    }

    
    public void enviarCorreoVerificacion(String destinatario, String enlaceVerificacion) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setTo(destinatario);
        helper.setSubject("Verify your account");
        helper.setText("<p>Thank you for registering. To verify your account, please click on the following link:</p>"
                + "<p><a href='" + enlaceVerificacion + "'>Verify account</a></p>",
                true);

        mailSender.send(mensaje);
    }
}
