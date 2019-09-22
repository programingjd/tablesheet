# Table sheet element.

## Usage

1. Load the es6 module.

    HTML:
    ```html
    <script type="module" src="tablesheet.mjs"/>
    ```
 
    JAVASCRIPT:
    ```javascript 1.7
    (async()=>{
      const { formats } = await import('./tablesheet.mjs');
    })();
    ```

2. Add the element to the DOM.

    HTML:
    ```html
    <table-sheet></table-sheet>
    ```
    JAVASCRIPT:
    ```javascript 1.7
    const element = document.createElement('table-sheet');
    parent.appendChild(element);
    ```
    
3. Set up the data.

    JAVASCRIPT:
    
    Specify the columns and data.
    
    ```javascript 1.7
    element.data=[
      {
         name: 'Name 1',
         date: '2019-09-20',
         number: 1,
         value: 2.25
      },
      {
         name: 'Name 2',
         date: '2019-09-21',
         number: 2,
         value: 1.5
      },
      {
         name: 'Name 3',
         date: '2019-09-22',
         number: 3,
         value: 0.1
      }
    ];
    element.columns=[
      {
         key: 'name',
         name: 'Name',
         editable: false,
         format: formats.capitalize(),
         align: 'center'
      },
      {
         key: 'number',
         name: '#',
         editable: true,
         format: formats.integer(),
         align: 'right'
      },
      {
         key: 'date',
         name: 'Date',
         editable: true,
         format: formats.date(),
         align: 'center'
      },
      {
         key: 'value',
         name: 'Value',
         editable: true,
         format: formats.float(2),
         align: 'right'
      }
    ];
    ```
    
## Examples

1. [Example 1](example1.html)

