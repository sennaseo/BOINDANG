FROM amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/community-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/community.jar
CMD ["java", "-jar", "/deploy/community.jar"]
