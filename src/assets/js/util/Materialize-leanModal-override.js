/** Slight override of Materialize's leanModal.js component library, with the aim of returning
* the event causing the modal to close to any complete() function provided in the options.
* This again in order to enable the callback to determine what triggered the close event,
* e.g. did the user click OK or cancel?
*
* Most of the code is a straight copy from the main Materialize library, with only slight
* modifications. Pulling this excerpt out into separate file to keep main library intact.
* Load this file after the main Materialize library to put the override into effect.
* 
* The original Materialize authors retain all rights to their work, including most of this file,
* and are welcome to incorporate the minor adjustments made free of charge, should they so choose.
*
* Auhor: Ulrik H. Gade, May 2016
*/

(function($) {
    var _stack = 0,
    _lastID = 0,
    _generateID = function() {
      _lastID++;
      return 'materialize-lean-overlay-' + _lastID;
    };

  $.fn.extend({
    openModal: function(options) {

      $('body').css('overflow', 'hidden');

      var defaults = {
        opacity: 0.5,
        in_duration: 350,
        out_duration: 250,
        ready: undefined,
        complete: undefined,
        dismissible: true,
        starting_top: '4%'
      },
      overlayID = _generateID(),
      $modal = $(this),
      $overlay = $('<div class="lean-overlay"></div>'),
      lStack = (++_stack);

      // Store a reference of the overlay
      $overlay.attr('id', overlayID).css('z-index', 1000 + lStack * 2);
      $modal.data('overlay-id', overlayID).css('z-index', 1000 + lStack * 2 + 1);

      $('body').append($overlay);

      // Override defaults
      options = $.extend(defaults, options);

      if (options.dismissible) {
        $overlay.click(function() {
          $modal.closeModal(options);
        });
        // Return on ESC
        $(document).on('keyup.leanModal' + overlayID, function(e) {
          if (e.keyCode === 27) {   // ESC key
            $modal.closeModal(options);
          }
        });
      }

      $modal.find('.modal-close').on('click.close', function(e) {
        options.e = e;
        $modal.closeModal(options);
      });

      $overlay.css({ display : 'block', opacity : 0 });

      $modal.css({
        display : 'block',
        opacity: 0
      });

      $overlay.velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: 'easeOutCubic'});
      $modal.data('associated-overlay', $overlay[0]);

      // Define Bottom Sheet animation
      if ($modal.hasClass('bottom-sheet')) {
        $modal.velocity({bottom: '0', opacity: 1}, {
          duration: options.in_duration,
          queue: false,
          ease: 'easeOutCubic',
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === 'function') {
              options.ready();
            }
          }
        });
      }
      else {
        $.Velocity.hook($modal, 'scaleX', 0.7);
        $modal.css({ top: options.starting_top });
        $modal.velocity({top: '10%', opacity: 1, scaleX: '1'}, {
          duration: options.in_duration,
          queue: false,
          ease: 'easeOutCubic',
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === 'function') {
              options.ready();
            }
          }
        });
      }
    }
  });

  $.fn.extend({
    closeModal: function(options) {
      
      var defaults = {
        out_duration: 250,
        complete: undefined
      },
      $modal = $(this),
      overlayID = $modal.data('overlay-id'),
      $overlay = $('#' + overlayID);

      options = $.extend(defaults, options);

      // Disable scrolling
      $('body').css('overflow', '');

      $modal.find('.modal-close').off('click.close');
      $(document).off('keyup.leanModal' + overlayID);

      $overlay.velocity( { opacity: 0}, {duration: options.out_duration, queue: false, ease: 'easeOutQuart'});


      // Define Bottom Sheet animation
      if ($modal.hasClass('bottom-sheet')) {
        $modal.velocity({bottom: '-100%', opacity: 0}, {
          duration: options.out_duration,
          queue: false,
          ease: 'easeOutCubic',
          // Handle modal ready callback
          
          complete: function(options) {
            
            $overlay.css({display:'none'});

            // Call complete callback
            if (typeof(options.complete) === 'function') {
              options.complete(options.e);
            }
            $overlay.remove();
            _stack--;
          }
        });
      }
      else {
        $modal.velocity(
          { top: options.starting_top, opacity: 0, scaleX: 0.7}, {
          duration: options.out_duration,
          complete:
            function() {

              $(this).css('display', 'none');
              // Call complete callback
              if (typeof(options.complete) === 'function') {
                options.complete(options.e);
              }
              $overlay.remove();
              _stack--;
            }
          }
        );
      }
    }
  });

  $.fn.extend({
    leanModal: function(option) {
      return this.each(function() {

        var defaults = {
          starting_top: '4%'
        },
        // Override defaults
        options = $.extend(defaults, option);

        // Close Handlers
        $(this).click(function(e) {
          options.starting_top = ($(this).offset().top - $(window).scrollTop()) /1.15;
          var modal_id = $(this).attr('href') || '#' + $(this).data('target');
          $(modal_id).openModal(options);
          e.preventDefault();
        }); // done set on click
      }); // done return
    }
  });
})(jQuery);
