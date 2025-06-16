from app import socketio


def send_notification(message):
    socketio.emit('new_notification', {'message': message}, broadcast=True)
