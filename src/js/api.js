export default class API {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
  }

  load() {
    return fetch(this.url);
  }

  add(TicketFull) {
    // this.url = http://localhost:7075/TicketFull
    return fetch(this.url, {
      body: JSON.stringify(TicketFull),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  edit(TicketFull) {
    return fetch(`${this.url}/${TicketFull.id}`, {
      body: JSON.stringify(TicketFull),
      method: 'PUT',
      headers: this.contentTypeHeader,
    });
  }

  editStatus(TicketFull) {
    console.info(`kek --- ${TicketFull}`);
    return fetch(`${this.url}/${TicketFull.id}`, {
      body: JSON.stringify(TicketFull),
      method: 'PUT',
      headers: this.contentTypeHeader,
    });
  }

  remove(id) {
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    });
  }
}
