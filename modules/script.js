const socket = io();  // Connect to the socket.io server
const currentUserId = 'your_current_user_id';  // Replace with the actual user ID
let selectedMatchUserId = '';

$('#matchedUsersList li').on('click', function () {
    selectedMatchUserId = $(this).data('user-id');
    socket.emit('startPrivateChat', selectedMatchUserId);

    $('#matchedUsersList').hide();
    $('#chatContainer').show();
});

$('#sendMessage').on('click', function () {
    const roomId = `room_${currentUserId}_${selectedMatchUserId}`;
    const message = $('#messageInput').val();
    socket.emit('privateMessage', { roomId, message });

    // Display the message in the chat UI
    $('#messages').append(`<p class="message"><span class="sender">You:</span> ${message}</p>`);
    $('#messageInput').val('');
});

// Listen for private messages
socket.on('privateMessage', ({ sender, message }) => {
    $('#messages').append(`<p class="message"><span class="sender">${sender}:</span> ${message}</p>`);
    $('#messages').scrollTop($('#messages')[0].scrollHeight); // Scroll to the latest message
});
