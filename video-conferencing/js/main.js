jQuery(document).ready(function( $ ) {

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Real view height for mobile devices
  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#intro').css({ height: $(window).height() });
  }

  // Initiate the wowjs animation library
  new WOW().init();

  // Initialize Venobox
  $('.venobox').venobox({
    bgcolor: '',
    overlayColor: 'rgba(6, 12, 34, 0.85)',
    closeBackground: '',
    closeColor: '#fff'
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Gallery carousel (uses the Owl Carousel library)
  $(".gallery-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    center:true,
    responsive: { 0: { items: 1 }, 768: { items: 3 }, 992: { items: 4 }, 1200: {items: 5}
    }
  });

  // Buy tickets select the ticket type on click
  $('#buy-ticket-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var ticketType = button.data('ticket-type');
    var modal = $(this);
    modal.find('#ticket-type').val(ticketType);
  })

// custom code
var config = {
        // via: https://github.com/muaz-khan/WebRTC-Experiment/tree/master/socketio-over-nodejs
        openSocket: function(config) {
            var SIGNALING_SERVER = 'https://socketio-over-nodejs2.herokuapp.com:443/';
            config.channel = config.channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
            var sender = Math.round(Math.random() * 999999999) + 999999999;
            io.connect(SIGNALING_SERVER).emit('new-channel', {
                channel: config.channel,
                sender: sender
            });
            var socket = io.connect(SIGNALING_SERVER + config.channel);
            socket.channel = config.channel;
            socket.on('connect', function () {
                if (config.callback) config.callback(socket);
            });
            socket.send = function (message) {
                socket.emit('message', {
                    sender: sender,
                    data: message
                });
            };
            socket.on('message', config.onmessage);
        },
        onRemoteStream: function(media) {
            var mediaElement = getMediaElement(media.video, {
                width: (childContainer.clientWidth / 3.5),
                buttons: ['mute-audio', 'mute-video', 'full-screen']
            });
            mediaElement.id = media.stream.streamid;
            childContainer.appendChild(mediaElement);
        },
        onRemoteStreamEnded: function(stream, video) {
            if (video.parentNode && video.parentNode.parentNode && video.parentNode.parentNode.parentNode) {
                video.parentNode.parentNode.parentNode.removeChild(video.parentNode.parentNode);
            }
        },
        onRoomFound: function(room) {
            var alreadyExist = document.querySelector('button[data-broadcaster="' + room.broadcaster + '"]');
            if (alreadyExist) return;
            if (typeof roomsList === 'undefined') roomsList = document.body;
            var tr = document.createElement('tr');
            tr.innerHTML = '<td><strong>' + room.roomName + '</strong> shared a conferencing room with you!</td>' +
                '<td><button class="join">Join</button></td>';
            tr.style.display = "None";
            roomsList.appendChild(tr);
            var joinRoomButton = tr.querySelector('.join');
            joinRoomButton.setAttribute('data-bc'+room.roomName,room.broadcaster);
            joinRoomButton.setAttribute('data-tk'+room.roomName,room.roomToken);
            joinRoomButton.setAttribute('id', 'leru'+room.roomName);
            joinRoomButton.setAttribute('data-broadcaster', room.broadcaster);
            joinRoomButton.setAttribute('data-roomToken', room.roomToken);
            document.getElementById("join-old-room").onclick = function() {
                document.getElementById('roomgan').hidden = false;
                document.getElementById('videogan').hidden = false;
                document.getElementById('intro').style.display = 'none';
                document.getElementById('namaroom').innerHTML = 'ROOM '+document.getElementById('conference-name-join').value;
                $('#joinModal').modal('hide');
                this.disabled = true;
                var roomName = (document.getElementById('conference-name-join') || { }).value;
                var broadcaster = document.getElementById('leru'+roomName).getAttribute('data-bc'+roomName);
                var roomToken = document.getElementById('leru'+roomName).getAttribute('data-tk'+roomName);
                captureUserMedia(function() {
                    conferenceUI.joinRoom({
                        roomToken: roomToken,
                        joinUser: broadcaster
                    });
                }, function() {
                    joinRoomButton.disabled = false;
                });
            };
        },
        onRoomClosed: function(room) {
            var joinButton = document.querySelector('button[data-roomToken="' + room.roomToken + '"]');
            if (joinButton) {
                // joinButton.parentNode === <li>
                // joinButton.parentNode.parentNode === <td>
                // joinButton.parentNode.parentNode.parentNode === <tr>
                // joinButton.parentNode.parentNode.parentNode.parentNode === <table>
                joinButton.parentNode.parentNode.parentNode.parentNode.removeChild(joinButton.parentNode.parentNode.parentNode);
            }
        },
        onReady: function() {
            console.log('now you can open or join rooms');
        }
    };
    function setupNewRoomButtonClickHandler() {
        document.getElementById('roomgan').hidden = false;
        document.getElementById('videogan').hidden = false;   
        document.getElementById('intro').style.display = 'none';
        document.getElementById('namaroom').innerHTML = 'ROOM '+document.getElementById('conference-name').value;
        $('#createModal').modal('hide');
        btnSetupNewRoom.disabled = true;
        document.getElementById('conference-name').disabled = true;
        captureUserMedia(function() {
            conferenceUI.createRoom({
                roomName: (document.getElementById('conference-name') || { }).value || 'Anonymous'
            });
        }, function() {
            btnSetupNewRoom.disabled = document.getElementById('conference-name').disabled = false;
        });
    }
    function captureUserMedia(callback, failure_callback) {
        var video = document.createElement('video');
        video.muted = true;
        video.volume = 0;
        try {
            video.setAttributeNode(document.createAttribute('autoplay'));
            video.setAttributeNode(document.createAttribute('playsinline'));
            video.setAttributeNode(document.createAttribute('controls'));
        } catch (e) {
            video.setAttribute('autoplay', true);
            video.setAttribute('playsinline', true);
            video.setAttribute('controls', true);
        }
        getUserMedia({
            video: video,
            onsuccess: function(stream) {
                config.attachStream = stream;
                // var mediaElement = getMediaElement(video, {
                //     width: (videosContainer.clientWidth / 2) - 50,
                //     buttons: ['mute-audio', 'mute-video', 'full-screen', 'volume-slider']
                // });
                var mediaElement = getMediaElement(video, {
                    width: (videosContainer.clientWidth/1.05),
                    buttons: ['mute-audio', 'mute-video', 'full-screen']
                });
                mediaElement.toggle('mute-audio');
                videosContainer.appendChild(mediaElement);
                callback && callback();
            },
            onerror: function() {
                alert('unable to get access to your webcam');
                callback && callback();
            }
        });
    }
    var conferenceUI = conference(config);
    /* UI specific */
    var videosContainer = document.getElementById('videos-container') || document.body;
    var childContainer = document.getElementById('child-container') || document.body;
    var btnSetupNewRoom = document.getElementById('setup-new-room');
    var btnJoinOldRoom = document.getElementById('join-old-room');
    var roomsList = document.getElementById('rooms-list');
    if (btnSetupNewRoom) btnSetupNewRoom.onclick = setupNewRoomButtonClickHandler;
    
    function rotateVideo(video) {
        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
        setTimeout(function() {
            video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
        }, 1000);
    }
    function scaleVideos() {
        var videos = document.querySelectorAll('video'),
            length = videos.length, video;
        var minus = 130;
        var windowHeight = 700;
        var windowWidth = 600;
        var windowAspectRatio = windowWidth / windowHeight;
        var videoAspectRatio = 4 / 3;
        var blockAspectRatio;
        var tempVideoWidth = 0;
        var maxVideoWidth = 0;
        for (var i = length; i > 0; i--) {
            blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
            if (blockAspectRatio <= windowAspectRatio) {
                tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
            } else {
                tempVideoWidth = windowWidth / i;
            }
            if (tempVideoWidth > maxVideoWidth)
                maxVideoWidth = tempVideoWidth;
        }
        for (var i = 0; i < length; i++) {
            video = videos[i];
            if (video)
                video.width = maxVideoWidth - minus;
        }
    }
    window.onresize = scaleVideos;

});
