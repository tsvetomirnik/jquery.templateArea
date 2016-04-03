(function ($) {
  'use strict';
  
  /**
   *  Placeholder helper class
   */
  var Placeholder = function (text) {
    this.name = text.replace(/{/g, '').replace(/}/g, '');
    this.getPreview = function () {
      return '{{' + this.name + '}}';
    };
  };

  var TemplateArea = function () {
    var
      $textArea = null,
      $previewArea = null,
      options = null,
      placehodersRegex = /\{\{([^}]+)\}\}/g,
      defaults = {
        previewClass: '',
        highlightInvalidPlaceholders: false,
        onlyDefined: true, // Wheather should use only the defined placeholders
        placeholders: []
      },
      
      /**
       *  Initilization
       */
      init = function (element, opt) {
        $textArea = $(element);
        initOptions(opt);
        build();
        bindEvents();
        initAutocomplete();
        
        // Trigger preview
        $textArea.trigger('blur');
      },

      /**
       *  Options initilization
       */
      initOptions = function (opt) {
        options = $.extend({}, defaults, opt || {});

        // Handle 'data-preview-class' attribute
        if (!options.previewClass) {
          options.previewClass = $textArea.attr('data-preview-class');
        }
      },

      /**
       *  Builds the markup
       */
      build = function () {
        var $wrapper = $(document.createElement('div'))
          .addClass('template-area');

        $textArea.wrap($wrapper);

        $previewArea = $(document.createElement('div'))
          .addClass('template-area-preview')
          .addClass(options.previewClass);

        $textArea.closest('.template-area')
          .append($previewArea);
      },

      /**
       *  Binds events
       */
      bindEvents = function () {
        // TODO: Provide "templateArea.clicked" event
        $textArea.on('blur', textAreaFocusOut);
        $previewArea.on('click', previewAreaClicked);
      },
      initAutocomplete = function () {
        if (!$.fn.textcomplete) {
          return;
        }

        $textArea.textcomplete([{
          // TODO: Improve the regex to macth all bracket cases
          match: /{([^}]*)$/, ///\B@(\w*)$/,
          search: function (term, callback) {
            callback($.map(options.placeholders, function (placeholder) {
              return placeholder.name.indexOf(term) === 0 ? placeholder.name : null;
            }));
          },
          index: 1,
          replace: function (mention) {
            var mentionNoBrackets = mention.replace(/{/g, '').replace(/}/g, '');
            return '{{' + mentionNoBrackets + '}}';
          },
          template: function (value, term) {
            // TODO: Improve the markup
            // TODO: Get the information from the option definitions
            return '<dl><dt>' + value + '</dt><dd>Description</dd></dl>';
          }
        }]);
      },

      /**
       *  Event handler when the text ares has been focused out
       */
      textAreaFocusOut = function () {
        $previewArea.empty();

        $.each(getChunks(), function (index, chunk) {
          var $chunk = $(document.createElement('span'));
          if (chunk.type === 'text') {
            $chunk.text(chunk.data);
          } else {
            $chunk.addClass('placeholder')
              .text(chunk.data);

            // Hightligh if it's not defined
            if (options.highlightInvalidPlaceholders) {
              if ($.map(options.placeholders, function (item) { return item.name; }).indexOf(chunk.data) === -1) {
                $chunk.addClass('invalid');
              }
            }
          }

          $previewArea.append($chunk);

          // Update size
          $previewArea.height($textArea.height());

          // Manage visibility
          $textArea.hide();
          $previewArea.show();
        });
      },
      
      /**
       *  Event handler for click on the preview area
       */
      previewAreaClicked = function () {
        $previewArea.hide();
        $textArea.show().focus();
      },

      /**
       *  Returns array with the placeholders from the content
       */
      getPlaceholders = function () {
        var placeholderStrings = $textArea.val().match(placehodersRegex),
          placeholders = [],
          validPlaceholderNames = [];
      
        // Remove placeholders brackets
        placeholders = $.map(placeholderStrings, function (item) {
          return new Placeholder(item);
        });

        if (options.onlyDefined) {
          validPlaceholderNames = $.map(options.placeholders, function (placeholder) {
            return placeholder.name;
          });

          placeholders = $.map(placeholders, function (placeholder) {
            if (validPlaceholderNames.indexOf(placeholder.name) !== -1) {
              return placeholder;
            }
          });
        }

        return placeholders;
      },

      /**
       *  Returns array with information about the content and placeholders
       */
      getChunks = function () {
        var templateText = $textArea.val(),
          textToProcess = templateText,
          templaceChunks = [];

        $.each(getPlaceholders(), function (index, placeholder) {
          var chunks = textToProcess.split(placeholder.getPreview());

          // Push the text from the left side
          if (chunks.length > 1 && chunks[0].length > 0) {
            templaceChunks.push({
              type: 'text',
              data: chunks[0]
            });
          }
          
          // Push the placeholder as chunk
          templaceChunks.push({
            type: 'placeholder',
            data: placeholder.name
          });
          
          // Set the chunks as processes
          var trimFrom = textToProcess.indexOf(placeholder.getPreview()) + (placeholder.getPreview()).length;
          textToProcess = textToProcess.substring(trimFrom, textToProcess.length);
        });
        
        // Add the remaining text to process as chunk
        if (textToProcess.length > 0) {
          templaceChunks.push({
            type: 'text',
            data: textToProcess
          });
        }

        return templaceChunks;
      };

    // Public
    return {
      init: init,
      getChunks: getChunks
    };
  };
  
  // Plugin declaration
  $.fn.extend({
    templateArea: function (options) {
      var templateArea = new TemplateArea();
      templateArea.init(this, options);
      $(this).data('templateArea', templateArea);
      return templateArea;
    }
  });

})(jQuery);