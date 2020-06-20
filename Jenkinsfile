pipeline {
  agent none
  stages {
    stage('Test') {
      agent any
      steps {
        tool 'node'
        nodejs('node') {
          timeout(time: 5) {
            sh 'npm test'
          }

        }

      }
    }

  }
}