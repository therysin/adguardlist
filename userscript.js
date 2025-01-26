const textBox = document.createElement('div');
textBox.id = 'custom-textbox';
textBox.style.position = 'fixed';
textBox.style.bottom = '20px';
textBox.style.right = '20px';
textBox.style.backgroundColor = 'white';
textBox.style.border = '1px solid #ccc';
textBox.style.borderRadius = '8px';
textBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
textBox.style.padding = '16px';
textBox.style.width = '300px';
textBox.style.zIndex = '9999';
textBox.style.fontFamily = 'Arial, sans-serif';

// Add content to the textbox
textBox.innerHTML = `
    <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
        Hello, this is a message!
    </div>
    <div style="font-size: 14px; color: #555;">
        This is a dismissable textbox. Click the button below to close it.
    </div>
    <button id="dismiss-button" style="
        margin-top: 12px;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
    ">
        Dismiss
    </button>
`;

// Append the textbox to the body
document.body.appendChild(textBox);

// Add functionality to the dismiss button
const dismissButton = document.getElementById('dismiss-button');
dismissButton.addEventListener('click', () => {
    textBox.remove();
});
