pipeline {
  agent none
  stages {
    stage('Test') {
      parallel {
        stage('Test') {
          agent any
          post {
            aborted {
              sh 'echo'
            }

          }
          steps {
            tool 'node'
            nodejs('node') {
              timeout(time: 5, unit: 'SECONDS') {
                sh 'npm install'
                sh 'node --version'
              }

            }

            error 'Test'
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