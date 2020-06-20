pipeline {
  agent any
  stages {
    stage('build') {
      agent {
        docker {
          image 'node'
        }

      }
      steps {
        git(url: 'https://github.com/aveliz1999/truck-kun.git', branch: 'jenkins')
        sh 'ls'
        sh 'npm'
      }
    }

  }
}