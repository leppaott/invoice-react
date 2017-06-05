import * as React from 'react';
import { FormEvent } from 'react';

export class Item {
  constructor(public name: string, public price: string, private callback: () => void) {
    this.handleChange = this.handleChange.bind(this);
  }

  // unique key to disable a warning, use item index since no stable ID present
  getAsElement(uniqueKey: number): JSX.Element {
    return (
      <tr id="item" key={uniqueKey}><td>
        <input type="text" name="name" value={this.name} onChange={this.handleChange} /></td><td>
        <input type="text" name="price" value={this.price} onChange={this.handleChange} /></td>
      </tr>
    );
  }

  private handleChange(e: FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    const value = { [target.name]: target.value };
    value.name ? (this.name = value.name) : (this.price = value.price);
    this.callback();
  }
}