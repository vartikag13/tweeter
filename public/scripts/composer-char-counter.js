/* eslint-disable no-undef */
$(document).ready(function() {
  $("#tweet-text").on('keyup', function() {
    let totalChar = 140;
    let remainingChar = totalChar - this.value.length;

    //update counter value
    $(this).parent().find('.counter').val(remainingChar);

    //error handling
    if (remainingChar < 0) {
      $(this).parent().find('.counter').css('color', 'rgb(146, 37, 37)');
    } else {
      $(this).parent().find('.counter').css('color', '#545149');
    }

  });

});