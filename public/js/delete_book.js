function deleteBook(bookId) {
    let link = '/delete-book-ajax/';
    let data = {
      id: bookId
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

$("#book-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      
});

// need to figure out how to update dropdown menu