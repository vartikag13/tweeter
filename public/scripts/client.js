/* eslint-disable no-undef */
/* eslint-disable func-style */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  
  //LOAD TWEETS
  function loadTweets() {
    $.ajax({ url: 'http://localhost:8080/tweets',
      type: 'GET',
      context: document.body,
      success: function(data) {
        renderTweets(data);
      }
    });
  }

  loadTweets();


  //ERROR HANDLING
  const $error = $('#errorMsg');
  function errorHandler(message) {
    $error.text(message);
    $('#errorMsg').slideDown("slow", function() {

    });
  }

  const $submitButton = $('#submitBtn');
  const $form = $('.new-tweet form');

  //EVENT LISTENERS
  $submitButton.on('click', function(e) {
    e.preventDefault();
    postTweet();
  });

  $form.on('submit', function(e) {
    e.preventDefault();
    postTweet();
  });

  function postTweet() {
    const formData = $form.serialize();
    const tweetText = $('#tweet-text').val();

    if (tweetText === null || tweetText === '') {
      errorHandler('⚠ Please enter something to post it');
      return;
    }

    if (tweetText.length > 140) {
      errorHandler('⚠ Tweet exceeded the character limit');
      return;
    }

    try {
      $.ajax({ url: '/tweets',
        type: 'POST',
        data: formData,
        success: function(data) {
          $('#errorMsg').slideUp("slow", function() {
          });
          loadTweets();
          //Clear new tweet input and reset counter
          $('#tweet-text').val('');
          $('.counter').val(140);
        }
      });
    } catch (error) {
      errorHandler('⚠ Could not post the tweet');
    }

  }
  
  //RENDER TWEET DATA
  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    let renderedTweets = '';
    //sorting tweets based on creation date
    tweets.sort(function(a,b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    tweets.forEach(function(tweetItem) {
      renderedTweets = renderedTweets + createTweetElement(tweetItem);
    });
    console.log(renderedTweets);
    // takes return value and appends it to the tweets container
    $('.tweetDisplaySec').empty();
    $('.tweetDisplaySec').append(renderedTweets);
  };

  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  
  const createTweetElement = function(tweet) {

    let $tweet = `
      <article class="tweetDisplay">
      <header>
      <div id="user-details">
      <img src="${tweet.user.avatars ? `${tweet.user.avatars}` : '/public/images/icons8-frog-face-48.png'}" alt="${tweet.user.name}">   ${tweet.user.name}
			<span> ${tweet.user.handle} </span>
      </div>
      </header>
      <p>
        ${escape(tweet.content.text)}
      </p>
      <footer>
        <span id= "footer-time">${timeago.format(tweet.created_at)}</span>
        <div id= "footer-icons">
          <i class="fas fa-flag"></i> 
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
    `;

    return $tweet;
  };
  console.log("starting");
  $('#submitBtn').on("submit", postTweet);
  console.log("ended");
});