const fs = require('fs'); // file operations


// create new angular module
var app = angular.module('App', ['ngRoute']);

// configure the routes
app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'public/templates/home.html'
    })

    // routes for consultor pages
    .when('/consultores',{
      templateUrl: 'public/templates/consultor/consultores.html',
      controller: 'ConsultorListCtrl'
    })
    .when('/consultores/novo',{
      templateUrl: 'public/templates/consultor/consultores_add.html'
    })
    .when('/consultor/:id',{
      templateUrl: 'public/templates/consultor/consultor.html'
    })
    .when('/consultor/:id/edit',{
      templateUrl: 'public/templates/consultor/consultor_edit.html',
      controller: 'ConsultorListCtrl'
    })
    .when('/consultor:id/remove',{
      templateUrl: 'public/templates/consultor/consultor_remove.html'
    })

    // default route
    .otherwise({
      redirectTo: '/'
    })
}])

// main controller
app.controller('mainController', ['$scope', 'SaveFactory', function($scope, SaveFactory){

  data = SaveFactory.read(); // read the saved data

  console.log(data); // print out the data

}])

// list the consultor
app.controller('ConsultorListCtrl', ['$scope', '$routeParams', '$location', 'SaveFactory', function($scope, $routeParams, $location, SaveFactory){

  data = SaveFactory.read(); // read all data

  $scope.consultores = data.consultores; // consultores array
  $scope.new = {}; // new empty object

  // function for saving new consultor
  $scope.save = function(){
    if($scope.consultor_form.$valid){ // if the form is valid
      console.log("valid form"); // prints that form is valid
      
      $scope.new.id = data.id_counter.consultor; // gets id for object
      data.consultores.push( // push new object data to array
        {
          id: $scope.new.id,
          nome: $scope.new.nome, 
          telefone: $scope.new.telefone, 
          endereco: $scope.new.endereco, 
          cpf: $scope.new.cpf, 
          comissao: $scope.new.comissao
        }
      );
      
      data.id_counter.consultor += 1; // adds one to consultor id count
      
      SaveFactory.write(data); // write data in file

      data = SaveFactory.read(); // re-read file data
      $scope.consultores = data.consultores; // update consultor list

      $scope.new = {}; // reset new object
    }else{
      console.log("Invalid form"); // prints that form is not valid
    }
  }

  $scope.edit = function(){ // method for edit consultor
    id = $routeParams.id // gets the id from route param
    consultor = $scope.consultores.find(function(e, i, a){ // find the consultor with the id specified
      return e.id === parseInt(id)
    })
    console.log(consultor); // prints out the consultor found
    
    $scope.consultor = consultor; // put found consultor in variable
  }

  $scope.delete = function(){ // method for deleting consultor
    id = $routeParams.id // gets id from route
    consultor = null // consultor variable as null
    $scope.consultores.forEach(function(e, i, a){ // search for consultor using id
      console.log(i);
    })
  }

  console.log($scope.consultores); // print out the list of consultores

}])

app.factory('SaveFactory', [function(){ // factory for saving and reading files
  return {
    pathToFile: __dirname + '/app.json', // path to the file = directory + file_name

    read: function(){ // method for reading file data
      self = this; // self is equals this object

      try{ // try to load file from disc
        dataFromFile = fs.readFileSync(self.pathToFile)
      }catch(e){ // if file was not found, creates a new one
        console.log(e)
        self.write({
          id_counter: {
            consultor: 1,
            cliente: 1,
            produto: 1,
            fornecedor: 1,
            pedido: 1,
            venda: 1
          },
          consultores: [],
          clientes: [],
          produtos: [],
          fornecedores: [],
          pedidos: [],
          vendas: []
        }); // write some data in the file creating it
        /*
        {
          id_counter: {
            consultor:
            cliente:
            produto:
            fornecedor:
            pedido:
            venda:
          },
          consultores: [
            {nome, telefone, endereco, cpf, comissao}
          ],
          clientes: [
            {nome, telefone, endereco, cpf}
          ],
          produtos: [
            {nome, foto, codigo, fornecedor, quantidade_estoque, preco_custo, preco_saida}
          ],
          fornecedores: [
            {nome, cnpj, endereco, telefone, email}
          ],
          pedidos: [
            {fornecedor, produtos, data_pedido, forma_pagamento, 
            quantia_parcelas, data_vencimento, total}
          ],
          vendas: [
            {consultor, cliente, produtos, data_pedido, forma_pagamento, 
            quantidade_parcelas, data_vencimento, total}
          ],
        }
        */
        dataFromFile = fs.readFileSync(self.pathToFile) // reading data again
      }finally{
        var stringData = dataFromFile.toString() // parses data to string
        var jsonResult = null // json result

        try{
          jsonResult = JSON.parse(stringData); // parses string to JSON
        } catch(e){
          console.log(e)
        }finally{
          return jsonResult; // returns JSON result
        }
      }
    },

    write: function(data){ // function for writing and saving file
      self = this;

      try{ // try to create or write file with new content
        writen = JSON.stringify(data) // parses JSON object to string
        
        // overwrite or create file with this content
        fs.writeFileSync(self.pathToFile, writen)
      }catch(e){
        console.log(e) // prints out error
      }
    },

    overwrite: function(data){ // function for overwritting file data

    }

  }         
}])