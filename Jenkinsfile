pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'develop', url: 'https://github.com/TON_USERNAME/NOM_DU_REPO.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        stage('Package') {
            steps {
                sh 'mvn package'
            }
        }
        stage('SonarQube Analysis') {
            environment {
                SONARQUBE = credentials('sonar-token-id') // ID des credentials Jenkins
            }
            steps {
                sh "mvn sonar:sonar -Dsonar.login=$SONARQUBE"
            }
        }
    }
}
