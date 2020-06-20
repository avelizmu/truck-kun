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
              timeout(time: 5) {
                sh '''npm install
npm start'''
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