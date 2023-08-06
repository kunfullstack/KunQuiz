var app = angular.module("myApp",[]);
app.controller("subjectsCtrl",function($scope, $http){
    $scope.listSubject = [];
    $http.get('db/Subjects.js').then(function(reponse){
        $scope.listSubject = reponse.data;
    });
});