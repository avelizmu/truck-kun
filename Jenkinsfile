pipeline {
  agent none
  stages {
    stage('Test') {
      steps {
        tool 'node'
        nodejs 'node'
        sh 'npm test'
      }
    }

  }
}