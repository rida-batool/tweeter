$(document).ready(function() {
  // --- our code goes here ---

  $('#tweet-text').on('input', function() {
    const maxLength = 140;
    const myValue = $(this).val().length;
    const charactersLeft = maxLength - myValue;
    //traverse up the DOM tree to parent from text-area
    const formParent = $(this).parent();
    const formCounter = formParent.find(".counter");
    formCounter.val(charactersLeft);
    if (charactersLeft < 0) {
      formCounter.addClass("redcolor");
    }
    else {
      formCounter.removeClass("redcolor");
    }

  });

});