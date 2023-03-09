
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
          deleteRow(bookId);
      }
    
    });

    window.location = window.location;
    window.location.reload();

  }
