package com.reciclape.auth_service.exception;

/** Excepciones de negocio del servicio de autenticacion. */
public final class ApiExceptions {

    private ApiExceptions() {
    }

    public static class RecursoNoEncontrado extends RuntimeException {
        public RecursoNoEncontrado(String mensaje) {
            super(mensaje);
        }
    }

    public static class ReglaNegocio extends RuntimeException {
        public ReglaNegocio(String mensaje) {
            super(mensaje);
        }
    }

    public static class CredencialesInvalidas extends RuntimeException {
        public CredencialesInvalidas() {
            super("Credenciales incorrectas");
        }
    }
}
