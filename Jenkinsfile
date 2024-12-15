pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Cloner le code source depuis le dépôt
                git 'https://votre-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Construire l'image Docker
                sh 'docker build -t rania2001/mon-api:1.0 .'
            }
        }

        stage('Push to DockerHub') {
            steps {
                // Se connecter à DockerHub
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
                // Pousser l'image
                sh 'docker push rania2001/mon-api:1.0'
            }
        }

        stage('Deploy Container') {
            steps {
                // Déployer le conteneur
                sh 'docker run -d -p 3000:3000 rania2001/mon-api:1.0'
            }
        }
    }
}
