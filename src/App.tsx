import * as React from 'react';
import { Component, FormEvent } from 'react';
import { Invoice } from './Invoice';
import { Item } from './Item';
import jsPDF = require('jspdf');
import './styles.css';
import ReactDOMServer = require('react-dom/server');

class App extends Component<{}, Invoice> {
  private items: Array<Item> = [];

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewItem = this.handleNewItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);

    this.items.push(new Item('', '', this.handleItemChange));
  }

  handleChange(e: FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    this.setState({ ...this.state, [target.name]: target.value });
  }

  handleSubmit(e: FormEvent<HTMLInputElement>) {
    let pdf: jsPDF = new jsPDF();
    // todo
    pdf.fromHTML(ReactDOMServer.renderToStaticMarkup(<App />), 30, 30);
    pdf.save('invoice.pdf');
  }

  handleNewItem(e: FormEvent<HTMLInputElement>) {
    this.items.push(new Item('', '', this.handleItemChange));
    this.forceUpdate();
  }

  handleDelete(e: FormEvent<HTMLInputElement>) {
    if (this.items.length > 1) {
      this.items.pop();
      this.forceUpdate();
    }
  }

  // easier with redux?
  handleItemChange() {
    this.forceUpdate();
  }

  getItems(): Array<JSX.Element> {
    return this.items.reduce((arr, cur, index) => {
      arr.push(cur.getAsElement(index));
      return arr;
    }, new Array<JSX.Element>());
  }

  getTotal(): string {
    return this.items.reduce((total, cur) => {
      return total + Number(cur.price);
    }, 0).toString();
  }

  render() {
    return (
      <div id="form">
        <table><tbody>
          <tr>
            <td>
              <input type="text" name="name" onChange={this.handleChange} /><br />
              <input type="text" name="street" onChange={this.handleChange} /><br />
              <input type="text" name="city" onChange={this.handleChange} />,
                  <input type="text" name="postcode" onChange={this.handleChange} />
            </td>
            <td>
              Invoice Number: {' '}
              <input type="text" name="invoiceNumber" onChange={this.handleChange} /><br />
              Invoice Date: {' '}
              <input type="text" name="invoiceDate" onChange={this.handleChange} /><br />
              Due Date: {' '}
              <input type="text" name="dueDate" onChange={this.handleChange} /><br />
            </td>
          </tr>
          <tr id="title">
            <td>Item</td>
            <td>Price</td>
          </tr>
          {this.getItems()}
          <tr>
            <td />
            <td>Total: {this.getTotal()}€</td>
          </tr>
          <tr>
            <td>
              <input type="submit" value="New Item" onClick={this.handleNewItem} />
              <input type="submit" value="Remove Last" onClick={this.handleDelete} />
            </td>
            <td>
              <input type="submit" value="Get PDF" onClick={this.handleSubmit} />
            </td>
          </tr>
        </tbody></table>
      </div>
    );
  }
}

export default App;