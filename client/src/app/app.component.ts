import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import "downloadjs";
import * as download from 'downloadjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  exampleItems = [];
  newItems = [];

  async selectAll() {
    try {
      console.log(environment.readAll);
      console.log('calling read all endpoint');

      this.exampleItems = [];
      const output = await fetch(environment.readAll);
      const outputJSON = await output.json();
      this.exampleItems = outputJSON;
      console.log('Success');
      console.log(outputJSON);
    } catch (error) {
      console.log(error);
    }
  }

  async saveItem(item: any) {
    try {
      console.log(environment.create);
      console.log('calling create item endpoint with: ' + item.item);

      const requestBody = {
        id: item.id,
        item: item.item,
        price: item.price,
        quantity: item.quantity
      };

      const createResponse =
        await fetch(environment.create, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(async res => {
          if(!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }
          else {
            return res;
          }   
        });      
  
      console.log(createResponse.status);
      
      for (var i = 0; i < this.newItems.length; i++){
        if (this.newItems[i].id == item.id){
          this.newItems.splice(i, 1);
        }
      }

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async updateItem(item: any) {
    try {
      console.log(environment.update);
      console.log('calling update endpoint with id ' + item.id + ' and value "' + item.item);

      const requestBody = {
        item: item.item,
        price: item.price,
        quantity: item.quantity
      };

      const updateResponse =
        await fetch(environment.update + item.id, {
          method: 'PUT',
          body: JSON.stringify(requestBody),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(async res => {
          if(!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }
          else {
            return res;
          }   
        });

      console.log(updateResponse.status);
      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async deleteItem(item: any) {
    try {
      console.log(environment.delete);
      console.log('calling delete endpoint with id ' + item.id);

      const deleteResponse =
        await fetch(environment.delete + item.id, {
          method: 'DELETE',
          headers:{
            'Content-Type': 'application/json'
          }
        });

      console.log(deleteResponse.status);

      // call select all to update the table
      this.selectAll();
    } catch (error) {
      console.log(error);
    }
  }

  createItem() {
    this.newItems.push({
      id: '',
      item: '',
      price: '',
      quantity: '',
      save: true
    });
  }

  async downloadCSV() {
    try {
      console.log(environment.export);
      const downloadLink = document.createElement("a");
      downloadLink.href = environment.export;
      downloadLink.download = "inventory.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.log(error);
    }
  }
}


