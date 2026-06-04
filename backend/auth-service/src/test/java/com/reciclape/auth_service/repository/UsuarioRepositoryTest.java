package com.reciclape.auth_service.repository;

import com.reciclape.auth_service.entity.Rol;
import com.reciclape.auth_service.entity.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de la capa de acceso a datos (rúbrica AP1):
 * insertar, listar, actualizar y eliminar.
 */
@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    private Rol rolVecino;

    @BeforeEach
    void setUp() {
        rolVecino = rolRepository.save(new Rol("VECINO"));
    }

    private Usuario nuevoUsuario(String email) {
        Usuario u = new Usuario();
        u.setNombres("Test");
        u.setApellidos("Usuario");
        u.setEmail(email);
        u.setPasswordHash("$2b$10$hashdeprueba");
        u.setTelefono("999000111");
        u.setRol(rolVecino);
        u.setActivo(true);
        return u;
    }

    @Test
    void insertar_guardaYAsignaId() {
        Usuario guardado = usuarioRepository.save(nuevoUsuario("nuevo@reciclape.pe"));

        assertThat(guardado.getId()).isNotNull();
        assertThat(guardado.getCreadoEn()).isNotNull();
        assertThat(usuarioRepository.findByEmail("nuevo@reciclape.pe")).isPresent();
    }

    @Test
    void listar_devuelveTodosLosUsuarios() {
        usuarioRepository.save(nuevoUsuario("a@reciclape.pe"));
        usuarioRepository.save(nuevoUsuario("b@reciclape.pe"));

        List<Usuario> usuarios = usuarioRepository.findAll();

        assertThat(usuarios).hasSize(2);
    }

    @Test
    void actualizar_modificaLosCampos() {
        Usuario guardado = usuarioRepository.save(nuevoUsuario("edit@reciclape.pe"));

        guardado.setNombres("Nombre Editado");
        guardado.setTelefono("988877766");
        usuarioRepository.save(guardado);

        Optional<Usuario> recargado = usuarioRepository.findById(guardado.getId());
        assertThat(recargado).isPresent();
        assertThat(recargado.get().getNombres()).isEqualTo("Nombre Editado");
        assertThat(recargado.get().getTelefono()).isEqualTo("988877766");
    }

    @Test
    void eliminar_borraElRegistro() {
        Usuario guardado = usuarioRepository.save(nuevoUsuario("del@reciclape.pe"));
        Long id = guardado.getId();

        usuarioRepository.deleteById(id);

        assertThat(usuarioRepository.findById(id)).isEmpty();
    }
}
