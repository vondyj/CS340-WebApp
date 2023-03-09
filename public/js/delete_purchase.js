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

    window.location = window.location;
    window.location.reload();

  }