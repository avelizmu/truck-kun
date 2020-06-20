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
              currentBuild
              timeout(time: 5, unit: 'SECONDS') {
                sh 'npm install'
                sh 'node --version'
              }

            }
          }
          post {
            aborted {
              error
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
