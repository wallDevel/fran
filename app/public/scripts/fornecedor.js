/**
 * nome - char required
 * email - char
 * telefone - char required
 * endereco - char required
 * cnpj - char
 */

angular.module('App')

.directive('fornecedorCreate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Há {{qtt}} fornecedores cadastrados </h3>
      <form name="add_form" ng-submit="create(novo)" novalidate>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="novo.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" class="form-control" type="text" placeholder="Email" name="email" ng-model="novo.email" ng-required="true"></input>
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
          <label for="cnpj">CNPJ</label>
          <input id="cnpj" class="form-control" type="text" placeholder="CNPJ" name="cnpj" ng-model="novo.cnpj"></input>
        </div>
        <input id="id" class="btn btn-primary" type="submit" value="Salvar">
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, FornecedorFactory){
        scope.qtt = FornecedorFactory.list().length
        scope.novo = {}
        scope.create = function(fornecedor){
          if(scope.add_form.$valid){
            console.log("formulário válido")
            FornecedorFactory.create(scope.novo);
            scope.$emit('fornecedor:created', scope.novo)
            scope.novo = {}
          }
        }
        scope.$on('fornecedor:created', function(evt){
          scope.qtt = FornecedorFactory.list().length
        })
      }
    ]
  }
})

.directive('fornecedorUpdate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Editar fornecedor - {{fornecedor.nome}} </h3>
      <form name="edit_form" ng-submit="update(fornecedor)" novalidate>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="fornecedor.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" class="form-control" type="text" placeholder="Email" name="email" ng-model="fornecedor.email" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input id="telefone" class="form-control" type="text" placeholder="Telefone" name="telefone" ng-model="fornecedor.telefone" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="endereco">Endereço</label>
          <input id="endereco" class="form-control" type="text" placeholder="Endereço" name="endereco" ng-model="fornecedor.endereco" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="cnpj">CNPJ</label>
          <input id="cnpj" class="form-control" type="text" placeholder="CNPJ" name="cnpj" ng-model="fornecedor.cnpj" ng-required="true"></input>
        </div>
        <input id="id" class="btn btn-primary" type="submit" value="Salvar">
        <a class="btn btn-primary" href="#/fornecedores">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, location, routeParams, FornecedorFactory){
        id = routeParams.id
        scope.fornecedor = FornecedorFactory.read(id)
        scope.update = function(id, obj){
          if(scope.edit_form.$valid){
            FornecedorFactory.update(scope.fornecedor)
            location.path('/fornecedores')
          }
        }
      }
    ]
  }
})

.directive('fornecedorDelete', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Tem certeza que deseja excluir o fornecedor - {{fornecedor.nome}} ?</h3>
      <form name="delete_form" ng-submit="delete(fornecedor)" novalidate>
        <input class="btn btn-danger" type="submit" value="Excluir">
        <a class="btn btn-primary" href="#/fornecedores">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, location, routeParams, FornecedorFactory){
        id = routeParams.id
        scope.fornecedor = FornecedorFactory.read(id)
        scope.delete = function(obj){
          FornecedorFactory.delete(scope.fornecedor)
          location.path('/fornecedores')
        }
      }
    ]
  }
})

.directive('fornecedorList', function(){
  return {
    restrict: 'AE',
    template: `
      <h3 class="text-center center">Lista de Fornecedores</h3>
      <div ng-if='fornecedores.length > 0'>
        <div>
          <label>Filtrar: <input class="form-control" ng-model="filtro"></label>
        </div>
        <fornecedor ng-repeat='fornecedor in fornecedores | filter:filtro' obj='fornecedor'></fornecedor>
      </div>
      <div ng-if='fornecedores.length <= 0'>
        <h3>Nenhum fornecedor disponível</h3>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, FornecedorFactory){
        scope.fornecedores = FornecedorFactory.list()
        scope.$on('fornecedor:created', function(evt, fornecedor){
          scope.fornecedores = FornecedorFactory.list()
        })
      }
    ]
  }
})

.directive('fornecedor', function(){
  return {
    restrict: 'AE',
    scope: {fornecedor: '=obj'},
    template: `
      <div class='lista'>
        <h4 class='lista-title'>{{fornecedor.nome}}</h4>
        <p>CNPJ: {{fornecedor.cnpj}}</p>
        <p>Endereço: {{fornecedor.endereco}}</p>
        <p>Telefone: {{fornecedor.telefone}}</p>
        <p>Email: {{fornecedor.email}}</p>
        <div>
          <a class="btn btn-danger" href="#/fornecedor/{{fornecedor.id}}/delete">Deletar</a>
          <a class="btn btn-primary" href="#/fornecedor/{{fornecedor.id}}/update">Editar</a>
        </div>
      </div>
    `
  }
})

.factory('FornecedorFactory', 
  ['SaveFactory',
  function(SaveFactory){
    return {
      list: function(){
        return db.run("SELECT * FROM empresa");
      },
      create: function(obj){
        inserted = db.insert("empresa", 
          {
            nome: obj.nome, 
            email: obj.email, 
            telefone: obj.telefone, 
            endereco: obj.endereco, 
            cnpj: obj.cnpj,
          }
        );
        console.log(inserted);
      },
      read: function(id){
        return db.run("SELECT * FROM empresa WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        return db.update('empresa', {
          nome: obj.nome, 
          email: obj.email, 
          telefone: obj.telefone, 
          endereco: obj.endereco, 
          cnpj: obj.cnpj,
        }, {id: parseInt(id)});
      },
      delete: function(id){
        return db.run("DELETE FROM empresa WHERE id = ?", [parseInt(id)]);
      },
      products: function(id){
        return db.run("SELECT * FROM produto WHERE empresa_id = ?", [parseInt(id)]);
      }
    }
  }])