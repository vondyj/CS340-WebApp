function deletePurchase(purchaseId) {
    let link = '/delete-purchase-ajax/';
    let data = {
      id: purchaseId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {

      }

    });


  }

$("#purchase-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      

});

// need to figure out how to update dropdown menu