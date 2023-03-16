function deletePurchaseBookDetail(purchaseBookDetailId) {
    let link = '/delete-purchase-book-detail-ajax/';
    let data = {
      id: purchaseBookDetailId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: (result) => {

      }
    
    });


  }

$("#purchase-book-detail-table").on('click', '.delete', function(e) {
    let whichtr = $(this).closest("tr");

    whichtr.remove();   
});