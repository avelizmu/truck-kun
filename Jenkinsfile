pipeline {
  agent none
  stages {
    stage('Test') {
      agent any
      steps {
        tool 'node'
        nodejs('node') {
          sh 'npm test'
        }

        sh 'npm test'
      }
    }

  }
}