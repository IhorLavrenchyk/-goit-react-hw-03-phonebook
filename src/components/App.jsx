import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';
import css from '../components/App.module.css';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      console.log('changed contacts');
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;

    const isInContacts = contacts.find(
      contact => name.toLowerCase() === contact.name.toLowerCase()
    );
    if (isInContacts) {
      toast.info(`${name} is already in contacts.`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(({ contacts }) => ({
      contacts: [newContact, ...contacts],
    }));
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = evt => {
    this.setState({ filter: evt.currentTarget.value });
  };

  render() {
    const visibleContacts = this.getVisibleContacts();

    return (
      <div className={css.phonebook__form}>
        <ToastContainer position="top-center" />
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />

        <h2>Contacts</h2>
        {this.state.contacts.length > 0 ? (
          <div>
            <Filter value={this.state.filter} onChange={this.changeFilter} />
            <ContactList
              contacts={visibleContacts}
              onDeleteContact={this.deleteContact}
            />
          </div>
        ) : (
          <p>Please, add contact ☝️</p>
        )}
      </div>
    );
  }
}

export default App;
