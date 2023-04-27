/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd"
//     },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ];

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

const renderTweets = function(tweets) {
  // loops through tweets
  for (let tweet of tweets.reverse()) {
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    const $oneTweet = createTweetElement(tweet);
    $("#tweet-section").append($oneTweet);
  }
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
  //saving the user-tweet from the form using jQuery
  const tweetTextArea = $("#tweet-text");
  const body = tweetTextArea.val();
  // Perform validation checks
  if (body === "") {
    alert("Please enter a tweet.");
    return;
  }

  if (body.length > 140) {
    alert("Tweet exceeds the character limit of 140.");
    return;
  }

  $.ajax({
    method: "POST",
    url: "http://localhost:8080/tweets",
    data: { text: body },
  }).then((res) => {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/tweets",
    }).then((res) => {
      const formattedResponse = formatResponse(res);
      const tweet = formattedResponse[formattedResponse.length - 1];
      const $oneTweet = createTweetElement(tweet);
      $("#tweet-section").prepend($oneTweet);
      resetForm();
    });
  });
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

};

const loadTweets = function() {
  $.ajax({
    method: "GET",
    url: "http://localhost:8080/tweets",
  }).then((res) => {
    //console.log("response:", timeago.format(res[0]["created_at"]));
    const formattedResponse = formatResponse(res);
    renderTweets(formattedResponse);
  });
};



$(document).ready(function() {

  loadTweets();

  $("form").on("submit", addTweet);

});