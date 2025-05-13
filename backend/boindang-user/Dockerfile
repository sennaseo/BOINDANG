FROM amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/boindang-user-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/boindang-user.jar
CMD ["java", "-jar", "/deploy/boindang-user.jar"]
