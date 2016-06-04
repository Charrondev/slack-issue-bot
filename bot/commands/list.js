module.exports = (controller) => {
  controller.hears(['list'], ['message_received', 'direct_message'])
}
