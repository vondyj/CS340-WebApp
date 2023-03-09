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
      success: (result) => {
          deleteRow(customerId);
      }
    
    });

    window.location = window.location;
    window.location.reload();

  }