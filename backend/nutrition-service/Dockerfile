FROM amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/nutrition-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/nutrition-service.jar
CMD ["java", "-jar", "/deploy/nutrition-service.jar"]
