const newFormHandler = async (event) => {
    event.preventDefault();
  
//     const title = document.querySelector('#username-signup').value.trim();
//     const body = document.querySelector('#password-signup').value.trim();
  
//     if (name && password) {
//       const response = await fetch('/api/users', {
//         method: 'POST',
//         body: JSON.stringify({ name, password }),
//         headers: { 'Content-Type': 'application/json' },
//       });
  
//       if (response.ok) {
//         document.location.replace('/dashboard');
//       } else {
//         alert(response.statusText);
//       }
//     }
//   };
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);