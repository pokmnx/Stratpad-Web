In avangate, we maintain a bunch of resources in the setup -> media center.

In particular, script.js and style.css are used by our stratpad template, which is used for affiliate signup, checkout, etc.

You can edit these two files and upload them into the media center, then look at a result like this:

https://secure.avangate.com/order/checkout.php?PRODS=4615539&QTY=1&LANG=en&ORDERSTYLE=nLXO5ZTfhH4%3D

You may need to specify the external files again (after updating) on the interface templates page. 

Or you can make quick edits in the text boxes which will override these two files.

NB. staging vs production product ids in the URL params will invoke either sandbox or production on avangate, respectively.

NNB. We also do some styling in the inline js on the template page:

eg. function affiliates_fixes(){
    if (sPage=='sign-up.php'){
      $('#signup-button').parent().prev().remove();
      $('#signup-button').parent().attr('colspan','2');
      $('#signup-form-wrap h2:first').text('Tell us about yourself');
      $('table.table-form:first').attr('style','margin-top:15px');
      $('table.table-form').css('width','100%');
      $('.table-form:last').find('input').css('marginRight', '10px');
      $('#login_password').after("<br>");      
      $('#login-form p:first').css('paddingBottom','20px'); 
      
      // get rid of white space at top of page
      document.body.removeChild(document.body.childNodes[0]);
    }
  }


avangate.js holds some of this inline js