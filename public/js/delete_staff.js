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
      success: function(result) {
        location.reload(true);
      }
    
    });

    location.reload(true);

  }