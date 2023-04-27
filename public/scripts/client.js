/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// function createTweetElementKindaBad(tweetData) {
//   //destructuring the tweetdata
//   const {
//     user: { name, avatars, handle },
//     content: { text },
//     created_at
//   } = tweetData;
//   //
//   return $(`<article>
//   <header>
//     <div class="name-img">
//       <img class="profile-img" src=${avatars}>
//       <div class="name">${name}</div>
//     </div>

//     <div class="handle">${handle}</div>
//   </header>


//   <p class="my-tweet">${text}</p>

//   <footer>
//     <div class="time">${created_at}</div>
//     <div class="icons">
//       <i class="fa-solid fa-flag fa-xs flag"></i>
//       <i class="fa-solid fa-retweet fa-xs retweet"></i>
//       <i class="fa-solid fa-heart fa-xs heart"></i>
//     </div>
//   </footer>

// </article>`);
// }


// loops through tweets
// calls createTweetElement for each tweet
// takes return value and appends it to the tweets container
const renderTweets = function(tweets) {
  for (let tweet of tweets.reverse()) {
    const $oneTweet = createTweetElement(tweet);
    $("#tweet-section").append($oneTweet);
  }
};

const createErrorElement = function(errorMessage) {
  const $tweetErrorDiv = $("<div>").attr("id", "tweet-Error").text(errorMessage);
  return $tweetErrorDiv;
};

const createTweetElement = function(tweetData) {
  //destructuring the tweetdata
  const {
    user: { name, avatars, handle },
    content: { text },
    created_at
  } = tweetData;
  //create article tags with classes instead of using template literals
  const $article = $("<article>").addClass("tweet box");
  const $header = $("<header>");
  const $nameImg = $("<div>").addClass("name-img");
  const $profileImg = $("<img>").addClass("profile-img").attr("src", avatars);
  const $name = $("<div>").addClass("name").text(name);
  const $handle = $("<div>").addClass("handle").text(handle);
  const $content = $("<p>").addClass("my-tweet").text(text);
  const $footer = $("<footer>");
  const $time = $("<div>").addClass("time").text(created_at);
  const $icons = $("<div>").addClass("icons");
  const $flagIcon = $("<i>").addClass("fa-solid fa-flag fa-xs flag");
  const $retweetIcon = $("<i>").addClass("fa-solid fa-retweet fa-xs retweet");
  const $heartIcon = $("<i>").addClass("fa-solid fa-heart fa-xs heart");

  //Build the tree structure
  $nameImg.append($profileImg, $name);
  $header.append($nameImg, $handle);
  $icons.append($flagIcon, $retweetIcon, $heartIcon);
  $footer.append($time, $icons);
  $article.append($header, $content, $footer);

  return $article;
};

//event handler function for submit button
const addTweet = function(event) {
  //prevents from reloading the page
  event.preventDefault();
  //Slide out the Error message 
  $("#errors").slideUp("fast");
  $("#errors").hide();

  //saving the user-tweet from the form using jQuery
  const tweetTextArea = $("#tweet-text");
  const body = tweetTextArea.val();
  // Perform validation checks
  //Check whether the tweet empty
  let flag = false;
  let errorMessages = "";
  if (body === "") {
    errorMessages += "Error! Empty Tweet. Please write something";
    flag = true;
  }
  //check whether the tweet size has gone beyond 140 characters
  if (body.length > 140) {
    errorMessages += "\n Error! Tweet exceeds 140 characters limit";
    flag = true;
  }

  if (flag) {
    $error = createErrorElement(errorMessages);
    $("#errors").append($error);
    $("#errors").slideDown("slow");
    $("#errors").show();
    return;
  }
  $.ajax({
    method: "POST",
    url: "http://localhost:8080/tweets",
    data: { text: body },
  }).then(() => { loadTweets(); });
  // .then($(".new-tweet").trigger("reset"));
  resetForm();
};

const formatResponse = function(response) {
  response.forEach((tweet) => {
    tweet.created_at = timeago.format(tweet.created_at);
  });
  return response;
};

const resetForm = function() {
  //  remove text from  const tweetTextArea = $("#tweet-text");
  $("#tweet-text").val("");
  $("#tweet-text").trigger("input");
  // $("#counterError").hide();
  // $("#tweetError").hide();

};

const loadTweets = function() {
  $.ajax({
    method: "GET",
    url: "http://localhost:8080/tweets",
  }).then((res) => {
    $("#tweet-section").empty();
    const formattedResponse = formatResponse(res);
    renderTweets(formattedResponse);
  });
};


$(document).ready(function() {
  loadTweets();
  $("form").on("submit", addTweet);

});