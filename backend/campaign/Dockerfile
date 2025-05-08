FROM arm64v8/amazoncorretto:17
RUN mkdir /deploy
ARG JAR_FILE=./build/libs/campaign-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} /deploy/campaign.jar
CMD ["java", "-jar", "/deploy/campaign.jar"]
