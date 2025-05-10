FROM arm64v8/amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/image-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/image-service.jar
CMD ["java", "-jar", "/deploy/image-service.jar"]
