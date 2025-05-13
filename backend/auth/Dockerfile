FROM amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/auth-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/auth.jar
CMD ["java", "-jar", "/deploy/auth.jar"]
