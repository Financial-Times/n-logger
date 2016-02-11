export default message => typeof message === 'string' ? message.replace(/"/g, '\'') : message;
