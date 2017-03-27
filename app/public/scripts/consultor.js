/**
 * nome - char required
 * email - char
 * telefone - char required
 * endereco - char required
 * cpf - char
 * comissao - real required
 */

angular.module('App')

.directive('consultorCreate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Há {{qtt}} consultores cadastrados </h3>
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
          <label for="email">Email</label>
          <input id="email" class="form-control" type="email" placeholder="Email" name="email" ng-model="novo.email" ng-required="false"></input>
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
          <label for="comissao">Comissão</label>
          <input id="comissao" class="form-control" integer type="text" placeholder="Comissão" name="comissao" ng-model="novo.comissao" ng-required="true"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ConsultorFactory',
      function(scope, ele, attrs, transclude, ConsultorFactory){
        scope.qtt = ConsultorFactory.list().length
        scope.novo = {}
        scope.create = function(consultor){
          // console.log(scope.novo)
          if(scope.add_form.$valid){
            ConsultorFactory.create(scope.novo);
            scope.$emit('consultor:created', scope.novo)
            scope.novo = {}
          }
        }
        scope.$on('consultor:created', function(evt){
          scope.qtt = ConsultorFactory.list().length
        })
      }
    ]
  }
})

.directive('consultorUpdate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Editar consultor - {{consultor.nome}} </h3>
      <form name="edit_form" ng-submit="update(consultor)" novalidate>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="consultor.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input id="telefone" class="form-control" type="text" placeholder="Telefone" name="telefone" ng-model="consultor.telefone" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" class="form-control" type="email" placeholder="Email" name="email" ng-model="consultor.email" ng-required="false"></input>
        </div>
        <div class="form-group">
          <label for="endereco">Endereço</label>
          <input id="endereco" class="form-control" type="text" placeholder="Endereço" name="endereco" ng-model="consultor.endereco" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="cpf">CPF</label>
          <input id="cpf" class="form-control" type="text" placeholder="CPF" name="cpf" ng-model="consultor.cpf" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="comissao">Comissão</label>
          <input id="comissao" class="form-control" integer type="text" placeholder="Comissão" name="comissao" ng-model="consultor.comissao" ng-required="true"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
        <a class="btn btn-danger" href="#/consultores">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ConsultorFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ConsultorFactory){
        id = routeParams.id
        scope.consultor = ConsultorFactory.read(id)
        scope.update = function(obj){
          if(scope.edit_form.$valid){
            ConsultorFactory.update(id, scope.consultor)
            location.path('/consultores')
          }
        }
      }
    ]
  }
})

.directive('consultorDelete', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Tem certeza que deseja excluir o consultor - {{consultor.nome}} ?</h3>
      <form name="delete_form" ng-submit="delete(consultor)" novalidate>
        <input class="btn btn-danger" type="submit" value="Excluir">
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ConsultorFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ConsultorFactory){
        id = routeParams.id
        scope.consultor = ConsultorFactory.read(id)
        scope.delete = function(obj){
          ConsultorFactory.delete(scope.consultor)
          location.path('/consultores')
        }
      }
    ]
  }
})

.directive('consultorList', function(){
  return {
    restrict: 'AE',
    template: `
      <h3 class="text-center center">Lista de Consultores</h3>
      <div ng-if='consultores.length > 0'>
        <div>
          <label>Filtrar: <input class="form-control" ng-model="filtro"></label>
        </div>
        <consultor ng-repeat='consultor in consultores | filter:filtro' obj='consultor'></consultor>
      </div>
      <div ng-if='consultores.length <= 0'>
        <h3>Nenhum consultor disponível</h3>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ConsultorFactory',
      function(scope, ele, attrs, transclude, ConsultorFactory){
        scope.consultores = ConsultorFactory.list()
        scope.$on('consultor:created', function(evt, consultor){
          scope.consultores = ConsultorFactory.list()
        })
      }
    ]
  }
})

.directive('consultor', function(){
  return {
    restrict: 'AE',
    scope: {consultor: '=obj'},
    template: `
      <div class='lista'>
        <h4 class='lista-title'>{{consultor.nome}}</h4>
        <p>Telefone: {{consultor.telefone}}</p>
        <p>Endereço: {{consultor.endereco}}</p>
        <p>Comissão: {{consultor.comissao}}</p>
        <div>
          <a class="btn btn-danger" href="#/consultor/{{consultor.id}}/remove">Deletar</a>
          <a class="btn btn-primary" href="#/consultor/{{consultor.id}}/edit">Editar</a>
        </div>
      </div>
    `
  }
})

.factory('ConsultorFactory', 
  ['SaveFactory',
  function(SaveFactory){
    return {
      list: function(){
        return db.run("SELECT * FROM vendedor");
      },
      create: function(obj){
        inserted = db.insert("vendedor", 
          {
            nome: obj.nome, 
            email: obj.email, 
            telefone: obj.telefone, 
            endereco: obj.endereco, 
            cpf: obj.cpf,
            comissao: obj.comissao
          }
        );
        console.log(inserted);
      },
      read: function(id){
        return db.run("SELECT * FROM vendedor WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        return db.update('vendedor', {
          nome: obj.nome, 
          email: obj.email, 
          telefone: obj.telefone, 
          endereco: obj.endereco, 
          cpf: obj.cpf,
          comissao: obj.comissao
        }, {id: parseInt(id)});
      },
      delete: function(id){
        return db.run("DELETE FROM vendedor WHERE id = ?", [parseInt(id)]);
      }
    }
  }])

.directive('integer', function(){
  return {
    link: function(scope, ele, attrs, c){
      scope.$watch(attrs.ngModel, function(a, b){
        if(a){
          // replace every no number for empty string
          a = a.replace(/[\D]/g, "")
          if(a && parseInt(a) < 0) a = ""
          if(a && parseInt(a) > 100) a = ""
          ele.val(a)          
        }
      })
    },
  }
})