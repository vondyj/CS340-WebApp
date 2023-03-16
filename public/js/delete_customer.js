function deleteCustomer(customerId) {
    let link = '/delete-customer-ajax/';
    let data = {
      id: customerId
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
  
$("#customer-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      
});

// need to figure out how to update dropdown menu