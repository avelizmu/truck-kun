pipeline {
  agent none
  stages {
    stage('build') {
      agent any
      steps {
        sh 'ls'
        tool 'node'
        sh 'node --version'
        sh 'npm --version'
      }
    }

  }
}