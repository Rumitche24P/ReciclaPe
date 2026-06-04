package com.reciclape.auth_service.config;

import com.reciclape.auth_service.entity.Rol;
import com.reciclape.auth_service.entity.Usuario;
import com.reciclape.auth_service.repository.RolRepository;
import com.reciclape.auth_service.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Carga datos iniciales (roles y usuarios de prueba) si la base está vacía.
 * Password de todos los usuarios demo: ReciclaPe2026
 */
@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (rolRepository.count() == 0) {
            rolRepository.save(new Rol("VECINO"));
            rolRepository.save(new Rol("RECICLADOR"));
            rolRepository.save(new Rol("ADMIN"));
        }
        if (usuarioRepository.count() == 0) {
            crear("Lucía", "Quispe Ramos", "lucia.vecino@reciclape.pe", "987654321", "VECINO");
            crear("Carlos", "Huamán Soto", "carlos.vecino@reciclape.pe", "987111222", "VECINO");
            crear("Marta", "Flores Díaz", "marta.recicla@reciclape.pe", "987333444", "RECICLADOR");
            crear("Pedro", "Mamani Cruz", "pedro.recicla@reciclape.pe", "987555666", "RECICLADOR");
            crear("Ana", "Torres Vega", "admin@reciclape.pe", "987777888", "ADMIN");
        }
    }

    private void crear(String nombres, String apellidos, String email, String telefono, String rolNombre) {
        Rol rol = rolRepository.findByNombre(rolNombre).orElseThrow();
        Usuario u = new Usuario();
        u.setNombres(nombres);
        u.setApellidos(apellidos);
        u.setEmail(email);
        u.setTelefono(telefono);
        u.setPasswordHash(passwordEncoder.encode("ReciclaPe2026"));
        u.setRol(rol);
        u.setActivo(true);
        usuarioRepository.save(u);
    }
}
