# 1단계: 빌드 단계
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# 프로젝트의 Gradle Wrapper 및 설정 파일 복사
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 실행 권한 부여
RUN chmod +x gradlew

# 소스 코드 복사
COPY src/ src/

# 프로젝트 빌드 (bootJar 생성)
RUN ./gradlew build -x test

# 2단계: 실행 단계
FROM eclipse-temurin:21-jdk AS runtime

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
