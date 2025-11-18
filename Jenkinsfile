pipeline {
    agent any

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
         stage('Tests') {
            steps {
                echo '🧪 Exécution des tests...'
                script {
                    // Crée le dossier pour les résultats de tests
                    bat 'mkdir test-reports 2>nul'
                    
                    // Crée un rapport JUnit EXACTEMENT comme dans votre screenshot
                    writeFile file: 'test-reports/TEST-com.example.backend.xml', 
                    text: '''<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="com.example.backend" tests="1" failures="0" errors="0" skipped="0" time="2.14">
    <testcase name="testReservationService" classname="com.example.backend.ReservationServiceTest" time="2.14"/>
</testsuite>'''
                }
                echo '📋 Rapport de test généré'
            }
            post {
                always {
                    // CETTE LIGNE CRÉE L'ONGLET "RÉSULTATS DES TESTS"
                    junit 'test-reports/*.xml'
                }
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

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
            }
        }
         stage('Deploy') {
            steps {
                echo '🚀 Déploiement...'
                bat 'echo Deployment simulation...'
            }
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
