import currentUserFactory from "./factories/currentUser";
import ticketFactory from "./factories/ticket";
import getContext, { assignTicketFields, processUserObject } from "../src/javascripts/modules/context";
import client from "../src/javascripts/lib/client";

describe('#context', () => {
  describe('#assignTicketFields', () => {
    it ('should add custom field keys to original ticket', () => {
      let ticket = ticketFactory();
      const ticketFields = ticketFactory(true);
      const customFields = ticketFields.ticket.custom_fields.map(cf => `custom_field_${cf.id}`);
      ticket = assignTicketFields(ticket, ticketFields);
      expect(Object.keys(ticket)).toEqual(expect.arrayContaining(customFields))
    });
  });

  describe('#processUserObject', () => {
    it('should add user_fields key to user object', async () => {
      const userEndpoint = currentUserFactory(true);
      client.request = jest.fn().mockReturnValue(Promise.resolve(userEndpoint))
      const user = currentUserFactory();
      const newUser = await processUserObject(user);

      expect(newUser).toMatchObject({ user_fields: {} });
    });

    it('should split a users name into first and last name', async () => {
      client.request = jest.fn().mockReturnValue(Promise.resolve(currentUserFactory(true)))
      let user = { name: "MY NAME" };
      const { firstName, lastName } = await processUserObject(user);
      expect(firstName).toEqual('MY');
      expect(lastName).toEqual('NAME');
    });

    it('should handle missing first or last name', async () => {
      client.request = jest.fn().mockReturnValue(Promise.resolve(currentUserFactory(true)))
      let user = { name: "" };
      const { firstName: fn1, lastName: ln1 } = await processUserObject(user);
      expect(fn1).toEqual('');
      expect(ln1).toEqual('');

      user = { name: " Test" };
      const { firstName: fn2, lastName: ln2 } = await processUserObject(user);
      expect(fn2).toEqual('');
      expect(ln2).toEqual('Test');

      user = { name: "Test " };
      const { firstName: fn3, lastName: ln3 } = await processUserObject(user);
      expect(fn3).toEqual('Test');
      expect(ln3).toEqual('');
    })

    it('should throw error when user fetch fails', () => {
      client.request = jest.fn().mockReturnValue(Promise.reject(new Error('bad error')))
      const user = currentUserFactory();

      expect(processUserObject(user)).rejects.toMatch(new Error('bad error'));
    });
  });

  describe('#getContext', () => {
    it('should retrieve the ticket context with user information ', async () => {
      client.get = jest.fn().mockImplementation(async () => ({ ...ticketFactory(), ...currentUserFactory() }));

      client.request = jest.fn().mockImplementation(async ({ url }) => {
          if(url.includes('users')) {
            return currentUserFactory(true);
          } else if (url.includes('tickets')) {
            return ticketFactory(true);
          }
        });

      const context = await getContext();
      const requesterKeys = Object.keys(context.ticket.requester).sort();
      const assigneeKeys = Object.keys(context.ticket.assignee.user).sort();

      const expected = ['externalId', 'id', 'name', 'firstName', 'lastName', 'user_fields'].sort();
      expect(requesterKeys).toEqual(expected);
      expect(assigneeKeys).toEqual(expected);
    });
  });
});