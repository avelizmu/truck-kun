pipeline {
  agent none
  stages {
    stage('Test') {
      parallel {
        stage('Test') {
          agent any
          post {
            aborted {
              error 'FAILURE'
            }

          }
          steps {
            tool 'node'
            nodejs('node') {
              sh 'npm install'
              sh 'node --version '
            }

          }
        }

        stage('test2') {
          agent any
          steps {
            sh 'ls'
          }
        }

      }
    }

    stage('last') {
      agent any
      steps {
        sleep 10
        sh 'ls'
      }
    }

  }
}