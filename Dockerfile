FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew

COPY src/ src/

RUN ./gradlew build -x test

FROM eclipse-temurin:21-jdk AS runtime

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-local}

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
