// var async = require('asyncawait/async');
// var await = require('asyncawait/await');

/**
 * nome - char required
 * endereco - char
 * telefone - char required
 * email - char
 * cpf - char
 */

angular.module('App')

// creates new cliente
.directive('clienteCreate', function(){
  return {
    restrict: 'AE',
    template: `
    <h3>Há {{qtt}} clientes cadastrados </h3>
    <form name="add_form" ng-submit="create(novo)" novalidate>
      <div class="form-group">
        <label for="nome">Nome</label>
        <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="novo.nome" ng-required="true"></input>
      </div>
      <div class="form-group">
        <label for="telefone">Telefone</label>
        <input id="telefone" class="form-control" type="text" placeholder="Telefone" name="telefone" ng-model="novo.telefone" ng-required="true"></input>
      </div>
      <div class="form-group">
        <label for="endereco">Endereço</label>
        <input id="endereco" class="form-control" type="text" placeholder="Endereço" name="endereco" ng-model="novo.endereco" ng-required="true"></input>
      </div>
      <div class="form-group">
        <label for="cpf">CPF</label>
        <input id="cpf" class="form-control" type="text" placeholder="CPF" name="cpf" ng-model="novo.cpf" ng-required="true"></input>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" class="form-control" type="email" placeholder="Email" name="email" ng-model="novo.email" ng-required="false"></input>
      </div>
      <input class="btn btn-primary" type="submit" value="Salvar">
    </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ClienteFactory',
      function(scope, ele, attrs, transclude, ClienteFactory){
        scope.qtt = ClienteFactory.list().length // quantity of clientes in system
        scope.novo = {} // new cliente object
        scope.create = function(cliente){ // creates new cliente
          if(scope.add_form.$valid){ // if form is valid
            console.log("formulário válido")
            ClienteFactory.create(scope.novo); // calls the save factory's method
            scope.$emit('cliente:created', scope.novo) // emits event for saved cliente
            scope.novo = {} // resets new object
          }else{
            console.log("error");
          }
        }
        // listens to cliente creation
        scope.$on('cliente:created', function(evt){
          scope.qtt = ClienteFactory.list().length // updates the quantity of clientes
        })
      }
    ]
  }
})

// cliente update directive
.directive('clienteUpdate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Editar cliente - {{cliente.nome}} </h3>
      <form name="edit_form" ng-submit="update(cliente)" novalidate>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="cliente.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input id="telefone" class="form-control" type="text" placeholder="Telefone" name="telefone" ng-model="cliente.telefone" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="endereco">Endereço</label>
          <input id="endereco" class="form-control" type="text" placeholder="Endereço" name="endereco" ng-model="cliente.endereco" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="cpf">CPF</label>
          <input id="cpf" class="form-control" type="text" placeholder="CPF" name="cpf" ng-model="cliente.cpf" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" class="form-control" type="email" placeholder="Email" name="email" ng-model="cliente.email" ng-required="false"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
        <a class="btn btn-danger" href="#/clientes">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ClienteFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ClienteFactory){
        id = routeParams.id // gets id from route
        scope.cliente = ClienteFactory.read(id) // read the cliente that has the id
        // console.log(scope.cliente);
        scope.update = function(obj){ // update function
          if(scope.edit_form.$valid){ // if form is valid
            ClienteFactory.update(id, obj) // calls update method from factory
            location.path('/clientes') // redirect to client list
          }
        }
      }
    ]
  }
})

.directive('clienteDelete', function(){ // deletes cliente
  return {
    restrict: 'AE',
    template: `
      <h3>Tem certeza que deseja excluir o cliente - {{cliente.nome}} ?</h3>
      <form name="delete_form" ng-submit="delete(cliente)" novalidate>
        <input class="btn btn-danger" type="submit" value="Excluir">
        <a class="btn btn-primary" href="#/clientes">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ClienteFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ClienteFactory){
        id = routeParams.id // gets id from route
        scope.cliente = ClienteFactory.read(id) // loads cliente
        scope.delete = function(obj){ // delete method
          ClienteFactory.delete(id) // calls delete method
          location.path('/clientes') // redirect to list of clientes
        }
      }
    ]
  }
})

.directive('clienteList', function(){ // list of clientes
  return {
    restrict: 'AE',
    template: `
      <h3 class="text-center center">Lista de Clientes</h3>
      <div ng-if='clientes.length > 0'>
        <div>
          <label>Filtrar: <input class="form-control" ng-model="filtro"></label>
        </div>
        <cliente ng-repeat='cliente in clientes | filter:filtro' obj='cliente'></cliente>
      </div>
      <div ng-if='clientes.length <= 0'>
        <h3>Nenhum cliente disponível</h3>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ClienteFactory', '$timeout',
      function(scope, ele, attrs, transclude, ClienteFactory, $timeout){
        scope.clientes = ClienteFactory.list(); // loads cliente list

        scope.$on('cliente:created', function(evt, cliente){ // listens to create event
          scope.clientes = ClienteFactory.list() // updates the list
        })
      }
    ]
  }
})

.directive('cliente', function(){ // cliente detail
  return {
    restrict: 'AE',
    scope: {cliente: '=obj'},
    template: `
      <div class='lista'>
        <h4 class='lista-title'>{{cliente.nome}}</h4>
        <p>Telefone: {{cliente.telefone}}</p>
        <p>Endereço: {{cliente.endereco}}</p>
        <p>CPF: {{cliente.cpf}}</p>
        <div>
          <a class="btn btn-danger" href="#/cliente/{{cliente.id}}/delete">Deletar</a>
          <a class="btn btn-primary" href="#/cliente/{{cliente.id}}/update">Editar</a>
        </div>
      </div>
    `
  }
})

.factory('ClienteFactory', 
  ['SaveFactory', '$q', '$interval',
  function(SaveFactory, $q, $interval){
    return { // returns object
      list: function(){ // gets cliente list
        return db.run("SELECT * FROM cliente");
      },
      create: function(obj){ // creates new object
        inserted = db.insert("cliente", 
          {
            nome: obj.nome, 
            endereco: obj.endereco, 
            telefone: obj.telefone, 
            email: obj.email, 
            cpf: obj.cpf
          }
        );
        console.log(inserted);
      },
      read: function(id){ // load cliente based on id
        return db.run("SELECT * FROM cliente WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        // update cliente based on id and object
        return db.update('cliente', {
          nome: obj.nome,
          endereco: obj.endereco,
          telefone: obj.telefone,
          email: obj.email,
          cpf: obj.cpf
        }, {id: parseInt(id)});
      },
      delete: function(id){ // delete cliente
        return db.run("DELETE FROM cliente WHERE id = ?", [parseInt(id)]);
      }
    }
  }])