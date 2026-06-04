package com.reciclape.recojo_service.exception;

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
}
