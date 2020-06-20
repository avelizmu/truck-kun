pipeline {
  agent none
  stages {
    stage('1') {
      steps {
        node(label: 'test node')
      }
    }

    stage('2') {
      steps {
        echo 'asd'
      }
    }

  }
}