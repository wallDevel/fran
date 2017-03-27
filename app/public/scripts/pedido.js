/**
 * empresa_id - integer required
 * data - date required
 * forma_pagamento - char required
 * forma_entrega - char required
 * quantidade_parcelas - int,
 * data_previsao_entrega - date
 */

angular.module('App')

.directive('pedidoCreate', function(){
  return {
    restrict: 'AE',
    template: `
    <h3>Há {{qtt}} pedidos cadastrados</h3>
    <form name="add_form" ng-submit="create(novo)" novalidate>
      <div class="form-group">
        <label for="data">Data</label>
        <input datepicker id="data" class="form-control" type="text" placeholder="Data" name="data" ng-model="novo.data" ng-required="true"></input>
      </div>
      <div class="form-group">
        <label for="fornecedor">Fornecedor</label>
        <select id="fornecedor" class="form-control" ng-options="fornecedor as fornecedor.nome for fornecedor in fornecedores track by fornecedor.id" ng-model="novo.fornecedor" ng-required="true"></select>
      </div>
      <div class="form-group" ng-if="novo.fornecedor">
        <label for="produto">Produtos</label>
        <select multiple="true" id="produto" class="form-control" ng-options="produto as produto.nome for produto in produtos track by produto.id" ng-model="novo.produtos" ng-required="true"></select>
      </div>
      <div class="form-group">
        <label for="forma_pagamento">Forma de Pagamento</label>
        <select id="forma_pagamento" class="form-control" ng-options="forma for forma in formas_pagamento" name="forma_pagamento" ng-model="novo.forma_pagamento" ng-required="true"></select>
      </div>
      <div class="form-group" ng-show="novo.forma_pagamento == formas_pagamento[1]">
        <label for="quantidade_parcelas">Parcelas</label>
        <input integer id="quantidade_parcelas" class="form-control" type="text" placeholder="Parcelas" name="quantidade_parcelas" ng-model="novo.quantidade_parcelas" ng-required="novo.forma_pagamento == formas_pagamento[1]"></input>
      </div>
      <div class="form-group" ng-show="novo.forma_pagamento == formas_pagamento[1]">
        <label for="vencimento_parcela">Vencimento primeira parcela</label>
        <input datepicker id="vencimento_parcela" class="form-control" type="text" placeholder="Vencimento da Primeira Parcela" name="vencimento_parcela" ng-model="novo.vencimento_parcela" ng-required="novo.forma_pagamento == formas_pagamento[1]"></input>
      </div>
      <input class="btn btn-primary" type="submit" value="Salvar">
    </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'PedidoFactory', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, PedidoFactory, FornecedorFactory){
        calcular_parcelas = function(){
          if(scope.novo.quantidade_parcelas && scope.novo.vencimento_parcela){
            scope.novo.vencimento_parcela = moment($('#vencimento_parcela').datepicker('getDate')).toString()
            vencimento_parcela = moment($('#vencimento_parcela').datepicker('getDate'))
            quantidade_parcelas = parseInt(scope.novo.quantidade_parcelas)
            scope.novo.parcelas = []
            for(var i=0; i<quantidade_parcelas; i++){
              v_t_add = angular.copy(vencimento_parcela)
              scope.novo.parcelas.push({
                parcela: i+1,
                vencimento: v_t_add.add(i, 'months').toString()
              })
            }
          }
        }

        scope.qtt = PedidoFactory.list().length
        scope.fornecedores = FornecedorFactory.list()
        scope.formas_pagamento = ['Dinheiro', 'Cartão']
        scope.novo = {}
        scope.create = function(pedido){
          if(scope.add_form.$valid){
            console.log("formulário válido")
            scope.novo.data = moment($('#data').datepicker('getDate')).toString()
            calcular_parcelas()
            // console.log(scope.novo)
            PedidoFactory.create(scope.novo);
            scope.$emit('pedido:created', scope.novo)
            scope.novo = {}
          }else{
            console.log("formulário inválido")
            // console.log(scope.novo)
          }
        }
        scope.$on('pedido:created', function(evt){
          scope.qtt = PedidoFactory.list().length
        })

        scope.$watch('novo.fornecedor', function(){
          if(scope.novo.fornecedor){
            produtos = FornecedorFactory.products(scope.novo.fornecedor)
            scope.produtos = produtos ? produtos : undefined
          }
        })

        // scope.$watch('novo.produtos', function(){
        //   if(scope.novo.produtos){
        //   }
        // })
      }
    ]
  }
})

.directive('pedidoUpdate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Editar pedido - {{pedido.nome}} </h3>
      <form name="edit_form" ng-submit="update(pedido)" novalidate>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="pedido.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input id="telefone" class="form-control" type="text" placeholder="Telefone" name="telefone" ng-model="pedido.telefone" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="endereco">Endereço</label>
          <input id="endereco" class="form-control" type="text" placeholder="Endereço" name="endereco" ng-model="pedido.endereco" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="cpf">CPF</label>
          <input id="cpf" class="form-control" type="text" placeholder="CPF" name="cpf" ng-model="pedido.cpf" ng-required="true"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
        <a class="btn btn-danger" href="#/pedidos">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'PedidoFactory',
      function(scope, ele, attrs, transclude, location, routeParams, PedidoFactory){
        id = routeParams.id
        scope.pedido = PedidoFactory.read(id)
        scope.update = function(obj){
          if(scope.edit_form.$valid){
            PedidoFactory.update(scope.pedido)
            location.path('/pedidos')
          }
        }
      }
    ]
  }
})

.directive('pedidoDelete', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Tem certeza que deseja excluir o pedido - {{pedido.nome}} ?</h3>
      <form name="delete_form" ng-submit="delete(pedido)" novalidate>
        <input class="btn btn-danger" type="submit" value="Excluir">
        <a class="btn btn-primary" href="#/pedidos">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'PedidoFactory',
      function(scope, ele, attrs, transclude, location, routeParams, PedidoFactory){
        id = routeParams.id
        scope.pedido = PedidoFactory.read(id)
        scope.delete = function(obj){
          PedidoFactory.delete(scope.pedido)
          location.path('/pedidos')
        }
      }
    ]
  }
})

.directive('pedidoList', function(){
  return {
    restrict: 'AE',
    template: `
      <h3 class="text-center center">Lista de Clientes</h3>
      <div ng-if='pedidos.length > 0'>
        <div>
          <label>Filtrar: <input class="form-control" ng-model="filtro"></label>
          <div ng-if="result"><span ng-bind='result.length'></span> <span>resultados encontrados.</span></div>
        </div>
        <pedido ng-repeat='pedido in pedidos | filter:filtro as result' obj='pedido'></pedido>

      </div>
      <div ng-if='pedidos.length <= 0'>
        <h3>Nenhum pedido disponível</h3>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'PedidoFactory',
      function(scope, ele, attrs, transclude, PedidoFactory){
        scope.pedidos = PedidoFactory.list()
        console.log(scope.pedidos)
        scope.$on('cliente:created', function(evt, cliente){
          scope.pedidos = PedidoFactory.list()
        })
      }
    ]
  }
})

.directive('pedido', function(){
  return {
    restrict: 'AE',
    scope: {pedido: '=obj'},
    template: `
      <div class='lista'>
        <h4 class='lista-title' ng-bind="pedido.data | date: 'dd/MM/yyyy'"></h4>
        <p>Fornecedor: {{pedido.fornecedor.nome}}</p>
        <p>Endereço: {{pedido.endereco}}</p>
        <p>CPF: {{pedido.cpf}}</p>
        <div>
          <a class="btn btn-danger" href="#/pedido/{{pedido.id}}/delete">Deletar</a>
          <a class="btn btn-primary" href="#/pedido/{{pedido.id}}/update">Editar</a>
        </div>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude',
      function(scope, ele, attrs, transclude){
        scope.pedido.data = new Date(scope.pedido.data);
        //console.log(scope.pedido)
      }
    ]
  }
})

.factory('PedidoFactory', 
  ['SaveFactory',
  function(SaveFactory){
    return {
      list: function(){
        return db.run("SELECT * FROM pedido");
      },
      create: function(obj){
        inserted = db.insert("pedido", 
          {
            empresa_id: obj.empresa_id, 
            data: obj.data, 
            forma_pagamento: obj.forma_pagamento, 
            forma_entrega: obj.forma_entrega, 
            quantidade_parcelas: obj.quantidade_parcelas,
            data_previsao_entrega: obj.data_previsao_entrega
          }
        );
        console.log(inserted);
      },
      read: function(id){
        return db.run("SELECT * FROM pedido WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        return db.update('pedido', {
          empresa_id: obj.empresa_id, 
          data: obj.data, 
          forma_pagamento: obj.forma_pagamento, 
          forma_entrega: obj.forma_entrega, 
          quantidade_parcelas: obj.quantidade_parcelas,
          data_previsao_entrega: obj.data_previsao_entrega
        }, {id: parseInt(id)});
      },
      delete: function(id){
        return db.run("DELETE FROM pedido WHERE id = ?", [parseInt(id)]);
      }
    }
  }])