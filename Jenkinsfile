pipeline {
  agent none
  stages {
    stage('build') {
      agent any
      steps {
        git(url: 'https://github.com/aveliz1999/truck-kun.git', branch: 'jenkins')
        sh 'ls'
        sh 'npm'
        sh 'node --version'
        sh 'npm --version'
      }
    }

  }
}