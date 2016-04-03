$(document).ready(function () {
  $('#template-area').templateArea({
    highlightInvalidPlaceholders: true,
    onlyDefined: false,
    placeholders: [
      { name: 'Name', description: 'Full name of the recipient' },
      { name: 'Location', description: 'Address of the recipient' }
    ]
  });
  
  $('#template-area2').templateArea({
    highlightInvalidPlaceholders: false,
    onlyDefined: false,
    placeholders: [
      { name: 'Name', description: 'Full name of the recipient' },
      { name: 'Location', description: 'Address of the recipient' }
    ]
  });
});