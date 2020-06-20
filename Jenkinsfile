pipeline {
  agent none
  stages {
    stage('build') {
      agent {
        docker {
          image 'node:latest'
        }

      }
      steps {
        tool 'docker'
        sh 'ls'
        sh 'node --version'
        sh 'npm --version'
      }
    }

  }
}