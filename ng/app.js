const app = angular.module("todoApp", ['ngMaterial'])

app.controller("todoAppCtrl", ["$scope", "$mdDialog", "todoAppService", 
function($scope, $mdDialog, todoAppService) {
    $scope.todos = [];
    $scope.button = "Update";
    let indexOfTodo;
    let userId;
    let isCompleted;

    $scope.showAlert = (content) => {
        $mdDialog.show (
           $mdDialog.alert()
              .parent(angular.element(document.querySelector('#todoContainer')))
              .clickOutsideToClose(true)
              .title('Error Message')
              .textContent(content)
              .ok('Ok!')
        );
     };


    $scope.addTodo = () => {
        const todoTitle = $scope.todoTitle;
        /*$scope.todos.push({
            userId: 1,
            title: todoTitle,
            completed: false,
            filterCompleted: true
        });*/
        todoAppService.addTodo(todoTitle)
        .then((response) => {
            if (response == 400){
                $scope.showAlert("Bad Request")
            }
            else if (response == 401){
                $scope.showAlert("Unauthorized")
            }
            else if (response == 403){
                $scope.showAlert("Forbidden")
            }
            else if (response == 404){
                $scope.showAlert(todoTitle + " Not Found")
            }
            else if (response == 500){
                $scope.showAlert("Internal Server Error")
            } 
            else if (response == 503){
                $scope.showAlert("Access-Control-Allow-Origin Error")
            }
            else {
                console.log(response);
            $scope.todos.push(response);
        }
        });

        $scope.todoTitle = "";
    }

    $scope.deleteTodo = (todo) => {
        indexOfTodo = $scope.todos.indexOf(todo);
        userId = todo.userId;
        todoAppService.deleteTodo(userId)
        .then((response) => {
            if (response == 400){
                $scope.showAlert("Bad Request")
            }
            else if (response == 401){
                $scope.showAlert("Unauthorized")
            }
            else if (response == 403){
                $scope.showAlert("Forbidden")
            }
            else if (response == 404){
                $scope.showAlert(todoTitle + " Not Found")
            }
            else if (response == 500){
                $scope.showAlert("Internal Server Error")
            }
        });

        $scope.todos.splice(indexOfTodo, 1);
    }

    $scope.updateTodo = (todo,index) => {
        const elem = angular.element(document.querySelector("#todoSpan_" + index));
        console.log($scope.todos);

        if ($scope.button == "Update"){
            elem[0].setAttribute("contenteditable", true);
            elem[0].setAttribute("target", 0);
            elem[0].focus();
            $scope.button = "Save";
        }
        else {
            elem[0].removeAttribute("contenteditable");
            elem[0].removeAttribute("target");
            $scope.button = "Update";
            $scope.todos[index].title = elem[0].innerText;

            userId = todo.userId;
            isCompleted = todo.completed;

            todoAppService.updateTodo(userId, elem[0].innerText, isCompleted)
            .then((response) => {
                if (response == 400){
                    $scope.showAlert("Bad Request")
                }
                else if (response == 401){
                    $scope.showAlert("Unauthorized")
                }
                else if (response == 403){
                    $scope.showAlert("Forbidden")
                }
                else if (response == 404){
                    $scope.showAlert(todoTitle + " Not Found")
                }
                else if (response == 500){
                    $scope.showAlert("Internal Server Error")
                }
            });
            
        }

        
    }

    $scope.completeTodo = (todo) => {
        indexOfTodo = $scope.todos.indexOf(todo)
        $scope.todos[indexOfTodo].completed = !$scope.todos[indexOfTodo].completed;
        
        if (todo.completed == true){
            todo.completed = false;
        }
        else if(todo.completed == false) {
            todo.completed = true;
        }

        
    }

    $scope.hideCompletedTodos = (evt) => {
       const hideStatus = evt.currentTarget.dataset.sts;

       if (hideStatus == 0) {
        $scope.todos.forEach(e => {
            if (e.completed){
                e.filterCompleted = false;
                evt.currentTarget.dataset.sts = 1;
                evt.currentTarget.textContent = "Show All";
            }  
        });
       }
       else {
        $scope.todos.forEach(e => {
                e.filterCompleted = true;
                evt.currentTarget.dataset.sts = 0;
                evt.currentTarget.textContent = "Hide Completed";
        });
        
       }

    }

}]);

app.service("todoAppService", ["$http", function($http) {
    this.apiUrl = "https://jsonplaceholder.typicode.com/todos"
    let data;
    let promise;

    this.addTodo = (todoTitle) => {
        data = JSON.stringify({
            userId: 1,
            title: todoTitle,
            completed: false,
            filterCompleted: true

        })

        promise = $http({
            method: "POST",
            url: this.apiUrl,
            data: data
        })
            .then((response) => {
                return response.data;
            }, (error) => {
                return error.status;
            });

            return promise;
    }

    this.deleteTodo = (userId) => {
        promise = $http({
            method: "DELETE",
            url: this.apiUrl + '/' + userId,
            data: JSON.stringify({userId : userId})
        })
        .then((response) => {
            return response.data;
        }, (error) => {
            return error.status;
        });

        return promise;
    }

    this.updateTodo = (userId, todoTitle, completed) => {
        data = JSON.stringify({
            userId: userId,
            title: todoTitle,
            completed: completed
        })

        promise = $http({
            method: "PUT",
            url: this.apiUrl + "/" + userId,
            data: data
        })
        .then((response) => {
            return response.data;
        }, (error) => {
            return error.status;
        });

        return promise;
    }

}]);