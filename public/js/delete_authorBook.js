function deleteAuthorBook(authorBookId) {
    let link = '/delete-author-book-ajax/';
    let data = {
      id: authorBookId
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

$("#author-book-table").on('click', '.delete', function(e) {
    let whichtr = $(this).closest("tr");

    whichtr.remove();   
});
