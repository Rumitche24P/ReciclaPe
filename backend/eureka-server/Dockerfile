# Build context esperado: backend/
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY eureka-server eureka-server
COPY api-gateway api-gateway
COPY auth-service auth-service
COPY recojo-service recojo-service
COPY reporte-service reporte-service
RUN mvn -q -pl eureka-server -am package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
