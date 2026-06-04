package com.reciclape.reporte_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class ReporteServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReporteServiceApplication.class, args);
	}

}
