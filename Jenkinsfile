pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "hibaohd/myapp"
    }
    tools {
        jdk 'jdk17'
        maven 'maven'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/HibaOhd/resevation_devices'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean package'
                }
            }
        }
        stage('Build Frontend') {
        dir('frontend') {
            bat "npm install"
            bat "npm run build"
        }
    }



        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('LocalSonar') { // Name of SonarQube server in Jenkins
                        withCredentials([string(credentialsId: 'SonarToken', variable: 'SONAR_TOKEN')]) {
                            bat "mvn sonar:sonar -Dsonar.login=%SONAR_TOKEN%"
                        }
                    }
                }
            }
        }
        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    bat "docker build -t hibaohd/backend:${BUILD_NUMBER} ."
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    bat "docker build -t hibaohd/frontend:${BUILD_NUMBER} ."
                }
            }
        }


        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    // Login
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
        
                    // Push backend image
                    bat "docker tag hibaohd/backend:${BUILD_NUMBER} hibaohd/backend:latest"
                    bat "docker push hibaohd/backend:${BUILD_NUMBER}"
                    bat "docker push hibaohd/backend:latest"
        
                    // Push frontend image
                    bat "docker tag hibaohd/frontend:${BUILD_NUMBER} hibaohd/frontend:latest"
                    bat "docker push hibaohd/frontend:${BUILD_NUMBER}"
                    bat "docker push hibaohd/frontend:latest"
                }
            }
        }


        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
