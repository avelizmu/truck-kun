pipeline {
  agent none
  stages {
    stage('build') {
      agent any
      steps {
        tool 'docker'
        sh 'ls'
        sh 'node --version'
        sh 'npm --version'
      }
    }

  }
}