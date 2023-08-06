var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './home.html'
        })
        .when('/gioithieu', {
            templateUrl: './gioithieu.html'
        })
        .when('/lienhe', {
            templateUrl: './lienhe.html'
        })
        .when('/gopy', {
            templateUrl: './gopy.html'
        })
        .when('/quiz/:id/:name', {
            templateUrl: './quizs.html',
            controller: 'quizCtrl'
        })
        .when('/subjects', {
            templateUrl: './subjects.html',
            controller: 'subjectsCtrl'
        })
        .when('/dangky', {
            templateUrl: './dangky.html',
            controller: 'dangkyCtrl'
        })
        .when('/dangnhap', {
            templateUrl: './dangnhap.html',
            controller: 'loginCtrl'
        })
        .when('/doimatkhau', {
            templateUrl: './doimatkhau.html',
            controller: 'changePass',
        })
        .when('/capnhattk', {
            templateUrl: './capnhattk.html'
        })
        .when('/quenmatkhau', {
            templateUrl: './quenmatkhau.html'
        })
});


app.controller('subjectsCtrl', function ($scope, $http) {
    $scope.listSubject = [];
    $http.get('./db/Subjects.js').then(function (reponse) {
        $scope.listSubject = reponse.data;
    });
});

app.controller('quizCtrl', function ($scope, $http, $routeParams, quizFactory) {
    $http.get('./db/Quizs/' + $routeParams.id + '.js').then(function (reponse) {
        quizFactory.questions = reponse.data;

    });
});

app.directive('quizfpl', function (quizFactory, $routeParams, $rootScope) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template_quiz.html',
        link: function (scope, elem, attrs) {
            scope.start = function () {
                if ($rootScope.Hoten === undefined) {
                    alert('Bạn chưa đăng nhập')
                    location = "#/!";
                } else {
                    quizFactory.getQuestions().then(function () {
                        scope.subjectsName = $routeParams.name;
                        scope.id = 1;
                        scope.quizOver = false;
                        scope.inProgess = true;
                        scope.getQuestion();
                    });
                }




            };

            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);

                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            }
            scope.checkAnswer = function () {
                // alert('answer');
                if (!$('input[name=answer]:checked').length)
                    return;
                var ans = $('input[name=answer]:checked').val();
                if (ans == scope.answer) {
                    // alert('Đúng');
                    scope.score++;
                    scope.correcAns = true;
                } else {
                    // alert('Sai');
                    scope.correcAns = false;
                }
                scope.answerMode = false;
            };
            scope.reset();
        }
    }
});

app.factory('quizFactory', function ($http, $routeParams) {

    return {
        getQuestions: function () {
            return $http.get('./db/Quizs/' + $routeParams.id + '.js').then(function (reponse) {
                questions = reponse.data;
            });
        },

        getQuestion: function (id) {
            var randomQuiz = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 10;
            }
            if (id < count) {
                return randomQuiz;
            } else {
                return false;
            }
        }
    }

});

app.controller('ClockCtrl', function ($scope, $interval) {
    $scope.minutes = 10;
    $scope.seconds = 0;
    $scope.finish = false;

    $scope.displayMinutes = $scope.minutes < 10 ? "0" + $scope.minutes : $scope.minutes; // 0m // m
    $scope.displaySeconds = $scope.seconds < 10 ? "0" + $scope.seconds : $scope.seconds;
    $scope.startCount = function () {
        $scope.seconds--;
        if ($scope.seconds === -1) {
            $scope.minutes -= 1;
            $scope.seconds = 59;
        }

        $scope.displayMinutes = $scope.minutes < 10 ? "0" + $scope.minutes : $scope.minutes;
        $scope.displaySeconds = $scope.seconds < 10 ? "0" + $scope.seconds : $scope.seconds;
        if ($scope.minutes === 0 && $scope.seconds === 0) {
            alert('Hết giờ')
            $scope.stopCountdown();
            $scope.reset();
        }
    }

    $scope.stopCountdown = function () {
        $scope.finish = !$scope.finish;
        $interval.cancel(myTimeout);

        alert('stop');
    }
    var myTimeout = $interval($scope.startCount, 1000);
});

// get dữ liệu
app.service('dataService', function ($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function () {
        return $http.get('http://localhost:3000/listStudent');
    }
    this.updateData = function (id, data) {
        return $http.patch('http://localhost:3000/listStudent/' + id, data); //put, patch
    }
    this.postData = function (data) {
        return $http.post('http://localhost:3000/listStudent', data);// inssert
    }

});
// login

app.controller('loginCtrl', function ($scope, $location, $rootScope, $window, dataService, $http) {

    $scope.users = [];

    dataService.getData().then(function (res) {
        $scope.users = res.data;
        console.log($scope.users);
    });

    $scope.users = null;
    var checkAccount = true;

    $scope.login = function () {
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.fullname != $scope.users[i].username) {
                checkAccount = false;
            } else if ($scope.password != $scope.users[i].password) {
                alert('Mật khẩu không đúng');
                $rootScope.isLogin = false;
                return;
            } else {
                alert('Đăng nhập thành công');
                $rootScope.isLogin = true;
                $rootScope.Hoten = $scope.users[i].fullname;
                $rootScope.userLogin = $scope.users[i];
                location = "#/!";
                return;
            }
        }
        if (checkAccount === false) {
            $rootScope.isLogin = false;
            alert('Tên đăng nhập không đúng');
        }
    }
});

// logoff
app.controller('logoff', function ($scope, $rootScope, $location, dataService, $timeout) {
    $scope.logoff = function () {
        alert('Đăng xuất thành công');
        $rootScope.isLogin = false;
        $rootScope.Hoten = undefined;
        location = "#/!";
    }

});



// đăng ký
app.controller('dangkyCtrl', function ($scope, dataService, $location, $timeout) {
    $scope.users = [];

    dataService.getData().then(function (res) {
        $scope.users = res.data;
    });


    $scope.creatAcc = function () {
        var newAcc = {
            username: $scope.username,
            password: $scope.password,
            fullname: $scope.fullname,
            email: $scope.email,
            gender: $scope.gender,
            birthday: $scope.birthday,
            schoolfee: $scope.schoolfee,
            marks: $scope.marks
        }

        var checkEmail = false;

        for (var i = 0; i < $scope.users.length; i++) {

            if (newAcc.email === $scope.users[i].email) {
                alert('Email đã tồn tại');
                return;
            } else {
                checkEmail = true;
            }
        }

        if (checkEmail = true) {
            dataService.postData(newAcc).then(function (res) {
                alert('Đăng ký thành công');
              
                location = "#/!";
                // console.log(users);
            });
        }


    }
});
// đổi mật khẩu
app.controller('changePass', function ($scope, dataService, $rootScope) {
    $scope.users = [];
    $scope.changePassf = (e) => {
        let currenUser = $scope.userLogin;
        if (currenUser.password !== $scope.oldpassword) {
            alert("Mật khẩu cũ không đúng!")
            return;
        }
        if ($scope.newPassword !== $scope.confirPassword) {
            alert("Mật khẩu mới không trùng khớp!")
            return;
        }
        currenUser.password = $scope.newPassword;
        dataService.updateData(currenUser.id, currenUser);

        alert("Đổi mật khẩu thành công! Xin mời đăng nhập lại!");
        $rootScope.isLogin = false;
        $rootScope.Hoten = undefined;
        location = "#/!"

    }
    return


    // var account = {
    //     username: $scope.username,
    //     password: $scope.password,
    //     fullname: $scope.fullname,
    //     email: $scope.email,
    //     gender: $scope.gender,
    //     birthday: $scope.birthday,
    //     schoolfee: $scope.schoolfee,
    //     marks: $scope.marks
    // }

});
