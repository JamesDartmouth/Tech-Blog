const updateFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#post-title').value;
    const body = document.querySelector('#post-content').value;

    // const id = window.location.toString().split('/')[
    //     window.location.toString().split('/').length - 1
    //   ];
  
    if (title && body) {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ post_id: id, title, body }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document
    .querySelector('.newpost-form')
    .addEventListener('submit', updateFormHandler);

