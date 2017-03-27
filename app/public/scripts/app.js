const fs = require('fs'); // file operations
//const sqlite = require('sqlite3').verbose();
//const db = new sqlite.Database(__dirname + '/data.db');
const db = require('sqlite-sync'); // read database manager
db.connect(__dirname + '/data.db'); // load database

// creates a new module
// var app = angular.module('App', ['ngRoute', 'ngFileUpload']);
var app = angular.module('App', ['ui.router', 'ngFileUpload']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'public/templates/home.html'
    })
    .state('consultor.create', {
      url: '/consultor/create',
      templateUrl: 'public/templates/consultor/consultores_add.html'
    })
    .state('consultor.list', {
      url: '/consultor/list',
      templateUrl: 'public/templates/consultor/consults.html'
    })
    .state('consultor.detail', {
      url: '/consultor/detail/:id',
      templateUrl: 'public/templates/consultor/consultor.html'
    })
    .state('consultor.edit', {
      url: '/consultor/edit/:id',
      templateUrl: 'public/templates/consultor/consultor_edit.html'
    })
    .state('consultor.delete', {
      url: '/consultor/delete/:id',
      templateUrl: 'public/templates/consultor/consultor_remove.html'
    })
}])

// app.config(['$routeProvider', function($routeProvider){ // route configuration
//   $routeProvider
//     .when('/', { // default page
//       templateUrl: 'public/templates/home.html'
//     })

//     .when('/consultores',{ // list of consultores
//       templateUrl: 'public/templates/consultor/consults.html',
//     })
//     .when('/consultores/novo',{ // new consutor page
//       templateUrl: 'public/templates/consultor/consultores_add.html'
//     })
//     .when('/consultor/:id',{ // consultor consult page
//       templateUrl: 'public/templates/consultor/consultor.html'
//     })
//     .when('/consultor/:id/edit',{ // cosultor edit page
//       templateUrl: 'public/templates/consultor/consultor_edit.html',
//     })
//     .when('/consultor/:id/remove',{ // consultor delete page
//       templateUrl: 'public/templates/consultor/consultor_remove.html',
//     })

//     .when('/fornecedores',{ // fornecedor list page
//       templateUrl: 'public/templates/fornecedor/fornecedores.html',
//     })
//     // .when('/fornecedores/novo',{ // fornecedor creation page
//     //   templateUrl: 'public/templates/fornecedor/fornecedor_add.html'
//     // })
//     // .when('/fornecedor/:id',{ // fornecedor consult page
//     //   templateUrl: 'public/templates/fornecedor/fornecedor.html'
//     // })
//     .when('/fornecedor/:id/update',{ // fornecedor update page
//       templateUrl: 'public/templates/fornecedor/fornecedor-update.html',
//     })
//     .when('/fornecedor/:id/delete',{ // forecedor delete page
//       templateUrl: 'public/templates/fornecedor/fornecedor-delete.html',
//     })

//     .when('/produtos',{ // produto list page
//       templateUrl: 'public/templates/produto/produtos.html',
//     })
//     // .when('/produtos/novo',{ // produto creation page
//     //   templateUrl: 'public/templates/produto/fornecedor_add.html'
//     // })
//     // .when('/produto/:id',{ // produto consult page
//     //   templateUrl: 'public/templates/produto/produto.html'
//     // })
//     .when('/produto/:id/update',{ // produto update page
//       templateUrl: 'public/templates/produto/produto_update.html',
//     })
//     .when('/produto/:id/delete',{ // produto delete page
//       templateUrl: 'public/templates/produto/produto_delete.html',
//     })

//     .when('/clientes',{
//       templateUrl: 'public/templates/cliente/clientes.html',
//     })
//     // .when('/clientes/novo',{
//     //   templateUrl: 'public/templates/cliente/fornecedor_add.html'
//     // })
//     // .when('/cliente/:id',{
//     //   templateUrl: 'public/templates/cliente/cliente.html'
//     // })
//     .when('/cliente/:id/update',{
//       templateUrl: 'public/templates/cliente/cliente_update.html',
//     })
//     .when('/cliente/:id/delete',{
//       templateUrl: 'public/templates/cliente/cliente_delete.html',
//     })

//     .when('/pedidos',{
//       templateUrl: 'public/templates/pedido/pedidos.html',
//     })
//     // .when('/pedidos/novo',{
//     //   templateUrl: 'public/templates/pedido/fornecedor_add.html'
//     // })
//     // .when('/pedido/:id',{
//     //   templateUrl: 'public/templates/pedido/pedido.html'
//     // })
//     // .when('/pedidos/:id/update',{
//     //   templateUrl: 'public/templates/pedido/pedido_update.html',
//     // })
//     // .when('/pedidos/:id/delete',{
//     //   templateUrl: 'public/templates/pedido/pedido_delete.html',
//     // })


//     .otherwise({ // default route
//       redirectTo: '/'
//     })
// }])

// main controller for all application
app.controller('mainController', ['$scope', 'SaveFactory', 'DBFactory', function($scope, SaveFactory, DBFactory){

  data = SaveFactory.read(); // read data from file

  DBFactory.initialize();

  // console.log(data); // prints out data

}])

// factory for database
app.factory('DBFactory', [function(){
  return {
    initialize: function(){
      // db.serialize(
        // function(){
          db.run(`
            CREATE TABLE IF NOT EXISTS cliente(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              nome CHAR(100) NOT NULL,
              endereco CHAR(100),
              telefone CHAR(100) NOT NULL,
              email CHAR(100),
              cpf CHAR(50)
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS vendedor(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              nome CHAR(100) NOT NULL,
              email CHAR(100),
              telefone CHAR(50) NOT NULL,
              endereco CHAR(100) NOT NULL,
              cpf CHAR(50),
              comissao REAL NOT NULL
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS empresa(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              nome CHAR(100) NOT NULL,
              email CHAR(100),
              telefone CHAR(50) NOT NULL,
              endereco CHAR(100) NOT NULL,
              cnpj CHAR(50)
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS produto(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              empresa_id INTEGER NOT NULL,
              nome CHAR(100) NOT NULL,
              codigo CHAR(100),
              preco_entrada REAL NOT NULL,
              preco_saida REAL NOT NULL,
              foto TEXT
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS pedido(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              empresa_id INTEGER NOT NULL,
              data DATE NOT NULL,
              forma_pagamento CHAR(100) NOT NULL,
              forma_entrega CHAR(100) NOT NULL,
              quantidade_parcelas INT,
              data_previsao_entrega DATE
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS pedido_produto(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              pedido_id INTEGER NOT NULL,
              produto_id INTEGER NOT NULL
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS venda(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              cliente_id INTEGER NOT NULL,
              vendedor_id INTEGER NOT NULL,
              data DATE NOT NULL,
              forma_pagamento CHAR(100) NOT NULL,
              forma_entrega CHAR(100) NOT NULL,
              quantidade_parcelas INT,
              desconto REAL
            )`);
          db.run(`
            CREATE TABLE IF NOT EXISTS venda_produto(
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              venda_id INTEGER NOT NULL,
              produto_id INTEGER NOT NULL
            )`);
        // }
      // );
    }
  }
}])

// factory for file creation and edition
app.factory('SaveFactory', [function(){
  return { // returns object
    pathToFile: __dirname + '/app.json', // path to the file

    read: function(){ // read file
      self = this;

      try{
        dataFromFile = fs.readFileSync(self.pathToFile) // open file from disc
      }catch(e){ // creates new file if if does not exist
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
            {nome, image, box, codigo, fornecedor, quantidade_estoque, preco_custo, preco_saida}
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
      }finally{ // reads eighter way
        var stringData = dataFromFile.toString() // parses file data to string
        var jsonResult = null // json result

        try{ // parse file string data to json
          jsonResult = JSON.parse(stringData); // parses string to JSON
        } catch(e){
          console.log(e) // prints out error
        }finally{
          return jsonResult; // returns file data as JSON
        }
      }
    },

    write: function(data){ // function for writting file
      self = this;

      try{ // try to write file
        writen = JSON.stringify(data) // parses JSON object to string
        // overwrite or create file with this content
        fs.writeFileSync(self.pathToFile, writen)
      }catch(e){
        console.log(e)
      }
    },

    overwrite: function(data){

    }

  }         
}])

// modal directive to use over application
app.directive("modal", function(){
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      title: "@", // modal title
      btntxt: "@" // text for button that opens the modal
    },
    template: `
      <button class="btn btn-primary" data-toggle="modal" data-target="#theModal">
        {{btntxt}}
      </button>
      <div class="modal fade" id="theModal" role="dialog" aria-labelledby="modallabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"
              aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="modallabel">{{title}}</h4>
            </div>
            <div class="modal-body">
              <ng-transclude></ng-transclude>
            </div>
          </div>
        </div>
      </div>
    `
  }
})

// directive for picking date over the application
app.directive('datepicker', function(){
  return {
    restrict: 'AE',
    link: function(scope, elem, attrs){
      // console.log(elem);
      $(elem).datepicker(); // makes element a date picker
      // $(elem).change(function(evt){
      //   console.log(evt);
      //   console.log($(elem).datepicker('getDate'))
      //   val = $(elem).datepicker('getDate')
      //   mom = moment(val, 'dd/mm/yy')
      //   console.log(val)
      //   console.log(mom.fromNow())
      // })
    }
  }
})