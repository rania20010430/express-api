pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rania2001/mon-api'  
    }

    stages {
        stage('clone code') {
            steps {
                git 'https://github.com/rania20010430/express-api.git'
            }
        }
        stage('build') {
            steps {
                script {
                  docker.build("${DOCKER_IMAGE}:1.0")
                }
            }
        }

        stage('push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-login') {
                        docker.image("${DOCKER_IMAGE}:1.0").push()
                    }
                }
            }
        }
    stage('deploy') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'DockerHubLogin') {
                        def docker_image = docker.image("${DOCKER_IMAGE}:1.0")
                        docker_image.run('--name mini-projet -p 3000:3000')
                 }
                }
            }
        }
    }
}
