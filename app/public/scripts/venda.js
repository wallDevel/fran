angular.module('App')

/**
 * cliente_id - integer required
 * vendedor_id - integer required
 * data - date required
 * forma_pagamento - char required
 * forma_entrega - char required
 * quantidade_parcelas - int
 * desconto - real
 */

.factory('ProdutoFactory', 
  ['SaveFactory',
  function(SaveFactory){
    return {
      list: function(){
        return db.run("SELECT * FROM venda");
      },
      create: function(obj){
        inserted = db.insert("venda", 
          {
            cliente_id: obj.cliente_id, 
            vendedor_id: obj.vendedor_id, 
            data: obj.data, 
            forma_pagamento: obj.forma_pagamento, 
            forma_entrega: obj.forma_entrega, 
            quantidade_parcelas: obj.quantidade_parcelas,
            deconto: obj.desconto
          }
        );
        console.log(inserted);
      },
      read: function(id){
        return db.run("SELECT * FROM venda WHERE id = ?", [parseInt(id)])[0];
      },
      update: function(id, obj){
        return db.update('venda', {
            cliente_id: obj.cliente_id, 
            vendedor_id: obj.vendedor_id, 
            data: obj.data, 
            forma_pagamento: obj.forma_pagamento, 
            forma_entrega: obj.forma_entrega, 
            quantidade_parcelas: obj.quantidade_parcelas,
            deconto: obj.desconto
        }, {id: parseInt(id)});
      },
      delete: function(id){
        return db.run("SELECT * FROM venda WHERE id = ?", [parseInt(id)])[0];
      }
    }
  }])