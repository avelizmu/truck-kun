pipeline {
  agent none
  stages {
    stage('setup') {
      steps {
        tool 'docker'
      }
    }

    stage('') {
      agent {
        docker {
          image 'node:latest'
        }

      }
      steps {
        sh 'node --version'
      }
    }

  }
}