function deleteStaff(staffId) {
    let link = '/delete-staff-ajax/';
    let data = {
      id: staffId
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

$("#staff-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      
});

// need to figure out how to update dropdown menu