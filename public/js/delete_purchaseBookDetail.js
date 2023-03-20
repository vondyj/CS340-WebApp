/*
  Overall structure - adapted
    Oregon State University, CS340: Introduction to Databases - 'nodejs-starter-app'
    George Kochera, Cortona1, Michael Curry, dmgs11 (2/28/23 - 3/19/23 )
    https://github.com/osu-cs340-ecampus/nodejs-starter-app
  
*/

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