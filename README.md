#Template Area

Text area with capabilities to define templates

## Dependencies

- jquery (>= 1.7.0)
- jquery-textcomplete (>= 0.5.0)

## Features

- Autocomplete of placeholders
- Supports multiple use cases how to handle not defined placeholders
- Easy to add custom validation

## Usage

```javascript
	$('#my-textarea').templateArea({
		placeholders: [
		  { name: 'Name', description: 'Full name of the contact' },
		  { name: 'Location', description: 'Address of the contact' }
		]
	  });
```

## License

[MIT](https://github.com/tsvetomirnik/jquery.templateArea/blob/master/LICENSE)