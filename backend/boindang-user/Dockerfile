FROM amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/encyclopedia-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/encyclopedia.jar
CMD ["java", "-jar", "/deploy/encyclopedia.jar"]
