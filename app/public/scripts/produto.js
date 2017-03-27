/**
 * empresa_id - integer required
 * nome - char required
 * codigo - char
 * preco_entrada - real required
 * preco_saida - real required
 * foto - char
 */

var fse = require('fs-extra')

angular.module('App')

.directive('produtoCreate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Há {{qtt}} produtos cadastrados </h3>
      <form name="add_form" ng-submit="create(novo)" novalidate>
        <image-d></image-d>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="novo.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="codigo">Código</label>
          <input id="codigo" class="form-control" type="text" placeholder="Código" name="codigo" ng-model="novo.codigo" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="fornecedor">Fornecedor</label>
          <select id="fornecedor" class="form-control" ng-options="fornecedor as fornecedor.nome for fornecedor in fornecedores track by fornecedor.id" ng-model="novo.fornecedor" ng-required="true"></select>
        </div>
        <div class="form-group">
          <label for="quantidade_estoque">Quantidade em Estoque</label>
          <input id="quantidade_estoque" class="form-control" integer type="text" placeholder="Quantidade em estoque" name="quantidade_estoque" ng-model="novo.quantidade_estoque" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="preco_custo">Preço de Custo</label>
          <input id="preco_custo" class="form-control" type="text" placeholder="Preço de Custo" name="preco_custo" ng-model="novo.preco_custo" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="preco_saida">Preço de Saída</label>
          <input id="preco_saida" class="form-control" type="text" placeholder="Preço Saída" name="preco_saida" ng-model="novo.preco_saida" ng-required="true"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ProdutoFactory', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, ProdutoFactory, FornecedorFactory){
        scope.qtt = ProdutoFactory.list().length
        scope.fornecedores = FornecedorFactory.list()
        scope.novo = {}
        scope.create = function(consultor){
          if(scope.add_form.$valid){
            console.log("Dados válidos")
            ProdutoFactory.create(scope.novo)
            scope.$emit('produto:created', scope.novo)
            scope.novo = {}
            // scope.$emit('image:clear')
          }else{
            console.log('form is not valid')
          }
        }
        scope.$on('produto:created', function(evt){
          scope.qtt = ProdutoFactory.list().length
        })
        scope.$on('image:set', function(evt, file, box){
          fse.copySync(file.path, 'app/public/images/'+file.name)
          scope.novo.image = 'public/images/'+file.name
        })
      }
    ]
  }
})

.directive('produtoUpdate', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Editar produto - {{produto.nome}} </h3>
      <form name="edit_form" ng-submit="update(produto)" novalidate>
        <image-d image="produto.image"></image-d>
        <div class="form-group">
          <label for="nome">Nome</label>
          <input id="nome" class="form-control" type="text" placeholder="Nome" name="nome" ng-model="produto.nome" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="codigo">Código</label>
          <input id="codigo" class="form-control" type="text" placeholder="Código" name="codigo" ng-model="produto.codigo" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="fornecedor">Fornecedor</label>
          <select id="fornecedor" class="form-control" ng-options="fornecedor as fornecedor.nome for fornecedor in fornecedores track by fornecedor.id" ng-model="produto.fornecedor" ng-required="true"></select>
        </div>
        <div class="form-group">
          <label for="quantidade_estoque">Quantidade em Estoque</label>
          <input id="quantidade_estoque" class="form-control" integer type="text" placeholder="Quantidade em estoque" name="quantidade_estoque" ng-model="produto.quantidade_estoque" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="preco_custo">Preço de Custo</label>
          <input id="preco_custo" class="form-control" type="text" placeholder="Preço de Custo" name="preco_custo" ng-model="produto.preco_custo" ng-required="true"></input>
        </div>
        <div class="form-group">
          <label for="preco_saida">Preço de Saída</label>
          <input id="preco_saida" class="form-control" type="text" placeholder="Preço Saída" name="preco_saida" ng-model="produto.preco_saida" ng-required="true"></input>
        </div>
        <input class="btn btn-primary" type="submit" value="Salvar">
        <a class="btn btn-danger" href="#/produtos">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ProdutoFactory', 'FornecedorFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ProdutoFactory, FornecedorFactory){
        id = routeParams.id
        scope.produto = ProdutoFactory.read(id)
        scope.fornecedores = FornecedorFactory.list()
        scope.update = function(obj){
          if(scope.edit_form.$valid){
            ProdutoFactory.update(scope.produto)
            location.path('/produtos')
          }
        }
        scope.$on('image:set', function(evt, file, box){
          fse.copySync(file.path, 'app/public/images/'+file.name)
          scope.produto.image = 'public/images/'+file.name
        })
      }
    ]
  }
})

.directive('produtoDelete', function(){
  return {
    restrict: 'AE',
    template: `
      <h3>Tem certeza que deseja excluir o produto - {{produto.nome}} ?</h3>
      <form name="delete_form" ng-submit="delete(produto)" novalidate>
        <input class="btn btn-danger" type="submit" value="Excluir">
        <a class="btn btn-danger" href="#/produtos">Cancelar</a>
      </form>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', '$location', '$routeParams', 'ProdutoFactory',
      function(scope, ele, attrs, transclude, location, routeParams, ProdutoFactory){
        id = routeParams.id
        scope.produto = ProdutoFactory.read(id)
        scope.delete = function(obj){
          ProdutoFactory.delete(scope.produto)
          location.path('/produtos')
        }
      }
    ]
  }
})

.directive('produtoList', function(){
  return {
    restrict: 'AE',
    template: `
      <h3 class="text-center center">Lista de Produtos</h3>
      <div ng-if='produtos.length > 0'>
        <div>
          <label>Filtrar: <input class="form-control" ng-model="filtro"></label>
        </div>
        <produto ng-repeat='produto in produtos | filter:filtro' obj='produto'></produto>
      </div>
      <div ng-if='produtos.length <= 0'>
        <h3>Nenhum produto disponível</h3>
      </div>
    `,
    controller: [
      '$scope', '$element', '$attrs', '$transclude', 'ProdutoFactory',
      function(scope, ele, attrs, transclude, ProdutoFactory){
        scope.produtos = ProdutoFactory.list()
        scope.$on('produto:created', function(evt, produto){
          scope.produtos = ProdutoFactory.list()
        })
      }
    ]
  }
})

.directive('produto', function(){
  return {
    restrict: 'AE',
    scope: {produto: '=obj'},
    template: `
      <div class='lista'>
        <h4 class='lista-title'>{{produto.nome}}</h4>
        <div class="row">
          <div class="col-md-3">
            <img ng-src="{{produto.image}}" width="100" />
          </div>
          <div class="col-md-9">
            <p>Código: {{produto.codigo}}</p>
            <p>Fornecedor: {{produto.fornecedor.nome}}</p>
            <p>Quantidade em Estoque: {{produto.quantidade_estoque}}</p>
            <p>Preço de Custo: {{produto.preco_custo}}</p>
            <p>Preço de Saída: {{produto.preco_saida}}</p>
          </div>
        </div>
        <div>
          <a class="btn btn-danger" href="#/produto/{{produto.id}}/delete">Deletar</a>
          <a class="btn btn-primary" href="#/produto/{{produto.id}}/update">Editar</a>
        </div>
      </div>
    `,
    // link: function(scope, ele, attrs){
    //   console.log(scope.produto)
    // }
  }
})

.directive('imageD', function(){
  return {
    restrict: 'AE',
    scope: {image: '=image'},
    template: `
      <div id="imageDragger">
        <h5>Arraste a imagem para cá</h5>
        <div>
          <img id="imageSelected" src=""></img>
        </div>
      </div>
    `,
    link: function(scope, ele, attrs){
      retfalse = function(){return false;}
      image_file = image_object = null
      image_drop = document.getElementById('imageDragger')
      image_object = document.getElementById('imageSelected') // element to contain image
      image_drop.ondragover = retfalse
      image_drop.ondragleave = retfalse
      image_drop.ondragend = retfalse
      image_drop.ondrop = function(e){
        e.preventDefault() // prevents default event
        image_file = e.dataTransfer.files[0]; // get the file being dropped
        // console.log(image_file.path) // shows the image path

        $(image_object).attr('src', image_file.path) // sets the src as path to file
        scope.$emit('image:set', image_file)
        // $(image_object).cropper({
        //   aspectRatio: 1/1,
        //   scalable: false,
        //   zoomable: false,
        //   crop: function(e){
        //     scope.$emit('crop:change', image_file, $(image_object).cropper('getCropBoxData'))
        //   }
        // })
      }
      if(scope.image){
        console.log(scope.image)
        $(image_object).attr('src', scope.image)
      }
      scope.$on('image:clear', function(evt){
        $(image_object).attr('src', "")
        image_file = image_object = null
      })
    }
  }
})

.factory('ProdutoFactory', 
  ['SaveFactory',
  function(SaveFactory){
    return {
      list: function(){
        return db.run("SELECT * FROM produto");
      },
      create: function(obj){
        inserted = db.insert("produto", 
          {
            empresa_id: obj.empresa_id, 
            nome: obj.nome, 
            codigo: obj.codigo, 
            preco_entrada: obj.preco_entrada, 
            preco_saida: obj.preco_saida,
            foto: obj.foto
          }
        );
        console.log(inserted);
      },
      read: function(id){
        return db.run("SELECT * FROM produto WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        return db.update('produto', {
          empresa_id: obj.empresa_id, 
          nome: obj.nome, 
          codigo: obj.codigo, 
          preco_entrada: obj.preco_entrada, 
          preco_saida: obj.preco_saida,
          foto: obj.foto
        }, {id: parseInt(id)});
      },
      delete: function(id){
        return db.run("SELECT * FROM produto WHERE id = ?", [parseInt(id)])[0];
      }
    }
  }])