'use strict';
    
    $('#<%= book.etag %>').click(showForm);
    function showForm(){
      $('#<%= book.id %>').show() ;
      $('.div').hide();
    }