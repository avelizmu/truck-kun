pipeline {
  agent none
  stages {
    stage('Test') {
      parallel {
        stage('Test') {
          agent any
          steps {
            tool 'node'
            nodejs('node') {
              catchError() {
                timeout(time: 5, unit: 'SECONDS') {
                  sh 'npm install'
                  sh 'node --version'
                }
              }

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
      steps {
        sleep 10
        sh 'ls'
      }
    }

  }
}
